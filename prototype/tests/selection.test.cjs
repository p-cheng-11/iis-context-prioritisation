const assert = require('node:assert/strict');
const { test } = require('node:test');
const { countWords, selectContext } = require('../selection.js');
const items = [
  { id: 'old', text: 'Use only free tools' },
  { id: 'middle', text: 'We meet every Wednesday afternoon' },
  { id: 'new', text: 'Please suggest a shared task board' }
];
test('word counting handles empty text and repeated whitespace', () => {
  assert.equal(countWords('   '), 0);
  assert.equal(countWords('one  two\nthree'), 3);
});
test('without priorities, newest fitting messages are selected', () => {
  const r = selectContext(items, [], 6);
  assert.deepEqual(r.selected.map(m => m.id), ['new']);
});
test('an older marked message takes priority over recent history', () => {
  const r = selectContext(items, ['old'], 6);
  assert.deepEqual(r.selected.map(m => m.id), ['old']);
  assert.equal(r.used, 4);
});
test('unmarking restores recency selection', () => {
  selectContext(items, ['old'], 6);
  assert.deepEqual(selectContext(items, [], 6).selected.map(m => m.id), ['new']);
});
test('an exact fit succeeds and preserves chronological order', () => {
  const r = selectContext(items, ['old'], 10);
  assert.deepEqual(r.selected.map(m => m.id), ['old', 'new']);
  assert.equal(r.used, 10);
});
test('overflow pauses selection rather than dropping a priority', () => {
  const r = selectContext(items, ['old', 'middle'], 8);
  assert.equal(r.overflow, true);
  assert.equal(r.required, 9);
  assert.deepEqual(r.selected, []);
});
test('increasing the budget resolves priority overflow', () => {
  const r = selectContext(items, ['old', 'middle'], 9);
  assert.equal(r.overflow, false);
  assert.deepEqual(r.selected.map(m => m.id), ['old', 'middle']);
});
test('an oversized recent message does not prevent a smaller older one fitting', () => {
  assert.deepEqual(selectContext(items, [], 4).selected.map(m => m.id), ['old']);
});
test('zero budget selects no nonempty messages', () => {
  assert.deepEqual(selectContext(items, [], 0).selected, []);
});
test('selection never exceeds budget, and retains every priority when feasible', () => {
  for (let mask = 0; mask < 8; mask++) {
    const flags = items.filter((_, i) => mask & (1 << i)).map(m => m.id);
    for (let budget = 0; budget <= 20; budget++) {
      const r = selectContext(items, flags, budget);
      assert.ok(r.used <= budget);
      if (!r.overflow) for (const id of flags) assert.ok(r.selected.some(m => m.id === id));
    }
  }
});
test('invalid budgets are rejected', () => {
  assert.throws(() => selectContext(items, [], -1));
  assert.throws(() => selectContext(items, [], 1.5));
});
