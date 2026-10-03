export const DRAFT_KEY = 'dukaanquest.product-draft.v1';
export const money = value => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(Number(value) || 0);
export function newDraft(product) {
    return { id: product?.id || `draft-${Date.now()}`, title: product?.title || '', brand: product?.brand || '', price: product?.basePrice ?? '', stock: product?.stockCount ?? '', material: product?.fabric || '', size: '', description: product?.platformListings?.amazon?.bullets?.join('\n') || '', original: product?.images?.raw || '', enhanced: '', sample: !!product, campaign: { tag: 'All', discount: 10, language: 'en' }, reviewed: false, exported: false, campaignPrepared: false, imageStatus: 'original', analysisStatus: 'none' };
}
export function checks(draft) {
    return [
        { key: 'original', label: 'Product photo', valid: !!draft.original, fix: 'Add a clear product photo' },
        { key: 'title', label: 'Product title', valid: !!draft.title.trim() && draft.title.length <= 200, fix: 'Add a title under 200 characters' },
        { key: 'brand', label: 'Brand or shop', valid: !!draft.brand.trim(), fix: 'Confirm the brand or shop name' },
        { key: 'price', label: 'Selling price', valid: Number.isFinite(Number(draft.price)) && Number(draft.price) > 0, fix: 'Set a selling price above zero' },
        { key: 'stock', label: 'Available stock', valid: draft.stock !== '' && Number.isInteger(Number(draft.stock)) && Number(draft.stock) >= 0, fix: 'Enter a whole stock quantity' },
        { key: 'material', label: 'Material', valid: !!draft.material.trim(), fix: 'Confirm the material; a photo cannot prove composition' },
        { key: 'size', label: 'Size or dimensions', valid: !!draft.size.trim(), fix: 'Add size or dimensions' },
        { key: 'description', label: 'Product details', valid: !!draft.description.trim(), fix: 'Add a description or key features' }
    ];
}
export function patchDraft(draft, patch) {
    return { ...draft, ...patch, reviewed: false, exported: false, campaignPrepared: false };
}
export function csvCell(value) {
    const text = String(value ?? '');
    return '"' + (/^[=+@-]/.test(text) ? "'" + text : text).replaceAll('"', '""') + '"';
}
export function listingCSV(draft, platform) {
    return ['Platform,Title,Brand,Price,Stock,Material,Size,Description', [platform, draft.title, draft.brand, draft.price, draft.stock, draft.material, draft.size, draft.description].map(csvCell).join(',')].join('\r\n');
}
export function downloadFile(name, content, type = 'text/plain') {
    const url = URL.createObjectURL(new Blob([content], { type }));
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
}
export function estimateChannels({ budget, customers, price, cost, conversion, fee, target }) {
    const margin = price - cost;
    const rows = [
        { name: 'Customer campaign', orders: Math.floor(customers * conversion / 100), spend: customers * 1, fee: 0 },
        { name: 'Marketplace', orders: Math.floor(budget / Math.max(price, 1) * 2), spend: budget, fee },
        { name: 'Local advertising', orders: Math.floor(budget / Math.max(price, 1) * 1.6), spend: budget, fee: 0 }
    ].map(row => ({ ...row, revenue: row.orders * price, profit: Math.round(row.orders * margin - row.spend - row.orders * price * row.fee / 100), affordable: row.spend <= budget, reachesTarget: row.orders * price >= target }));
    const candidates = rows.filter(row => row.affordable && row.profit > 0);
    const reaching = candidates.filter(row => row.reachesTarget);
    const best = [...(reaching.length ? reaching : candidates)].sort((a, b) => b.profit - a.profit)[0];
    return rows.map(row => ({ ...row, recommended: row === best }));
}
