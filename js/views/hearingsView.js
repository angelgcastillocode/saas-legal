/**
 * Vista Dedicada: Agenda Judicial de Audiencias, Términos Fatales y Preparación con IA
 */

import { store } from '../store/state.js';
import { showToast } from '../components/globalSearchModal.js';

export function renderHearingsView(container) {
  const state = store.state;
  const hearings = state.hearings;

  container.innerHTML = `
    <div class="flex flex-col w-full">
      <div class="flex flex-col md:flex-row md:items-center justify-between pb-6 gap-4">
        <div>
          <div class="flex items-center gap-2 text-on-surface-variant font-mono-code text-xs uppercase tracking-wider">
            <span>AGENDA JURISDICCIONAL</span>
            <span class="text-outline">/</span>
            <span class="text-error font-semibold">PLAZOS FATALES Y COMPARECENCIAS ORALES</span>
          </div>
          <h1 class="text-2xl lg:text-3xl font-bold text-white tracking-tight mt-1">Audiencias &amp; Términos Judiciales</h1>
          <p class="text-sm text-on-surface-variant mt-1">
            Sincronización de citas en juzgados, salas de oralidad y asistente neuronal para guiones de audiencia.
          </p>
        </div>
        <button id="new-hearing-btn" type="button" class="px-4 py-2.5 rounded-xl bg-primary-container hover:bg-primary text-white text-sm font-semibold shadow-lg shadow-primary/25 flex items-center gap-2 self-start md:self-auto">
          <span class="material-symbols-outlined text-lg">event_upcoming</span>
          <span>Agendar Audiencia</span>
        </button>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <!-- Left 7 Cols: Hearings List -->
        <div class="lg:col-span-7 flex flex-col gap-4">
          ${hearings.map(h => {
            const isCrit = h.urgency === 'critical';
            return `
              <div class="bg-surface-container-low border ${isCrit ? 'border-error/40' : 'border-outline-variant'} rounded-2xl p-5 relative overflow-hidden shadow-lg">
                <div class="absolute left-0 top-0 bottom-0 w-1.5 ${isCrit ? 'bg-error' : 'bg-amber-400'}"></div>
                <div class="flex items-start justify-between gap-3 pl-2 mb-3">
                  <div>
                    <div class="flex items-center gap-2 flex-wrap">
                      <span class="font-mono-code text-xs text-primary font-bold">${h.caseId}</span>
                      <span class="px-2 py-0.5 rounded bg-surface-container text-xs text-on-surface-variant">${h.clientName}</span>
                      <span class="px-2 py-0.5 rounded bg-white/5 text-xs text-slate-300 font-mono-code">${h.matter}</span>
                    </div>
                    <h3 class="text-base font-bold text-white mt-1">${h.title}</h3>
                  </div>
                  <span class="px-2.5 py-1 rounded-full ${isCrit ? 'bg-error text-white animate-pulse' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'} font-mono-code text-xs font-semibold shrink-0">
                    ${h.timeBadge}
                  </span>
                </div>

                <div class="pl-2 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-on-surface-variant bg-surface-container-lowest/80 border border-outline-variant p-3 rounded-xl mb-3">
                  <div><strong class="text-white">Juez / Autoridad:</strong> ${h.judge}</div>
                  <div><strong class="text-white">Sala / Juzgado:</strong> ${h.courtroom}</div>
                  <div class="sm:col-span-2 text-slate-300 mt-1">${h.notes || 'Comparecencia con expediente digital disponible en el Visor Web.'}</div>
                </div>

                <div class="pl-2 flex items-center justify-end gap-2">
                  <button type="button" data-ai-script="${h.id}" class="px-3.5 py-1.5 rounded-xl bg-primary-container hover:bg-primary text-white text-xs font-semibold flex items-center gap-1.5">
                    <span class="material-symbols-outlined text-sm">psychology</span>
                    <span>Generar Guion de Audiencia IA</span>
                  </button>
                </div>
              </div>
            `;
          }).join('')}
        </div>

        <!-- Right 5 Cols: AI Hearing Prep Assistant -->
        <div class="lg:col-span-5 bg-surface-container-low border border-outline-variant rounded-2xl p-6 shadow-xl sticky top-20">
          <div class="flex items-center gap-2.5 pb-4 mb-4 border-b border-outline-variant">
            <div class="w-9 h-9 rounded-xl bg-primary/15 border border-primary/30 text-primary flex items-center justify-center">
              <span class="material-symbols-outlined text-xl">psychology</span>
            </div>
            <div>
              <h3 class="text-base font-bold text-white">Copiloto de Sala Oral IA</h3>
              <p class="text-xs text-on-surface-variant">Síntesis estratégica y documentos listos para juzgado</p>
            </div>
          </div>

          <div id="hearing-ai-prep-box" class="space-y-3 text-xs">
            <div class="p-3.5 rounded-xl bg-surface-container-lowest border border-primary/30">
              <span class="font-mono-code text-[11px] text-primary font-semibold uppercase block mb-1">Audiencia Seleccionada</span>
              <div class="text-sm font-bold text-white">${hearings[0]?.title || 'Audiencia Preliminar'} (${hearings[0]?.caseId || 'EXP-2023-4110'})</div>
              <p class="text-on-surface-variant mt-1">${hearings[0]?.courtroom || ''}</p>
            </div>

            <div class="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant space-y-2 leading-relaxed text-slate-200 font-mono-code">
              <div class="text-emerald-400 font-bold">1. ACREDITACIÓN DE PERSONALIDAD</div>
              <p>Exhibir Poder General apostillado desde el Visor Web Integrado y solicitar reconocimiento de autorizados.</p>
              <div class="text-emerald-400 font-bold pt-2">2. DEPURACIÓN Y EXCEPCIONES</div>
              <p>Desestimar la excepción de incompetencia invocando la sumisión expresa pactada en los pagarés base de la acción.</p>
              <div class="text-emerald-400 font-bold pt-2">3. ADMISIÓN DE PRUEBAS</div>
              <p>Solicitar admisión de la documental privada (Contrato Original de 12 fojas) y pericial contable.</p>
            </div>

            <button id="open-court-viewer-btn" type="button" class="w-full py-2.5 rounded-xl bg-surface-container-high hover:bg-primary text-white font-semibold text-xs border border-white/10 transition-all flex items-center justify-center gap-2">
              <span class="material-symbols-outlined text-base">folder_open</span>
              <span>Abrir Repositorio para Consulta en Juzgado</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  `;

  document.getElementById('open-court-viewer-btn')?.addEventListener('click', () => {
    store.setRoute('documentos');
  });

  container.querySelectorAll('[data-ai-script]').forEach(btn => {
    btn.addEventListener('click', () => {
      const hId = btn.getAttribute('data-ai-script');
      const h = hearings.find(item => item.id === hId);
      if (!h) return;
      const box = document.getElementById('hearing-ai-prep-box');
      if (box) {
        box.innerHTML = `
          <div class="p-3.5 rounded-xl bg-surface-container-lowest border border-primary/40">
            <span class="font-mono-code text-[11px] text-emerald-400 font-semibold uppercase block mb-1">✓ Guion Generado por Legal-LLM v4</span>
            <div class="text-sm font-bold text-white">${h.title} (${h.caseId})</div>
            <p class="text-on-surface-variant mt-1">${h.judge} • ${h.courtroom}</p>
          </div>
          <div class="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant space-y-2 leading-relaxed text-slate-200 font-mono-code">
            <div class="text-primary font-bold">● APERTURA DE AUDIENCIA (${h.matter.toUpperCase()})</div>
            <p>"Con su venia, Señoría. Comparece la representación de ${h.clientName} dentro de los autos del expediente ${h.caseId}..."</p>
            <div class="text-primary font-bold pt-2">● PUNTO MEDULAR DE DEBATE</div>
            <p>${h.notes}</p>
            <div class="text-emerald-400 font-bold pt-2">● PIEZAS DE AUTOS VINCULADAS</div>
            <p>Todos los archivos normalizados están disponibles offline/online en el Visor Web del Repositorio.</p>
          </div>
        `;
        showToast(`Guion estratégico preparado para ${h.caseId}`, 'success');
      }
    });
  });

  document.getElementById('new-hearing-btn')?.addEventListener('click', () => {
    const title = prompt('Título de la Audiencia o Término Procesal:', 'Audiencia de Desahogo de Pruebas y Alegatos');
    if (!title) return;
    const caseId = prompt('Expediente vinculado:', 'EXP-2024-8841-CIV') || 'EXP-2024-8841-CIV';
    store.addHearing({
      title,
      caseId,
      clientName: 'TechCorp Iberoamérica S.A.',
      timeBadge: 'En 48 horas',
      judge: 'Juez 3º de lo Civil',
      courtroom: 'Sala de Oralidad No. 2',
      urgency: 'critical',
      matter: 'Mercantil',
      notes: 'Comparecencia programada desde el módulo de Agenda Judicial.'
    });
    showToast('Nueva audiencia registrada en la Agenda Judicial', 'success');
    renderHearingsView(container);
  });
}
