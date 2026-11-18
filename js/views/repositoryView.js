/**
 * Vista 3 de Stitch: Repositorio Documental Inteligente
 * Réplica fiel de repositorio_documental_expedientes_saas_legal_dark_theme/code.html
 * con la Arquitectura de Árbol Jerárquico de 3 Niveles:
 *   Nivel 1: Carpeta por Cliente ([Nombre del Cliente])
 *   Nivel 2: Subcarpetas por Tipo de Documento IA (Demandas, Apelaciones, Audiencias, Contratos, Identificaciones, Notificaciones, Pruebas, Poderes)
 *   Nivel 3: Archivos clasificados con Nomenclatura Estandarizada ([Tipo]_[Fecha]_[NombreOriginal].ext)
 * Incluye Reclasificación Drag & Drop entre carpetas, Visor Web Integrado y Descarga Directa.
 */

import { store } from '../store/state.js';
import { DOCUMENT_CATEGORIES } from '../services/fileNormalizer.js';
import { openWebViewerModal, downloadNormalizedDocument } from '../components/webViewerModal.js';
import { openReclassifyModal } from '../components/reclassifyModal.js';
import { downloadRepositoryManifest } from '../services/reportGenerator.js';
import { showToast } from '../components/globalSearchModal.js';

let treeSearchText = '';
let inspectorViewMode = 'entities'; // 'entities' | 'json'

