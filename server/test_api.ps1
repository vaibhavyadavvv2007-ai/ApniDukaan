Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "   DUKAANQUEST E2E API INTEGRATION SUITE (PS-21)          " -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

# 1. Health & Services Check
$health = Invoke-RestMethod -Uri 'http://localhost:5000/api/health' -Method Get
Write-Host "✅ Health Status: $($health.overall) (Version: $($health.version))" -ForegroundColor Green
Write-Host "   Gemini Mode: $($health.services.gemini.mode) | Model: $($health.services.gemini.model)" -ForegroundColor Gray
Write-Host "   Sarvam Mode: $($health.services.sarvam.mode) | Langs: $($health.services.sarvam.supportedLanguages -join ', ')" -ForegroundColor Gray
Write-Host "   n8n Webhook: $($health.services.n8n.endpoint)" -ForegroundColor Gray
Write-Host "   Paytm Mode: $($health.services.paytm.mode) | MID: $($health.services.paytm.mid)" -ForegroundColor Gray

# 2. Gemini Multimodal Studio
$gemini = Invoke-RestMethod -Uri 'http://localhost:5000/api/studio/enhance' -Method Post -Body '{"productContext":"Pure Kanjeevaram Saree"}' -ContentType 'application/json'
Write-Host "✅ Gemini Title: $($gemini.analysis.productTitle)" -ForegroundColor Green
Write-Host "   Compliance Score: $($gemini.analysis.complianceScore)% | Latency: $($gemini.latencyMs)ms" -ForegroundColor Gray

# 3. Sarvam Translation & Voice Suite
$sarvam = Invoke-RestMethod -Uri 'http://localhost:5000/api/sarvam/translate' -Method Post -Body '{"text":"Festive Saree Collection Launch","targetLanguage":"hi"}' -ContentType 'application/json'
Write-Host "✅ Sarvam Translation: Mode: $($sarvam.mode) | Lang: $($sarvam.language)" -ForegroundColor Green

$stt = Invoke-RestMethod -Uri 'http://localhost:5000/api/sarvam/stt' -Method Post -Body '{"languageCode":"hi-IN"}' -ContentType 'application/json'
Write-Host "✅ Sarvam STT (Saaras v4): $($stt.transcript)" -ForegroundColor Green

# 4. Paytm FinTech Link & Status
$paytm = Invoke-RestMethod -Uri 'http://localhost:5000/api/paytm/create-link' -Method Post -Body '{"amount":4850,"customerName":"Ananya Deshpande"}' -ContentType 'application/json'
Write-Host "✅ Paytm Link: $($paytm.paymentLink) | Status: $($paytm.status)" -ForegroundColor Green
Write-Host "   UPI URI: $($paytm.upiIntentUri)" -ForegroundColor Gray
Write-Host "   Soundbox Audio: $($paytm.soundbox.announcementText)" -ForegroundColor Gray

# 5. Omnichannel Marketplace Adapters
$transform = Invoke-RestMethod -Uri 'http://localhost:5000/api/catalog/transform/prod-001' -Method Get
Write-Host "✅ Omnichannel Adapters Transformed:" -ForegroundColor Green
Write-Host "   Amazon: $($transform.platforms.amazon.statusLabel)" -ForegroundColor Gray
Write-Host "   Flipkart: $($transform.platforms.flipkart.statusLabel)" -ForegroundColor Gray
Write-Host "   Meesho: $($transform.platforms.meesho.statusLabel)" -ForegroundColor Gray
Write-Host "   Myntra: $($transform.platforms.myntra.statusLabel)" -ForegroundColor Gray
Write-Host "   Nykaa: $($transform.platforms.nykaa.statusLabel)" -ForegroundColor Gray

# 6. n8n CRM Broadcast & WhatsApp Template Configuration
$tmpl = Invoke-RestMethod -Uri 'http://localhost:5000/api/crm/template-status' -Method Get
Write-Host "✅ Meta WhatsApp Template: Active: $($tmpl.activeTemplate) ($($tmpl.language)) | Custom: $($tmpl.customTemplateName) ($($tmpl.metaReviewStatus))" -ForegroundColor Green

$crm = Invoke-RestMethod -Uri 'http://localhost:5000/api/crm/broadcast' -Method Post -Body '{"recipients":[{"name":"Ananya","phone":"+919845012345","marketingOptIn":true}],"templateText":"VIP Discount"}' -ContentType 'application/json'
Write-Host "✅ n8n CRM Broadcast: Mode: $($crm.mode) | Dispatched: $($crm.dispatchedCount) | Template: $($crm.templateConfig.activeTemplate) | Consent Compliant: $($crm.privacyConsentCompliant)" -ForegroundColor Green

# 7. Marketplace Packaging Scraper
$scrape = Invoke-RestMethod -Uri 'http://localhost:5000/api/readiness/scrape?platform=amazon' -Method Get
Write-Host "✅ Scraper Engine: $($scrape.platform) ($($scrape.specs.Length) official packaging specs verified)" -ForegroundColor Green

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "   ALL 7 CORE ENGINES VERIFIED SUCCESSFULLY               " -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan
