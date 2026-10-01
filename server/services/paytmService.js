/**
 * Paytm FinTech & UPI Gateway Service
 */
function createPaymentLink({ amount, customerName, orderId, notes }) {
  const mid = process.env.PAYTM_MID || "PAYTM_MID_984521";
  const uniqueOrderId = orderId || `ORD_${Date.now()}`;
  
  // Standard Paytm Payment Link URL
  const paymentLink = `https://paytm.me/dukaan/sg-${amount}?orderId=${uniqueOrderId}`;
  
  // Standard NPCI UPI Intent URI for QR Codes and Mobile Wallets
  const upiIntentUri = `upi://pay?pa=paytmqr${mid}@paytm&pn=Shree+Ganesh+Matching+Centre&am=${amount}&cu=INR&tn=${encodeURIComponent(notes || 'Dukaan Purchase')}`;

  return {
    success: true,
    orderId: uniqueOrderId,
    amount: Number(amount),
    currency: "INR",
    paymentLink,
    upiIntentUri,
    merchantId: mid,
    settlementCycle: "T+1 Instant Bank Settlement",
    status: "ACTIVE"
  };
}

module.exports = {
  createPaymentLink
};
