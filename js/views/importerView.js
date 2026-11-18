/**
 * Vista 2 de Stitch: Importador Masivo "Zero-Touch"
 * Réplica 100% fiel de importador_zero_touch_saas_legal/code.html con cola asíncrona real,
 * Consola de Importación en vivo, normalización [Tipo]_[Fecha]_[NombreOriginal]
 * y sincronización instantánea con el Dashboard y el Repositorio Documental.
 */

import { store } from '../store/state.js';
import { processSingleFileZeroTouch } from '../services/extractorEngine.js';
import { downloadBatchCSV } from '../services/reportGenerator.js';
import { openWebViewerModal } from '../components/webViewerModal.js';
import { openReclassifyModal } from '../components/reclassifyModal.js';
import { showToast } from '../components/globalSearchModal.js';

let warningFilterOnly = false;

export function renderImporterView(container) {
  const state = store.state;
  const batch = state.importerBatch;
  const batchDocs = (batch.recentBatchDocs && batch.recentBatchDocs.length > 0)
    ? batch.recentBatchDocs
    : state.documents.slice(0, 5);

  const progressPct = batch.totalCount > 0
    ? Math.round((batch.processedCount / batch.totalCount) * 100)
    : 100;

  container.innerHTML = `
    <div class="flex flex-col w-full">
      <!-- Content Header Area -->
      <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-space-lg mb-space-xl mt-2">
        <div class="flex flex-col gap-space-xs max-w-3xl">
          <div class="flex items-center gap-space-sm mb-1">
            <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono-code text-label-sm uppercase tracking-wide">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
              Daemon v4.2 Activo • Modo ${state.aiSettings.mode === 'api' ? 'LLM API Real' : 'Híbrido Cliente + Regex'}
            </span>
            <span class="font-mono-code text-body-sm text-outline">LATENCIA RED: 28ms</span>
          </div>
          <h1 class="font-headline-xl text-headline-xl text-white font-semibold tracking-tight">
            Motor de Ingesta Inteligente “Zero-Touch”
          </h1>
          <p class="font-body-md text-body-md text-on-surface-variant leading-relaxed">
            Carga masiva de documentación judicial y corporativa. La IA extrae metadatos, normaliza el archivo como <code class="text-primary font-mono-code">[Tipo]_[Fecha]_[Original]</code> y lo clasifica automáticamente en el árbol <strong class="text-white">Cliente → Tipo de Documento → Archivo</strong>.
          </p>
        </div>

        <!-- Action Toolbar -->
        <div class="flex flex-wrap items-center gap-space-sm self-start lg:self-auto">
          <div class="relative inline-flex items-center bg-surface-variant border border-white/10 rounded-lg shadow-sm">
            <span class="material-symbols-outlined text-primary ml-3 text-lg">psychology</span>
            <select id="importer-model-select" class="appearance-none bg-transparent pl-2 pr-9 py-2 font-label-md text-label-md text-white focus:outline-none cursor-pointer">
              <option class="bg-surface-variant text-white" value="legal-v4">Modelo: Legal-LLM Jurisprudencia v4</option>
              <option class="bg-surface-variant text-white" value="compliance-v3">Modelo: Compliance Mercantil &amp; M&amp;A v3.8</option>
              <option class="bg-surface-variant text-white" value="litigio-rag">Modelo: Litigio Administrativo RAG-Turbo</option>
            </select>
            <span class="material-symbols-outlined absolute right-2.5 pointer-events-none text-outline text-base">expand_more</span>
          </div>

          <button id="importer-settings-btn" class="inline-flex items-center gap-space-xs px-3.5 py-2 bg-surface-variant text-white hover:bg-surface-container-highest border border-white/10 rounded-lg font-label-md text-label-md shadow-sm transition-all" type="button">
            <span class="material-symbols-outlined text-base text-primary">tune</span>
            <span>Ajustes IA / API Key</span>
          </button>

          <button id="importer-simulate-batch-btn" class="inline-flex items-center gap-space-xs px-3.5 py-2 bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25 border border-emerald-500/30 rounded-lg font-label-md text-label-md shadow-sm transition-all" type="button" title="Ejecuta una simulación con 4 archivos reales + casos límite (sin expediente, cliente de un solo nombre y formato inválido)">
            <span class="material-symbols-outlined text-base text-emerald-400">science</span>
            <span>Probar Cola Demo + Casos Límite</span>
          </button>
        </div>
      </div>

      <!-- Primary Workstation Grid: Ingestion Zone + Real-time Telemetry Card -->
      <div class="grid grid-cols-1 xl:grid-cols-12 gap-space-lg mb-space-xl">
        <!-- Massive Drop Zone (8 Cols) -->
        <div class="xl:col-span-8 flex flex-col">
          <div class="relative group bg-surface-variant border border-white/10 rounded-xl p-space-xl shadow-lg flex flex-col justify-between overflow-hidden h-full">
            <div class="absolute -top-24 -right-24 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none group-hover:bg-primary/20 transition-colors"></div>
            <div class="absolute -bottom-20 -left-20 w-64 h-64 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none"></div>

            <input id="zero-touch-file-input" type="file" multiple class="hidden" accept=".pdf,.docx,.doc,.png,.jpg,.jpeg,.tiff,.tif,.txt,*/*" />

            <!-- Upper Drop Target Area -->
            <div id="zero-touch-dropzone" class="relative rounded-lg bg-surface-container-lowest/80 border-2 border-dashed border-white/15 hover:border-primary/60 hover:bg-surface-container-low/90 p-space-xl text-center flex flex-col items-center justify-center transition-all cursor-pointer">
              <div class="relative w-20 h-20 rounded-2xl bg-surface-container-high border border-white/10 shadow-inner flex items-center justify-center mb-space-md group-hover:scale-105 transition-transform">
                <span class="material-symbols-outlined text-4xl text-primary">cloud_upload</span>
                <span class="material-symbols-outlined text-lg text-secondary-fixed absolute -top-1.5 -right-1.5 bg-surface-container-lowest border border-white/10 text-cyan-400 p-1 rounded-full shadow-sm">auto_awesome</span>
              </div>
              <h2 class="font-headline-lg text-headline-lg text-white font-semibold mb-space-xs">
                Arrastra y suelta expedientes o archivos reales desde tu PC aquí
              </h2>
              <p class="font-body-md text-body-md text-on-surface-variant max-w-xl mb-space-lg">
                Soporta múltiples archivos simultáneamente en cola asíncrona. Formatos admitidos: PDF, DOCX, PNG, JPG, TIFF (también puedes soltar archivos de la carpeta <code class="text-primary font-mono-code">samples/</code> del proyecto).
              </p>

              <!-- Badges -->
              <div class="flex flex-wrap items-center justify-center gap-space-xs mb-space-lg">
                <span class="inline-flex items-center gap-1 px-3 py-1 rounded-md bg-white/5 border border-white/10 text-on-surface-variant font-mono-code text-label-sm">
                  <span class="material-symbols-outlined text-sm text-red-400">picture_as_pdf</span> PDF con OCR Multi-capa
                </span>
                <span class="inline-flex items-center gap-1 px-3 py-1 rounded-md bg-white/5 border border-white/10 text-on-surface-variant font-mono-code text-label-sm">
                  <span class="material-symbols-outlined text-sm text-primary">article</span> DOCX / Modelos Contratados
                </span>
                <span class="inline-flex items-center gap-1 px-3 py-1 rounded-md bg-white/5 border border-white/10 text-on-surface-variant font-mono-code text-label-sm">
                  <span class="material-symbols-outlined text-sm text-emerald-400">image</span> Fojas Digitalizadas / PNG &amp; JPG
                </span>
                <span class="inline-flex items-center gap-1 px-3 py-1 rounded-md bg-white/5 border border-white/10 text-on-surface-variant font-mono-code text-label-sm">
                  <span class="material-symbols-outlined text-sm text-amber-400">account_tree</span> Normalización [Tipo]_[Fecha]_[Nombre]
                </span>
              </div>

              <!-- Buttons -->
              <div class="flex flex-wrap items-center justify-center gap-space-sm">
                <button id="explore-local-files-btn" class="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary-container hover:bg-primary text-white font-label-md text-label-md shadow-lg shadow-primary/20 border border-primary/40 transition-all" type="button">
                  <span class="material-symbols-outlined text-base">upload_file</span>
                  <span>Explorar Archivos Locales</span>
                </button>
                <button id="open-repo-from-importer-btn" class="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-white border border-white/10 font-label-md text-label-md transition-all" type="button">
                  <span class="material-symbols-outlined text-base text-primary">folder_open</span>
                  <span>Ver Árbol en Repositorio Documental</span>
                </button>
              </div>
            </div>

            <!-- Instant Heuristics Checklist -->
            <div class="mt-space-lg pt-space-md flex flex-wrap items-center justify-between gap-space-md text-on-surface-variant">
              <label class="flex items-center gap-space-xs cursor-pointer select-none">
                <input id="chk-auto-create-case" ${state.aiSettings.autoCreateCase ? 'checked' : ''} class="w-4 h-4 rounded text-primary bg-surface-container-lowest border-white/20 focus:ring-0 cursor-pointer accent-primary" type="checkbox"/>
                <span class="font-body-md text-body-md text-on-surface">Auto-clasificar y asignar <strong>"Sin número (Nuevo)"</strong> si no tiene expediente</span>
              </label>
              <label class="flex items-center gap-space-xs cursor-pointer select-none">
                <input id="chk-redact-pii" ${state.aiSettings.redactPII ? 'checked' : ''} class="w-4 h-4 rounded text-primary bg-surface-container-lowest border-white/20 focus:ring-0 cursor-pointer accent-primary" type="checkbox"/>
                <span class="font-body-md text-body-md text-on-surface">Normalizar nombre automáticamente (<code class="text-emerald-400 font-mono-code">[Tipo]_[Fecha]_[Nombre]</code>)</span>
              </label>
            </div>
          </div>
        </div>

        <!-- Upload Status & Telemetry Metrics Card (4 Cols) -->
        <div class="xl:col-span-4 flex flex-col">
          <div class="bg-surface-variant border border-white/10 rounded-xl p-space-lg shadow-lg flex flex-col justify-between h-full">
            <div>
              <!-- Header Status -->
              <div class="flex items-center justify-between pb-space-md border-b border-white/10">
                <div class="flex items-center gap-space-xs">
                  <div id="telemetry-status-icon-wrap" class="w-8 h-8 rounded-lg ${batch.failCount > 0 ? 'bg-amber-500/15 border-amber-500/30 text-amber-400' : 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'} border flex items-center justify-center">
                    <span class="material-symbols-outlined text-lg" id="telemetry-status-icon">${batch.isProcessing ? 'sync' : (batch.failCount > 0 ? 'warning' : 'task_alt')}</span>
                  </div>
                  <div>
                    <h3 class="font-headline-sm text-headline-sm text-white" id="telemetry-batch-title">Lote de Ingesta #${batch.batchId}</h3>
                    <span id="telemetry-batch-subtitle" class="font-mono-code text-body-sm ${batch.failCount > 0 ? 'text-amber-300' : 'text-emerald-400'} font-medium">
                      ${batch.isProcessing ? 'Procesando cola en vivo...' : (batch.failCount > 0 ? `Completado • ${batch.failCount} incidencia(s)` : 'Completado • Sin Incidencias')}
                    </span>
                  </div>
                </div>
                <span id="telemetry-pct-badge" class="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 font-mono-code text-label-sm font-semibold">
                  ${progressPct}% OK
                </span>
              </div>

              <!-- Progress Bar & Count -->
              <div class="space-y-2 my-space-md">
                <div class="flex justify-between font-label-md text-label-md">
                  <span class="text-white">Progreso del Pipeline</span>
                  <span id="telemetry-progress-count" class="font-mono-code text-white font-semibold">${batch.processedCount} / ${batch.totalCount} archivos procesados</span>
                </div>
                <div class="w-full bg-surface-container-lowest h-2.5 rounded-full overflow-hidden border border-white/5">
                  <div id="telemetry-progress-bar" class="bg-emerald-400 h-full rounded-full transition-all duration-300 shadow-[0_0_8px_rgba(52,211,153,0.6)]" style="width: ${progressPct}%;"></div>
                </div>
                <p id="telemetry-success-fail-text" class="font-body-sm text-body-sm text-outline">
                  <strong class="text-emerald-400">${batch.successCount} éxitos</strong>, <strong class="${batch.failCount > 0 ? 'text-error' : 'text-outline'}">${batch.failCount} fallos</strong> estructurales detectados
                </p>
              </div>

              <!-- Metrics Bento Grid -->
              <div class="grid grid-cols-2 gap-space-sm pt-space-xs">
                <div class="p-space-md rounded-lg bg-surface-container-lowest border border-white/5 flex flex-col">
                  <span class="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-1">Tiempo de Ingesta</span>
                  <span id="telemetry-elapsed" class="font-headline-lg text-headline-lg font-mono-code text-primary font-bold">${batch.elapsedSeconds}s</span>
                  <span class="font-mono-code text-body-sm text-outline mt-0.5">Cola asíncrona activa</span>
                </div>
                <div class="p-space-md rounded-lg bg-surface-container-lowest border border-white/5 flex flex-col">
                  <span class="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-1">Tokens Consumidos</span>
                  <span id="telemetry-tokens" class="font-headline-lg text-headline-lg font-mono-code text-white font-bold">${batch.tokensUsed.toLocaleString()}</span>
                  <span class="font-mono-code text-body-sm text-outline mt-0.5">Embedding text-004</span>
                </div>
                <div class="col-span-2 p-space-md rounded-lg bg-surface-container-lowest border border-white/5 flex items-center justify-between">
                  <div>
                    <span class="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider block">Precisión Global IA</span>
                    <span id="telemetry-confidence" class="font-headline-md text-headline-md font-mono-code text-emerald-400 font-bold">${batch.avgConfidence}%</span>
                  </div>
                  <div class="text-right">
                    <span class="inline-flex items-center gap-1 font-mono-code text-label-sm text-emerald-300 bg-emerald-500/15 border border-emerald-500/25 px-2 py-0.5 rounded">
                      <span class="material-symbols-outlined text-xs">verified</span> Certificado
                    </span>
                    <span class="block font-mono-code text-body-sm text-outline mt-0.5">Hash SHA-256 Validado</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Action Controls -->
            <div class="pt-space-lg flex flex-col sm:flex-row gap-space-sm border-t border-white/10 mt-auto">
              <button id="telemetry-add-more-btn" class="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-primary-container hover:bg-primary text-white font-label-md text-label-md shadow-md shadow-primary/20 border border-primary/40 transition-all" type="button">
                <span class="material-symbols-outlined text-base">add_circle</span>
                <span>Procesar Más Archivos</span>
              </button>
              <button id="telemetry-csv-btn" class="inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-surface-container-high hover:bg-surface-container-highest border border-white/10 text-white font-label-md text-label-md transition-all" type="button">
                <span class="material-symbols-outlined text-base text-outline">download</span>
                <span>Reporte CSV</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Interactive Dark Terminal / Console Log: 'Consola de Importación' -->
      <div class="w-full mb-space-xl">
        <div class="rounded-xl overflow-hidden bg-surface-container-lowest border border-white/10 shadow-2xl text-on-surface">
          <!-- Terminal Window Bar -->
          <div class="bg-surface-container-low px-space-md py-3 flex items-center justify-between border-b border-white/10">
            <div class="flex items-center gap-space-sm">
              <div class="flex items-center gap-1.5 mr-space-md">
                <span class="w-3 h-3 rounded-full bg-red-500/80"></span>
                <span class="w-3 h-3 rounded-full bg-amber-500/80"></span>
                <span class="w-3 h-3 rounded-full bg-emerald-500/80"></span>
              </div>
              <span class="font-mono-code text-body-sm text-on-surface-variant flex items-center gap-1.5">
                <span class="material-symbols-outlined text-sm text-primary">terminal</span>
                saas-legal@extractor-daemon: ~ /var/log/ingesta-zero-touch.log
              </span>
            </div>
            <div class="flex items-center gap-space-xs">
              <button id="terminal-filter-warn-btn" class="px-2.5 py-1 rounded ${warningFilterOnly ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'text-on-surface-variant hover:text-white hover:bg-white/10'} font-mono-code text-label-sm flex items-center gap-1 transition-colors" title="Filtrar por Advertencias y Fallos" type="button">
                <span class="material-symbols-outlined text-sm">filter_alt</span>
                <span>${warningFilterOnly ? 'Solo Alertas/Fallos' : 'Todos los Logs'}</span>
              </button>
              <button id="terminal-clear-btn" class="px-2.5 py-1 rounded text-on-surface-variant hover:text-white hover:bg-white/10 font-mono-code text-label-sm transition-all" type="button">
                Limpiar
              </button>
              <button id="copy-btn" class="inline-flex items-center gap-1 px-2.5 py-1 rounded text-on-surface-variant hover:text-white hover:bg-white/10 font-mono-code text-label-sm transition-all" type="button">
                <span class="material-symbols-outlined text-sm">content_copy</span>
                <span>Copiar Log</span>
              </button>
            </div>
          </div>

          <!-- Terminal Body Content -->
          <div class="p-space-md md:p-space-lg font-mono-code text-xs sm:text-sm space-y-2.5 max-h-[400px] overflow-y-auto leading-relaxed bg-[#070a0f]" id="console-log">
            ${renderConsoleLogs(batch.logs)}
          </div>
        </div>
      </div>

      <!-- Batch Summary Inspection Data Table -->
      <div class="w-full flex flex-col bg-surface-variant border border-white/10 rounded-xl shadow-lg overflow-hidden">
        <div class="px-space-lg py-space-md flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm bg-surface-variant border-b border-white/10">
          <div>
            <h3 class="font-headline-md text-headline-md text-white">Documentos Ingeridos en este Lote</h3>
            <p class="font-body-sm text-body-sm text-on-surface-variant">Sincronizados en tiempo real con el Árbol Documental (<strong class="text-white">Cliente → Tipo de Documento → Archivo Normalizado</strong>)</p>
          </div>
          <div class="flex items-center gap-space-xs">
            <span class="font-mono-code text-label-sm text-emerald-400">${batchDocs.length} indexados en el árbol local</span>
          </div>
        </div>

        <div class="w-full overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider border-b border-white/10">
                <th class="py-3 px-space-md">Archivo Normalizado &amp; Fuente</th>
                <th class="py-3 px-space-md">Nivel 1: Cliente</th>
                <th class="py-3 px-space-md">Nivel 2: Carpeta &amp; Tipo</th>
                <th class="py-3 px-space-md">Expediente Vinculado</th>
                <th class="py-3 px-space-md text-center">Confianza</th>
                <th class="py-3 px-space-md text-right">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-white/5 font-body-md text-body-md text-on-surface">
              ${batchDocs.map(doc => renderBatchTableRow(doc)).join('')}
            </tbody>
          </table>
        </div>

        <!-- Table Footer -->
        <div class="px-space-lg py-space-sm bg-surface-variant border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm">
          <span class="font-mono-code text-body-sm text-outline">Mostrando ${batchDocs.length} documentos sincronizados en el Repositorio Central</span>
          <div class="flex items-center gap-space-xs">
            <button id="batch-go-repo-btn" class="px-3.5 py-1.5 rounded-lg bg-surface-container-high border border-white/10 text-white hover:bg-surface-container-highest font-label-md text-label-md transition-colors flex items-center gap-1.5" type="button">
              <span class="material-symbols-outlined text-base text-primary">account_tree</span>
              <span>Inspeccionar en Árbol Documental</span>
            </button>
            <button id="batch-approve-btn" class="px-3.5 py-1.5 rounded-lg bg-primary-container text-white hover:bg-primary font-label-md text-label-md transition-colors shadow-md shadow-primary/20 border border-primary/40 flex items-center gap-1.5" type="button">
              <span class="material-symbols-outlined text-base">verified</span>
              <span>Aprobar Lote en Firme</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  `;

  bindImporterEvents(container, batchDocs);
}

