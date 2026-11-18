/**
 * Vista 1 de Stitch: Dashboard General SaaS Legal
 * Réplica 100% fiel de dashboard_general_saas_legal/code.html con datos reactivos en vivo.
 */

import { store } from '../store/state.js';
import { openWebViewerModal } from '../components/webViewerModal.js';
import { showToast } from '../components/globalSearchModal.js';
import { downloadRepositoryManifest } from '../services/reportGenerator.js';

let activeTableFilter = 'ALL'; // 'ALL' | 'HIGH' | 'PENDING_AI' | 'HEARING'
let currentPage = 1;
const PAGE_SIZE = 5;

export function renderDashboardView(container) {
  const state = store.state;
  const totalCasesCount = state.stats.baseActiveCases + Math.max(0, state.cases.length - 9);
  const totalClientsCount = state.stats.baseRegisteredClients + Math.max(0, state.clients.length - 9);
  const totalDocsCount = state.stats.baseDocsClassified + Math.max(0, state.documents.length - 9);
  const criticalHearings = state.hearings.filter(h => h.urgency === 'critical').length;

  // Filtrar expedientes de la tabla inferior
  let filteredCases = [...state.cases];
  if (activeTableFilter === 'HIGH') {
    filteredCases = filteredCases.filter(c => c.priority === 'Alta Prioridad');
  } else if (activeTableFilter === 'PENDING_AI') {
    filteredCases = filteredCases.filter(c => c.pendingAIReview || c.id === 'Sin número (Nuevo)');
  } else if (activeTableFilter === 'HEARING') {
    filteredCases = filteredCases.filter(c => c.hasUpcomingHearing);
  }

  const totalPages = Math.max(1, Math.ceil(filteredCases.length / PAGE_SIZE));
  if (currentPage > totalPages) currentPage = 1;
  const paginatedCases = filteredCases.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  container.innerHTML = `
    <div class="flex flex-col w-full">
      <!-- Sub-header context ribbon -->
      <div class="flex flex-col md:flex-row md:items-center justify-between pb-6 gap-4">
        <div class="flex flex-col">
          <div class="flex items-center gap-2 text-on-surface-variant font-mono-code text-xs uppercase tracking-wider">
            <span>CENTRO DE CONTROL LEGAL</span>
            <span class="text-outline">/</span>
            <span class="text-primary font-semibold">VISTA EJECUTIVA EN TIEMPO REAL</span>
          </div>
          <p class="text-sm text-on-surface-variant mt-1">
            Monitoreo automatizado de cartera procesal, motores de ingesta neuronal y plazos jurisdiccionales.
          </p>
        </div>
        <div class="flex items-center gap-3 self-start md:self-auto">
          <div class="flex items-center gap-2 bg-surface-container-low border border-outline-variant px-3 py-1.5 rounded-xl">
            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span class="font-mono-code text-xs text-on-surface">Motor v2.4 Activo</span>
          </div>
          <button id="dash-partner-report-btn" class="flex items-center gap-2 px-4 py-2 bg-primary-container text-white rounded-xl text-sm font-semibold shadow-md hover:bg-primary transition-all duration-200" type="button">
            <span class="material-symbols-outlined text-base">add_chart</span>
            <span>Generar Informe Socio</span>
          </button>
        </div>
      </div>

      <!-- Top Hero Stats Row: 4 Specialized KPI Blocks -->
      <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <!-- Card 1: Expedientes Activos -->
        <div data-nav-card="expedientes" class="cursor-pointer flex flex-col justify-between bg-surface-container-low border border-outline-variant p-5 rounded-2xl relative overflow-hidden group hover:border-primary/40 transition-all">
          <div class="absolute -right-4 -top-4 w-24 h-24 bg-primary/10 rounded-full blur-xl group-hover:scale-125 transition-transform"></div>
          <div>
            <div class="flex items-center justify-between mb-2">
              <span class="text-xs text-on-surface-variant uppercase tracking-wider font-semibold">Total Expedientes Activos</span>
              <span class="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono-code text-xs font-semibold">+12% trim.</span>
            </div>
            <div class="flex items-baseline gap-2">
              <span class="text-3xl text-white font-bold tracking-tight">${totalCasesCount.toLocaleString()}</span>
              <span class="text-xs text-on-surface-variant">casos en litigio</span>
            </div>
          </div>
          <div class="mt-4 pt-2 bg-surface-container-lowest/60 border border-outline-variant p-2 rounded-xl">
            <div class="flex items-center justify-between font-mono-code text-xs text-on-surface">
              <span><strong class="text-primary font-bold">312</strong> Civ</span>
              <span class="text-outline">•</span>
              <span><strong class="text-amber-400 font-bold">${84 + Math.max(0, state.cases.length - 9)}</strong> Merc</span>
              <span class="text-outline">•</span>
              <span><strong class="text-emerald-400 font-bold">32</strong> Lab</span>
            </div>
          </div>
        </div>

        <!-- Card 2: Clientes Registrados -->
        <div data-nav-card="clientes" class="cursor-pointer flex flex-col justify-between bg-surface-container-low border border-outline-variant p-5 rounded-2xl relative overflow-hidden group hover:border-primary/40 transition-all">
          <div class="absolute -right-4 -top-4 w-24 h-24 bg-secondary/10 rounded-full blur-xl group-hover:scale-125 transition-transform"></div>
          <div>
            <div class="flex items-center justify-between mb-2">
              <span class="text-xs text-on-surface-variant uppercase tracking-wider font-semibold">Clientes Registrados</span>
              <span class="flex items-center gap-1 font-mono-code text-xs text-secondary font-semibold">
                <span class="material-symbols-outlined text-sm">trending_up</span>+${8 + Math.max(0, state.clients.length - 9)} altas
              </span>
            </div>
            <div class="flex items-baseline gap-2">
              <span class="text-3xl text-white font-bold tracking-tight">${totalClientsCount.toLocaleString()}</span>
              <span class="text-xs text-on-surface-variant">titulares</span>
            </div>
          </div>
          <div class="mt-4 flex items-center justify-between bg-surface-container-lowest/60 border border-outline-variant px-3 py-2 rounded-xl">
            <span class="text-xs text-on-surface-variant">Carpetas en Árbol Local</span>
            <span class="font-mono-code text-xs font-semibold text-primary">${state.clients.length} activas</span>
          </div>
        </div>

        <!-- Card 3: Documentos Clasificados IA -->
        <div data-nav-card="documentos" class="cursor-pointer flex flex-col justify-between bg-surface-container-low border border-outline-variant p-5 rounded-2xl relative overflow-hidden group hover:border-primary/40 transition-all">
          <div class="absolute -right-6 -bottom-6 w-32 h-32 bg-primary/10 rounded-full blur-2xl group-hover:scale-110 transition-transform"></div>
          <div>
            <div class="flex items-center justify-between mb-2">
              <span class="text-xs text-on-surface-variant uppercase tracking-wider font-semibold">Documentos Clasificados IA</span>
              <span class="px-2 py-0.5 rounded-md bg-primary/15 text-primary border border-primary/25 font-mono-code text-xs font-semibold">99.1% Z-Touch</span>
            </div>
            <div class="flex items-baseline gap-2">
              <span class="text-3xl text-primary font-bold tracking-tight">${totalDocsCount.toLocaleString()}</span>
              <span class="text-xs text-on-surface-variant">este mes</span>
            </div>
          </div>
          <div class="mt-4 flex items-center justify-between bg-surface-container-lowest/60 border border-outline-variant px-3 py-2 rounded-xl">
            <span class="text-xs text-on-surface-variant flex items-center gap-1 font-medium">
              <span class="material-symbols-outlined text-sm text-secondary">schedule</span> Ahorro operacional:
            </span>
            <span class="font-mono-code text-xs font-bold text-secondary">${state.stats.hoursSaved} hrs</span>
          </div>
        </div>

        <!-- Card 4: Alertas de Audiencias -->
        <div data-nav-card="audiencias" class="cursor-pointer flex flex-col justify-between bg-surface-container-low border border-outline-variant p-5 rounded-2xl relative overflow-hidden group hover:border-error/40 transition-all">
          <div class="absolute -right-4 -top-4 w-24 h-24 bg-error/10 rounded-full blur-xl group-hover:scale-125 transition-transform"></div>
          <div>
            <div class="flex items-center justify-between mb-2">
              <span class="text-xs text-on-surface-variant uppercase tracking-wider font-semibold">Alertas de Audiencias</span>
              <span class="px-2 py-0.5 rounded-md bg-error/15 text-error border border-error/25 font-mono-code text-xs font-semibold">${criticalHearings} Críticas</span>
            </div>
            <div class="flex items-baseline gap-2">
              <span class="text-3xl text-error font-bold tracking-tight">${state.hearings.length + 3}</span>
              <span class="text-xs text-on-surface-variant">próx. 5 días hábiles</span>
            </div>
          </div>
          <div class="mt-4 flex items-center justify-between bg-error/10 border border-error/20 px-3 py-2 rounded-xl">
            <span class="text-xs text-error flex items-center gap-1 font-medium">
              <span class="material-symbols-outlined text-sm">priority_high</span> Término fatal judicial
            </span>
            <span class="font-mono-code text-xs font-bold text-error">48h max</span>
          </div>
        </div>
      </div>

      <!-- Middle Layout: Asymmetric 2 Columns (7 / 5 Grid) -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6 items-start">
        <!-- Left Column (7 cols): Live Ingestion Stream -->
        <div class="lg:col-span-7 flex flex-col bg-surface-container-low border border-outline-variant p-6 rounded-2xl">
          <div class="flex items-center justify-between mb-5">
            <div class="flex items-center gap-3">
              <div class="w-9 h-9 rounded-xl bg-primary/15 border border-primary/25 flex items-center justify-center text-primary">
                <span class="material-symbols-outlined text-xl">document_scanner</span>
              </div>
              <div>
                <h2 class="text-base text-white font-semibold tracking-tight">Actividad Reciente: Ingesta Neuronal</h2>
                <p class="text-xs text-on-surface-variant">Auto-clasificación y normalización [Tipo]_[Fecha]_[Original] en segundo plano</p>
              </div>
            </div>
            <span class="font-mono-code text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full font-medium">Stream Live</span>
          </div>

          <!-- Feed List -->
          <div class="flex flex-col gap-3">
            ${state.feed.slice(0, 4).map(item => renderFeedItem(item)).join('')}
          </div>

          <!-- Compact AI Telemetry Footer inside Feed Card -->
          <div class="mt-4 pt-3 flex items-center justify-between bg-surface-container-lowest text-on-surface-variant p-3 rounded-xl border border-outline-variant">
            <div class="flex items-center gap-2 font-mono-code text-xs">
              <span class="text-secondary font-medium">● OCR Pipeline</span>
              <span class="text-outline">|</span>
              <span>Latencia media: 420ms</span>
              <span class="hidden sm:inline text-outline">|</span>
              <span class="hidden sm:inline">Confidence score: 0.994</span>
            </div>
            <button id="dash-go-importer-logs" class="text-xs text-primary hover:text-white transition-colors flex items-center gap-0.5 font-medium" type="button">
              <span>Logs Completos</span>
              <span class="material-symbols-outlined text-sm">chevron_right</span>
            </button>
          </div>
        </div>

        <!-- Right Column (5 cols): Próximas Audiencias & Términos Judiciales -->
        <div class="lg:col-span-5 flex flex-col bg-surface-container-low border border-outline-variant p-6 rounded-2xl">
          <div class="flex items-center justify-between mb-5">
            <div class="flex items-center gap-3">
              <div class="w-9 h-9 rounded-xl bg-error/15 border border-error/25 flex items-center justify-center text-error">
                <span class="material-symbols-outlined text-xl">event_upcoming</span>
              </div>
              <div>
                <h2 class="text-base text-white font-semibold tracking-tight">Próximas Audiencias</h2>
                <p class="text-xs text-on-surface-variant">Términos procesales con agenda judicial</p>
              </div>
            </div>
            <span class="text-xs bg-surface-container border border-outline-variant px-2.5 py-1 rounded-full text-on-surface-variant font-semibold">5 Días</span>
          </div>

          <!-- Timeline Cards -->
          <div class="flex flex-col gap-4 relative">
            ${state.hearings.slice(0, 3).map(h => renderHearingCard(h)).join('')}
          </div>
        </div>
      </div>

      <!-- Bottom Section: Expedientes Recientes con Modificaciones Automáticas -->
      <div class="flex flex-col bg-surface-container-low border border-outline-variant p-6 rounded-2xl">
        <!-- Header with Title & Filter Chips -->
        <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-5">
          <div>
            <h2 class="text-lg text-white font-semibold tracking-tight">Expedientes Recientes con Modificaciones Automáticas</h2>
            <p class="text-xs text-on-surface-variant">Carátulas judiciales actualizadas mediante el extractor Zero-Touch y acuerdos publicados</p>
          </div>
          <!-- Filter Chips Group -->
          <div class="flex items-center gap-2 flex-wrap">
            <button data-case-filter="ALL" class="px-3.5 py-1.5 rounded-full ${activeTableFilter === 'ALL' ? 'bg-primary-container text-white font-semibold shadow-sm' : 'bg-surface-container-highest border border-outline-variant text-on-surface-variant hover:text-white'} text-xs transition-colors" type="button">
              Todos (${state.cases.length})
            </button>
            <button data-case-filter="HIGH" class="px-3.5 py-1.5 rounded-full ${activeTableFilter === 'HIGH' ? 'bg-primary-container text-white font-semibold shadow-sm' : 'bg-surface-container-highest border border-outline-variant text-on-surface-variant hover:text-white'} text-xs transition-colors" type="button">
              Alta Prioridad
            </button>
            <button data-case-filter="PENDING_AI" class="px-3.5 py-1.5 rounded-full ${activeTableFilter === 'PENDING_AI' ? 'bg-primary-container text-white font-semibold shadow-sm' : 'bg-surface-container-highest border border-outline-variant text-on-surface-variant hover:text-white'} text-xs font-medium flex items-center gap-1.5 transition-colors" type="button">
              <span class="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
              <span>Pendientes de Revisión IA / Sin Número</span>
            </button>
            <button data-case-filter="HEARING" class="px-3.5 py-1.5 rounded-full ${activeTableFilter === 'HEARING' ? 'bg-primary-container text-white font-semibold shadow-sm' : 'bg-surface-container-highest border border-outline-variant text-on-surface-variant hover:text-white'} text-xs font-medium flex items-center gap-1.5 transition-colors" type="button">
              <span class="w-1.5 h-1.5 rounded-full bg-error"></span>
              <span>Con Audiencia Próxima</span>
            </button>
          </div>
        </div>

        <!-- Data Table Container -->
        <div class="w-full overflow-x-auto rounded-xl border border-outline-variant">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-surface-container-lowest text-xs text-on-surface-variant border-b border-outline-variant font-semibold">
                <th class="py-3 px-4">ID EXPEDIENTE</th>
                <th class="py-3 px-4">CARÁTULA / ASUNTO</th>
                <th class="py-3 px-4">CLIENTE PRINCIPAL</th>
                <th class="py-3 px-4">JUZGADO / TRIBUNAL</th>
                <th class="py-3 px-4">ÚLTIMO DOC INGESTADO IA</th>
                <th class="py-3 px-4">ESTADO</th>
                <th class="py-3 px-4 text-right">ACCIONES</th>
              </tr>
            </thead>
            <tbody class="text-sm divide-y divide-outline-variant">
              ${paginatedCases.map(c => renderCaseRow(c)).join('')}
            </tbody>
          </table>
        </div>

        <!-- Table Pagination & Bulk Status Footer -->
        <div class="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 mt-2">
          <div class="font-mono-code text-xs text-on-surface-variant">
            Mostrando <strong class="text-white">${paginatedCases.length ? (currentPage - 1) * PAGE_SIZE + 1 : 0} - ${(currentPage - 1) * PAGE_SIZE + paginatedCases.length}</strong> de <strong class="text-white">${filteredCases.length}</strong> expedientes locales (${totalCasesCount} en despacho)
          </div>
          <div class="flex items-center gap-2">
            <button id="dash-prev-page" ${currentPage <= 1 ? 'disabled' : ''} class="px-3 py-1.5 rounded-lg bg-surface-container border border-outline-variant text-on-surface-variant hover:text-white hover:border-primary/40 text-xs font-semibold disabled:opacity-50 transition-colors" type="button">
              Anterior
            </button>
            <span class="font-mono-code text-xs px-2 text-primary font-bold">${currentPage} / ${totalPages}</span>
            <button id="dash-next-page" ${currentPage >= totalPages ? 'disabled' : ''} class="px-3 py-1.5 rounded-lg bg-surface-container border border-outline-variant text-on-surface-variant hover:text-white hover:border-primary/40 text-xs font-semibold disabled:opacity-50 transition-colors" type="button">
              Siguiente
            </button>
          </div>
        </div>
      </div>
    </div>
  `;

  // Eventos de navegación desde tarjetas KPI
  container.querySelectorAll('[data-nav-card]').forEach(card => {
    card.addEventListener('click', () => {
      store.setRoute(card.getAttribute('data-nav-card'));
    });
  });

  document.getElementById('dash-go-importer-logs')?.addEventListener('click', () => {
    store.setRoute('importador');
  });

  document.getElementById('dash-partner-report-btn')?.addEventListener('click', () => {
    downloadRepositoryManifest(store.state);
    showToast('Informe Ejecutivo de Socio exportado con índice certificado SHA-256', 'success');
  });

  // Filtros de la tabla inferior
  container.querySelectorAll('[data-case-filter]').forEach(btn => {
    btn.addEventListener('click', () => {
      activeTableFilter = btn.getAttribute('data-case-filter');
      currentPage = 1;
      renderDashboardView(container);
    });
  });

  document.getElementById('dash-prev-page')?.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage -= 1;
      renderDashboardView(container);
    }
  });

  document.getElementById('dash-next-page')?.addEventListener('click', () => {
    if (currentPage < totalPages) {
      currentPage += 1;
      renderDashboardView(container);
    }
  });

  // Acciones en el feed y en la tabla
  container.querySelectorAll('[data-open-client-repo]').forEach(btn => {
    btn.addEventListener('click', () => {
      const clientId = btn.getAttribute('data-open-client-repo');
      const caseId = btn.getAttribute('data-open-case-repo') || null;
      store.setRoute('documentos', { clientId, category: null, caseId });
    });
  });

  container.querySelectorAll('[data-open-ai-doc]').forEach(btn => {
    btn.addEventListener('click', () => {
      const caseId = btn.getAttribute('data-open-ai-doc');
      const doc = store.state.documents.find(d => d.caseId === caseId) || store.state.documents[0];
      if (doc) openWebViewerModal(doc.id);
    });
  });

  container.querySelectorAll('[data-prepare-hearing]').forEach(btn => {
    btn.addEventListener('click', () => {
      store.setRoute('audiencias');
      showToast('Asistente de Audiencias y Puntos de Litigio abierto', 'info');
    });
  });
}

