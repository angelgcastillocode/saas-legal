/**
 * Modal de Reclasificación y Validación Manual de Documentos
 * Permite corregir Cliente, Subcarpeta de Tipo de Documento (Nivel 2),
 * Tipo Específico y Expediente vinculado, actualizando en tiempo real
 * la vista previa de la Nomenclatura Estandarizada ([Tipo]_[Fecha]_[NombreOriginal].ext).
 */

import { store } from '../store/state.js';
import {
  DOCUMENT_CATEGORIES,
  buildNormalizedFileName
} from '../services/fileNormalizer.js';
import { showToast } from './globalSearchModal.js';

export function openReclassifyModal(docId) {
  const doc = store.state.documents.find(d => d.id === docId);
  if (!doc) return;

  const modalRoot = document.getElementById('global-modal-root');
  if (!modalRoot) return;

  const clients = store.state.clients;
  const cases = store.state.cases;

  modalRoot.innerHTML = `
    <div class="fixed inset-0 z-[100] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 modal-backdrop-enter" id="reclassify-backdrop">
      <div class="bg-surface-container-low border border-white/15 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden">
        <div class="px-6 py-4 bg-surface-container-lowest border-b border-white/10 flex items-center justify-between">
          <div class="flex items-center gap-2.5">
            <span class="material-symbols-outlined text-primary text-xl">drive_file_move</span>
            <div>
              <h3 class="text-base font-bold text-white">Reclasificar y Validar Documento</h3>
              <p class="text-xs text-on-surface-variant">Ajusta la ubicación en el Árbol Documental y normaliza su nomenclatura</p>
            </div>
          </div>
          <button id="reclassify-close-btn" type="button" class="p-1.5 rounded-lg text-on-surface-variant hover:text-white hover:bg-white/10">
            <span class="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        <form id="reclassify-form" class="p-6 space-y-4 text-sm">
          <!-- Archivo Original & Vista Previa Normalizada -->
          <div class="p-3.5 rounded-xl bg-surface-container-lowest border border-primary/30 space-y-1.5">
            <div class="flex items-center justify-between text-xs text-on-surface-variant">
              <span>Archivo Original (Trazabilidad):</span>
              <span class="font-mono-code text-slate-300">${doc.originalName}</span>
            </div>
            <div class="pt-1 border-t border-white/10">
              <span class="text-[11px] uppercase tracking-wider text-primary font-semibold block">Nomenclatura Estandarizada Resultante:</span>
              <span id="live-normalized-preview" class="font-mono-code text-xs sm:text-sm text-emerald-400 font-bold break-all">
                ${doc.normalizedName}
              </span>
            </div>
          </div>

          <!-- Nivel 1: Cliente -->
          <div>
            <label class="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1.5">
              Nivel 1 • Carpeta de Cliente
            </label>
            <select id="reclass-client-select" class="w-full rounded-xl bg-surface-container-lowest border border-white/15 text-white text-sm px-3.5 py-2.5 focus:border-primary focus:ring-1 focus:ring-primary">
              ${clients.map(c => `<option value="${c.id}" ${c.id === doc.clientId ? 'selected' : ''}>${c.name} (${c.id})</option>`).join('')}
              <option value="__NEW__">+ Crear nuevo cliente (ej. Persona física o un solo nombre)...</option>
            </select>
            <input id="reclass-new-client-input" type="text" placeholder="Escribe el nombre del cliente (ej. Juan, Pemex, Constructora Alfa...)" class="hidden mt-2 w-full rounded-xl bg-surface-container-lowest border border-primary/50 text-white text-sm px-3.5 py-2 focus:outline-none" />
          </div>

          <!-- Nivel 2: Subcarpeta por Tipo de Documento -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1.5">
                Nivel 2 • Subcarpeta (Tipo IA)
              </label>
              <select id="reclass-category-select" class="w-full rounded-xl bg-surface-container-lowest border border-white/15 text-white text-sm px-3.5 py-2.5 focus:border-primary focus:ring-1 focus:ring-primary">
                ${DOCUMENT_CATEGORIES.map(cat => `<option value="${cat.id}" ${cat.id === doc.category ? 'selected' : ''}>📁 ${cat.label}</option>`).join('')}
              </select>
            </div>
            <div>
              <label class="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1.5">
                Clasificación Específica
              </label>
              <input id="reclass-doctype-input" type="text" value="${doc.docTypeLabel}" class="w-full rounded-xl bg-surface-container-lowest border border-white/15 text-white text-sm px-3.5 py-2.5 focus:border-primary focus:outline-none" />
            </div>
          </div>

          <!-- Expediente Vinculado -->
          <div>
            <label class="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1.5">
              Expediente Judicial Vinculado
            </label>
            <input id="reclass-case-input" list="cases-datalist" type="text" value="${doc.caseId}" class="w-full rounded-xl bg-surface-container-lowest border border-white/15 text-white font-mono-code text-sm px-3.5 py-2.5 focus:border-primary focus:outline-none" placeholder="Ej. EXP-2024-8841-CIV o Sin número (Nuevo)" />
            <datalist id="cases-datalist">
              <option value="Sin número (Nuevo)">Sin número (Nuevo)</option>
              ${cases.map(c => `<option value="${c.id}">${c.id} — ${c.clientName}</option>`).join('')}
            </datalist>
          </div>

          <!-- Checkbox de Validación Humana -->
          <label class="flex items-center gap-2.5 pt-1 cursor-pointer select-none">
            <input id="reclass-validate-check" type="checkbox" checked class="w-4 h-4 rounded text-primary bg-surface-container-lowest border-white/20 accent-primary" />
            <span class="text-xs text-on-surface">Marcar como <strong>Validado por Abogado (100% Confianza)</strong> y retirar alertas</span>
          </label>

          <div class="pt-3 border-t border-white/10 flex items-center justify-end gap-2.5">
            <button id="reclassify-cancel-btn" type="button" class="px-4 py-2 rounded-xl bg-surface-container border border-white/10 text-xs font-semibold text-on-surface-variant hover:text-white">
              Cancelar
            </button>
            <button type="submit" class="px-5 py-2 rounded-xl bg-primary-container hover:bg-primary text-xs font-semibold text-white shadow-lg shadow-primary/25 flex items-center gap-1.5">
              <span class="material-symbols-outlined text-base">check_circle</span>
              <span>Guardar y Normalizar</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  `;

  const close = () => {
    modalRoot.innerHTML = '';
  };

  document.getElementById('reclassify-close-btn')?.addEventListener('click', close);
  document.getElementById('reclassify-cancel-btn')?.addEventListener('click', close);
  document.getElementById('reclassify-backdrop')?.addEventListener('click', (e) => {
    if (e.target.id === 'reclassify-backdrop') close();
  });

  const clientSelect = document.getElementById('reclass-client-select');
  const newClientInput = document.getElementById('reclass-new-client-input');
  const categorySelect = document.getElementById('reclass-category-select');
  const previewEl = document.getElementById('live-normalized-preview');

  clientSelect?.addEventListener('change', () => {
    if (clientSelect.value === '__NEW__') {
      newClientInput.classList.remove('hidden');
      newClientInput.focus();
    } else {
      newClientInput.classList.add('hidden');
    }
  });

  categorySelect?.addEventListener('change', () => {
    const newNorm = buildNormalizedFileName(doc.originalName, categorySelect.value, doc.dateISO);
    if (previewEl) previewEl.textContent = newNorm;
  });

  document.getElementById('reclassify-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const isNewClient = clientSelect.value === '__NEW__';
    const validateChecked = document.getElementById('reclass-validate-check')?.checked;

    const updated = store.reclassifyDocument(doc.id, {
      clientId: isNewClient ? null : clientSelect.value,
      newClientName: isNewClient ? (newClientInput.value.trim() || 'Cliente General') : null,
      category: categorySelect.value,
      docTypeLabel: document.getElementById('reclass-doctype-input')?.value.trim() || doc.docTypeLabel,
      caseId: document.getElementById('reclass-case-input')?.value.trim() || 'Sin número (Nuevo)',
      confidence: validateChecked ? 100 : doc.confidence
    });

    close();
    if (updated) {
      showToast(`Reclasificado en ${updated.clientName} / ${updated.category} como "${updated.normalizedName}"`, 'success');
    }
  });
}