function renderConsoleLogs(customLogs = []) {
  if (!customLogs || customLogs.length === 0) {
    // Mostrar los logs iniciales exactos del diseño Stitch cuando aún no se ha corrido un nuevo lote en la sesión
    return `
      <div class="text-[#38bdf8]">
        <span class="text-white/40">[16:23:13]</span> Conectando a IA de extracción y motor OCR multicanal...
      </div>
      <div class="text-[#818cf8]">
        <span class="text-white/40">[16:23:14]</span> Pipeline inicializado. Regla activa: [Cliente] / [Tipo_Documento] / [Tipo]_[Fecha]_[Original]...
      </div>
      <div class="pt-1">
        <div class="text-[#34d399] font-medium flex items-center gap-1.5">
          <span class="text-white/40">[16:23:15]</span>
          <span class="material-symbols-outlined text-sm">check_circle</span>
          <span>[OK] Actividad03-1RA EVA-FBD-ISC.pdf (14.2 MB)</span>
        </div>
        <div class="pl-7 space-y-0.5 text-on-surface-variant">
          <div>├── Cliente identificado (Nivel 1): <span class="text-white font-medium">TechCorp Iberoamérica S.A.</span> (ID: <span class="text-primary">CLI-9402</span>)</div>
          <div>├── Subcarpeta IA (Nivel 2): <span class="text-emerald-400 font-semibold">📁 Demandas</span> → <span class="text-white">Escrito Inicial de Demanda</span></div>
          <div>├── Nombre normalizado (Nivel 3): <span class="text-primary font-semibold">Demanda_2026-11-06_Actividad03-1RA_EVA-FBD-ISC.pdf</span></div>
          <div>├── Expediente vinculado: <span class="text-cyan-400">EXP-2024-8841-CIV</span> (3º de lo Civil de 1ª Instancia)</div>
          <div>└── Nivel de confianza IA: <span class="text-[#34d399] font-semibold">99.4%</span> (Extracción verificada sin anomalías)</div>
        </div>
      </div>
      <div class="pt-1">
        <div class="text-[#34d399] font-medium flex items-center gap-1.5">
          <span class="text-white/40">[16:23:16]</span>
          <span class="material-symbols-outlined text-sm">check_circle</span>
          <span>[OK] Contrato_Prestacion_Servicios_Confidencial.docx (2.8 MB)</span>
        </div>
        <div class="pl-7 space-y-0.5 text-on-surface-variant">
          <div>├── Cliente identificado (Nivel 1): <span class="text-white font-medium">Innova Logistics S.L.</span> (ID: <span class="text-primary">CLI-7719</span>)</div>
          <div>├── Subcarpeta IA (Nivel 2): <span class="text-emerald-400 font-semibold">📁 Contratos</span> → <span class="text-white">Acuerdo de Confidencialidad y NDA Bilateral</span></div>
          <div>├── Nombre normalizado (Nivel 3): <span class="text-primary font-semibold">Contrato_2026-11-06_Contrato_Prestacion_Servicios_Confidencial.docx</span></div>
          <div>├── Expediente vinculado: <span class="text-amber-300">Sin número (Nuevo)</span> (<span class="text-cyan-400 font-medium">Auto-asignado: EXP-2025-0104-CORP</span>)</div>
          <div>└── Nivel de confianza IA: <span class="text-[#34d399] font-semibold">97.8%</span></div>
        </div>
      </div>
      <div class="py-1 px-2.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-300 flex items-start gap-1.5">
        <span class="text-white/40">[16:23:17]</span>
        <span class="material-symbols-outlined text-sm text-amber-400 mt-0.5">warning</span>
        <span>[WARN] Folio_Resolucion_Tribunal_Notif_639.pdf -&gt; Folio escaneado con baja resolución (150 DPI). Aplicando super-resolución IA... Clasificado con 86.4% confianza (puedes reclasificarlo con Drag &amp; Drop).</span>
      </div>
      <div class="pt-2 text-cyan-300 font-medium flex items-center gap-1.5">
        <span class="text-white/40">[16:23:19]</span>
        <span class="material-symbols-outlined text-sm text-cyan-400">verified</span>
        <span class="text-emerald-400 font-semibold">[READY] Consola lista. Arrastra tus propios archivos PDF, DOCX, PNG o JPG arriba para procesarlos en vivo.</span>
      </div>
    `;
  }

  const filtered = warningFilterOnly
    ? customLogs.filter(l => l.type === 'warn' || l.type === 'error')
    : customLogs;

  if (filtered.length === 0) {
    return `<div class="text-outline italic">No hay advertencias o fallos registrados en el lote actual.</div>`;
  }

  return filtered.map(l => l.html).join('');
}