function renderFeedItem(item) {
  if (item.statusType === 'urgent') {
    return `
      <div class="p-4 rounded-xl bg-error/10 border border-error/25 hover:border-error/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div class="flex items-start gap-3 min-w-0">
          <div class="p-2.5 rounded-xl bg-surface-container-lowest text-error border border-error/30 mt-0.5">
            <span class="material-symbols-outlined text-xl">${item.icon || 'gavel'}</span>
          </div>
          <div class="min-w-0">
            <div class="flex items-center gap-2 flex-wrap">
              <span class="text-sm text-white font-semibold truncate max-w-xs" title="${item.normalizedName || item.fileName}">${item.normalizedName || item.fileName}</span>
              <span class="px-2 py-0.5 rounded-md bg-error/20 text-error border border-error/30 text-[11px] font-semibold">${item.tag}</span>
            </div>
            <p class="text-xs text-error mt-1 flex items-center gap-1 font-medium">
              <span class="material-symbols-outlined text-sm">alarm</span> ${item.urgentText || 'Plazo fatal detectado: 48h hábiles restantes'}
            </p>
          </div>
        </div>
        <div class="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center shrink-0">
          <span class="font-mono-code text-xs text-on-surface-variant">${item.timeAgo}</span>
          <span class="px-2 py-0.5 rounded-md bg-error text-white text-[11px] uppercase font-bold tracking-wider mt-1">Acción Urgente</span>
        </div>
      </div>
    `;
  }

  return `
    <div class="p-4 rounded-xl bg-surface-container border border-outline-variant hover:border-primary/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div class="flex items-start gap-3 min-w-0">
        <div class="p-2.5 rounded-xl bg-surface-container-lowest ${item.iconColor || 'text-primary'} border border-outline-variant mt-0.5">
          <span class="material-symbols-outlined text-xl">${item.icon || 'picture_as_pdf'}</span>
        </div>
        <div class="min-w-0">
          <div class="flex items-center gap-2 flex-wrap">
            <span class="text-sm text-white font-semibold truncate max-w-md font-mono-code" title="${item.normalizedName || item.fileName}">${item.normalizedName || item.fileName}</span>
            <span class="px-2 py-0.5 rounded-md bg-surface-container-highest text-on-surface-variant border border-outline-variant text-[11px] font-medium">${item.tag}</span>
          </div>
          <p class="text-xs text-on-surface-variant mt-1">
            Archivado en <span class="font-mono-code text-primary font-semibold">#${item.caseId}</span> • <strong class="text-white">${item.clientName}</strong>
          </p>
        </div>
      </div>
      <div class="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center shrink-0">
        <span class="font-mono-code text-xs text-on-surface-variant">${item.timeAgo}</span>
        ${item.statusType === 'pending'
          ? `<span class="px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-300 border border-amber-500/30 text-[11px] mt-1">Validar IA (${item.confidence}%)</span>`
          : `<span class="text-xs text-emerald-400 font-semibold flex items-center gap-1 mt-1"><span class="material-symbols-outlined text-xs">verified</span> ${item.confidence}% Match</span>`
        }
      </div>
    </div>
  `;
}

