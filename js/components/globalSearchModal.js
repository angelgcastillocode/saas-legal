/**
 * Buscador Global (Cmd + K) y Sistema de Notificaciones Toast
 */

import { store } from '../store/state.js';
import { openWebViewerModal } from './webViewerModal.js';

export function showToast(message, type = 'info') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'fixed bottom-5 right-5 z-[120] flex flex-col gap-2 max-w-md';
    document.body.appendChild(container);
  }

  const colors = {
    success: 'bg-surface-container-lowest border-emerald-500/40 text-emerald-400',
    warning: 'bg-surface-container-lowest border-amber-500/40 text-amber-300',
    error: 'bg-surface-container-lowest border-error/40 text-error',
    info: 'bg-surface-container-lowest border-primary/40 text-primary'
  };
  const icons = {
    success: 'check_circle',
    warning: 'warning',
    error: 'error',
    info: 'bolt'
  };

  const toast = document.createElement('div');
  toast.className = `flex items-center gap-3 px-4 py-3 rounded-xl border shadow-2xl backdrop-blur-xl transition-all duration-300 ${colors[type] || colors.info}`;
  toast.innerHTML = `
    <span class="material-symbols-outlined text-lg shrink-0">${icons[type] || 'bolt'}</span>
    <span class="text-xs font-medium text-white leading-snug">${message}</span>
  `;

  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(8px)';
    setTimeout(() => toast.remove(), 250);
  }, 3600);
}

