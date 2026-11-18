/**
 * Vista Dedicada: Gestión de Expedientes Judiciales y Carátulas
 * Permite filtrar por materia, crear nuevos expedientes y asignar folio oficial
 * a los expedientes creados como "Sin número (Nuevo)".
 */

import { store } from '../store/state.js';
import { showToast } from '../components/globalSearchModal.js';

let selectedMatter = 'ALL';

export function renderCasesView(container) {
  const state = store.state;
  const filteredCases = state.cases.filter(c => {
    if (selectedMatter === 'ALL') return true;
    if (selectedMatter === 'UNNUMBERED') return c.id === 'Sin número (Nuevo)';
    return c.matter.toLowerCase() === selectedMatter.toLowerCase();
  });

  container.innerHTML = `
    <div class="flex flex-col w-full">
      <div class="flex flex-col md:flex-row md:items-center justify-between pb-6 gap-4">
        <div>
          <div class="flex items-center gap-2 text-on-surface-variant font-mono-code text-xs uppercase tracking-wider">
            <span>CONTROL PROCESAL</span>
            <span class="text-outline">/</span>
            <span class="text-primary font-semibold">EXPEDIENTES ACTIVOS Y RADICACIONES</span>
          </div>
          <h1 class="text-2xl lg:text-3xl font-bold text-white tracking-tight mt-1">Cartera de Expedientes Judiciales</h1>
          <p class="text-sm text-on-surface-variant mt-1">
            Supervisa carátulas, juzgados, cuantías y asigna número oficial a expedientes detectados como "Sin número (Nuevo)".
          </p>
        </div>
        <button id="open-new-case-modal-btn" type="button" class="px-4 py-2.5 rounded-xl bg-primary-container hover:bg-primary text-white text-sm font-semibold shadow-lg shadow-primary/25 flex items-center gap-2 self-start md:self-auto">
          <span class="material-symbols-outlined text-lg">create_new_folder</span>
          <span>Radicar Nuevo Expediente</span>
        </button>
      </div>

      <!-- Filter Pills -->
      <div class="flex items-center gap-2 flex-wrap mb-6">
        ${[
          { id: 'ALL', label: `Todos (${state.cases.length})` },
          { id: 'Mercantil', label: 'Mercantil' },
          { id: 'Civil', label: 'Civil' },
          { id: 'Laboral', label: 'Laboral' },
          { id: 'Administrativo', label: 'Administrativo' },
          { id: 'UNNUMBERED', label: '⚠️ Sin número (Nuevo)' }
        ].map(f => `
          <button type="button" data-matter-filter="${f.id}" class="px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors ${selectedMatter === f.id ? 'bg-primary-container text-white font-semibold shadow-sm' : 'bg-surface-container-low border border-outline-variant text-on-surface-variant hover:text-white'}">
            ${f.label}
          </button>
        `).join('')}
      </div>

      <!-- Cases Cards List -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">
        ${filteredCases.map(c => {
          const caseDocs = state.documents.filter(d => d.caseId === c.id && d.clientId === c.clientId);
          const isUnnumbered = c.id === 'Sin número (Nuevo)';
          return `
            <div class="bg-surface-container-low border ${isUnnumbered ? 'border-amber-500/40' : 'border-outline-variant'} hover:border-primary/50 rounded-2xl p-5 flex flex-col justify-between shadow-lg transition-all">
              <div>
                <div class="flex items-center justify-between gap-2 mb-2 flex-wrap">
                  <span class="px-2.5 py-1 rounded-lg ${isUnnumbered ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-primary/15 text-primary border border-primary/30'} font-mono-code text-xs font-bold">
                    ${c.id}
                  </span>
                  <div class="flex items-center gap-2">
                    <span class="px-2.5 py-0.5 rounded-full bg-surface-container-highest text-on-surface-variant text-xs font-medium border border-outline-variant">${c.matter}</span>
                    <span class="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold">${c.stage}</span>
                  </div>
                </div>

                <h3 class="text-base font-bold text-white mb-1">${c.title}</h3>
                <p class="text-xs text-on-surface-variant mb-4">Cliente: <strong class="text-white">${c.clientName}</strong> • ${c.court}</p>

                <div class="grid grid-cols-2 gap-3 p-3 rounded-xl bg-surface-container-lowest border border-outline-variant text-xs mb-4">
                  <div>
                    <span class="text-outline block">Cuantía / Suerte Principal</span>
                    <span class="font-mono-code font-bold text-primary text-sm">${c.amount}</span>
                  </div>
                  <div>
                    <span class="text-outline block">Abogado Responsable</span>
                    <span class="font-semibold text-white">${c.lawyer}</span>
                  </div>
                </div>
              </div>

              <div class="pt-3 border-t border-outline-variant flex items-center justify-between gap-2 flex-wrap">
                <span class="font-mono-code text-xs text-on-surface-variant">
                  <strong class="text-white">${caseDocs.length}</strong> documento(s) indexados
                </span>
                <div class="flex items-center gap-2">
                  ${isUnnumbered ? `
                    <button type="button" data-assign-number="${c.clientId}" class="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-xs font-semibold">
                      Asignar Folio Judicial
                    </button>
                  ` : ''}
                  <button type="button" data-open-case-tree="${c.clientId}" data-open-case-id="${c.id}" class="px-3.5 py-1.5 rounded-lg bg-primary-container hover:bg-primary text-white text-xs font-semibold flex items-center gap-1.5">
                    <span class="material-symbols-outlined text-sm">folder_open</span>
                    <span>Ver Documentos</span>
                  </button>
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;

  container.querySelectorAll('[data-matter-filter]').forEach(btn => {
    btn.addEventListener('click', () => {
      selectedMatter = btn.getAttribute('data-matter-filter');
      renderCasesView(container);
    });
  });

  container.querySelectorAll('[data-open-case-tree]').forEach(btn => {
    btn.addEventListener('click', () => {
      store.setRoute('documentos', {
        clientId: btn.getAttribute('data-open-case-tree'),
        category: null,
        caseId: btn.getAttribute('data-open-case-id')
      });
    });
  });

  container.querySelectorAll('[data-assign-number]').forEach(btn => {
    btn.addEventListener('click', () => {
      const clientId = btn.getAttribute('data-assign-number');
      const newNum = prompt('Ingresa el número de expediente judicial asignado por Oficialía (ej. EXP-2026-0450-MERC):', `EXP-2026-${Math.floor(1000 + Math.random() * 8999)}-MERC`);
      if (newNum && newNum.trim()) {
        const clean = newNum.trim().toUpperCase();
        const caseObj = store.state.cases.find(c => c.clientId === clientId && c.id === 'Sin número (Nuevo)');
        if (caseObj) {
          caseObj.id = clean;
          caseObj.status = 'En trámite';
          caseObj.statusColor = 'emerald';
          caseObj.pendingAIReview = false;
        }
        store.state.documents.forEach(d => {
          if (d.clientId === clientId && d.caseId === 'Sin número (Nuevo)') {
            d.caseId = clean;
          }
        });
        store.notify('cases');
        showToast(`Folio judicial ${clean} asignado y vinculado a sus documentos`, 'success');
        renderCasesView(container);
      }
    });
  });

  document.getElementById('open-new-case-modal-btn')?.addEventListener('click', () => {
    openNewCaseModal(() => renderCasesView(container));
  });
}