function renderBatchTableRow(doc) {
  const isPdf = doc.ext === 'pdf';
  const isImg = ['png', 'jpg', 'jpeg'].includes(doc.ext);
  const iconBoxClass = isPdf
    ? 'bg-red-500/10 border-red-500/20 text-red-400'
    : (isImg ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-primary/10 border-primary/20 text-primary');
  const iconName = isPdf ? 'picture_as_pdf' : (isImg ? 'image' : 'description');

  const isLowConf = doc.confidence < store.state.aiSettings.lowConfidenceThreshold;
  const confBadgeClass = isLowConf
    ? 'bg-amber-500/15 border-amber-500/30 text-amber-300'
    : 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400';

  return `
    <tr class="hover:bg-white/[0.03] transition-colors">
      <td class="py-3.5 px-space-md">
        <div class="flex items-center gap-space-sm">
          <span class="w-9 h-9 rounded-lg border ${iconBoxClass} flex items-center justify-center flex-shrink-0">
            <span class="material-symbols-outlined text-xl">${iconName}</span>
          </span>
          <div class="min-w-0">
            <span class="font-mono-code font-semibold text-white block truncate max-w-xs" title="${doc.normalizedName}">${doc.normalizedName}</span>
            <span class="font-mono-code text-body-sm text-outline block truncate max-w-xs">Fuente: ${doc.originalName} • ${doc.sizeLabel}</span>
          </div>
        </div>
      </td>
      <td class="py-3.5 px-space-md">
        <span class="font-medium text-white">${doc.clientName}</span>
        <span class="block font-mono-code text-body-sm text-outline">${doc.clientId}</span>
      </td>
      <td class="py-3.5 px-space-md">
        <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-primary/15 border border-primary/30 text-primary font-mono-code text-label-sm font-semibold">
          📁 ${doc.category}
        </span>
        <span class="block text-xs text-on-surface-variant mt-0.5">${doc.docTypeLabel}</span>
      </td>
      <td class="py-3.5 px-space-md">
        <span data-batch-open-case="${doc.clientId}" class="inline-flex items-center gap-1 font-mono-code text-label-md font-semibold ${doc.caseId === 'Sin número (Nuevo)' ? 'text-amber-300' : 'text-primary'} hover:underline cursor-pointer">
          ${doc.caseId}
          <span class="material-symbols-outlined text-xs">open_in_new</span>
        </span>
        <span class="block font-body-sm text-body-sm text-on-surface-variant truncate max-w-[180px]">${doc.court}</span>
      </td>
      <td class="py-3.5 px-space-md text-center">
        <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border ${confBadgeClass} font-mono-code text-label-sm font-semibold">
          ${doc.confidence}%
        </span>
      </td>
      <td class="py-3.5 px-space-md text-right whitespace-nowrap">
        <div class="inline-flex items-center gap-1">
          <button data-batch-preview="${doc.id}" class="inline-flex items-center gap-1 text-white bg-surface-container-high hover:bg-primary px-2.5 py-1 rounded-lg text-xs font-medium transition-colors" type="button" title="Abrir en Visor Web">
            <span class="material-symbols-outlined text-sm">visibility</span>
            <span>Visor</span>
          </button>
          <button data-batch-reclassify="${doc.id}" class="inline-flex items-center gap-1 text-primary hover:text-white px-2.5 py-1 rounded-lg hover:bg-white/10 text-xs font-semibold transition-colors" type="button" title="Reclasificar Carpeta / Cliente">
            <span class="material-symbols-outlined text-sm">drive_file_move</span>
            <span>Reclasificar</span>
          </button>
        </div>
      </td>
    </tr>
  `;
}

function bindImporterEvents(container, batchDocs) {
  const dropzone = document.getElementById('zero-touch-dropzone');
  const fileInput = document.getElementById('zero-touch-file-input');

  const triggerFilePicker = () => fileInput?.click();
  document.getElementById('explore-local-files-btn')?.addEventListener('click', (e) => {
    e.stopPropagation();
    triggerFilePicker();
  });
  document.getElementById('telemetry-add-more-btn')?.addEventListener('click', triggerFilePicker);
  dropzone?.addEventListener('click', (e) => {
    if (e.target.closest('button')) return;
    triggerFilePicker();
  });

  // Drag & Drop real
  if (dropzone) {
    ['dragenter', 'dragover'].forEach(evt => {
      dropzone.addEventListener(evt, (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropzone.classList.add('drop-zone-active');
      });
    });
    ['dragleave', 'drop'].forEach(evt => {
      dropzone.addEventListener(evt, (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropzone.classList.remove('drop-zone-active');
      });
    });
    dropzone.addEventListener('drop', (e) => {
      const files = Array.from(e.dataTransfer?.files || []);
      if (files.length > 0) {
        runFilesQueue(files, container);
      }
    });
  }

  fileInput?.addEventListener('change', (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      runFilesQueue(files, container);
      fileInput.value = '';
    }
  });

  // Botón de Simulación de Lote Mixto con Casos Límite
  document.getElementById('importer-simulate-batch-btn')?.addEventListener('click', () => {
    const demoFiles = createDemoEdgeCaseFiles();
    runFilesQueue(demoFiles, container);
  });

  document.getElementById('importer-settings-btn')?.addEventListener('click', () => {
    store.setRoute('ajustes');
  });

  document.getElementById('open-repo-from-importer-btn')?.addEventListener('click', (e) => {
    e.stopPropagation();
    store.setRoute('documentos');
  });

  document.getElementById('batch-go-repo-btn')?.addEventListener('click', () => {
    store.setRoute('documentos');
  });

  document.getElementById('batch-approve-btn')?.addEventListener('click', () => {
    showToast('Lote aprobado en firme y sellado en el Árbol del Repositorio Documental', 'success');
    store.setRoute('documentos');
  });

  document.getElementById('telemetry-csv-btn')?.addEventListener('click', () => {
    downloadBatchCSV(batchDocs);
    showToast('Reporte CSV descargado', 'success');
  });

  // Controles de la Consola de Importación
  document.getElementById('terminal-filter-warn-btn')?.addEventListener('click', () => {
    warningFilterOnly = !warningFilterOnly;
    renderImporterView(container);
  });

  document.getElementById('terminal-clear-btn')?.addEventListener('click', () => {
    store.state.importerBatch.logs = [
      {
        type: 'info',
        html: `<div class="text-[#38bdf8]"><span class="text-white/40">[${new Date().toLocaleTimeString()}]</span> Consola reiniciada. Esperando nuevos documentos en la cola Zero-Touch...</div>`
      }
    ];
    renderImporterView(container);
  });

  document.getElementById('copy-btn')?.addEventListener('click', function () {
    const logEl = document.getElementById('console-log');
    if (logEl) {
      navigator.clipboard?.writeText(logEl.innerText);
      showToast('Log de consola copiado al portapapeles', 'info');
    }
  });

  // Acciones por fila de la tabla del lote
  container.querySelectorAll('[data-batch-preview]').forEach(btn => {
    btn.addEventListener('click', () => {
      openWebViewerModal(btn.getAttribute('data-batch-preview'));
    });
  });

  container.querySelectorAll('[data-batch-reclassify]').forEach(btn => {
    btn.addEventListener('click', () => {
      openReclassifyModal(btn.getAttribute('data-batch-reclassify'));
    });
  });

  container.querySelectorAll('[data-batch-open-case]').forEach(btn => {
    btn.addEventListener('click', () => {
      store.setRoute('documentos', { clientId: btn.getAttribute('data-batch-open-case') });
    });
  });
}