export function openGlobalSearchModal(initialQuery = '') {
  const modalRoot = document.getElementById('global-modal-root');
  if (!modalRoot) return;

  modalRoot.innerHTML = `
    <div class="fixed inset-0 z-[100] bg-black/75 backdrop-blur-sm flex items-start justify-center pt-16 p-4 modal-backdrop-enter" id="cmdk-backdrop">
      <div class="bg-surface-container-low border border-white/15 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden">
        <div class="p-4 bg-surface-container-lowest border-b border-white/10 flex items-center gap-3">
          <span class="material-symbols-outlined text-primary text-xl">search</span>
          <input id="cmdk-input" type="text" value="${initialQuery}" placeholder="Buscar expediente, cliente, archivo normalizado o término OCR..." class="w-full bg-transparent text-white text-sm focus:outline-none placeholder:text-outline" autocomplete="off" />
          <span class="px-2 py-0.5 rounded bg-surface-container text-[11px] font-mono-code text-outline border border-white/10">ESC</span>
        </div>
        <div id="cmdk-results" class="max-h-[60vh] overflow-y-auto p-3 space-y-4 divide-y divide-white/5"></div>
      </div>
    </div>
  `;

  const input = document.getElementById('cmdk-input');
  const resultsEl = document.getElementById('cmdk-results');
  const close = () => { modalRoot.innerHTML = ''; };

  document.getElementById('cmdk-backdrop')?.addEventListener('click', (e) => {
    if (e.target.id === 'cmdk-backdrop') close();
  });

  const renderResults = (q) => {
    const query = (q || '').trim().toLowerCase();
    const { clients, cases, documents } = store.state;

    const matchedClients = clients.filter(c =>
      !query || c.name.toLowerCase().includes(query) || c.id.toLowerCase().includes(query) || (c.rfc || '').toLowerCase().includes(query)
    ).slice(0, 4);

    const matchedCases = cases.filter(c =>
      !query || c.id.toLowerCase().includes(query) || c.title.toLowerCase().includes(query) || c.clientName.toLowerCase().includes(query)
    ).slice(0, 4);

    const matchedDocs = documents.filter(d =>
      !query ||
      d.normalizedName.toLowerCase().includes(query) ||
      d.originalName.toLowerCase().includes(query) ||
      d.clientName.toLowerCase().includes(query) ||
      d.category.toLowerCase().includes(query) ||
      (d.ocrSnippet || '').toLowerCase().includes(query)
    ).slice(0, 6);

    resultsEl.innerHTML = `
      <div>
        <div class="text-[11px] font-semibold uppercase tracking-wider text-outline px-2 mb-1.5">Documentos Clasificados (${matchedDocs.length})</div>
        <div class="space-y-1">
          ${matchedDocs.length ? matchedDocs.map(d => `
            <button type="button" data-cmdk-doc="${d.id}" class="w-full text-left p-2.5 rounded-xl hover:bg-surface-container-high flex items-center justify-between gap-3 transition-colors">
              <div class="min-w-0">
                <div class="text-xs font-mono-code text-white font-semibold truncate">${d.normalizedName}</div>
                <div class="text-[11px] text-on-surface-variant truncate">${d.clientName} → ${d.category} • ${d.caseId}</div>
              </div>
              <span class="px-2 py-0.5 rounded bg-primary/15 text-primary text-[11px] font-mono-code shrink-0">Abrir Visor</span>
            </button>
          `).join('') : '<p class="text-xs text-outline px-2 py-1">Sin coincidencias en documentos</p>'}
        </div>
      </div>

      <div class="pt-3">
        <div class="text-[11px] font-semibold uppercase tracking-wider text-outline px-2 mb-1.5">Expedientes (${matchedCases.length})</div>
        <div class="space-y-1">
          ${matchedCases.length ? matchedCases.map(c => `
            <button type="button" data-cmdk-case="${c.id}" data-cmdk-client="${c.clientId}" class="w-full text-left p-2.5 rounded-xl hover:bg-surface-container-high flex items-center justify-between gap-3 transition-colors">
              <div class="min-w-0">
                <div class="text-xs font-mono-code text-primary font-semibold">${c.id} — <span class="font-sans text-white">${c.title}</span></div>
                <div class="text-[11px] text-on-surface-variant">${c.clientName} • ${c.court}</div>
              </div>
              <span class="text-xs text-outline">Ver Carpeta →</span>
            </button>
          `).join('') : '<p class="text-xs text-outline px-2 py-1">Sin coincidencias en expedientes</p>'}
        </div>
      </div>

      <div class="pt-3">
        <div class="text-[11px] font-semibold uppercase tracking-wider text-outline px-2 mb-1.5">Clientes (${matchedClients.length})</div>
        <div class="space-y-1">
          ${matchedClients.length ? matchedClients.map(cl => `
            <button type="button" data-cmdk-only-client="${cl.id}" class="w-full text-left p-2.5 rounded-xl hover:bg-surface-container-high flex items-center justify-between gap-3 transition-colors">
              <div>
                <div class="text-xs font-semibold text-white">${cl.name}</div>
                <div class="text-[11px] font-mono-code text-outline">${cl.id} • RFC: ${cl.rfc}</div>
              </div>
              <span class="text-xs text-emerald-400">Abrir Árbol →</span>
            </button>
          `).join('') : '<p class="text-xs text-outline px-2 py-1">Sin coincidencias en clientes</p>'}
        </div>
      </div>
    `;

    resultsEl.querySelectorAll('[data-cmdk-doc]').forEach(btn => {
      btn.addEventListener('click', () => {
        const docId = btn.getAttribute('data-cmdk-doc');
        close();
        openWebViewerModal(docId);
      });
    });

    resultsEl.querySelectorAll('[data-cmdk-case]').forEach(btn => {
      btn.addEventListener('click', () => {
        const clientId = btn.getAttribute('data-cmdk-client');
        close();
        store.setRoute('documentos', { clientId, category: null });
      });
    });

    resultsEl.querySelectorAll('[data-cmdk-only-client]').forEach(btn => {
      btn.addEventListener('click', () => {
        const clientId = btn.getAttribute('data-cmdk-only-client');
        close();
        store.setRoute('documentos', { clientId, category: null });
      });
    });
  };

  renderResults(initialQuery);
  input?.focus();
  input?.addEventListener('input', (e) => renderResults(e.target.value));
}
