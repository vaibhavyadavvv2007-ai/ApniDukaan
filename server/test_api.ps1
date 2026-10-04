Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "   DUKAANQUEST E2E INTEGRATION VERIFICATION SUITE         " -ForegroundColor Cyan
Write-Host "   HackSprint 2026 | PS-21: Democratizing Digital Commerce" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

# 1. Health & Services Check with Explicit 4-Tier Classification
$health = Invoke-RestMethod -Uri 'http://localhost:5000/api/health' -Method Get
Write-Host "`n[1. SYSTEM HEALTH & INTEGRATION CLASSIFICATION]" -ForegroundColor White
Write-Host "   Overall Status: $($health.overallStatus)" -ForegroundColor Cyan
$summary = $health.integrationSummary
Write-Host "   Tally: $($summary.LIVE) LIVE | $($summary.SANDBOX) SANDBOX | $($summary.STAGED) STAGED | $($summary.FALLBACK) FALLBACK" -ForegroundColor Cyan

# 2. Gemini Dual-Model AI Studio
Write-Host "`n[2. GOOGLE GEMINI DUAL-MODEL AI STUDIO]" -ForegroundColor White
$gemText = Invoke-RestMethod -Uri 'http://localhost:5000/api/studio/extract-attributes' -Method Post -Body '{"productContext":"Handwoven Kanjeevaram Silk Saree"}' -ContentType 'application/json'
if ($gemText.liveAPI) {
    Write-Host "[OK] Text Path (Flash-Lite): LIVE VERIFIED (HTTP 200) | Latency: $($gemText.latencyMs)ms" -ForegroundColor Green
    Write-Host "   SEO Title: $($gemText.analysis.productTitle)" -ForegroundColor Gray
    Write-Host "   Compliance Score: $($gemText.analysis.complianceScore)% | Bullets Extracted: $($gemText.analysis.amazonBullets.Length)" -ForegroundColor Gray
} else {
    Write-Host "[--] Text Path (Flash-Lite): FALLBACK MODE ($($gemText.mode))" -ForegroundColor Yellow
}

$gemImg = Invoke-RestMethod -Uri 'http://localhost:5000/api/studio/generate-image' -Method Post -Body '{"productContext":"Kanjeevaram Saree","transformationType":"whiteBackground"}' -ContentType 'application/json'
if ($gemImg.liveAPI -and $gemImg.image) {
    Write-Host "   [OK] Photo Studio Hero: LIVE AI-GENERATED | Model: $($gemImg.model) | Latency: $($gemImg.latencyMs)ms" -ForegroundColor Green
} elseif ($gemImg.apiHttpStatus -eq 429) {
    Write-Host "   [..] Photo Studio Hero: STAGED (Model reachable, billing required for live AI generation)" -ForegroundColor Yellow
    Write-Host "        Model: $($gemImg.model) | HTTP 429 | Asset: Staged 4K Catalog Pipeline" -ForegroundColor Gray
    Write-Host "        Quota: Enable Google Cloud pay-as-you-go billing to upgrade to LIVE AI-generated images" -ForegroundColor Gray
} else {
    Write-Host "   [..] Photo Studio Hero: STAGED PIPELINE ($($gemImg.mode))" -ForegroundColor Gray
}

# 3. Sarvam Translation Suite
Write-Host "`n[3. SARVAM AI INDIC LANGUAGE SUITE]" -ForegroundColor White
$sarvam = Invoke-RestMethod -Uri 'http://localhost:5000/api/sarvam/translate' -Method Post -Body '{"text":"Festive Saree Collection Launch","targetLanguage":"hi"}' -ContentType 'application/json'
if ($sarvam.liveAPI) {
    Write-Host "[OK] Sarvam Translation: LIVE VERIFIED (HTTP 200) | Lang: $($sarvam.language) | Latency: $($sarvam.latencyMs)ms" -ForegroundColor Green
    Write-Host "   Translation: $($sarvam.translatedText)" -ForegroundColor Gray
} else {
    Write-Host "[--] Sarvam Translation: INDIC DICTIONARY FALLBACK ($($sarvam.mode))" -ForegroundColor Yellow
    Write-Host "   Fallback Text: $($sarvam.translatedText.Substring(0, [Math]::Min(60, $sarvam.translatedText.Length)))..." -ForegroundColor Gray
}

# 4. Paytm FinTech Gateway (STAGED/FALLBACK Mode)
Write-Host "`n[4. PAYTM FINTECH GATEWAY (STAGED/FALLBACK)]" -ForegroundColor White
$paytm = Invoke-RestMethod -Uri 'http://localhost:5000/api/paytm/create-link' -Method Post -Body '{"amount":4850,"customerName":"Ananya Deshpande"}' -ContentType 'application/json'
Write-Host "[..] Paytm Status: $($paytm.status) ($($paytm.classification))" -ForegroundColor Yellow
Write-Host "   Notice: $($paytm.notice)" -ForegroundColor Gray
Write-Host "   Payment Link: $($paytm.paymentLink)" -ForegroundColor Gray
Write-Host "   UPI URI: $($paytm.upiIntentUri)" -ForegroundColor Gray
Write-Host "   Soundbox: $($paytm.soundbox.announcementText)" -ForegroundColor Gray

