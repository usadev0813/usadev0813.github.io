import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const elements = {
  '.theme-toggle': { addEventListener: (_, handler) => (elements.click = handler) },
  '#year': { textContent: '' },
};
const storage = new Map([['theme', 'dark']]);
const context = {
  document: { documentElement: { dataset: {} }, querySelector: (selector) => elements[selector] },
  localStorage: { getItem: (key) => storage.get(key), setItem: (key, value) => storage.set(key, value) },
  Date,
};

vm.runInNewContext(fs.readFileSync('script.js', 'utf8'), context);
assert.equal(context.document.documentElement.dataset.theme, 'dark');
elements.click();
assert.equal(context.document.documentElement.dataset.theme, 'light');
assert.equal(elements['#year'].textContent, new Date().getFullYear());