function renderHearingCard(h) {
  const barColor = h.urgency === 'critical' ? 'bg-error' : (h.urgency === 'warning' ? 'bg-amber-400' : 'bg-outline');
  const badgeHtml = h.urgency === 'critical'
    ? `<span class="px-2 py-0.5 rounded-full bg-error text-white font-mono-code text-xs font-semibold animate-pulse">${h.timeBadge}</span>`
    : `<span class="px-2 py-0.5 rounded-full bg-surface-container-highest text-on-surface-variant border border-outline-variant font-mono-code text-xs font-medium">${h.timeBadge}</span>`;

  return `
    <div class="flex flex-col p-4 rounded-xl bg-surface-container border border-outline-variant relative overflow-hidden">
      <div class="absolute left-0 top-0 bottom-0 w-1 ${barColor}"></div>
      <div class="flex items-start justify-between gap-2 pl-2 mb-2">
        <div>
          <span class="font-mono-code text-xs text-primary font-bold">${h.caseId}</span>
          <h3 class="text-sm text-white font-semibold mt-0.5">${h.title}</h3>
        </div>
        ${badgeHtml}
      </div>
      <div class="pl-2 text-xs text-on-surface-variant mb-4 space-y-1">
        <p><strong class="text-white">Juez / Autoridad:</strong> ${h.judge}</p>
        <p><strong class="text-white">Sala / Sede:</strong> ${h.courtroom}</p>
      </div>
      <div class="pl-2 flex items-center gap-2">
        <button data-prepare-hearing="${h.id}" class="w-full py-2 px-3 ${h.urgency === 'critical' ? 'bg-primary-container text-white hover:bg-primary' : 'bg-surface-container-highest border border-outline-variant text-white hover:border-primary/40'} rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5" type="button">
          <span class="material-symbols-outlined text-base">${h.urgency === 'critical' ? 'psychology' : 'article'}</span>
          <span>${h.urgency === 'critical' ? 'Preparar Auto con IA' : 'Ver Estrategia Litigiosa'}</span>
        </button>
      </div>
    </div>
  `;
}

