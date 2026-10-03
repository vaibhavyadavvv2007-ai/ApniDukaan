import test from 'node:test';
import assert from 'node:assert/strict';
import { newDraft, checks, patchDraft, listingCSV, estimateChannels } from '../src/services/draft.js';
const complete = { ...newDraft(), original: 'data:image/jpeg;base64,test', title: 'Maroon saree', brand: 'Shop', price: 1000, stock: 2, material: 'Cotton', size: '5.5 m', description: 'Checked details', reviewed: true, exported: true, campaignPrepared: true };
test('empty fields and invalid numeric values cannot pass completeness', () => {
    assert.equal(checks(newDraft()).filter(c => c.valid).length, 0);
    assert.ok(checks(complete).every(c => c.valid));
    for (const price of [0, -5, Infinity, 'abc'])
        assert.equal(checks({ ...complete, price }).find(c => c.key === 'price').valid, false);
    for (const stock of ['', -1, 0.5])
        assert.equal(checks({ ...complete, stock }).find(c => c.key === 'stock').valid, false);
    assert.equal(checks({ ...complete, stock: 0 }).find(c => c.key === 'stock').valid, true);
});
test('editing a product invalidates review, export and downstream campaign', () => {
    const next = patchDraft(complete, { price: 500 });
    assert.equal(next.price, 500);
    assert.equal(next.reviewed, false);
    assert.equal(next.exported, false);
    assert.equal(next.campaignPrepared, false);
    assert.equal(complete.price, 1000);
});
test('listing export escapes quotes, commas, newlines and spreadsheet formulas', () => {
    const csv = listingCSV({ ...complete, title: 'Silk, "gold"', description: 'Line 1\nLine 2', brand: '=HYPERLINK("x")' }, 'amazon');
    assert.ok(csv.includes('"Silk, ""gold"""'));
    assert.ok(csv.includes('"Line 1\nLine 2"'));
    assert.ok(csv.includes('"\'=HYPERLINK(""x"")"'));
});
test('recommendation changes with audience and target, and avoids losing scenarios', () => {
    const values = { budget: 1000, customers: 200, price: 1000, cost: 100, conversion: 5, fee: 15, target: 1000 };
    assert.equal(estimateChannels(values).find(r => r.recommended).name, 'Customer campaign');
    assert.equal(estimateChannels({ ...values, customers: 0 }).find(r => r.recommended).name, 'Marketplace');
    assert.equal(estimateChannels({ ...values, cost: 2000 }).some(r => r.recommended), false);
    const small = { ...values, customers: 1, conversion: 100 };
    assert.equal(estimateChannels(small).find(r => r.recommended).name, 'Customer campaign');
    assert.equal(estimateChannels({ ...small, target: 2000 }).find(r => r.recommended).name, 'Marketplace');
});
