/**
 * WhatsApp delivery-status tracking.
 *
 * Meta's send API returning HTTP 200 with a `wamid` only means the message was
 * ACCEPTED for delivery. The real outcome arrives asynchronously on the
 * subscribed `messages` webhook, e.g.:
 *
 *   { entry: [ { changes: [ { value: { statuses: [
 *       { id: "wamid...", status: "failed", recipient_id: "91...",
 *         errors: [ { code: 131049, title: "This message was not delivered
 *                     to maintain healthy ecosystem engagement." } ] } ] } } ] } ] }
 *
 * This service records those callbacks so the merchant UI can report what Meta
 * actually decided instead of assuming a wamid means "delivered".
 */
const { loadDB, saveDB } = require('../db/database');

const MAX_TRACKED = 200;

function readLog(db) {
  if (!Array.isArray(db.whatsappDeliveryLog)) db.whatsappDeliveryLog = [];
  return db.whatsappDeliveryLog;
}

/**
 * Fold every `statuses` entry in a Meta webhook body into the delivery log.
 * Returns the number of status records written.
 */
function recordStatusWebhook(body) {
  const entries = body?.entry;
  if (!Array.isArray(entries)) return 0;

  const db = loadDB();
  const log = readLog(db);
  let written = 0;

  for (const entry of entries) {
    for (const change of entry?.changes || []) {
      const value = change?.value || {};
      const phoneNumberId = value?.metadata?.phone_number_id || null;

      for (const status of value?.statuses || []) {
        if (!status?.id) continue;

        const firstError = Array.isArray(status.errors) ? status.errors[0] : null;
        const record = {
          messageId: status.id,
          // Meta can report an older, weaker status after a newer one; keep the most advanced.
          status: String(status.status || '').toLowerCase(),
          recipientId: status.recipient_id || null,
          phoneNumberId,
          errorCode: firstError?.code ?? null,
          errorTitle: firstError?.title || firstError?.message || null,
          recordedAt: new Date().toISOString(),
          metaTimestamp: status.timestamp || null,
        };

        const existingIndex = log.findIndex((e) => e.messageId === record.messageId);
        if (existingIndex >= 0) {
          const existing = log[existingIndex];
          // Terminal states are never downgraded by a late non-terminal callback.
          const terminal = (s) => s === 'delivered' || s === 'read' || s === 'failed';
          if (terminal(existing.status) && !terminal(record.status)) continue;
          log[existingIndex] = record;
        } else {
          log.push(record);
        }
        written += 1;
      }
    }
  }

  if (written) {
    log.sort((a, b) => String(b.recordedAt).localeCompare(String(a.recordedAt)));
    db.whatsappDeliveryLog = log.slice(0, MAX_TRACKED);
    saveDB(db);
  }

  return written;
}

/**
 * Look up the recorded outcome for a wamid.
 * `known: false` means Meta has not reported a status yet, which is NOT success.
 */
function getDeliveryStatus(messageId) {
  if (!messageId) return { known: false, status: 'unknown', messageId: null };

  const db = loadDB();
  const record = readLog(db).find((e) => e.messageId === messageId);
  if (!record) return { known: false, status: 'pending', messageId };

  return {
    known: true,
    messageId: record.messageId,
    status: record.status,
    recipientId: record.recipientId,
    errorCode: record.errorCode,
    errorTitle: record.errorTitle,
    recordedAt: record.recordedAt,
  };
}

function listDeliveryStatuses(limit = 25) {
  const db = loadDB();
  return readLog(db).slice(0, limit);
}

module.exports = { recordStatusWebhook, getDeliveryStatus, listDeliveryStatuses };