function renderCaseRow(c) {
  let statusBadge = `
    <span class="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold flex items-center gap-1 w-max">
      <span class="material-symbols-outlined text-xs">check_circle</span> ${c.status}
    </span>
  `;
  if (c.statusColor === 'amber' || c.id === 'Sin número (Nuevo)') {
    statusBadge = `
      <span class="px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold flex items-center gap-1 w-max">
        <span class="material-symbols-outlined text-xs">hourglass_top</span> ${c.status}
      </span>
    `;
  } else if (c.statusColor === 'primary') {
    statusBadge = `
      <span class="px-2.5 py-1 rounded-full bg-primary/15 border border-primary/25 text-primary text-xs font-semibold flex items-center gap-1 w-max">
        <span class="material-symbols-outlined text-xs">pending_actions</span> ${c.status}
      </span>
    `;
  }

  return `
    <tr class="hover:bg-surface-container transition-colors group">
      <td class="py-3.5 px-4 font-mono-code text-xs ${c.id === 'Sin número (Nuevo)' ? 'text-amber-300' : 'text-primary'} font-semibold whitespace-nowrap">
        ${c.id}
      </td>
      <td class="py-3.5 px-4">
        <div class="text-sm text-white font-semibold truncate max-w-xs">${c.title}</div>
        <div class="text-xs text-on-surface-variant">${c.subtitle}</div>
      </td>
      <td class="py-3.5 px-4 whitespace-nowrap">
        <span class="text-sm font-medium text-white">${c.clientName}</span>
      </td>
      <td class="py-3.5 px-4">
        <div class="text-xs text-on-surface-variant truncate max-w-xs">${c.court}</div>
      </td>
      <td class="py-3.5 px-4">
        <div class="flex items-center gap-1.5 text-xs text-white font-mono-code font-medium truncate max-w-xs" title="${c.lastDocName}">
          <span class="material-symbols-outlined text-sm text-primary">description</span>
          <span class="truncate">${c.lastDocName}</span>
        </div>
        <span class="font-mono-code text-[11px] text-on-surface-variant">${c.lastUpdateText}</span>
      </td>
      <td class="py-3.5 px-4 whitespace-nowrap">
        ${statusBadge}
      </td>
      <td class="py-3.5 px-4 text-right whitespace-nowrap">
        <div class="flex items-center justify-end gap-1">
          <button data-open-ai-doc="${c.id}" class="p-1.5 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container-highest transition-all" title="Abrir Visor Web / Análisis IA" type="button">
            <span class="material-symbols-outlined text-lg">auto_awesome</span>
          </button>
          <button data-open-client-repo="${c.clientId}" data-open-case-repo="${c.id}" class="p-1.5 rounded-lg text-on-surface-variant hover:text-white hover:bg-surface-container-highest transition-all" title="Abrir Carpeta del Cliente en Repositorio" type="button">
            <span class="material-symbols-outlined text-lg">folder_open</span>
          </button>
        </div>
      </td>
    </tr>
  `;
}