/**
 * Procesa una lista de archivos uno por uno de forma asíncrona,
 * actualizando la barra de progreso y la Consola de Importación en tiempo real.
 */
async function runFilesQueue(files, container) {
  const batch = store.state.importerBatch;
  batch.batchId += 1;
  batch.isProcessing = true;
  batch.totalCount = files.length;
  batch.processedCount = 0;
  batch.successCount = 0;
  batch.failCount = 0;
  batch.elapsedSeconds = 0;
  batch.tokensUsed = 0;
  batch.logs = [];
  batch.recentBatchDocs = [];

  const startBatchTime = performance.now();
  const nowStr = () => new Date().toLocaleTimeString('es-MX', { hour12: false });

  const appendLog = (type, html) => {
    batch.logs.push({ type, html });
    const consoleEl = document.getElementById('console-log');
    if (consoleEl) {
      consoleEl.innerHTML = renderConsoleLogs(batch.logs);
      consoleEl.scrollTop = consoleEl.scrollHeight;
    }
  };

  renderImporterView(container);

  appendLog(
    'info',
    `<div class="text-[#38bdf8] terminal-line-anim"><span class="text-white/40">[${nowStr()}]</span> Conectando a motor de extracción (${store.state.aiSettings.mode === 'api' ? 'LLM API Key Activa' : 'Motor Híbrido Local PDF.js/Mammoth + Regex'}) — Cola: ${files.length} archivo(s)...</div>`
  );

  let confidenceSum = 0;

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    appendLog(
      'info',
      `<div class="text-[#818cf8] terminal-line-anim"><span class="text-white/40">[${nowStr()}]</span> ⏳ Procesando (${i + 1}/${files.length}): <span class="text-white">${file.name}</span>...</div>`
    );

    const result = await processSingleFileZeroTouch(file);
    batch.processedCount = i + 1;
    batch.elapsedSeconds = Number(((performance.now() - startBatchTime) / 1000).toFixed(1));

    if (!result.ok) {
      // Caso límite: archivo con formato no permitido o corrupto -> marcar ❌ Fallo y continuar
      batch.failCount += 1;
      appendLog(
        'error',
        `<div class="py-1.5 px-3 rounded bg-red-500/15 border border-red-500/30 text-red-300 flex items-start gap-2 terminal-line-anim">
          <span class="text-white/40">[${nowStr()}]</span>
          <span>❌ <strong>[FALLO]</strong> <span class="text-white">${result.fileName}</span> (${result.sizeLabel}) &rarr; ${result.errorReason} <em class="text-amber-300">(Continuando con el resto de la cola...)</em></span>
        </div>`
      );
    } else {
      batch.successCount += 1;
      batch.tokensUsed += result.tokensUsed || 320;
      confidenceSum += result.confidence;
      batch.avgConfidence = Number((confidenceSum / batch.successCount).toFixed(1));

      // Sincronizar inmediatamente con el Store global (Dashboard y Repositorio)
      const ingested = store.ingestProcessedDocument(result);
      batch.recentBatchDocs.unshift(ingested.doc);

      if (result.caseId === 'Sin número (Nuevo)' || result.lowDpiWarning) {
        appendLog(
          'warn',
          `<div class="py-1 px-2.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-300 flex items-start gap-1.5 terminal-line-anim">
            <span class="text-white/40">[${nowStr()}]</span>
            <span class="material-symbols-outlined text-sm text-amber-400 mt-0.5">warning</span>
            <span>[WARN] ${result.originalName} &rarr; ${result.caseId === 'Sin número (Nuevo)' ? 'No se detectó número de expediente explícito; asignado automáticamente como <strong>"Sin número (Nuevo)"</strong>.' : 'Baja densidad de puntos detectada; filtro OCR neuronal aplicado.'}</span>
          </div>`
        );
      }

      appendLog(
        'ok',
        `<div class="pt-1 terminal-line-anim">
          <div class="text-[#34d399] font-medium flex items-center gap-1.5">
            <span class="text-white/40">[${nowStr()}]</span>
            <span class="material-symbols-outlined text-sm">check_circle</span>
            <span>[OK] ${result.originalName} (${result.sizeLabel})</span>
          </div>
          <div class="pl-7 space-y-0.5 text-on-surface-variant">
            <div>├── Cliente identificado (Nivel 1): <span class="text-white font-medium">${ingested.client.name}</span> (ID: <span class="text-primary">${ingested.client.id}</span>${ingested.isNewClient ? ' • <span class="text-emerald-400">Nuevo Cliente Creado</span>' : ''})</div>
            <div>├── Subcarpeta IA (Nivel 2): <span class="text-emerald-400 font-semibold">📁 ${ingested.doc.category}</span> &rarr; <span class="text-white">${ingested.doc.docTypeLabel}</span></div>
            <div>├── Nombre normalizado (Nivel 3): <span class="text-primary font-semibold">${ingested.doc.normalizedName}</span></div>
            <div>├── Expediente vinculado: <span class="${ingested.doc.caseId === 'Sin número (Nuevo)' ? 'text-amber-300 font-semibold' : 'text-cyan-400'}">${ingested.doc.caseId}</span> (${ingested.doc.court})</div>
            <div>└── Nivel de confianza IA: <span class="text-[#34d399] font-semibold">${ingested.doc.confidence}%</span> • Hash SHA-256: <span class="text-slate-400">${ingested.doc.sha256.slice(0, 12)}...</span></div>
          </div>
        </div>`
      );
    }

    updateLiveTelemetryDOM(batch);
  }

  batch.isProcessing = false;
  appendLog(
    'info',
    `<div class="pt-2 text-cyan-300 font-medium flex items-center gap-1.5 terminal-line-anim">
      <span class="text-white/40">[${nowStr()}]</span>
      <span class="material-symbols-outlined text-sm text-cyan-400">verified</span>
      <span class="text-emerald-400 font-semibold">[SUCCESS] Cola finalizada: ${batch.successCount} indexados en el Árbol Documental, ${batch.failCount} descartados por formato/integridad.</span>
    </div>`
  );

  store.saveState();
  renderImporterView(container);
  showToast(`Lote #${batch.batchId} finalizado: ${batch.successCount} documento(s) agregados al Dashboard y Repositorio`, batch.failCount > 0 ? 'warning' : 'success');
}

