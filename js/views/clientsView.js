/**
 * Vista Dedicada: Directorio de Clientes y Carpetas Raíz (Nivel 1)
 * Soporta personas morales, personas físicas y clientes con un solo nombre sin apellidos separados.
 */

import { store } from '../store/state.js';
import { showToast } from '../components/globalSearchModal.js';

let clientFilterType = 'ALL';
let clientSearchQuery = '';

export function renderClientsView(container) {
  const state = store.state;
  const filtered = state.clients.filter(c => {
    if (clientFilterType !== 'ALL' && c.type !== clientFilterType) return false;
    if (clientSearchQuery) {
      const q = clientSearchQuery.toLowerCase();
      return c.name.toLowerCase().includes(q) || c.id.toLowerCase().includes(q) || (c.rfc || '').toLowerCase().includes(q);
    }
    return true;
  });

  container.innerHTML = `
    <div class="flex flex-col w-full">
      <div class="flex flex-col md:flex-row md:items-center justify-between pb-6 gap-4">
        <div>
          <div class="flex items-center gap-2 text-on-surface-variant font-mono-code text-xs uppercase tracking-wider">
            <span>DIRECTORIO DE TITULARES</span>
            <span class="text-outline">/</span>
            <span class="text-primary font-semibold">NIVEL 1 DEL ÁRBOL DOCUMENTAL</span>
          </div>
          <h1 class="text-2xl lg:text-3xl font-bold text-white tracking-tight mt-1">Clientes &amp; Cuentas Corporativas</h1>
          <p class="text-sm text-on-surface-variant mt-1">
            Cada cliente representa una carpeta raíz (Nivel 1) en el Repositorio Documental Inteligente.
          </p>
        </div>
        <div class="flex items-center gap-2.5">
          <button id="new-client-modal-btn" type="button" class="px-4 py-2.5 rounded-xl bg-primary-container hover:bg-primary text-white text-sm font-semibold shadow-lg shadow-primary/25 flex items-center gap-2 transition-all">
            <span class="material-symbols-outlined text-lg">person_add</span>
            <span>Nuevo Cliente</span>
          </button>
        </div>
      </div>

      <!-- Toolbar -->
      <div class="bg-surface-container-low border border-outline-variant rounded-xl p-4 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div class="relative w-full sm:max-w-md">
          <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-lg">search</span>
          <input id="clients-search-input" value="${clientSearchQuery}" type="text" placeholder="Buscar cliente por nombre, ID o RFC..." class="w-full h-10 pl-10 pr-4 bg-surface-container-lowest border border-outline-variant rounded-lg text-sm text-white focus:border-primary focus:outline-none" />
        </div>
        <div class="flex items-center gap-2 flex-wrap">
          ${['ALL', 'Gran Cuenta', 'Corporativo', 'Persona Física'].map(t => `
            <button type="button" data-client-type="${t}" class="px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${clientFilterType === t ? 'bg-primary text-white font-semibold' : 'bg-surface-container-highest text-on-surface-variant hover:text-white border border-outline-variant'}">
              ${t === 'ALL' ? `Todos (${state.clients.length})` : t}
            </button>
          `).join('')}
        </div>
      </div>

      <!-- Grid of Client Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        ${filtered.map(client => {
          const clientCases = state.cases.filter(c => c.clientId === client.id);
          const clientDocs = state.documents.filter(d => d.clientId === client.id);
          return `
            <div class="bg-surface-container-low border border-outline-variant hover:border-primary/40 rounded-2xl p-5 flex flex-col justify-between transition-all shadow-lg group">
              <div>
                <div class="flex items-start justify-between gap-2 mb-3">
                  <div class="flex items-center gap-3 min-w-0">
                    <div class="w-11 h-11 rounded-xl bg-primary/15 border border-primary/30 text-primary flex items-center justify-center font-bold text-base shrink-0">
                      ${client.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div class="min-w-0">
                      <h3 class="text-base font-bold text-white truncate group-hover:text-primary transition-colors">${client.name}</h3>
                      <span class="font-mono-code text-xs text-primary">${client.id} • RFC: ${client.rfc}</span>
                    </div>
                  </div>
                  <span class="px-2.5 py-0.5 rounded-full bg-surface-container-highest border border-outline-variant text-[11px] text-on-surface-variant font-medium shrink-0">
                    ${client.type}
                  </span>
                </div>

                <div class="space-y-1.5 text-xs text-on-surface-variant bg-surface-container-lowest/70 border border-outline-variant p-3 rounded-xl mb-4">
                  <div class="flex justify-between"><span class="text-outline">Representante:</span> <strong class="text-white truncate max-w-[180px]">${client.representative}</strong></div>
                  <div class="flex justify-between"><span class="text-outline">Sector / Giro:</span> <span class="text-slate-300">${client.sector}</span></div>
                  <div class="flex justify-between"><span class="text-outline">Contacto:</span> <span class="font-mono-code text-slate-300">${client.email}</span></div>
                </div>
              </div>

              <div class="pt-3 border-t border-outline-variant flex items-center justify-between gap-2">
                <div class="flex items-center gap-3 font-mono-code text-xs">
                  <span class="text-white"><strong>${clientCases.length}</strong> Exp.</span>
                  <span class="text-outline">•</span>
                  <span class="text-emerald-400"><strong>${clientDocs.length}</strong> Docs IA</span>
                </div>
                <div class="flex items-center gap-1.5">
                  <button type="button" data-client-open-tree="${client.id}" class="px-3 py-1.5 rounded-lg bg-primary-container hover:bg-primary text-white text-xs font-semibold flex items-center gap-1 transition-all">
                    <span class="material-symbols-outlined text-sm">account_tree</span>
                    <span>Abrir Carpeta</span>
                  </button>
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;

  document.getElementById('clients-search-input')?.addEventListener('input', (e) => {
    clientSearchQuery = e.target.value;
    renderClientsView(container);
    const input = document.getElementById('clients-search-input');
    if (input) {
      input.focus();
      input.setSelectionRange(input.value.length, input.value.length);
    }
  });

  container.querySelectorAll('[data-client-type]').forEach(btn => {
    btn.addEventListener('click', () => {
      clientFilterType = btn.getAttribute('data-client-type');
      renderClientsView(container);
    });
  });

  container.querySelectorAll('[data-client-open-tree]').forEach(btn => {
    btn.addEventListener('click', () => {
      store.setRoute('documentos', { clientId: btn.getAttribute('data-client-open-tree'), category: null });
    });
  });

  document.getElementById('new-client-modal-btn')?.addEventListener('click', () => {
    openNewClientModal(() => renderClientsView(container));
  });
}

function openNewClientModal(onCreated) {
  const modalRoot = document.getElementById('global-modal-root');
  if (!modalRoot) return;

  modalRoot.innerHTML = `
    <div class="fixed inset-0 z-[100] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 modal-backdrop-enter" id="new-client-backdrop">
      <div class="bg-surface-container-low border border-white/15 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
        <div class="px-6 py-4 bg-surface-container-lowest border-b border-white/10 flex items-center justify-between">
          <h3 class="text-base font-bold text-white">Alta de Cliente (Carpeta Raíz Nivel 1)</h3>
          <button id="close-new-client-btn" type="button" class="text-on-surface-variant hover:text-white">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>
        <form id="new-client-form" class="p-6 space-y-4 text-sm">
          <div>
            <label class="block text-xs font-semibold text-on-surface-variant uppercase mb-1">Nombre o Razón Social (Acepta 1 solo nombre o sin apellidos separados)</label>
            <input id="nc-name" required type="text" placeholder="Ej. Alejandro, Grupo Alfa S.A., María..." class="w-full rounded-xl bg-surface-container-lowest border border-white/15 text-white px-3.5 py-2.5 focus:border-primary focus:outline-none" />
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-semibold text-on-surface-variant uppercase mb-1">Tipo de Titular</label>
              <select id="nc-type" class="w-full rounded-xl bg-surface-container-lowest border border-white/15 text-white px-3.5 py-2.5">
                <option value="Corporativo">Corporativo</option>
                <option value="Persona Física">Persona Física</option>
                <option value="Gran Cuenta">Gran Cuenta</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-semibold text-on-surface-variant uppercase mb-1">RFC / Identificador Fiscal</label>
              <input id="nc-rfc" type="text" placeholder="XAXX010101000" class="w-full rounded-xl bg-surface-container-lowest border border-white/15 text-white font-mono-code px-3.5 py-2.5 focus:border-primary focus:outline-none" />
            </div>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-semibold text-on-surface-variant uppercase mb-1">Representante / Contacto</label>
              <input id="nc-rep" type="text" placeholder="Nombre del representante" class="w-full rounded-xl bg-surface-container-lowest border border-white/15 text-white px-3.5 py-2.5 focus:border-primary focus:outline-none" />
            </div>
            <div>
              <label class="block text-xs font-semibold text-on-surface-variant uppercase mb-1">Correo Electrónico</label>
              <input id="nc-email" type="email" placeholder="contacto@cliente.mx" class="w-full rounded-xl bg-surface-container-lowest border border-white/15 text-white px-3.5 py-2.5 focus:border-primary focus:outline-none" />
            </div>
          </div>
          <div class="pt-3 border-t border-white/10 flex justify-end gap-2">
            <button id="cancel-new-client-btn" type="button" class="px-4 py-2 rounded-xl bg-surface-container text-xs font-semibold text-on-surface-variant hover:text-white">Cancelar</button>
            <button type="submit" class="px-5 py-2 rounded-xl bg-primary-container hover:bg-primary text-xs font-semibold text-white">Crear Carpeta de Cliente</button>
          </div>
        </form>
      </div>
    </div>
  `;

  const close = () => { modalRoot.innerHTML = ''; };
  document.getElementById('close-new-client-btn')?.addEventListener('click', close);
  document.getElementById('cancel-new-client-btn')?.addEventListener('click', close);

  document.getElementById('new-client-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('nc-name')?.value.trim();
    if (!name) return;
    const { client } = store.findOrCreateClient(name, {
      type: document.getElementById('nc-type')?.value,
      rfc: document.getElementById('nc-rfc')?.value.trim() || 'XAXX010101000',
      representative: document.getElementById('nc-rep')?.value.trim() || name,
      email: document.getElementById('nc-email')?.value.trim() || 'juridico@cliente.mx'
    });
    store.notify('clients');
    close();
    showToast(`Cliente "${client.name}" registrado con carpeta raíz en el Repositorio`, 'success');
    if (onCreated) onCreated();
  });
}
