/**
 * Visor Web Integrado y Descarga Directa Normalizada
 * Diseñado para consulta inmediata en juzgados desde cualquier dispositivo
 * sin depender de software de escritorio.
 */

import { store } from '../store/state.js';
import { getFileFromVault } from '../store/fileVault.js';
import { triggerBrowserDownload } from '../services/reportGenerator.js';
import { openReclassifyModal } from './reclassifyModal.js';
import { showToast } from './globalSearchModal.js';

let activeObjectUrl = null;

export async function openWebViewerModal(docId) {
  const doc = store.state.documents.find(d => d.id === docId);
  if (!doc) return;

  const modalRoot = document.getElementById('global-modal-root');
  if (!modalRoot) return;

  if (activeObjectUrl) {
    URL.revokeObjectURL(activeObjectUrl);
    activeObjectUrl = null;
  }

  const vaultRecord = await getFileFromVault(doc.id);
  let hasNativePdf = false;
  let hasNativeImage = false;

  if (vaultRecord && vaultRecord.blob) {
    activeObjectUrl = URL.createObjectURL(vaultRecord.blob);
    if (doc.ext === 'pdf' || vaultRecord.type === 'application/pdf') {
      hasNativePdf = true;
    } else if (['png', 'jpg', 'jpeg', 'webp'].includes(doc.ext) || vaultRecord.type.startsWith('image/')) {
      hasNativeImage = true;
    }
  }

  const fullText = (vaultRecord?.extractedText || doc.fullPreviewText || doc.ocrSnippet || '').trim();

  modalRoot.innerHTML = `
    <div class="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 modal-backdrop-enter" id="web-viewer-backdrop">
      <div class="bg-surface-container-lowest border border-white/15 rounded-2xl w-full max-w-6xl h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        <!-- Top Bar -->
        <div class="px-5 py-4 bg-surface-container-low border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div class="flex items-start sm:items-center gap-3 min-w-0">
            <div class="w-10 h-10 rounded-xl bg-primary/15 border border-primary/30 text-primary flex items-center justify-center shrink-0">
              <span class="material-symbols-outlined text-xl">${doc.ext === 'pdf' ? 'picture_as_pdf' : (['png', 'jpg', 'jpeg'].includes(doc.ext) ? 'image' : 'description')}</span>
            </div>
            <div class="min-w-0">
              <div class="flex items-center gap-2 flex-wrap">
                <h3 class="text-sm sm:text-base font-bold text-white font-mono-code truncate" title="${doc.normalizedName}">
                  ${doc.normalizedName}
                </h3>
                <span class="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[11px] font-mono-code font-semibold">
                  Visor Remoto Juzgado
                </span>
              </div>
              <div class="flex items-center gap-2 text-xs text-on-surface-variant mt-0.5 flex-wrap">
                <span>Original: <strong class="text-slate-300 font-mono-code">${doc.originalName}</strong></span>
                <span>•</span>
                <span>Ruta: <strong class="text-primary">${doc.clientName}</strong> / <strong class="text-emerald-400">${doc.category}</strong></span>
                <span>•</span>
                <span>Exp: <strong class="text-white font-mono-code">${doc.caseId}</strong></span>
              </div>
            </div>
          </div>

          <div class="flex items-center gap-2 shrink-0">
            <button id="viewer-reclassify-btn" type="button" class="px-3 py-2 rounded-xl bg-surface-container-high hover:bg-surface-container-highest border border-white/10 text-xs font-semibold text-white flex items-center gap-1.5 transition-all">
              <span class="material-symbols-outlined text-base text-amber-400">drive_file_move</span>
              <span>Reclasificar</span>
            </button>
            <button id="viewer-download-btn" type="button" class="px-3.5 py-2 rounded-xl bg-primary-container hover:bg-primary text-xs font-semibold text-white shadow-md shadow-primary/20 flex items-center gap-1.5 transition-all">
              <span class="material-symbols-outlined text-base">download</span>
              <span>Descargar Normalizado</span>
            </button>
            <button id="viewer-close-btn" type="button" class="p-2 rounded-xl bg-surface-container hover:bg-error/20 hover:text-error text-on-surface-variant border border-white/10 transition-all" title="Cerrar Visor (Esc)">
              <span class="material-symbols-outlined text-xl">close</span>
            </button>
          </div>
        </div>

        <!-- Mode Tabs -->
        <div class="px-5 py-2.5 bg-surface-container border-b border-white/10 flex items-center justify-between flex-wrap gap-2">
          <div class="flex items-center gap-2">
            <button type="button" data-viewer-tab="document" class="viewer-tab-btn px-3.5 py-1.5 rounded-lg bg-primary text-white text-xs font-semibold flex items-center gap-1.5">
              <span class="material-symbols-outlined text-sm">visibility</span>
              <span>Vista Documento / Folio Judicial</span>
            </button>
            <button type="button" data-viewer-tab="ocr" class="viewer-tab-btn px-3.5 py-1.5 rounded-lg bg-surface-container-lowest text-on-surface-variant hover:text-white text-xs font-medium flex items-center gap-1.5 border border-white/5">
              <span class="material-symbols-outlined text-sm">document_scanner</span>
              <span>Transcripción OCR &amp; Entidades IA</span>
            </button>
          </div>
          <div class="flex items-center gap-3 font-mono-code text-xs text-on-surface-variant">
            <span>Fojas: <strong class="text-white">${doc.fojas || 1}</strong></span>
            <span>•</span>
            <span>Confianza IA: <strong class="text-emerald-400">${doc.confidence}%</strong></span>
            <span class="hidden md:inline">•</span>
            <span class="hidden md:inline">SHA-256: <strong class="text-primary">${(doc.sha256 || '').slice(0, 14)}...</strong></span>
          </div>
        </div>

        <!-- Main Body -->
        <div class="flex-1 overflow-y-auto p-5 bg-[#090c12]" id="viewer-tab-content">
          ${renderDocumentPreviewPane(doc, { hasNativePdf, hasNativeImage, activeObjectUrl, fullText })}
        </div>
      </div>
    </div>
  `;

  const closeViewer = () => {
    if (activeObjectUrl) {
      URL.revokeObjectURL(activeObjectUrl);
      activeObjectUrl = null;
    }
    modalRoot.innerHTML = '';
  };

  document.getElementById('viewer-close-btn')?.addEventListener('click', closeViewer);
  document.getElementById('web-viewer-backdrop')?.addEventListener('click', (e) => {
    if (e.target.id === 'web-viewer-backdrop') closeViewer();
  });

  document.getElementById('viewer-reclassify-btn')?.addEventListener('click', () => {
    closeViewer();
    openReclassifyModal(doc.id);
  });

  document.getElementById('viewer-download-btn')?.addEventListener('click', () => {
    downloadNormalizedDocument(doc, vaultRecord);
  });

  const tabBtns = modalRoot.querySelectorAll('.viewer-tab-btn');
  const contentContainer = document.getElementById('viewer-tab-content');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.getAttribute('data-viewer-tab');
      tabBtns.forEach(b => {
        b.className = 'viewer-tab-btn px-3.5 py-1.5 rounded-lg bg-surface-container-lowest text-on-surface-variant hover:text-white text-xs font-medium flex items-center gap-1.5 border border-white/5';
      });
      btn.className = 'viewer-tab-btn px-3.5 py-1.5 rounded-lg bg-primary text-white text-xs font-semibold flex items-center gap-1.5';

      if (tab === 'ocr') {
        contentContainer.innerHTML = renderOCREntitiesPane(doc, fullText);
      } else {
        contentContainer.innerHTML = renderDocumentPreviewPane(doc, { hasNativePdf, hasNativeImage, activeObjectUrl, fullText });
      }
    });
  });
}