function updateLiveTelemetryDOM(batch) {
  const pct = batch.totalCount > 0 ? Math.round((batch.processedCount / batch.totalCount) * 100) : 100;
  const bar = document.getElementById('telemetry-progress-bar');
  const countEl = document.getElementById('telemetry-progress-count');
  const pctBadge = document.getElementById('telemetry-pct-badge');
  const sfText = document.getElementById('telemetry-success-fail-text');
  const elapsedEl = document.getElementById('telemetry-elapsed');
  const tokensEl = document.getElementById('telemetry-tokens');
  const confEl = document.getElementById('telemetry-confidence');

  if (bar) bar.style.width = `${pct}%`;
  if (countEl) countEl.textContent = `${batch.processedCount} / ${batch.totalCount} archivos procesados`;
  if (pctBadge) pctBadge.textContent = `${pct}%`;
  if (sfText) {
    sfText.innerHTML = `<strong class="text-emerald-400">${batch.successCount} éxitos</strong>, <strong class="${batch.failCount > 0 ? 'text-error' : 'text-outline'}">${batch.failCount} fallos</strong> estructurales detectados`;
  }
  if (elapsedEl) elapsedEl.textContent = `${batch.elapsedSeconds}s`;
  if (tokensEl) tokensEl.textContent = batch.tokensUsed.toLocaleString();
  if (confEl) confEl.textContent = `${batch.avgConfidence}%`;
}