function openNewCaseModal(onCreated) {
  const modalRoot = document.getElementById('global-modal-root');
  if (!modalRoot) return;
  const clients = store.state.clients;

  modalRoot.innerHTML = `
    <div class="fixed inset-0 z-[100] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 modal-backdrop-enter">
      <div class="bg-surface-container-low border border-white/15 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
        <div class="px-6 py-4 bg-surface-container-lowest border-b border-white/10 flex items-center justify-between">
          <h3 class="text-base font-bold text-white">Radicar Nuevo Expediente</h3>
          <button id="close-ncase-btn" type="button" class="text-on-surface-variant hover:text-white"><span class="material-symbols-outlined">close</span></button>
        </div>
        <form id="new-case-form" class="p-6 space-y-4 text-sm">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-semibold text-on-surface-variant uppercase mb-1">Número de Expediente</label>
              <input id="case-num-input" type="text" value="EXP-2026-${Math.floor(1000 + Math.random() * 8999)}-CIV" class="w-full rounded-xl bg-surface-container-lowest border border-white/15 text-white font-mono-code px-3.5 py-2.5" placeholder="O deja vacío para Sin número (Nuevo)" />
            </div>
            <div>
              <label class="block text-xs font-semibold text-on-surface-variant uppercase mb-1">Materia</label>
              <select id="case-matter-input" class="w-full rounded-xl bg-surface-container-lowest border border-white/15 text-white px-3.5 py-2.5">
                <option value="Mercantil">Mercantil</option>
                <option value="Civil">Civil</option>
                <option value="Laboral">Laboral</option>
                <option value="Administrativo">Administrativo</option>
                <option value="Penal">Penal</option>
              </select>
            </div>
          </div>
          <div>
            <label class="block text-xs font-semibold text-on-surface-variant uppercase mb-1">Cliente Titular</label>
            <select id="case-client-input" class="w-full rounded-xl bg-surface-container-lowest border border-white/15 text-white px-3.5 py-2.5">
              ${clients.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
            </select>
          </div>
          <div>
            <label class="block text-xs font-semibold text-on-surface-variant uppercase mb-1">Carátula / Asunto del Litigio</label>
            <input id="case-title-input" required type="text" placeholder="Ej. Juicio Ejecutivo Mercantil por Incumplimiento..." class="w-full rounded-xl bg-surface-container-lowest border border-white/15 text-white px-3.5 py-2.5" />
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-semibold text-on-surface-variant uppercase mb-1">Juzgado / Tribunal</label>
              <input id="case-court-input" type="text" value="Juzgado 5º de lo Mercantil" class="w-full rounded-xl bg-surface-container-lowest border border-white/15 text-white px-3.5 py-2.5" />
            </div>
            <div>
              <label class="block text-xs font-semibold text-on-surface-variant uppercase mb-1">Cuantía Estimada</label>
              <input id="case-amount-input" type="text" value="$950,000 MXN" class="w-full rounded-xl bg-surface-container-lowest border border-white/15 text-white font-mono-code px-3.5 py-2.5" />
            </div>
          </div>
          <div class="pt-3 border-t border-white/10 flex justify-end gap-2">
            <button id="cancel-ncase-btn" type="button" class="px-4 py-2 rounded-xl bg-surface-container text-xs font-semibold text-on-surface-variant">Cancelar</button>
            <button type="submit" class="px-5 py-2 rounded-xl bg-primary-container hover:bg-primary text-xs font-semibold text-white">Crear Expediente</button>
          </div>
        </form>
      </div>
    </div>
  `;

  const close = () => { modalRoot.innerHTML = ''; };
  document.getElementById('close-ncase-btn')?.addEventListener('click', close);
  document.getElementById('cancel-ncase-btn')?.addEventListener('click', close);

  document.getElementById('new-case-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const clientId = document.getElementById('case-client-input')?.value;
    const client = store.state.clients.find(c => c.id === clientId) || store.state.clients[0];
    const num = document.getElementById('case-num-input')?.value.trim() || 'Sin número (Nuevo)';
    const title = document.getElementById('case-title-input')?.value.trim();
    const matter = document.getElementById('case-matter-input')?.value;
    const court = document.getElementById('case-court-input')?.value.trim();
    const amount = document.getElementById('case-amount-input')?.value.trim();

    store.state.cases.unshift({
      id: num,
      title,
      subtitle: `Juicio ${matter}`,
      matter,
      clientId: client.id,
      clientName: client.name,
      court,
      lawyer: store.state.currentUser?.name || 'Dra. Elena Valdés',
      amount,
      amountNote: 'Radicado en sistema local',
      stage: 'Escrito Inicial',
      status: num === 'Sin número (Nuevo)' ? 'Sin número (Nuevo)' : 'En trámite',
      statusColor: num === 'Sin número (Nuevo)' ? 'amber' : 'emerald',
      priority: 'Alta Prioridad',
      hasUpcomingHearing: false,
      pendingAIReview: num === 'Sin número (Nuevo)',
      lastDocName: 'Pendiente de ingesta',
      lastUpdateText: 'Recién creado'
    });

    store.notify('cases');
    close();
    showToast(`Expediente "${num}" registrado para ${client.name}`, 'success');
    if (onCreated) onCreated();
  });
}
