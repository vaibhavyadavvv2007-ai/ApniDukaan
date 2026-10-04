/**
 * Repair the n8n "dukaanquest-crm" workflow so it forwards the Meta WhatsApp
 * Cloud API payload built by the DukaanQuest backend.
 *
 * Why the previous attempts failed (all verified against n8n-nodes-base source):
 *   - Description.js declares jsonBody with
 *     displayOptions.show = { sendBody:[true], contentType:['json'], specifyBody:['json'] }
 *     so DELETING contentType makes jsonBody invisible; getNodeParameter('jsonBody')
 *     then returns its '' default and HttpRequestV3 does
 *     JSON.parse('') -> "The value in the 'JSON Body' field is not valid JSON".
 *   - contentType:'raw' instead runs
 *     `else if (bodyContentType === 'raw') { requestOptions.body = body; }`
 *     which CLOBBERS the JSON body with the empty `body` parameter.
 *   => The only correct combination is contentType:'json' + specifyBody:'json'.
 *
 * HttpRequestV3 then does:
 *   if (typeof jsonBodyParameter !== 'object' && jsonBodyParameter !== null)
 *       requestOptions.body = parseJsonParameter(...)
 *   else
 *       requestOptions.body = jsonBodyParameter;   // object used as-is
 * so an expression that resolves to an OBJECT is forwarded verbatim.
 *
 * A Code node fans the webhook payload out to one item per opted-in recipient,
 * so every recipient in a campaign is actually messaged (the old workflow only
 * ever contacted a single hardcoded number).
 */
const fs = require('fs');
const os = require('os');
const path = require('path');
const { DatabaseSync } = require('node:sqlite');

const WORKFLOW_ID = 'BjF6e6hmWBC8wsXj';
const CODE_NODE_ID = '7b1f0c42-9d3e-4a55-8c21-6f0a2e5d7b10';

const dbPath = path.join(os.homedir(), '.n8n', 'database.sqlite');
const db = new DatabaseSync(dbPath);

const row = db
  .prepare('SELECT nodes, connections, versionId FROM workflow_entity WHERE id = ?')
  .get(WORKFLOW_ID);
if (!row) throw new Error(`workflow ${WORKFLOW_ID} not found`);

const nodes = JSON.parse(row.nodes);

const webhook = nodes.find((n) => n.name === 'Webhook');
const respond = nodes.find((n) => n.name === 'Respond to Webhook');
const http = nodes.find((n) => n.type === 'n8n-nodes-base.httpRequest');
if (!webhook || !respond || !http) throw new Error('expected Webhook / HTTP Request / Respond to Webhook nodes');

// Echo the per-recipient Meta result so the backend gets HTTP 200 plus the
// wamid (or the Meta error) instead of a bare n8n 500.
respond.parameters.respondWith = 'json';
respond.parameters.responseBody =
  '={{ JSON.stringify({ success: true, source: "DukaanQuest", meta: $json }) }}';

const buildPayloads = {
  parameters: {
    jsCode: [
      '// One Meta WhatsApp Cloud API request per opted-in recipient.',
      'const incoming = $input.first().json;',
      'const recipients = (incoming.body && incoming.body.recipients) || [];',
      'const optedIn = recipients.filter((r) => r && r.whatsappCloudPayload && r.whatsappCloudPayload.to);',
      'if (optedIn.length === 0) {',
      "  throw new Error('No opted-in recipients with a whatsappCloudPayload were received. Check body.recipients in the webhook payload.');",
      '}',
      'return optedIn.map((r) => ({ json: { whatsappCloudPayload: r.whatsappCloudPayload } }));',
    ].join('\n'),
  },
  type: 'n8n-nodes-base.code',
  typeVersion: 2,
  position: [-16, 0],
  id: CODE_NODE_ID,
  name: 'Build Payloads',
};

http.parameters.sendBody = true;
http.parameters.contentType = 'json';
http.parameters.specifyBody = 'json';
http.parameters.jsonBody = '={{ $json.whatsappCloudPayload }}';
delete http.parameters.body;
delete http.parameters.rawBody;
delete http.parameters.bodyParameters;
http.parameters.options = {};
// Without this, a Meta rejection aborts the branch and n8n answers the webhook
// with HTTP 500 "Error in workflow", so the merchant never sees the Meta reason.
http.onError = 'continueRegularOutput';

const nextNodes = [webhook, buildPayloads, http, respond];

const nextConnections = {
  Webhook: { main: [[{ node: 'Build Payloads', type: 'main', index: 0 }]] },
  'Build Payloads': { main: [[{ node: 'HTTP Request', type: 'main', index: 0 }]] },
  'HTTP Request': { main: [[{ node: 'Respond to Webhook', type: 'main', index: 0 }]] },
  'Respond to Webhook': { main: [[]] },
};

const nodesJson = JSON.stringify(nextNodes);
const connectionsJson = JSON.stringify(nextConnections);

db.prepare('UPDATE workflow_entity SET nodes = ?, connections = ?, updatedAt = ? WHERE id = ?').run(
  nodesJson,
  connectionsJson,
  new Date().toISOString(),
  WORKFLOW_ID,
);

const versions = db
  .prepare('SELECT versionId FROM workflow_history WHERE workflowId = ?')
  .all(WORKFLOW_ID);

let patchedHistory = 0;
for (const v of versions) {
  db.prepare('UPDATE workflow_history SET nodes = ?, connections = ?, updatedAt = ? WHERE versionId = ?').run(
    nodesJson,
    connectionsJson,
    new Date().toISOString(),
    v.versionId,
  );
  patchedHistory += 1;
}

const check = JSON.parse(
  db.prepare('SELECT nodes FROM workflow_entity WHERE id = ?').get(WORKFLOW_ID).nodes,
).find((n) => n.type === 'n8n-nodes-base.httpRequest');

console.log('workflow_entity nodes updated');
console.log(`workflow_history rows updated: ${patchedHistory}`);
console.log('HTTP Request parameters now:', JSON.stringify(check.parameters, null, 2));
db.close();