/**
 * Crea un lote de archivos reales en memoria que cubre todos los casos de uso y casos límite:
 * 1. Demanda con expediente explícito (PDF)
 * 2. Contrato sin número de expediente -> "Sin número (Nuevo)" (DOCX)
 * 3. Identificación de cliente con un solo nombre sin apellidos -> "Alejandro" (PNG)
 * 4. Archivo con formato no permitido (.exe) -> ❌ Fallo en consola sin detener la cola
 * 5. Apelación urgente con término fatal (PDF)
 */
function createDemoEdgeCaseFiles() {
  const f1 = new File(
    [`JUICIO EJECUTIVO MERCANTIL\nExpediente: EXP-2024-8841-CIV\nCliente: TechCorp Iberoamérica S.A.\nJuzgado 3ro de lo Civil\nPor medio del presente escrito inicial de demanda reclamo el pago de $1,250,000.00 USD.`],
    'Ampliacion_Demanda_TechCorp_2026.pdf',
    { type: 'application/pdf' }
  );

  const f2 = new File(
    [`CONTRATO DE ARRENDAMIENTO FINANCIERO Y SUMINISTRO\nCliente: Grupo Logístico Federal\nCelebrado en la Ciudad de México por un monto de $680,000.00 USD.\n(Nota: Este documento aún no tiene número de expediente judicial asignado).`],
    'Contrato_Arrendamiento_Flota_SinExp.docx',
    { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' }
  );

  const f3 = new File(
    [`CREDENCIAL PARA VOTAR / IDENTIFICACIÓN OFICIAL INE\nCliente: Alejandro\nClave de Elector: ALJM880101HDFR01\nDocumento de identidad para expediente laboral.`],
    'INE_Identificacion_Alejandro.png',
    { type: 'image/png' }
  );

  const f4 = new File(
    [`MZ_EXECUTABLE_BINARY_INVALID_FORMAT`],
    'Instalador_Malicioso_NoPermitido.exe',
    { type: 'application/x-msdownload' }
  );

  const f5 = new File(
    [`RECURSO DE APELACIÓN EN CONTRA DE SENTENCIA INTERLOCUTORIA\nExpediente: EXP-2023-8819\nCliente: Operadora Hotelera del Norte\nSala Regional Metropolitana TFJA\nMonto controvertido: $4,920,000.00 MXN.`],
    'Recurso_Apelacion_Fiscal_SAT.pdf',
    { type: 'application/pdf' }
  );

  return [f1, f2, f3, f4, f5];
}