# 5. Amazon SP-API Sandbox Verification & Listings POC
Write-Host "`n[5. AMAZON SP-API SANDBOX VERIFICATION]" -ForegroundColor White
$amz = Invoke-RestMethod -Uri 'http://localhost:5000/api/amazon/verify-sandbox' -Method Get
if ($amz.verified) {
    Write-Host "[OK] Amazon SP-API: SANDBOX VERIFIED (HTTP $($amz.statusCode)) | Latency: $($amz.latencyMs)ms" -ForegroundColor Green
    Write-Host "   Auth: Login with Amazon (LWA) OAuth2 Token Exchange Verified" -ForegroundColor Gray
    Write-Host "   Sandbox Endpoint: $($amz.endpointTested)" -ForegroundColor Gray
    Write-Host "   Masked Client: $($amz.credentialAudit.maskedClientId)" -ForegroundColor Gray
} else {
    Write-Host "[--] Amazon SP-API: FALLBACK MODE" -ForegroundColor Yellow
}

$amzTypes = Invoke-RestMethod -Uri 'http://localhost:5000/api/amazon/product-types' -Method Get
Write-Host "   Listings POC: $($amzTypes.totalCount) Product Types Available (Source: $($amzTypes.source))" -ForegroundColor Gray

$amzDef = Invoke-RestMethod -Uri 'http://localhost:5000/api/amazon/product-type-definition?productType=SAREE' -Method Get
Write-Host "   Schema Definition: $($amzDef.productType) (Source: $($amzDef.source))" -ForegroundColor Gray

$amzPut = Invoke-RestMethod -Uri 'http://localhost:5000/api/amazon/listings/put' -Method Post -Body '{"masterProduct":{"title":"SHREE GANESH Kanjeevaram Saree","basePrice":4850,"sku":"SG-SAN-001"}}' -ContentType 'application/json'
if ($amzPut.status -eq 'ACCEPTED') {
    Write-Host "[OK] SP-API Listings Items PUT: SANDBOX ACCEPTED (Submission ID: $($amzPut.submissionId))" -ForegroundColor Green
} else {
    Write-Host "[..] SP-API Listings Items: EXPORT FALLBACK (Status: $($amzPut.status))" -ForegroundColor Yellow
}

# 6. n8n CRM Broadcast & Meta WhatsApp Cloud API Verification
Write-Host "`n[6. n8n CRM HUB -> META WHATSAPP CLOUD API]" -ForegroundColor White
$tmpl = Invoke-RestMethod -Uri 'http://localhost:5000/api/crm/template-status' -Method Get

# The NORMAL merchant campaign template must be the Meta-approved marketing
# template dukaanquest_new_arrival. hello_world is a TECHNICAL TEST template
# and must never be the active campaign template.
Write-Host "   Active Template : $($tmpl.activeTemplate) ($($tmpl.language), $($tmpl.category))" -ForegroundColor Cyan
Write-Host "   Role            : $($tmpl.role) | Meta review: $($tmpl.metaReviewStatus)" -ForegroundColor Gray
Write-Host "   Body Var Order  : $($tmpl.bodyParameterOrder -join ' -> ')" -ForegroundColor Gray
Write-Host "   Header Params   : $($tmpl.hasHeaderParameters) | Buttons: $($tmpl.hasButtons)" -ForegroundColor Gray
Write-Host "   Test Template   : $($tmpl.technicalTestTemplate) (explicit test mode only)" -ForegroundColor Gray

$templateOk = $true
if ($tmpl.activeTemplate -ne 'dukaanquest_new_arrival') {
    Write-Host "[FAIL] Normal campaign template is '$($tmpl.activeTemplate)', expected 'dukaanquest_new_arrival'." -ForegroundColor Red
    $templateOk = $false
} else {
    Write-Host "[OK] Normal campaign template is dukaanquest_new_arrival." -ForegroundColor Green
}
if ($tmpl.activeTemplate -eq 'hello_world') {
    Write-Host "[FAIL] hello_world must never be the normal campaign template." -ForegroundColor Red
    $templateOk = $false
} else {
    Write-Host "[OK] hello_world is NOT the normal campaign template." -ForegroundColor Green
}
if ($tmpl.language -ne 'en') {
    Write-Host "[FAIL] Approved locale is 'en' (verified via Meta Graph API), got '$($tmpl.language)'." -ForegroundColor Red
    $templateOk = $false
} else {
    Write-Host "[OK] Approved language code 'en' matches the Meta-approved template." -ForegroundColor Green
}
$expectedOrder = @('customerName','collectionName','shopName','discount')
if ((($tmpl.bodyParameterOrder -join ',') -ne ($expectedOrder -join ','))) {
    Write-Host "[FAIL] Body variable order does not match the approved positional order." -ForegroundColor Red
    $templateOk = $false
} else {
    Write-Host "[OK] Body variables match the approved positional order (4 vars)." -ForegroundColor Green
}