function renderDocumentPreviewPane(doc, { hasNativePdf, hasNativeImage, activeObjectUrl, fullText }) {
  if (hasNativePdf && activeObjectUrl) {
    return `
      <div class="w-full h-full flex flex-col gap-3">
        <iframe src="${activeObjectUrl}" class="w-full flex-1 min-h-[65vh] rounded-xl border border-white/10 bg-surface-container" title="${doc.normalizedName}"></iframe>
      </div>
    `;
  }

  if (hasNativeImage && activeObjectUrl) {
    return `
      <div class="w-full h-full flex flex-col items-center justify-center gap-4 p-4">
        <img src="${activeObjectUrl}" alt="${doc.normalizedName}" class="max-h-[68vh] w-auto object-contain rounded-xl border border-white/15 shadow-2xl" />
      </div>
    `;
  }

  // Vista de Folio Judicial Digital (para documentos de demostración, .docx o lectura móvil en juzgado)
  return `
    <div class="max-w-4xl mx-auto bg-surface-container-low border border-white/10 rounded-2xl p-6 sm:p-10 shadow-xl">
      <!-- Sello digital de carátula -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-white/10">
        <div>
          <span class="px-2.5 py-1 rounded-md bg-primary/15 border border-primary/30 text-primary font-mono-code text-xs font-semibold">
            COPIA CERTIFICADA DIGITAL • SOVEREIGN VAULT
          </span>
          <h4 class="text-lg font-bold text-white mt-2">${doc.docTypeLabel}</h4>
          <p class="text-xs text-on-surface-variant">${doc.court || 'Órgano Jurisdiccional Verificado'}</p>
        </div>
        <div class="bg-surface-container-lowest border border-white/10 rounded-xl p-3 font-mono-code text-xs text-right">
          <div class="text-primary font-bold">${doc.caseId}</div>
          <div class="text-on-surface-variant">Carpeta: ${doc.category}</div>
          <div class="text-emerald-400">Confianza OCR: ${doc.confidence}%</div>
        </div>
      </div>

      <!-- Cuerpo del documento legible -->
      <div class="bg-surface-container-lowest border border-white/10 rounded-xl p-6 font-mono-code text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-wrap select-all">${escapeHtml(fullText)}</div>

      <!-- Pie criptográfico -->
      <div class="mt-6 pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono-code text-outline">
        <span>Archivo Normalizado: <strong class="text-white">${doc.normalizedName}</strong></span>
        <span>SHA-256: <strong class="text-emerald-400">${doc.sha256}</strong></span>
      </div>
    </div>
  `;
}

