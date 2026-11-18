/**
 * Vista Dedicada: Panel de Ajustes para IA, API Keys y Sistema Local
 * Permite alternar entre extracción Híbrida Local (PDF.js + Mammoth + Regex)
 * y extracción con IA Real (Gemini API / OpenRouter / Endpoint Local),
 * además de configurar la nomenclatura estandarizada y restaurar los datos demo.
 */

import { store } from '../store/state.js';
import { showToast } from '../components/globalSearchModal.js';

export function renderSettingsView(container) {
  const ai = store.state.aiSettings;

  container.innerHTML = `
    <div class="flex flex-col w-full max-w-5xl mx-auto">
      <div class="flex flex-col md:flex-row md:items-center justify-between pb-6 gap-4">
        <div>
          <div class="flex items-center gap-2 text-on-surface-variant font-mono-code text-xs uppercase tracking-wider">
            <span>CONFIGURACIÓN DEL NÚCLEO</span>
            <span class="text-outline">/</span>
            <span class="text-primary font-semibold">MOTOR DE EXTRACCIÓN IA &amp; BÓVEDA LOCAL</span>
          </div>
          <h1 class="text-2xl lg:text-3xl font-bold text-white tracking-tight mt-1">Ajustes de Inteligencia Artificial &amp; OCR</h1>
          <p class="text-sm text-on-surface-variant mt-1">
            Alterna entre el motor híbrido local (PDF.js / Mammoth + Regex Jurídico) y la conexión en vivo mediante API Key (Gemini, OpenRouter o LLM Local).
          </p>
        </div>
        <button id="reset-demo-data-btn" type="button" class="px-4 py-2 rounded-xl bg-error/15 hover:bg-error/25 text-error border border-error/30 text-xs font-semibold flex items-center gap-1.5 self-start md:self-auto transition-all">
          <span class="material-symbols-outlined text-base">restart_alt</span>
          <span>Restaurar Datos Demo de Fábrica</span>
        </button>
      </div>

      <form id="ai-settings-form" class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <!-- Left 7 Cols: Engine Mode & API Key -->
        <div class="lg:col-span-7 flex flex-col gap-5 bg-surface-container-low border border-outline-variant rounded-2xl p-6 shadow-xl">
          <h2 class="text-base font-bold text-white flex items-center gap-2">
            <span class="material-symbols-outlined text-primary">memory</span>
            <span>Modo de Operación del Importador Zero-Touch</span>
          </h2>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label class="p-4 rounded-xl border ${ai.mode === 'hybrid' ? 'bg-primary/10 border-primary text-white' : 'bg-surface-container-lowest border-white/10 text-on-surface-variant'} cursor-pointer transition-all">
              <div class="flex items-center gap-2 mb-1">
                <input type="radio" name="aiMode" value="hybrid" ${ai.mode === 'hybrid' ? 'checked' : ''} class="accent-primary" />
                <span class="text-sm font-bold text-white">Híbrido en Cliente (Recomendado)</span>
              </div>
              <p class="text-xs text-on-surface-variant leading-relaxed">
                Extrae el texto real con PDF.js y Mammoth en tu navegador + Regex Jurídico instantáneo sin requerir API Key.
              </p>
            </label>

            <label class="p-4 rounded-xl border ${ai.mode === 'api' ? 'bg-primary/10 border-primary text-white' : 'bg-surface-container-lowest border-white/10 text-on-surface-variant'} cursor-pointer transition-all">
              <div class="flex items-center gap-2 mb-1">
                <input type="radio" name="aiMode" value="api" ${ai.mode === 'api' ? 'checked' : ''} class="accent-primary" />
                <span class="text-sm font-bold text-white">Conexión API Key en Vivo</span>
              </div>
              <p class="text-xs text-on-surface-variant leading-relaxed">
                Envía el texto extraído del documento a Gemini, OpenRouter o tu servidor LLM local con fallback automático.
              </p>
            </label>
          </div>

          <div class="space-y-4 pt-2 border-t border-white/10">
            <div>
              <label class="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1.5">Proveedor de IA</label>
              <select id="set-provider" class="w-full rounded-xl bg-surface-container-lowest border border-white/15 text-white text-sm px-3.5 py-2.5 focus:border-primary focus:outline-none">
                <option value="gemini" ${ai.provider === 'gemini' ? 'selected' : ''}>Google Gemini API (gemini-2.5-flash / gemini-2.5-pro)</option>
                <option value="openrouter" ${ai.provider === 'openrouter' ? 'selected' : ''}>OpenRouter API (Claude / GPT-4o / Llama 3 / Gemini)</option>
                <option value="local" ${ai.provider === 'local' ? 'selected' : ''}>Endpoint Local Compatible con OpenAI (Ollama / LM Studio)</option>
              </select>
            </div>

            <div>
              <label class="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1.5">API Key (Se guarda únicamente en tu localStorage local)</label>
              <div class="relative">
                <input id="set-apikey" type="password" value="${ai.apiKey || ''}" placeholder="AIzaSy... o sk-or-v1-..." class="w-full rounded-xl bg-surface-container-lowest border border-white/15 text-white font-mono-code text-sm pl-3.5 pr-20 py-2.5 focus:border-primary focus:outline-none" />
                <button id="toggle-key-vis-btn" type="button" class="absolute right-2.5 top-1/2 -translate-y-1/2 px-2 py-1 rounded text-xs font-mono-code text-primary hover:bg-white/5">
                  Mostrar
                </button>
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1.5">Modelo Preferido</label>
                <input id="set-model" type="text" value="${ai.modelName || 'gemini-2.5-flash'}" class="w-full rounded-xl bg-surface-container-lowest border border-white/15 text-white font-mono-code text-sm px-3.5 py-2.5 focus:border-primary focus:outline-none" />
              </div>
              <div>
                <label class="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1.5">Endpoint Local (Opcional)</label>
                <input id="set-endpoint" type="text" value="${ai.localEndpoint || 'http://localhost:11434/v1/chat/completions'}" class="w-full rounded-xl bg-surface-container-lowest border border-white/15 text-white font-mono-code text-sm px-3.5 py-2.5 focus:border-primary focus:outline-none" />
              </div>
            </div>
          </div>

          <div class="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
            <button type="submit" class="px-5 py-2.5 rounded-xl bg-primary-container hover:bg-primary text-white text-sm font-semibold shadow-lg shadow-primary/25 flex items-center gap-2 transition-all">
              <span class="material-symbols-outlined text-lg">save</span>
              <span>Guardar Configuración IA</span>
            </button>
          </div>
        </div>

        <!-- Right 5 Cols: Hierarchy & Naming Rules -->
        <div class="lg:col-span-5 flex flex-col gap-5">
          <div class="bg-surface-container-low border border-outline-variant rounded-2xl p-6 shadow-xl space-y-4">
            <h2 class="text-base font-bold text-white flex items-center gap-2">
              <span class="material-symbols-outlined text-emerald-400">account_tree</span>
              <span>Reglas del Repositorio &amp; Normalización</span>
            </h2>

            <div class="p-3.5 rounded-xl bg-surface-container-lowest border border-white/10 text-xs space-y-2">
              <div class="text-primary font-semibold uppercase tracking-wider">Arquitectura en Árbol Activa</div>
              <div class="font-mono-code text-slate-300 space-y-1">
                <div>├── <strong>Nivel 1:</strong> Carpeta por Cliente ([Nombre])</div>
                <div>├── <strong>Nivel 2:</strong> Subcarpetas por Tipo IA (Demandas, Apelaciones, Audiencias, Contratos, Identificaciones...)</div>
                <div>└── <strong>Nivel 3:</strong> Archivo Normalizado</div>
              </div>
            </div>

            <div>
              <label class="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1.5">Patrón de Nomenclatura Estandarizada</label>
              <input type="text" readonly value="[Tipo]_[Fecha]_[NombreOriginal].ext" class="w-full rounded-xl bg-surface-container-lowest border border-emerald-500/30 text-emerald-400 font-mono-code text-xs px-3.5 py-2.5" />
            </div>

            <div>
              <div class="flex justify-between text-xs mb-1">
                <span class="text-on-surface-variant font-semibold uppercase">Umbral de Alerta de Confianza Baja</span>
                <span id="threshold-val-label" class="font-mono-code text-primary font-bold">${ai.lowConfidenceThreshold}%</span>
              </div>
              <input id="set-threshold" type="range" min="75" max="98" value="${ai.lowConfidenceThreshold}" class="w-full accent-primary cursor-pointer" />
              <p class="text-[11px] text-outline mt-1">Si un documento tiene menor confianza, mostrará aviso para reclasificarlo con Drag &amp; Drop.</p>
            </div>
          </div>
        </div>
      </form>
    </div>
  `;

  const keyInput = document.getElementById('set-apikey');
  document.getElementById('toggle-key-vis-btn')?.addEventListener('click', function () {
    if (!keyInput) return;
    if (keyInput.type === 'password') {
      keyInput.type = 'text';
      this.textContent = 'Ocultar';
    } else {
      keyInput.type = 'password';
      this.textContent = 'Mostrar';
    }
  });

  const thresholdRange = document.getElementById('set-threshold');
  const thresholdLabel = document.getElementById('threshold-val-label');
  thresholdRange?.addEventListener('input', () => {
    if (thresholdLabel) thresholdLabel.textContent = `${thresholdRange.value}%`;
  });

  document.getElementById('ai-settings-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const selectedMode = container.querySelector('input[name="aiMode"]:checked')?.value || 'hybrid';
    store.updateAISettings({
      mode: selectedMode,
      provider: document.getElementById('set-provider')?.value || 'gemini',
      apiKey: keyInput?.value.trim() || '',
      modelName: document.getElementById('set-model')?.value.trim() || 'gemini-2.5-flash',
      localEndpoint: document.getElementById('set-endpoint')?.value.trim() || 'http://localhost:11434/v1/chat/completions',
      lowConfidenceThreshold: Number(thresholdRange?.value || 90)
    });
    showToast('Configuración de IA y Nomenclatura guardada en local', 'success');
    renderSettingsView(container);
  });

  document.getElementById('reset-demo-data-btn')?.addEventListener('click', async () => {
    if (confirm('¿Deseas restaurar todos los Clientes, Expedientes y Documentos de demostración a su estado original?')) {
      await store.resetToDemoDefaults();
      showToast('Datos de demostración restaurados correctamente', 'info');
      store.setRoute('dashboard');
    }
  });
}
