'use strict';
const { countWords, selectContext } = globalThis.ContextSelection;
const messages = [
  { id: 'm1', role: 'You', text: 'Our group has no money for software subscriptions. Please suggest only free tools for this project.' },
  { id: 'm2', role: 'Assistant', text: 'Understood. We can begin by identifying the tasks your group needs to coordinate and the materials you will share.' },
  { id: 'm3', role: 'You', text: 'One teammate uses keyboard navigation. Any tool we choose should be usable without relying on a mouse.' },
  { id: 'm4', role: 'Assistant', text: 'Your group could divide the work into research, design, implementation, and presentation, with one person coordinating each area.' },
  { id: 'm5', role: 'You', text: 'We have four people and meet on Wednesday afternoons. We need a shared task list and somewhere to keep notes.' },
  { id: 'm6', role: 'Assistant', text: 'A task list can show ownership and deadlines. Shared notes can record decisions and questions to revisit at your next meeting.' }
];
const scenarios = {
  retain: { budget: 60, important: [], task: 'Flag message 01 about free tools. Notice its Included label, inspect the context, then show the simulated reply.' },
  revise: { budget: 60, important: ['m1', 'm3'], task: 'Both constraints are important. Unmark message 01, inspect what changes, then use Undo to restore it.' },
  overflow: { budget: 20, important: ['m1', 'm3'], task: 'Two important messages exceed the budget. Unmark either one or increase the budget to at least 35 words.' }
};
let state = { scenario: 'retain', budget: 60, important: [], reply: null };
let undoStack = [];
let currentSelection;
const $ = id => document.getElementById(id);
function escapeHtml(s) { return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }
function number(id) { return id.slice(1).padStart(2, '0'); }
function announce(text) { $('announcement').textContent = text; }
function remember() { undoStack.push({ ...state, important: [...state.important], reply: null }); }
function changed(text) {
  const hadReply = Boolean(state.reply); state.reply = null; render();
  announce(text + (hadReply ? ' The previous scripted reply was cleared because its context changed.' : ''));
}
function toggleImportant(id) {
  remember(); const marked = state.important.includes(id);
  state.important = marked ? state.important.filter(x => x !== id) : [...state.important, id];
  changed(`Message ${number(id)} ${marked ? 'unmarked' : 'marked important'}. Context updated.`);
  document.querySelector(`[data-flag="${id}"]`).focus();
}
function loadScenario(key) {
  const preset = scenarios[key];
  state = { scenario: key, budget: preset.budget, important: [...preset.important], reply: null };
  undoStack = []; render(); announce('Scenario loaded. Prepared conversation and priorities reset.');
}
function render() {
  const result = selectContext(messages, state.important, state.budget);
  currentSelection = result;
  const selected = new Set(result.selected.map(m => m.id));
  $('scenario-task').textContent = scenarios[state.scenario].task;
  document.querySelectorAll('[data-scenario]').forEach(b => {
    const active = b.dataset.scenario === state.scenario;
    b.classList.toggle('active', active); b.setAttribute('aria-pressed', active);
  });
  $('conversation').innerHTML = messages.map(m => {
    const marked = state.important.includes(m.id); const included = selected.has(m.id);
    const label = result.overflow ? 'Pending' : included ? 'Included' : 'Excluded';
    return `<article class="message ${marked ? 'marked' : ''}" aria-label="Message ${number(m.id)} from ${m.role}">
      <div class="message-top"><span class="avatar ${m.role === 'You' ? 'user' : ''}" aria-hidden="true">${m.role === 'You' ? 'Y' : 'C'}</span><strong>${m.role}</strong><span class="message-number">${number(m.id)}</span><span class="status ${result.overflow ? 'pending' : included ? 'included' : 'excluded'}" title="${escapeHtml(result.reasons[m.id])}">${included ? '✓ ' : ''}${label}</span></div>
      <p>${escapeHtml(m.text)}</p><div class="message-bottom"><span>${countWords(m.text)} words</span><button class="flag ${marked ? 'is-marked' : ''}" data-flag="${m.id}" aria-pressed="${marked}" aria-label="${marked ? 'Unmark' : 'Mark'} message ${number(m.id)} as important"><span aria-hidden="true">⚑</span> ${marked ? 'Important' : 'Mark important'}</button></div></article>`;
  }).join('');
  document.querySelectorAll('[data-flag]').forEach(b => b.addEventListener('click', () => toggleImportant(b.dataset.flag)));
  $('budget').value = state.budget;
  $('budget-value').textContent = `${state.budget} words`;
  $('usage-value').textContent = result.overflow ? `${result.required} / ${state.budget}` : `${result.used} / ${state.budget}`;
  $('usage-label').textContent = result.overflow ? 'words required by priorities' : 'words selected';
  $('usage-bar').max = state.budget; $('usage-bar').value = result.overflow ? state.budget : result.used;
  $('usage-bar').classList.toggle('over', result.overflow);
  $('included-count').textContent = result.selected.length;
  $('flagged-count').textContent = state.important.length;
  $('excluded-count').textContent = result.overflow ? '—' : messages.length - result.selected.length;
  $('overflow').hidden = !result.overflow;
  $('overflow-text').textContent = `Your important messages need ${result.required} words, but the budget is ${state.budget}. You need ${result.required - state.budget} more words.`;
  $('respond').disabled = result.overflow;
  $('respond').setAttribute('aria-describedby', result.overflow ? 'overflow' : 'question');
  $('undo').disabled = undoStack.length === 0;
  $('selection-list').innerHTML = result.overflow ? '<p class="empty">Waiting for you to resolve the budget.</p>' : result.selected.length ? result.selected.map(m => `<div class="selected-item"><span class="selected-index">${number(m.id)}</span><div><strong>${m.role}</strong><small>${state.important.includes(m.id) ? 'Your priority' : 'Recent message'} · ${countWords(m.text)} words</small></div><span class="selected-check" aria-hidden="true">✓</span></div>`).join('') : '<p class="empty">No full messages fit this budget.</p>';
  $('reply-panel').hidden = !state.reply;
  if (state.reply) { $('reply-text').textContent = state.reply.text; $('reply-evidence').textContent = state.reply.evidence; }
  if ($('preview-dialog').open) renderPreview();
}
function renderPreview() {
  const r = currentSelection;
  $('preview-content').innerHTML = r.overflow ? '<div class="warning"><strong>Context selection is paused.</strong><p>Close this preview and adjust the important messages or budget. No reply can run while priorities exceed capacity.</p></div>' : r.selected.length ? r.selected.map(m => `<article class="preview-message"><div><strong>${number(m.id)} · ${m.role}</strong><span>${countWords(m.text)} words</span></div><p>${escapeHtml(m.text)}</p><small>${escapeHtml(r.reasons[m.id])}</small></article>`).join('') : '<p>No history messages selected.</p>';
  if (!r.overflow) {
    const ids = new Set(r.selected.map(m => m.id));
    $('preview-content').innerHTML += '<h3>Excluded from this reply</h3>' + messages.filter(m => !ids.has(m.id)).map(m => `<p class="excluded-reason"><strong>${number(m.id)}</strong> ${escapeHtml(r.reasons[m.id])}.</p>`).join('');
  }
}
function showReply() {
  if (currentSelection.overflow) return;
  const ids = currentSelection.selected.map(m => m.id);
  const free = ids.includes('m1'), accessible = ids.includes('m3');
  let text = free
    ? 'Keep the setup free: use a no-cost shared task list and a shared notes document. Give each task an owner and a deadline.'
    : 'Use a shared task board and a shared notes document. A paid workspace with subscription features could also be considered.';
  text += accessible
    ? ' Before choosing, check that a teammate can navigate, edit, and save using only the keyboard.'
    : ' Review the arrangement together at your next meeting.';
  state.reply = { text, evidence: `Scripted branch: free-tools constraint ${free ? 'present' : 'absent'}; keyboard constraint ${accessible ? 'present' : 'absent'}. This is an authored illustration, not evidence of real LLM performance.` };
  render(); announce('Scripted example reply displayed below the next question.');
  $('reply-panel').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}
document.querySelectorAll('[data-scenario]').forEach(b => b.addEventListener('click', () => loadScenario(b.dataset.scenario)));
$('budget').addEventListener('change', e => { remember(); state.budget = Number(e.target.value); changed('History budget changed. Context updated.'); });
$('budget').addEventListener('input', e => { $('budget-value').textContent = `${e.target.value} words`; });
$('reset').addEventListener('click', () => loadScenario(state.scenario));
$('undo').addEventListener('click', () => { if (undoStack.length) { state = undoStack.pop(); render(); announce('Last change undone. Context updated.'); } });
$('respond').addEventListener('click', showReply);
$('preview').addEventListener('click', () => { renderPreview(); $('preview-dialog').showModal(); });
$('close-preview').addEventListener('click', () => $('preview-dialog').close());
render();