export function renderRepositoryView(container) {
  const state = store.state;
  const filter = state.repositoryFilter;

  const selectedClient = state.clients.find(c => c.id === filter.selectedClientId) || state.clients[0];
  if (selectedClient && filter.selectedClientId !== selectedClient.id) {
    filter.selectedClientId = selectedClient.id;
  }

  // Filtrar documentos según selección del árbol (Nivel 1: Cliente, Nivel 2: Subcarpeta Tipo, o Búsqueda)
  let docs = state.documents.filter(d => {
    if (filter.selectedClientId && d.clientId !== filter.selectedClientId) return false;
    if (filter.selectedCategory && d.category !== filter.selectedCategory) return false;
    if (filter.selectedCaseId && d.caseId !== filter.selectedCaseId) return false;
    if (filter.searchQuery) {
      const q = filter.searchQuery.toLowerCase();
      const hay = `${d.normalizedName} ${d.originalName} ${d.docTypeLabel} ${d.caseId} ${d.court} ${d.ocrSnippet || ''} ${d.entities?.actor || ''} ${d.entities?.demandado || ''}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });

  if (filter.sortBy === 'confidence') {
    docs.sort((a, b) => b.confidence - a.confidence);
  }

  const inspectedDoc = docs.find(d => d.id === filter.selectedDocId) || docs[0] || state.documents[0];
  const clientCases = state.cases.filter(c => c.clientId === selectedClient?.id);
  const activeCaseBanner = (filter.selectedCaseId
    ? state.cases.find(c => c.id === filter.selectedCaseId)
    : clientCases[0]) || state.cases[0];

  container.innerHTML = `
    <div class="flex flex-col w-full">
      <!-- TOP BREADCRUMB & CONTEXT META -->
      <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md mb-space-lg pt-2">
        <div class="flex flex-col gap-1">
          <div class="flex items-center gap-2 font-mono-code text-xs text-outline flex-wrap">
            <span>Repositorio Raíz</span>
            <span class="material-symbols-outlined text-xs">chevron_right</span>
            <span class="text-white font-semibold">${selectedClient ? selectedClient.name : 'Todos los Clientes'}</span>
            <span class="material-symbols-outlined text-xs">chevron_right</span>
            <span class="text-primary font-medium">${filter.selectedCategory ? `📁 ${filter.selectedCategory}` : 'Todas las Subcarpetas IA'}</span>
            ${filter.selectedCaseId ? `
              <span class="material-symbols-outlined text-xs">chevron_right</span>
              <span class="text-emerald-400 font-medium">${filter.selectedCaseId}</span>
            ` : ''}
          </div>
          <div class="flex items-baseline gap-space-md flex-wrap mt-1">
            <h1 class="text-2xl lg:text-3xl font-bold text-white tracking-tight">Repositorio Documental Inteligente</h1>
            <div class="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-surface-container border border-outline-variant text-primary font-mono-code text-xs">
              <span class="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span>
              <span>Árbol 3 Niveles • Drag &amp; Drop Activo</span>
            </div>
          </div>
        </div>

        <!-- GLOBAL ACTIONS -->
        <div class="flex items-center gap-space-sm flex-wrap">
          <button id="repo-export-zip-btn" class="flex items-center gap-2 px-space-md py-2.5 bg-surface-container-low text-on-surface border border-outline-variant rounded-lg text-sm font-medium shadow-sm hover:bg-surface-container hover:text-white hover:border-slate-600 transition-all" type="button">
            <span class="material-symbols-outlined text-lg text-primary">folder_zip</span>
            <span>Exportar Índice Certificado</span>
          </button>
          <button id="repo-upload-btn" class="flex items-center gap-2 px-space-md py-2.5 bg-primary-container text-white rounded-lg text-sm font-medium shadow-[0_0_16px_rgba(25,120,229,0.4)] hover:brightness-110 active:scale-[0.99] border border-primary/40 transition-all" type="button">
            <span class="material-symbols-outlined text-lg">upload_file</span>
            <span>Subir en Importador Zero-Touch</span>
          </button>
        </div>
      </div>

      <!-- CONTROL TOOLBAR: SEARCH & FILTERS -->
      <div class="bg-surface-container-low border border-outline-variant rounded-xl p-space-md shadow-lg mb-space-lg flex flex-col md:flex-row items-center justify-between gap-space-md">
        <div class="relative w-full md:max-w-xl">
          <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-lg">manage_search</span>
          <input id="repo-search-input" value="${filter.searchQuery || ''}" class="w-full h-10 pl-10 pr-space-md bg-surface-container-lowest border border-outline-variant text-on-surface placeholder:text-outline text-sm rounded-lg shadow-inner focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all" placeholder="Filtrar por nombre normalizado ([Tipo]_[Fecha]...), cuantía, juzgado o texto OCR..." type="text"/>
        </div>
        <div class="flex items-center gap-space-sm w-full md:w-auto justify-end flex-wrap">
          <!-- Filtro rápido por Expediente del cliente -->
          <select id="repo-case-select" class="h-9 px-3 rounded-lg bg-surface-container-lowest border border-outline-variant text-xs text-white font-mono-code focus:border-primary focus:outline-none">
            <option value="">Todos los Expedientes de ${selectedClient?.name || 'Cliente'}</option>
            ${clientCases.map(c => `<option value="${c.id}" ${filter.selectedCaseId === c.id ? 'selected' : ''}>${c.id} — ${c.matter}</option>`).join('')}
          </select>

          <div class="flex items-center gap-1 bg-surface-container-lowest border border-outline-variant p-1 rounded-lg">
            <span class="text-xs text-outline px-1.5 font-medium">Orden:</span>
            <button data-repo-sort="recent" class="px-2.5 py-1 rounded text-xs ${filter.sortBy === 'recent' ? 'bg-primary text-white font-medium shadow-sm' : 'text-on-surface-variant hover:text-white'} transition-colors" type="button">Fecha Reciente</button>
            <button data-repo-sort="confidence" class="px-2.5 py-1 rounded text-xs ${filter.sortBy === 'confidence' ? 'bg-primary text-white font-medium shadow-sm' : 'text-on-surface-variant hover:text-white'} transition-colors" type="button">Confianza IA</button>
          </div>
        </div>
      </div>

      <!-- SPLIT WORKSPACE -->
      <div class="grid grid-cols-1 xl:grid-cols-12 gap-space-lg items-start">
        <!-- LEFT PANEL: 3-LEVEL HIERARCHICAL TREE (Nivel 1: Cliente -> Nivel 2: Subcarpeta Tipo Doc -> Nivel 3: Archivos) -->
        <aside class="xl:col-span-4 flex flex-col gap-space-md">
          <div class="bg-surface-container-low border border-outline-variant rounded-xl p-space-md shadow-lg flex flex-col">
            <!-- Explorer Header -->
            <div class="flex items-center justify-between pb-space-sm mb-space-sm border-b border-outline-variant">
              <div class="flex items-center gap-2">
                <span class="material-symbols-outlined text-primary text-xl">account_tree</span>
                <div>
                  <span class="text-sm font-semibold text-white block">Árbol Jerárquico de Clientes</span>
                  <span class="text-[11px] text-on-surface-variant">Arrastra un documento aquí para reclasificarlo</span>
                </div>
              </div>
              <span class="px-2 py-0.5 rounded-full bg-surface-container border border-outline-variant text-on-surface-variant font-mono-code text-[11px]">${state.clients.length} Clientes</span>
            </div>

            <!-- Quick filter in tree -->
            <div class="relative w-full mb-space-md">
              <span class="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-outline text-base">search</span>
              <input id="tree-client-search" value="${treeSearchText}" class="w-full h-8 pl-8 pr-2 bg-surface-container-lowest border border-outline-variant text-on-surface placeholder:text-outline text-xs rounded focus:outline-none focus:border-primary" placeholder="Buscar cliente o carpeta en el árbol..." type="text"/>
            </div>

            <!-- Hierarchical Tree Nodes -->
            <div class="flex flex-col gap-1.5 text-xs max-h-[520px] overflow-y-auto pr-1" id="repository-folder-tree">
              ${renderHierarchicalTree(state, filter)}
            </div>

            <!-- Cloud Storage Telemetry Widget -->
            <div class="mt-space-md p-space-md rounded-xl bg-surface-container-lowest border border-outline-variant flex flex-col gap-2">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-1.5">
                  <span class="material-symbols-outlined text-secondary text-base">lock</span>
                  <span class="text-xs font-semibold text-white">Cifrado Militar AES-256</span>
                </div>
                <span class="font-mono-code text-xs text-primary font-bold">42.8%</span>
              </div>
              <div class="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
                <div class="bg-gradient-to-r from-primary to-primary-container h-full rounded-full" style="width: 42.8%;"></div>
              </div>
              <div class="flex items-center justify-between font-mono-code text-[11px] text-on-surface-variant">
                <span>Visor Remoto Juzgado Activo</span>
                <span>IndexedDB + Local</span>
              </div>
            </div>
          </div>

          <!-- Quick AI Pipeline Status -->
          <div class="bg-surface-container-lowest border border-outline-variant text-on-surface rounded-xl p-space-md shadow-lg flex flex-col gap-space-sm relative overflow-hidden">
            <div class="absolute -right-4 -bottom-4 w-24 h-24 bg-primary/5 rounded-full blur-xl pointer-events-none"></div>
            <div class="flex items-center justify-between">
              <span class="text-[11px] tracking-widest text-secondary font-semibold uppercase">Nomenclatura Activa</span>
              <span class="material-symbols-outlined text-secondary text-base">verified</span>
            </div>
            <p class="text-xs font-mono-code font-bold text-white">[Tipo]_[Fecha]_[NombreOriginal]</p>
            <p class="text-xs text-on-surface-variant leading-relaxed">
              Cada documento conserva su nombre original para trazabilidad y recibe su nombre estandarizado al clasificarse o arrastrarse entre carpetas.
            </p>
          </div>
        </aside>

        <!-- RIGHT PANEL: CASE DETAIL & DOCUMENT GRID (col-span-8) -->
        <section class="xl:col-span-8 flex flex-col gap-space-lg">
          <!-- CASE / CLIENT HEADER SUMMARY BANNER -->
          <div class="bg-surface-container-low border border-outline-variant rounded-xl p-space-lg shadow-lg flex flex-col gap-space-md">
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-space-sm pb-space-sm border-b border-outline-variant">
              <div class="flex flex-col">
                <div class="flex items-center gap-2 mb-1.5 flex-wrap">
                  <span class="px-2 py-0.5 rounded bg-primary-container text-white font-mono-code text-xs font-semibold shadow-xs">
                    ${activeCaseBanner ? activeCaseBanner.id : 'CARPETA CLIENTE'}
                  </span>
                  <span class="px-2.5 py-0.5 rounded-full bg-secondary-container text-secondary border border-secondary/30 text-xs font-semibold">
                    ${filter.selectedCategory ? `Subcarpeta: ${filter.selectedCategory}` : (activeCaseBanner?.stage || 'Todas las Subcarpetas')}
                  </span>
                </div>
                <h2 class="text-xl lg:text-2xl font-bold text-white tracking-tight">
                  ${selectedClient ? selectedClient.name : 'Repositorio General'} ${activeCaseBanner ? `— ${activeCaseBanner.title}` : ''}
                </h2>
              </div>
              <div class="flex items-center gap-2">
                <div class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/30 text-primary text-xs font-semibold">
                  <span class="material-symbols-outlined text-base">auto_awesome</span>
                  <span>Auto-Filing IA: 100%</span>
                </div>
              </div>
            </div>

            <!-- Case Metadata Grid -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-space-md pt-space-xs">
              <div class="flex flex-col p-3 rounded-lg bg-surface-container-lowest border border-outline-variant">
                <span class="text-xs text-outline">Juzgado / Tribunal</span>
                <span class="text-sm font-semibold text-white truncate mt-0.5">${activeCaseBanner?.court || '3º de lo Civil de 1ª Instancia'}</span>
                <span class="font-mono-code text-xs text-on-surface-variant">Sede Judicial Verificada</span>
              </div>
              <div class="flex flex-col p-3 rounded-lg bg-surface-container-lowest border border-outline-variant">
                <span class="text-xs text-outline">Abogado Titular / Representante</span>
                <div class="flex items-center gap-1.5 mt-0.5">
                  <span class="material-symbols-outlined text-primary text-base">verified_user</span>
                  <span class="text-sm font-semibold text-white truncate">${activeCaseBanner?.lawyer || selectedClient?.representative || 'Dra. Elena Valdés'}</span>
                </div>
                <span class="text-xs text-on-surface-variant">RFC Cliente: ${selectedClient?.rfc || 'Verificado'}</span>
              </div>
              <div class="flex flex-col p-3 rounded-lg bg-surface-container-lowest border border-outline-variant">
                <span class="text-xs text-outline">Cuantía Estimada</span>
                <span class="font-mono-code text-lg font-bold text-primary mt-0.5">${activeCaseBanner?.amount || '$1,250,000 USD'}</span>
                <span class="text-xs text-secondary font-medium">${activeCaseBanner?.amountNote || 'Documentos respaldados en bóveda'}</span>
              </div>
            </div>
          </div>

          <!-- DOCUMENT LIST SECTION (Nivel 3: Archivos Clasificados) -->
          <div class="flex flex-col gap-space-md">
            <div class="flex items-center justify-between flex-wrap gap-2">
              <div class="flex items-center gap-2">
                <h3 class="text-base font-semibold text-white">
                  Nivel 3 • Archivos Clasificados ${filter.selectedCategory ? `en "${filter.selectedCategory}"` : `de ${selectedClient?.name || ''}`}
                </h3>
                <span class="font-mono-code text-xs px-2 py-0.5 rounded-full bg-surface-container border border-outline-variant text-slate-300 font-bold">
                  ${docs.length} archivo(s)
                </span>
              </div>
              <span class="text-xs text-outline">💡 Tip: Arrastra cualquier archivo hacia una carpeta del árbol izquierdo para moverlo o reclasificarlo</span>
            </div>

            <!-- DOCUMENT CARDS LIST -->
            <div class="flex flex-col gap-space-sm" id="documentList">
              ${docs.length > 0
                ? docs.map(doc => renderDocumentCard(doc, inspectedDoc?.id === doc.id)).join('')
                : `
                  <div class="bg-surface-container-low border border-dashed border-white/15 rounded-xl p-8 text-center">
                    <span class="material-symbols-outlined text-4xl text-outline mb-2">folder_off</span>
                    <p class="text-sm font-semibold text-white">No hay documentos en la subcarpeta seleccionada</p>
                    <p class="text-xs text-on-surface-variant mt-1">Puedes arrastrar un documento hacia esta subcarpeta o mostrar todas las subcarpetas del cliente.</p>
                    <button id="repo-clear-subfilter-btn" type="button" class="mt-4 px-4 py-2 rounded-lg bg-primary-container text-white text-xs font-semibold hover:bg-primary">
                      Ver todas las subcarpetas de ${selectedClient?.name || 'este cliente'}
                    </button>
                  </div>
                `
              }
            </div>
          </div>

          <!-- AUDIT LOG & AI EXTRACTION INSPECTOR PANEL (INTERACTIVE EMBEDDED) -->
          ${inspectedDoc ? renderInspectorPanel(inspectedDoc) : ''}
        </section>
      </div>
    </div>
  `;

  bindRepositoryEvents(container, inspectedDoc);
}

/**
 * Renderiza el Árbol Jerárquico de 3 Niveles:
 * Nivel 1: Carpeta por Cliente
 * Nivel 2: Subcarpetas por Tipo de Documento detectado por la IA (Demandas, Apelaciones, Audiencias, Contratos, Identificaciones, etc.)
 */
function renderHierarchicalTree(state, filter) {
  const q = treeSearchText.trim().toLowerCase();
  const clientsToShow = state.clients.filter(c => {
    if (!q) return true;
    return c.name.toLowerCase().includes(q) || c.id.toLowerCase().includes(q);
  });

  return clientsToShow.map(client => {
    const clientDocs = state.documents.filter(d => d.clientId === client.id);
    const isSelectedClient = filter.selectedClientId === client.id;
    const isExpanded = filter.expandedClients.includes(client.id) || isSelectedClient;

    // Agrupar conteo por cada Subcarpeta de Tipo de Documento (Nivel 2)
    const categoriesWithDocs = DOCUMENT_CATEGORIES.map(cat => {
      const count = clientDocs.filter(d => d.category === cat.id).length;
      return { ...cat, count };
    }).filter(cat => cat.count > 0 || isSelectedClient);

    return `
      <div class="flex flex-col rounded-lg ${isSelectedClient ? 'bg-surface-container border border-outline-variant/80' : 'hover:bg-surface-container/50'} p-1.5 transition-all">
        <!-- Nivel 1: Carpeta del Cliente (Drop Target) -->
        <div
          data-tree-client="${client.id}"
          data-drop-client="${client.id}"
          class="tree-drop-target flex items-center justify-between p-1.5 rounded-md cursor-pointer hover:bg-surface-container-high transition-colors border border-transparent"
          title="Nivel 1: Carpeta de Cliente (Suelta un archivo aquí para asignarlo a ${client.name})"
        >
          <div class="flex items-center gap-2 min-w-0">
            <span data-toggle-expand="${client.id}" class="material-symbols-outlined ${isSelectedClient ? 'text-primary' : 'text-outline'} text-base">
              ${isExpanded ? 'expand_more' : 'chevron_right'}
            </span>
            <span class="material-symbols-outlined ${isSelectedClient ? 'text-primary' : 'text-outline'} text-lg">
              ${isExpanded ? 'folder_open' : 'folder'}
            </span>
            <span class="${isSelectedClient ? 'font-semibold text-white' : 'font-medium text-slate-300'} truncate">
              ${client.name}
            </span>
          </div>
          <span class="font-mono-code text-[11px] ${isSelectedClient ? 'text-primary px-1.5 py-0.5 rounded-full bg-primary/10 border border-primary/25' : 'text-outline'} shrink-0">
            ${clientDocs.length} docs
          </span>
        </div>

        ${isExpanded ? `
          <!-- Nivel 2: Subcarpetas por Tipo de Documento detectado por IA -->
          <div class="flex flex-col pl-4 mt-1 gap-1 border-l border-outline-variant/60 ml-3">
            <!-- Opción Ver Todo del Cliente -->
            <div
              data-tree-subcat=""
              data-tree-parent="${client.id}"
              data-drop-client="${client.id}"
              class="tree-drop-target flex items-center justify-between p-1.5 rounded-lg cursor-pointer transition-colors border ${isSelectedClient && !filter.selectedCategory ? 'bg-primary-container/20 border-primary/40 text-white shadow-sm' : 'border-transparent text-on-surface-variant hover:bg-surface-container-high'}"
            >
              <div class="flex items-center gap-2 min-w-0">
                <span class="material-symbols-outlined text-primary text-sm">Perm_Media</span>
                <span class="font-medium text-xs truncate">Todas las carpetas (${clientDocs.length})</span>
              </div>
            </div>

            ${categoriesWithDocs.map(cat => {
              const isSubSelected = isSelectedClient && filter.selectedCategory === cat.id;
              return `
                <div
                  data-tree-subcat="${cat.id}"
                  data-tree-parent="${client.id}"
                  data-drop-client="${client.id}"
                  data-drop-category="${cat.id}"
                  class="tree-drop-target flex items-center justify-between p-1.5 rounded-lg cursor-pointer transition-colors border ${isSubSelected ? 'bg-primary-container/20 border-primary/40 text-white shadow-sm' : 'border-transparent text-on-surface-variant hover:bg-surface-container-high'}"
                  title="Nivel 2: Subcarpeta ${cat.label} — Arrastra un documento aquí para reclasificarlo como ${cat.prefix}"
                >
                  <div class="flex items-center gap-2 min-w-0">
                    <span class="material-symbols-outlined ${isSubSelected ? 'text-primary' : cat.color} text-base">${cat.icon}</span>
                    <div class="flex flex-col min-w-0">
                      <span class="font-semibold text-xs ${isSubSelected ? 'text-white' : 'text-slate-300'} truncate">${cat.label}</span>
                      <span class="text-[10px] text-outline font-mono-code truncate">Prefijo: ${cat.prefix}_*</span>
                    </div>
                  </div>
                  <span class="font-mono-code text-[11px] px-1.5 py-0.2 rounded-full ${isSubSelected ? 'bg-primary-container text-white font-semibold' : 'bg-surface-container-lowest text-outline border border-white/5'}">
                    ${cat.count}
                  </span>
                </div>
              `;
            }).join('')}
          </div>
        ` : ''}
      </div>
    `;
  }).join('');
}

function renderDocumentCard(doc, isSelected) {
  const isLowConfidence = doc.confidence < store.state.aiSettings.lowConfidenceThreshold;
  const iconName = doc.ext === 'pdf'
    ? 'picture_as_pdf'
    : (['png', 'jpg', 'jpeg'].includes(doc.ext) ? 'image' : 'description');

  return `
    <div
      draggable="true"
      data-doc-card="${doc.id}"
      class="doc-card-draggable bg-surface-container-low border ${isSelected ? 'border-primary/60 ring-1 ring-primary/30' : 'border-outline-variant'} rounded-xl p-space-md shadow-md hover:border-primary/50 hover:bg-surface-variant transition-all flex flex-col gap-space-sm group"
    >
      <div class="flex flex-col md:flex-row md:items-start justify-between gap-space-sm">
        <div class="flex items-start gap-space-md min-w-0">
          <div class="w-12 h-12 rounded-xl ${isLowConfidence ? 'bg-amber-500/15 border-amber-500/30 text-amber-400' : 'bg-primary/10 border-primary/30 text-primary'} border flex items-center justify-center shrink-0 group-hover:bg-primary-container group-hover:text-white transition-all shadow-sm">
            <span class="material-symbols-outlined text-2xl">${iconName}</span>
          </div>
          <div class="flex flex-col min-w-0">
            <!-- Nombre Normalizado y Badges -->
            <div class="flex items-center gap-2 flex-wrap mb-1">
              <span class="text-sm font-bold text-white font-mono-code group-hover:text-primary transition-colors truncate" title="${doc.normalizedName}">
                ${doc.normalizedName}
              </span>
              <span class="px-2 py-0.5 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-semibold">
                📁 ${doc.category} • ${doc.docTypeLabel}
              </span>
              ${isLowConfidence
                ? `<span class="px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 font-mono-code text-[11px] font-bold flex items-center gap-1">
                    <span class="material-symbols-outlined text-xs">warning</span> ${doc.confidence}% Baja IA (Arrastra o Reclasifica)
                   </span>`
                : `<span class="px-2 py-0.5 rounded-full bg-secondary-container text-secondary border border-secondary/30 font-mono-code text-[11px] font-bold flex items-center gap-1">
                    <span class="material-symbols-outlined text-xs">verified</span> ${doc.confidence}% Alta IA
                   </span>`
              }
            </div>

            <!-- Trazabilidad de Nombre Original + Expediente -->
            <div class="flex items-center gap-2 text-xs text-on-surface-variant mb-1.5 flex-wrap">
              <span>Original: <strong class="text-slate-300 font-mono-code">${doc.originalName}</strong></span>
              <span>•</span>
              <span>Expediente: <strong class="${doc.caseId === 'Sin número (Nuevo)' ? 'text-amber-300' : 'text-primary'} font-mono-code">${doc.caseId}</strong></span>
            </div>

            <!-- Detected Metadata Chips -->
            <div class="flex items-center gap-space-xs flex-wrap text-xs text-on-surface-variant">
              ${(doc.chips || []).map(ch => `
                <span class="${ch.isError ? 'bg-error-container text-error border border-error/30 font-semibold' : (ch.isPrimary ? 'bg-primary/10 border border-primary/30 text-primary font-medium' : 'bg-surface-container-lowest border border-outline-variant')} px-2 py-0.5 rounded">
                  ${ch.label}: <strong class="text-white font-mono-code">${ch.value}</strong>
                </span>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- Actions & Meta -->
        <div class="flex flex-row md:flex-col items-end justify-between md:justify-start gap-2 shrink-0">
          <div class="flex items-center gap-1 font-mono-code text-xs text-outline">
            <span>${doc.sizeLabel}</span>
            <span>•</span>
            <span>${doc.uploadedAt}</span>
          </div>
          <div class="flex items-center gap-1.5 flex-wrap justify-end">
            <button data-doc-preview="${doc.id}" class="px-2.5 py-1 rounded-lg bg-surface-container-lowest border border-outline-variant text-white text-xs font-medium hover:bg-primary hover:border-primary transition-colors flex items-center gap-1" title="Abrir en Visor Web Integrado (Accesible en Juzgados)" type="button">
              <span class="material-symbols-outlined text-sm">visibility</span>
              <span>Visor Web</span>
            </button>
            <button data-doc-reclassify="${doc.id}" class="px-2.5 py-1 rounded-lg bg-surface-container-lowest border border-outline-variant text-slate-300 text-xs font-medium hover:text-white hover:border-amber-400/50 transition-colors flex items-center gap-1" title="Mover de carpeta o reclasificar" type="button">
              <span class="material-symbols-outlined text-sm text-amber-400">drive_file_move</span>
              <span>Reclasificar</span>
            </button>
            <button data-doc-download="${doc.id}" class="p-1.5 rounded-lg bg-surface-container-lowest border border-outline-variant text-on-surface-variant hover:text-white hover:border-primary transition-colors" title="Descargar con Nombre Normalizado (${doc.normalizedName})" type="button">
              <span class="material-symbols-outlined text-base">download</span>
            </button>
            <button data-doc-inspect="${doc.id}" class="px-2.5 py-1 rounded-lg bg-primary-container text-white text-xs font-medium shadow-sm hover:brightness-110 transition-colors" title="Ver Auditoría OCR abajo" type="button">
              IA Data
            </button>
          </div>
        </div>
      </div>

      <div class="flex items-center justify-between pt-2 border-t border-outline-variant/60 text-xs font-mono-code text-outline">
        <span class="flex items-center gap-1">
          <span class="material-symbols-outlined text-sm text-secondary">drag_indicator</span> Arrastrable hacia carpetas del árbol • SHA-256: ${doc.sha256.slice(0, 12)}...
        </span>
        <span class="text-primary font-medium group-hover:underline">Click para inspeccionar OCR &gt;</span>
      </div>
    </div>
  `;
}

function renderInspectorPanel(doc) {
  const ent = doc.entities || {};
  return `
    <div class="bg-surface-container-low border border-outline-variant rounded-xl p-space-lg shadow-xl flex flex-col gap-space-md" id="inspectorPanel">
      <div class="flex items-center justify-between pb-space-sm border-b border-outline-variant flex-wrap gap-2">
        <div class="flex items-center gap-space-sm">
          <span class="material-symbols-outlined text-primary text-2xl">document_scanner</span>
          <div>
            <h4 class="text-base font-semibold text-white">Auditoría IA &amp; Extractor OCR en Vivo</h4>
            <p class="text-xs text-on-surface-variant font-mono-code" id="inspectorDocTitle">
              Inspeccionando: ${doc.normalizedName} (Original: ${doc.originalName})
            </p>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <span class="px-2.5 py-1 rounded bg-secondary-container text-secondary border border-secondary/30 font-mono-code text-xs font-bold">
            SHA-256: ${doc.sha256.slice(0, 8)}...${doc.sha256.slice(-4)}
          </span>
          <button id="toggle-inspector-json-btn" class="px-2.5 py-1 rounded-lg ${inspectorViewMode === 'json' ? 'bg-primary text-white' : 'bg-surface-container text-outline hover:text-white'} border border-outline-variant transition-colors font-mono-code text-xs flex items-center gap-1" type="button">
            <span class="material-symbols-outlined text-sm">code</span>
            <span>${inspectorViewMode === 'json' ? 'Ver Matriz NLP' : 'JSON'}</span>
          </button>
        </div>
      </div>

      ${inspectorViewMode === 'json' ? `
        <pre class="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 font-mono-code text-xs text-emerald-400 overflow-x-auto max-h-80">${JSON.stringify({
          id: doc.id,
          normalizedName: doc.normalizedName,
          originalName: doc.originalName,
          hierarchyPath: `${doc.clientName} / ${doc.category} / ${doc.normalizedName}`,
          caseId: doc.caseId,
          confidence: doc.confidence,
          sha256: doc.sha256,
          entities: doc.entities
        }, null, 2)}</pre>
      ` : `
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-space-md">
          <!-- Extracted Legal Entities Matrix (Left col-span-7) -->
          <div class="lg:col-span-7 flex flex-col gap-space-sm bg-surface-container-lowest border border-outline-variant p-space-md rounded-xl">
            <span class="text-xs font-semibold text-white uppercase tracking-wider">Entidades Jurídicas Extraídas por NLP</span>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-space-sm text-xs">
              <div class="p-2.5 rounded-lg bg-surface-container-low border border-outline-variant flex flex-col">
                <span class="text-outline text-[11px]">Demandante / Titular (Nivel 1)</span>
                <span class="font-semibold text-white mt-0.5">${ent.actor || doc.clientName}</span>
                <span class="text-[11px] font-mono-code text-secondary font-medium mt-1">${ent.actorMeta || '100% Coincidencia'}</span>
              </div>
              <div class="p-2.5 rounded-lg bg-surface-container-low border border-outline-variant flex flex-col">
                <span class="text-outline text-[11px]">Contraparte / Demandado</span>
                <span class="font-semibold text-white mt-0.5">${ent.demandado || 'Por determinar'}</span>
                <span class="text-[11px] font-mono-code text-secondary font-medium mt-1">${ent.demandadoMeta || 'Extraído por IA'}</span>
              </div>
              <div class="p-2.5 rounded-lg bg-surface-container-low border border-outline-variant flex flex-col">
                <span class="text-outline text-[11px]">Representante Legal</span>
                <span class="font-semibold text-white mt-0.5">${ent.representante || 'Lic. Rodrigo Méndez Aranda'}</span>
                <span class="text-[11px] font-mono-code text-primary mt-1">${ent.representanteMeta || 'Personalidad acreditada'}</span>
              </div>
              <div class="p-2.5 rounded-lg bg-surface-container-low border border-outline-variant flex flex-col">
                <span class="text-outline text-[11px]">Obligación / Cuantía Principal</span>
                <span class="font-semibold text-primary font-mono-code text-sm mt-0.5">${ent.obligacion || '$1,250,000.00 USD'}</span>
                <span class="text-[11px] text-on-surface-variant mt-1">${ent.obligacionMeta || doc.docTypeLabel}</span>
              </div>
            </div>

            <!-- OCR Snippet Highlight -->
            <div class="mt-1 p-3 rounded-lg bg-surface-container-low border border-outline-variant flex flex-col gap-1">
              <div class="flex items-center justify-between text-xs text-outline">
                <span class="font-mono-code">OCR Transcripción Fidedigna (Foja 1)</span>
                <span class="text-secondary font-mono-code font-bold">Confianza ${doc.confidence}%</span>
              </div>
              <p class="font-mono-code text-xs text-slate-300 bg-surface-container-lowest border border-outline-variant/60 p-2.5 rounded leading-relaxed">
                ${doc.ocrSnippet}
              </p>
            </div>
          </div>

          <!-- Live Terminal Output & Verification Trace (Right col-span-5) -->
          <div class="lg:col-span-5 bg-surface-container-lowest border border-outline-variant text-on-surface p-space-md rounded-xl shadow-inner flex flex-col justify-between font-mono-code text-xs">
            <div class="flex flex-col gap-2">
              <div class="flex items-center justify-between text-outline text-[11px] pb-1 border-b border-outline-variant">
                <div class="flex items-center gap-1.5">
                  <span class="w-2.5 h-2.5 rounded-full bg-error"></span>
                  <span class="w-2.5 h-2.5 rounded-full bg-yellow-400"></span>
                  <span class="w-2.5 h-2.5 rounded-full bg-secondary"></span>
                </div>
                <span class="text-slate-400">ia-engine-v2.log</span>
              </div>
              <div class="flex flex-col gap-1.5 text-xs pt-1">
                ${(doc.engineLogs || []).map((line, idx) => `
                  <div class="${idx % 2 === 0 ? 'text-slate-300' : 'text-secondary'}">${line}</div>
                `).join('')}
              </div>
            </div>
            <div class="mt-4 pt-2.5 border-t border-outline-variant flex items-center justify-between text-xs">
              <span class="text-on-surface-variant">Estado: Verificado</span>
              <span class="text-secondary font-bold tracking-wider">READY_TO_SERVE</span>
            </div>
          </div>
        </div>
      `}
    </div>
  `;
}

function bindRepositoryEvents(container, inspectedDoc) {
  const filter = store.state.repositoryFilter;

  document.getElementById('repo-upload-btn')?.addEventListener('click', () => {
    store.setRoute('importador');
  });

  document.getElementById('repo-export-zip-btn')?.addEventListener('click', () => {
    downloadRepositoryManifest(store.state);
    showToast('Índice Certificado del Árbol Documental descargado', 'success');
  });

  document.getElementById('repo-search-input')?.addEventListener('input', (e) => {
    filter.searchQuery = e.target.value;
    renderRepositoryView(container);
    const input = document.getElementById('repo-search-input');
    if (input) {
      input.focus();
      input.setSelectionRange(input.value.length, input.value.length);
    }
  });

  document.getElementById('tree-client-search')?.addEventListener('input', (e) => {
    treeSearchText = e.target.value;
    renderRepositoryView(container);
    const input = document.getElementById('tree-client-search');
    if (input) {
      input.focus();
      input.setSelectionRange(input.value.length, input.value.length);
    }
  });

  document.getElementById('repo-case-select')?.addEventListener('change', (e) => {
    filter.selectedCaseId = e.target.value || null;
    renderRepositoryView(container);
  });

  container.querySelectorAll('[data-repo-sort]').forEach(btn => {
    btn.addEventListener('click', () => {
      filter.sortBy = btn.getAttribute('data-repo-sort');
      renderRepositoryView(container);
    });
  });

  document.getElementById('repo-clear-subfilter-btn')?.addEventListener('click', () => {
    filter.selectedCategory = null;
    filter.selectedCaseId = null;
    renderRepositoryView(container);
  });

  // Navegación por el Árbol (Nivel 1: Clientes)
  container.querySelectorAll('[data-tree-client]').forEach(node => {
    node.addEventListener('click', () => {
      const clientId = node.getAttribute('data-tree-client');
      const idx = filter.expandedClients.indexOf(clientId);
      if (filter.selectedClientId === clientId) {
        if (idx !== -1) filter.expandedClients.splice(idx, 1);
        else filter.expandedClients.push(clientId);
      } else {
        filter.selectedClientId = clientId;
        filter.selectedCategory = null;
        filter.selectedCaseId = null;
        if (idx === -1) filter.expandedClients.push(clientId);
      }
      store.saveState();
      renderRepositoryView(container);
    });
  });

  // Navegación por Subcarpetas de Tipo de Documento (Nivel 2)
  container.querySelectorAll('[data-tree-subcat]').forEach(subNode => {
    subNode.addEventListener('click', (e) => {
      e.stopPropagation();
      const parentClientId = subNode.getAttribute('data-tree-parent');
      const subcat = subNode.getAttribute('data-tree-subcat');
      filter.selectedClientId = parentClientId;
      filter.selectedCategory = subcat || null;
      filter.selectedCaseId = null;
      store.saveState();
      renderRepositoryView(container);
    });
  });

  // Acciones en cada tarjeta de documento (Nivel 3)
  container.querySelectorAll('[data-doc-card]').forEach(card => {
    const docId = card.getAttribute('data-doc-card');

    card.addEventListener('click', (e) => {
      if (e.target.closest('button')) return;
      filter.selectedDocId = docId;
      renderRepositoryView(container);
    });

    // Drag start para reclasificación Drag & Drop hacia el árbol
    card.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('text/plain', docId);
      e.dataTransfer.effectAllowed = 'move';
      card.classList.add('doc-card-dragging');
    });

    card.addEventListener('dragend', () => {
      card.classList.remove('doc-card-dragging');
      container.querySelectorAll('.tree-drop-target').forEach(t => t.classList.remove('drag-over-folder'));
    });
  });

  // Configurar cada carpeta del Árbol como Drop Target para reclasificar documentos
  container.querySelectorAll('.tree-drop-target').forEach(folderEl => {
    folderEl.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      folderEl.classList.add('drag-over-folder');
    });

    folderEl.addEventListener('dragleave', () => {
      folderEl.classList.remove('drag-over-folder');
    });

    folderEl.addEventListener('drop', (e) => {
      e.preventDefault();
      e.stopPropagation();
      folderEl.classList.remove('drag-over-folder');

      const draggedDocId = e.dataTransfer.getData('text/plain');
      if (!draggedDocId) return;

      const targetClientId = folderEl.getAttribute('data-drop-client');
      const targetCategory = folderEl.getAttribute('data-drop-category') || null;

      const updated = store.reclassifyDocument(draggedDocId, {
        clientId: targetClientId,
        category: targetCategory || undefined,
        confidence: 100
      });

      if (updated) {
        filter.selectedClientId = updated.clientId;
        filter.selectedCategory = targetCategory || null;
        filter.selectedDocId = updated.id;
        showToast(
          `Movido a ${updated.clientName} → 📁 ${updated.category} y renombrado a "${updated.normalizedName}"`,
          'success'
        );
        renderRepositoryView(container);
      }
    });
  });

  container.querySelectorAll('[data-doc-preview]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      openWebViewerModal(btn.getAttribute('data-doc-preview'));
    });
  });

  container.querySelectorAll('[data-doc-reclassify]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      openReclassifyModal(btn.getAttribute('data-doc-reclassify'));
    });
  });

  container.querySelectorAll('[data-doc-download]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const docId = btn.getAttribute('data-doc-download');
      const doc = store.state.documents.find(d => d.id === docId);
      if (doc) downloadNormalizedDocument(doc);
    });
  });

  container.querySelectorAll('[data-doc-inspect]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      filter.selectedDocId = btn.getAttribute('data-doc-inspect');
      renderRepositoryView(container);
      document.getElementById('inspectorPanel')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  });

  document.getElementById('toggle-inspector-json-btn')?.addEventListener('click', () => {
    inspectorViewMode = inspectorViewMode === 'json' ? 'entities' : 'json';
    renderRepositoryView(container);
  });
}