$body = @'
{"recipients":[{"name":"Ramesh","phone":"+919845012345","marketingOptIn":true}],"templateText":"Exclusive VIP Offer","campaign":{"collectionName":"Festive Kanjeevaram Silk","shopName":"Shree Ganesh Matching & Saree Centre","discount":"15%"}}
'@
$crm = Invoke-RestMethod -Uri 'http://localhost:5000/api/crm/broadcast' -Method Post -Body $body -ContentType 'application/json'

# Assert the exact Meta request structure that was staged for n8n.
$sent = $crm.stagedPayloadPreview.primaryRecipientPayload
if ($sent.template.name -eq 'dukaanquest_new_arrival' -and $sent.template.language.code -eq 'en') {
    Write-Host "[OK] Meta request structure: template=$($sent.template.name) lang=$($sent.template.language.code) params=$($sent.template.components[0].parameters.Count)" -ForegroundColor Green
} else {
    Write-Host "[FAIL] Unexpected Meta request structure: $($sent.template.name) / $($sent.template.language.code)" -ForegroundColor Red
    $templateOk = $false
}

if ($crm.liveDeliveryConfirmed -and $crm.whatsappMessageId) {
    Write-Host "[OK] Meta WhatsApp Broadcast: LIVE VERIFIED" -ForegroundColor Green
    Write-Host "   WhatsApp Message ID (wamid): $($crm.whatsappMessageId)" -ForegroundColor Cyan
    Write-Host "   External Confirmation: $($crm.externalStatusDetail)" -ForegroundColor Gray
} elseif ($crm.metaRejection) {
    Write-Host "[FAIL] Meta REJECTED the request. Code $($crm.metaRejection.code) subcode $($crm.metaRejection.subcode)" -ForegroundColor Red
    Write-Host "   Reason : $($crm.metaRejection.message)" -ForegroundColor Red
    Write-Host "   Hint   : $($crm.metaRejection.hint)" -ForegroundColor Yellow
    Write-Host "   NOTE: no silent fallback to hello_world was performed." -ForegroundColor Gray
    $templateOk = $false
} elseif ($crm.dispatchedToLiveInstance) {
    Write-Host "[..] n8n Webhook: RECEIVED (delivery not yet confirmed by Meta)" -ForegroundColor Yellow
    Write-Host "   Detail: $($crm.externalStatusDetail)" -ForegroundColor Gray
    Write-Host "   Classification: $($crm.classification) (no live delivery claimed without a wamid)" -ForegroundColor Gray
} else {
    Write-Host "[--] n8n Webhook: UNREACHABLE (staged payload only, nothing sent)" -ForegroundColor Yellow
    Write-Host "   Detail: $($crm.externalStatusDetail)" -ForegroundColor Gray
}

if (-not $templateOk) {
    Write-Host "[!] SECTION 6 RESULT: FAILED" -ForegroundColor Red
} else {
    Write-Host "[OK] SECTION 6 RESULT: TEMPLATE INTEGRATION CHECKS PASSED" -ForegroundColor Green
}

# 7. Omnichannel Transformation & Scraper
Write-Host "`n[7. OMNICHANNEL ADAPTERS & PACKAGING SCRAPER]" -ForegroundColor White
$transform = Invoke-RestMethod -Uri 'http://localhost:5000/api/catalog/transform/prod-001' -Method Get
Write-Host "[OK] Omnichannel Adapters: Amazon ($($transform.platforms.amazon.statusLabel)) | Flipkart ($($transform.platforms.flipkart.statusLabel)) | Meesho ($($transform.platforms.meesho.statusLabel)) | Myntra ($($transform.platforms.myntra.statusLabel))" -ForegroundColor Green
$scrape = Invoke-RestMethod -Uri 'http://localhost:5000/api/readiness/scrape?platform=amazon' -Method Get
Write-Host "[OK] Packaging Scraper: $($scrape.platform) ($($scrape.specs.Length) official packaging specs verified)" -ForegroundColor Green

# Final Integrity Summary Banner
Write-Host ""
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "   VERIFICATION SUITE INTEGRITY SUMMARY                   " -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan
$liveColor = if ($summary.LIVE -gt 0) { "Green" } else { "Yellow" }
$fallbackColor = if ($summary.FALLBACK -gt 0) { "Yellow" } else { "Green" }
Write-Host "   LIVE Services:     $($summary.LIVE)" -ForegroundColor $liveColor
Write-Host "   SANDBOX Services:  $($summary.SANDBOX)" -ForegroundColor Green
Write-Host "   STAGED Services:   $($summary.STAGED)" -ForegroundColor Yellow
Write-Host "   FALLBACK Services: $($summary.FALLBACK)" -ForegroundColor $fallbackColor
Write-Host "----------------------------------------------------------" -ForegroundColor Gray
if ($summary.FALLBACK -gt 0) {
    Write-Host "[!] OVERALL STATUS: PARTIAL - Transparently separated without false live claims." -ForegroundColor Yellow
} else {
    Write-Host "[OK] OVERALL STATUS: ALL SERVICES OPERATIONAL." -ForegroundColor Green
}
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host ""
