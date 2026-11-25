/* Pure selection logic. Also loadable by Node for optional tests. */
(function (root) {
  'use strict';
  function countWords(text) {
    const trimmed = String(text).trim();
    return trimmed ? trimmed.split(/\s+/u).length : 0;
  }
  function selectContext(messages, importantIds, budget) {
    if (!Number.isInteger(budget) || budget < 0) throw new Error('Budget must be a non-negative integer.');
    const important = new Set(importantIds);
    const marked = messages.filter(m => important.has(m.id));
    const required = marked.reduce((sum, m) => sum + countWords(m.text), 0);
    const reasons = {};
    if (required > budget) {
      messages.forEach(m => { reasons[m.id] = important.has(m.id) ? 'Important; waiting for budget resolution' : 'Selection paused until priorities fit'; });
      return { selected: [], used: 0, required, overflow: true, reasons };
    }
    const chosen = new Set(marked.map(m => m.id));
    let used = required;
    marked.forEach(m => { reasons[m.id] = 'Included because you marked it important'; });
    for (const m of [...messages].reverse()) {
      if (chosen.has(m.id)) continue;
      const cost = countWords(m.text);
      if (used + cost <= budget) {
        chosen.add(m.id); used += cost;
        reasons[m.id] = 'Included by recency; fits the remaining budget';
      } else reasons[m.id] = 'Excluded because the remaining budget is too small';
    }
    return { selected: messages.filter(m => chosen.has(m.id)), used, required, overflow: false, reasons };
  }
  root.ContextSelection = { countWords, selectContext };
  if (typeof module !== 'undefined' && module.exports) module.exports = root.ContextSelection;
})(typeof globalThis !== 'undefined' ? globalThis : this);