function renderOCREntitiesPane(doc, fullText) {
  const ent = doc.entities || {};
  return `
    <div class="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div class="lg:col-span-5 flex flex-col gap-3">
        <div class="bg-surface-container-low border border-white/10 rounded-xl p-4">
          <h4 class="text-xs font-semibold uppercase tracking-wider text-primary mb-3">Metadatos y Trazabilidad</h4>
          <div class="space-y-2.5 text-xs">
            <div class="p-2.5 rounded-lg bg-surface-container-lowest border border-white/5">
              <span class="text-outline block">Nombre Normalizado (Estándar Despacho)</span>
              <span class="font-mono-code text-white font-semibold break-all">${doc.normalizedName}</span>
            </div>
            <div class="p-2.5 rounded-lg bg-surface-container-lowest border border-white/5">
              <span class="text-outline block">Archivo Fuente Original</span>
              <span class="font-mono-code text-slate-300 break-all">${doc.originalName}</span>
            </div>
            <div class="p-2.5 rounded-lg bg-surface-container-lowest border border-white/5">
              <span class="text-outline block">Ubicación en Árbol Documental</span>
              <span class="text-white font-semibold">${doc.clientName} <span class="text-primary">→</span> ${doc.category}</span>
            </div>
            <div class="p-2.5 rounded-lg bg-surface-container-lowest border border-white/5">
              <span class="text-outline block">Actor / Cliente</span>
              <span class="text-white font-semibold">${ent.actor || doc.clientName}</span>
              <span class="block text-[11px] font-mono-code text-emerald-400">${ent.actorMeta || ''}</span>
            </div>
            <div class="p-2.5 rounded-lg bg-surface-container-lowest border border-white/5">
              <span class="text-outline block">Contraparte / Demandado</span>
              <span class="text-white font-semibold">${ent.demandado || 'No especificado'}</span>
              <span class="block text-[11px] font-mono-code text-on-surface-variant">${ent.demandadoMeta || ''}</span>
            </div>
            <div class="p-2.5 rounded-lg bg-surface-container-lowest border border-white/5">
              <span class="text-outline block">Obligación / Cuantía</span>
              <span class="text-primary font-mono-code font-bold">${ent.obligacion || 'S/D'}</span>
              <span class="block text-[11px] text-on-surface-variant">${ent.obligacionMeta || ''}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="lg:col-span-7 flex flex-col gap-3">
        <div class="bg-surface-container-low border border-white/10 rounded-xl p-4 flex-1 flex flex-col">
          <div class="flex items-center justify-between mb-3">
            <h4 class="text-xs font-semibold uppercase tracking-wider text-emerald-400">Texto Completo Extraído por OCR</h4>
            <button type="button" onclick="navigator.clipboard?.writeText(document.getElementById('ocr-raw-box').innerText)" class="px-2.5 py-1 rounded bg-surface-container-highest text-xs text-white hover:bg-primary transition-colors font-mono-code">
              Copiar Texto
            </button>
          </div>
          <pre id="ocr-raw-box" class="flex-1 bg-surface-container-lowest border border-white/5 rounded-xl p-4 font-mono-code text-xs text-slate-200 whitespace-pre-wrap leading-relaxed overflow-y-auto max-h-[55vh]">${escapeHtml(fullText)}</pre>
        </div>
      </div>
    </div>
  `;
}

export async function downloadNormalizedDocument(doc, vaultRecord = null) {
  const record = vaultRecord || (await getFileFromVault(doc.id));
  if (record && record.blob) {
    triggerBrowserDownload(record.blob, doc.normalizedName);
    showToast(`Descargando "${doc.normalizedName}"`, 'success');
    return;
  }

  // Si es un documento de demostración precargado, generamos un archivo descargable con su contenido íntegro
  const content = [
    `===================================================================`,
    `SAAS LEGAL — THE SOVEREIGN VAULT v2.4 AI`,
    `DOCUMENTO CERTIFICADO CON NOMENCLATURA ESTANDARIZADA`,
    `===================================================================`,
    `Nombre Normalizado : ${doc.normalizedName}`,
    `Nombre Original    : ${doc.originalName}`,
    `Cliente (Nivel 1)  : ${doc.clientName} (${doc.clientId})`,
    `Carpeta (Nivel 2)  : ${doc.category}`,
    `Tipo de Documento  : ${doc.docTypeLabel}`,
    `Expediente         : ${doc.caseId}`,
    `Juzgado / Sede     : ${doc.court}`,
    `Confianza IA       : ${doc.confidence}%`,
    `Hash SHA-256       : ${doc.sha256}`,
    `===================================================================\n`,
    doc.fullPreviewText || doc.ocrSnippet || ''
  ].join('\n');

  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const downloadName = doc.normalizedName.endsWith('.txt')
    ? doc.normalizedName
    : `${doc.normalizedName}`;
  triggerBrowserDownload(blob, downloadName);
  showToast(`Descargado como "${downloadName}"`, 'success');
}

function escapeHtml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
