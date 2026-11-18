/**
 * Vista Completa de Autenticación y Registro — SaaS Legal ("The Sovereign Vault" v2.4 AI)
 * Construida tomando como referencia exacta la plantilla de Autenticación y Registro de Stitch:
 * - Toast Flash Superior de Telemetría del Servidor
 * - Contenedor Maestro Bento / Split Auth Card (5/12 Branding + Telemetría en vivo + Imagen | 7/12 Tabs Login & Registro)
 * - Pill Switcher (Iniciar Sesión / Crear Cuenta Jurídica)
 * - Switch de visibilidad de contraseña, Spinner de carga de 2.5s, Acceso Rápido por Rol / e.firma PJF
 * - Registro con validación en vivo de teléfono a 10 dígitos, Medidor de Fortaleza de Contraseña de 3 barras y verificación de coincidencia
 * - Incluye conmutador entre Tema Oscuro (Fidelity Dark) y Tema Claro (idéntico al color de la plantilla de referencia)
 */

import { DEMO_USERS } from '../store/mockData.js';
import { store } from '../store/state.js';
import { showToast } from '../components/globalSearchModal.js';

export function renderLoginScreen(container) {
  if (!container) return;

  const isLight = store.state.loginTheme === 'light';
  const currentUser = store.state.currentUser || DEMO_USERS[0];

  // Clases adaptativas para soportar tanto el Tema Oscuro de SaaS Legal como el Tema Claro exacto de la plantilla de referencia
  const pageBg = isLight ? 'bg-[#f0f3ff] text-[#111c2d]' : 'bg-[#0b0e14] text-[#f1f5f9]';
  const toastBg = isLight
    ? 'bg-white border border-[#c1c6d5]/60 shadow-md text-[#111c2d]'
    : 'bg-surface-container-low border border-white/10 shadow-xl text-white';
  const cardBg = isLight
    ? 'bg-white border border-[#c1c6d5]/50 shadow-2xl'
    : 'bg-surface-container-lowest border border-white/10 shadow-2xl';
  const leftColBg = isLight
    ? 'bg-[#e7eeff] text-[#111c2d]'
    : 'bg-surface-container-low text-white border-b lg:border-b-0 lg:border-r border-white/10';
  const subCardBg = isLight
    ? 'bg-white/90 border border-[#c1c6d5]/40 shadow-sm'
    : 'bg-surface-container-lowest/90 border border-white/10 shadow-sm';
  const miniBoxBg = isLight
    ? 'bg-[#e7eeff] text-[#111c2d]'
    : 'bg-surface-container text-white border border-white/5';
  const pillTrackBg = isLight
    ? 'bg-[#e7eeff]'
    : 'bg-surface-container-low border border-white/10';
  const inputClasses = isLight
    ? 'bg-[#f0f3ff] focus:bg-white text-[#111c2d] ring-1 ring-inset ring-[#c1c6d5]/80 focus:ring-2 focus:ring-[#004e9f] placeholder:text-[#727784]'
    : 'bg-surface-container-low focus:bg-surface-container text-white ring-1 ring-inset ring-white/15 focus:ring-2 focus:ring-primary placeholder:text-outline';
  const mutedText = isLight ? 'text-[#414753]' : 'text-on-surface-variant';
  const outlineText = isLight ? 'text-[#727784]' : 'text-outline';
  const headingText = isLight ? 'text-[#111c2d]' : 'text-white';
  const primaryBtn = isLight
    ? 'bg-[#004e9f] hover:bg-[#00458e] text-white'
    : 'bg-primary-container hover:bg-primary text-white shadow-[0_0_20px_rgba(25,120,229,0.35)]';

  container.innerHTML = `
    <div class="${pageBg} font-sans min-h-screen flex items-center justify-center p-4 sm:p-6 transition-colors duration-300">
      <div class="flex flex-col w-full items-center justify-center py-4 px-1 sm:px-4">

        <!-- Toast Notificación Flash de Servidor Legal Sovereign-01 -->
        <div class="w-full max-w-2xl mb-5 ${toastBg} rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-3 transition-all duration-300" id="flash-toast">
          <div class="flex items-center space-x-3">
            <span class="flex h-9 w-9 items-center justify-center rounded-lg ${isLight ? 'bg-[#e7eeff] text-[#004e9f]' : 'bg-primary/15 text-primary border border-primary/30'}">
              <span class="material-symbols-outlined text-[20px]">verified_user</span>
            </span>
            <div>
              <p class="text-xs ${isLight ? 'text-[#004e9f]' : 'text-primary'} font-bold tracking-wide uppercase font-mono-code">
                Servidor Sovereign-01 • Telemetría Judicial
              </p>
              <p class="text-xs ${mutedText}">
                Conexión cifrada activa TLS 1.3 • Bóveda Legal Zero-Touch en línea
              </p>
            </div>
          </div>
          <div class="flex items-center space-x-2">
            <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium ${isLight ? 'bg-emerald-100 text-emerald-800' : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'}">
              <span class="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Nodo Activo
            </span>
            <button id="toggle-auth-theme-btn" type="button" class="px-2.5 py-1 rounded-lg text-[11px] font-mono-code font-semibold ${isLight ? 'bg-[#e7eeff] text-[#004e9f] hover:bg-[#d8e3fb]' : 'bg-surface-container-highest text-primary hover:text-white border border-white/10'} flex items-center gap-1 transition-colors" title="Alternar entre Tema Oscuro y Tema Claro de la plantilla">
              <span class="material-symbols-outlined text-[15px]">${isLight ? 'dark_mode' : 'light_mode'}</span>
              <span>${isLight ? 'Modo Oscuro' : 'Modo Claro'}</span>
            </button>
            <button id="close-flash-toast-btn" type="button" class="${outlineText} hover:opacity-80 p-1 rounded-md">
              <span class="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
        </div>

        <!-- Contenedor Maestro Bento / Split Auth Card -->
        <div class="w-full max-w-5xl ${cardBg} rounded-2xl overflow-hidden flex flex-col lg:flex-row">

          <!-- ========================================================================= -->
          <!-- LADO IZQUIERDO (5/12): Branding Institucional SaaS Legal + Telemetría IA  -->
          <!-- ========================================================================= -->
          <div class="lg:w-5/12 ${leftColBg} p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden">
            <!-- Glow ambiental decorativo -->
            <div class="absolute -top-16 -right-16 w-52 h-52 bg-primary/20 rounded-full blur-2xl pointer-events-none"></div>
            <div class="absolute -bottom-20 -left-20 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

            <div class="relative z-10">
              <!-- Insignias Oficiales Integradas: SaaS Legal & Motor v2.4 AI -->
              <div class="flex items-center justify-between gap-3 mb-6 ${subCardBg} backdrop-blur-sm p-3 rounded-xl">
                <!-- SaaS Legal -->
                <div class="flex items-center space-x-2.5">
                  <div class="h-10 w-10 rounded-lg ${isLight ? 'bg-[#004e9f]' : 'bg-primary-container'} flex items-center justify-center text-white shadow-sm">
                    <span class="material-symbols-outlined text-[22px]">balance</span>
                  </div>
                  <div>
                    <p class="text-xs ${isLight ? 'text-[#004e9f]' : 'text-primary'} font-bold leading-tight">SAAS LEGAL</p>
                    <p class="text-[11px] ${outlineText}">The Sovereign Vault</p>
                  </div>
                </div>

                <div class="h-8 w-px ${isLight ? 'bg-[#c1c6d5]' : 'bg-white/10'}"></div>

                <!-- Motor Zero-Touch IA -->
                <div class="flex items-center space-x-2.5">
                  <div class="h-10 w-10 rounded-lg bg-[#007286] flex items-center justify-center text-white shadow-sm">
                    <span class="material-symbols-outlined text-[22px]">document_scanner</span>
                  </div>
                  <div>
                    <p class="text-xs ${isLight ? 'text-[#007286]' : 'text-cyan-400'} font-bold leading-tight font-mono-code">ZERO-TOUCH IA</p>
                    <p class="text-[11px] ${outlineText}">Motor OCR v2.4</p>
                  </div>
                </div>
              </div>

              <!-- Título Institucional y Lema Oficial -->
              <div class="space-y-2 mb-6">
                <div class="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md ${isLight ? 'bg-[#d7e3ff] text-[#001b3e]' : 'bg-primary/15 text-primary border border-primary/30'} text-[11px] font-semibold tracking-wide uppercase">
                  <span class="material-symbols-outlined text-[14px]">assured_workload</span>
                  <span>Plataforma Corporativa de Litigio</span>
                </div>
                <h1 class="text-2xl sm:text-[26px] ${headingText} font-extrabold tracking-tight leading-tight">
                  Ventanilla Jurídica Digital
                </h1>
                <p class="text-sm ${mutedText} font-medium leading-relaxed">
                  Importador Masivo Zero-Touch, Clasificación Documental Autónoma y Visor Remoto para Juzgados.
                </p>
              </div>

              <!-- Indicador Estado del Motor IA en Directo -->
              <div class="${subCardBg} p-4 rounded-xl space-y-3 mb-6">
                <div class="flex items-center justify-between">
                  <span class="text-[11px] ${mutedText} font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <span class="material-symbols-outlined text-[16px] ${isLight ? 'text-[#004e9f]' : 'text-primary'}">memory</span>
                    Pipeline Neuronal OCR
                  </span>
                  <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold ${isLight ? 'bg-emerald-100 text-emerald-800' : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'}">
                    <span class="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                    99.8% Precisión
                  </span>
                </div>

                <!-- Micro Gráfica de Capacidad de Ingesta -->
                <div class="space-y-1.5">
                  <div class="flex justify-between text-[12px] font-medium ${mutedText}">
                    <span>Bóveda Documental Indexada</span>
                    <span class="font-bold font-mono-code ${headingText}">84.5% Capacidad</span>
                  </div>
                  <div class="w-full ${isLight ? 'bg-[#d8e3fb]' : 'bg-surface-container-highest'} h-2 rounded-full overflow-hidden">
                    <div class="${isLight ? 'bg-[#004e9f]' : 'bg-primary'} h-full rounded-full transition-all duration-500" style="width: 84.5%;"></div>
                  </div>
                </div>

                <div class="grid grid-cols-2 gap-2 pt-1 text-[11px] ${mutedText}">
                  <div class="${miniBoxBg} p-2 rounded-lg flex items-center space-x-2">
                    <span class="material-symbols-outlined text-[16px] ${isLight ? 'text-[#006398]' : 'text-primary'}">account_tree</span>
                    <div class="min-w-0">
                      <p class="${outlineText} text-[10px]">Árbol Repositorio</p>
                      <p class="font-semibold ${headingText} truncate">Cliente → Tipo → Doc</p>
                    </div>
                  </div>
                  <div class="${miniBoxBg} p-2 rounded-lg flex items-center space-x-2">
                    <span class="material-symbols-outlined text-[16px] ${isLight ? 'text-[#005868]' : 'text-emerald-400'}">gavel</span>
                    <div class="min-w-0">
                      <p class="${outlineText} text-[10px]">Expedientes Activos</p>
                      <p class="font-semibold ${headingText} truncate">428 Sincronizados</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Imagen institucional temática de centro de mando y telemetría -->
            <div class="relative rounded-xl overflow-hidden h-36 bg-surface-variant mt-2 shadow-sm border border-white/10">
              <img
                class="w-full h-full object-cover brightness-95 contrast-105"
                alt="Centro de Mando y Telemetría Jurídica"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA-SoOel4IuGUTdqwtoojLZTb3H4zxiejUPlJDOMvhnIMm0Rh5HOL3197r2r8g1tw1E6MY2UWkF98Fg8BsO3fhb8ICwNxxELTD1wMQWYtf2GaRoFxw98f1mBDEGcZn356hdov4JsE8l91X-dTJ0lvi5F21an5Nv7Kp4qc3u-svhuTN5U-DBZLTisNypVWCaS_8RQc7kCi0YQbIL3idh-v6pYYFFjKT-DJss6qje_Qi_"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-[#002f64]/90 via-[#002f64]/30 to-transparent flex items-end p-3">
                <p class="text-white text-[12px] font-medium flex items-center gap-1.5">
                  <span class="material-symbols-outlined text-[16px] text-cyan-300">sensors</span>
                  Telemetría y Clasificación Automatizada SaaS Legal v2.4
                </p>
              </div>
            </div>

            <div class="pt-4 text-center lg:text-left">
              <p class="text-[11px] ${outlineText}">
                © 2026 SaaS Legal • The Sovereign Vault. Todos los derechos reservados.
              </p>
            </div>
          </div>

          <!-- ========================================================================= -->
          <!-- LADO DERECHO (7/12): Tarjetas Interactivas de Autenticación (Login & Reg) -->
          <!-- ========================================================================= -->
          <div class="lg:w-7/12 p-6 sm:p-10 flex flex-col justify-center">

            <!-- Selector de Pestañas Tipo Pill Switch -->
            <div class="flex p-1 ${pillTrackBg} rounded-xl mb-6 shadow-inner">
              <button
                type="button"
                id="tab-login"
                class="flex-1 py-2.5 px-4 rounded-lg text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all duration-200 ${isLight ? 'bg-white text-[#004e9f] shadow-sm' : 'bg-primary-container text-white shadow-sm'}"
              >
                <span class="material-symbols-outlined text-[18px]">lock</span>
                Iniciar Sesión
              </button>
              <button
                type="button"
                id="tab-register"
                class="flex-1 py-2.5 px-4 rounded-lg text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-200 ${mutedText} hover:${headingText}"
              >
                <span class="material-symbols-outlined text-[18px]">person_add</span>
                Crear Cuenta Jurídica
              </button>
            </div>

            <!-- ============================================ -->
            <!-- PANEL 1: INICIAR SESIÓN (LOGIN)              -->
            <!-- ============================================ -->
            <div class="space-y-4 transition-opacity duration-200" id="panel-login">
              <div>
                <h2 class="text-xl ${headingText} font-bold">Bienvenido a la Plataforma SaaS Legal</h2>
                <p class="text-xs sm:text-sm ${mutedText} mt-1">
                  Ingresa con tu cuenta corporativa del despacho o selecciona un perfil de demostración rápida.
                </p>
              </div>

              <!-- Selector Rápido de Rol de Demostración (Autocompleta o Entra en 1-Clic) -->
              <div class="p-3 rounded-xl ${isLight ? 'bg-[#f0f3ff] border border-[#c1c6d5]/60' : 'bg-surface-container-low border border-white/10'} space-y-2">
                <div class="flex items-center justify-between">
                  <span class="text-[11px] font-mono-code uppercase tracking-wider font-bold ${isLight ? 'text-[#004e9f]' : 'text-primary'}">
                    ⚡ Acceso Rápido Demo (Selecciona Rol):
                  </span>
                  <span class="text-[11px] ${outlineText}">Autocompleta credenciales</span>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  ${DEMO_USERS.map(u => `
                    <button
                      type="button"
                      data-quick-role="${u.id}"
                      class="p-2 rounded-lg border text-left transition-all flex items-center gap-2 ${currentUser.id === u.id
                        ? (isLight ? 'bg-white border-[#004e9f] shadow-sm' : 'bg-primary/15 border-primary text-white')
                        : (isLight ? 'bg-white/60 border-transparent hover:bg-white' : 'bg-surface-container-lowest border-white/5 hover:border-white/20')}"
                    >
                      <img src="${u.avatar}" alt="${u.name}" class="w-7 h-7 rounded-full object-cover shrink-0" />
                      <div class="min-w-0">
                        <div class="text-[11px] font-bold ${headingText} truncate">${u.name.split(' ').slice(0, 2).join(' ')}</div>
                        <div class="text-[10px] ${outlineText} truncate">${u.roleTitle.split(' ')[0]}</div>
                      </div>
                    </button>
                  `).join('')}
                </div>
              </div>

              <form class="space-y-4" id="form-login">
                <!-- Campo Correo -->
                <div class="space-y-1.5">
                  <label class="text-xs ${headingText} font-semibold flex items-center justify-between">
                    <span>Correo Electrónico</span>
                    <span class="text-[11px] ${outlineText} font-normal">Corporativo o Judicial</span>
                  </label>
                  <div class="relative flex items-center">
                    <span class="material-symbols-outlined absolute left-3.5 ${outlineText} text-[20px] pointer-events-none">alternate_email</span>
                    <input
                      class="w-full ${inputClasses} text-sm rounded-lg pl-11 pr-4 py-3 border-0 outline-none transition-all"
                      id="login-email"
                      placeholder="abogado@sovereignvault.legal"
                      required
                      type="email"
                      value="${currentUser.email}"
                    />
                  </div>
                </div>

                <!-- Campo Contraseña con Switch de Ojo -->
                <div class="space-y-1.5">
                  <div class="flex items-center justify-between">
                    <label class="text-xs ${headingText} font-semibold">Contraseña</label>
                    <button
                      id="forgot-pass-btn"
                      type="button"
                      class="text-xs ${isLight ? 'text-[#004e9f]' : 'text-primary'} hover:underline font-semibold"
                    >
                      ¿Olvidaste tu contraseña?
                    </button>
                  </div>
                  <div class="relative flex items-center">
                    <span class="material-symbols-outlined absolute left-3.5 ${outlineText} text-[20px] pointer-events-none">key</span>
                    <input
                      class="w-full ${inputClasses} text-sm rounded-lg pl-11 pr-11 py-3 border-0 outline-none transition-all"
                      id="login-password"
                      placeholder="••••••••••••"
                      required
                      type="password"
                      value="VaultLegal2026#"
                    />
                    <button
                      id="toggle-login-pass-btn"
                      class="absolute right-3 ${outlineText} hover:${headingText} p-1 rounded-md transition-colors"
                      title="Mostrar u ocultar contraseña"
                      type="button"
                    >
                      <span class="material-symbols-outlined text-[20px]" id="login-eye-icon">visibility</span>
                    </button>
                  </div>
                </div>

                <!-- Opciones de Sesión -->
                <div class="flex items-center justify-between pt-1">
                  <label class="flex items-center space-x-2 cursor-pointer select-none">
                    <input checked class="h-4 w-4 rounded text-primary focus:ring-primary accent-primary" type="checkbox" />
                    <span class="text-xs sm:text-sm ${mutedText}">Mantener sesión activa en este equipo</span>
                  </label>
                </div>

                <!-- Botón Iniciar Sesión con Estado Dinámico Loading -->
                <div class="pt-1">
                  <button
                    class="w-full ${primaryBtn} py-3 px-5 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center justify-center space-x-2 cursor-pointer"
                    id="btn-login-submit"
                    type="submit"
                  >
                    <span class="flex items-center gap-2" id="btn-login-text">
                      <span class="material-symbols-outlined text-[20px]">login</span>
                      <span>Iniciar Sesión en SaaS Legal</span>
                    </span>
                    <!-- Spinner de carga oculto por defecto -->
                    <span class="hidden items-center gap-2" id="btn-login-spinner">
                      <svg class="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" d="M4 12a8 8 0 018-8v8H4z" fill="currentColor"></path>
                      </svg>
                      <span>Verificando credenciales en Servidor Sovereign-01...</span>
                    </span>
                  </button>
                </div>

                <!-- Demostración interactiva de estado "Loading" -->
                <div class="flex items-center justify-center pt-1">
                  <button
                    id="simulate-spinner-only-btn"
                    class="text-[12px] font-medium ${outlineText} hover:text-primary transition-colors flex items-center gap-1"
                    type="button"
                  >
                    <span class="material-symbols-outlined text-[14px]">cached</span>
                    <span>Probar simulación de estado de carga (Spinner 2.0s)</span>
                  </button>
                </div>
              </form>

              <!-- Acceso Directo Alternativo por Llave / e.firma Judicial -->
              <div class="mt-5 pt-4 border-t ${isLight ? 'border-[#d8e3fb]' : 'border-white/10'} flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
                <div class="flex items-center space-x-2 ${mutedText}">
                  <span class="material-symbols-outlined text-primary text-[22px]">contactless</span>
                  <span class="text-[13px] font-medium">¿Cuentas con firma electrónica FIEL (e.firma PJF)?</span>
                </div>
                <button
                  id="efirma-access-btn"
                  class="text-[12px] font-bold ${isLight ? 'text-[#004e9f] bg-[#d7e3ff] hover:bg-[#c1d5ff]' : 'text-primary bg-primary/15 border border-primary/30 hover:bg-primary hover:text-white'} px-3.5 py-1.5 rounded-lg transition-colors"
                  type="button"
                >
                  Acceso con e.firma
                </button>
              </div>
            </div>

            <!-- ============================================ -->
            <!-- PANEL 2: REGISTRO DE CUENTA JURÍDICA         -->
            <!-- ============================================ -->
            <div class="space-y-4 hidden transition-opacity duration-200" id="panel-register">
              <div>
                <div class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${isLight ? 'bg-[#d7e3ff] text-[#001b3e]' : 'bg-primary/15 text-primary border border-primary/30'} mb-1">
                  <span class="material-symbols-outlined text-[14px]">sms</span>
                  Validación inmediata por SMS Celular y Cédula
                </div>
                <h2 class="text-xl ${headingText} font-bold">Registro de Abogado / Usuario</h2>
                <p class="text-xs sm:text-sm ${mutedText}">
                  Activa tu acceso al Importador Zero-Touch, alertas de términos fatales y visor de juzgados.
                </p>
              </div>

              <form class="space-y-3.5" id="form-register">
                <!-- Campo 1: Nombre Completo -->
                <div class="space-y-1">
                  <label class="text-xs ${headingText} font-semibold">Nombre Completo y Apellidos</label>
                  <div class="relative flex items-center">
                    <span class="material-symbols-outlined absolute left-3.5 ${outlineText} text-[18px] pointer-events-none">badge</span>
                    <input
                      id="reg-fullname"
                      class="w-full ${inputClasses} text-sm rounded-lg pl-10 pr-4 py-2.5 border-0 outline-none transition-all"
                      placeholder="Ej. Lic. María Elena Morales Hernández"
                      required
                      type="text"
                    />
                  </div>
                </div>

                <!-- Fila de 2 columnas: Correo & Teléfono con indicador verde -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <!-- Correo -->
                  <div class="space-y-1">
                    <label class="text-xs ${headingText} font-semibold">Correo Electrónico</label>
                    <div class="relative flex items-center">
                      <span class="material-symbols-outlined absolute left-3.5 ${outlineText} text-[18px] pointer-events-none">mail</span>
                      <input
                        id="reg-email"
                        class="w-full ${inputClasses} text-sm rounded-lg pl-10 pr-4 py-2.5 border-0 outline-none transition-all"
                        placeholder="abogado@despacho.mx"
                        required
                        type="email"
                      />
                    </div>
                  </div>

                  <!-- Teléfono a 10 dígitos con validación verde en vivo -->
                  <div class="space-y-1">
                    <div class="flex items-center justify-between">
                      <label class="text-xs ${headingText} font-semibold">Teléfono Celular (10 dgt)</label>
                      <span class="hidden items-center gap-1 text-[11px] font-bold text-emerald-500 bg-emerald-500/15 px-1.5 py-0.2 rounded" id="phone-valid-badge">
                        <span class="material-symbols-outlined text-[13px]">check_circle</span> Válido
                      </span>
                    </div>
                    <div class="relative flex items-center">
                      <span class="material-symbols-outlined absolute left-3.5 ${outlineText} text-[18px] pointer-events-none">phone_iphone</span>
                      <input
                        class="w-full ${inputClasses} text-sm rounded-lg pl-10 pr-9 py-2.5 border-0 outline-none transition-all tabular-nums"
                        id="reg-phone"
                        maxlength="10"
                        placeholder="5584921100"
                        required
                        type="tel"
                      />
                      <span class="material-symbols-outlined absolute right-3 text-emerald-500 hidden text-[20px]" id="phone-check-icon">check</span>
                    </div>
                  </div>
                </div>

                <!-- Selector Desplegable Predictivo de Área de Práctica / Rol -->
                <div class="space-y-1">
                  <div class="flex items-center justify-between">
                    <label class="text-xs ${headingText} font-semibold">Área de Práctica Jurídica (Especialidad)</label>
                    <span class="text-[11px] ${outlineText} font-normal">Define tu perfil de ingesta IA</span>
                  </div>
                  <div class="relative flex items-center">
                    <span class="material-symbols-outlined absolute left-3.5 ${outlineText} text-[18px] pointer-events-none">domain</span>
                    <select
                      id="reg-specialty"
                      class="w-full ${inputClasses} text-sm rounded-lg pl-10 pr-8 py-2.5 border-0 outline-none transition-all appearance-none cursor-pointer"
                      required
                    >
                      <option disabled selected value="">Selecciona tu área o adscripción en el despacho...</option>
                      <option value="Socia / Dirección de Litigio Mercantil">Litigio Mercantil y Corporativo (Área 01 - Contratos &amp; Pagarés)</option>
                      <option value="Abogado Titular en Materia Civil">Litigio Civil y Familiar (Área 02 - Primera Instancia)</option>
                      <option value="Especialista en Derecho Laboral">Derecho Laboral Colectivo e Individual (Área 03 - Tribunales)</option>
                      <option value="Abogado Contencioso Administrativo">Contencioso Administrativo y Fiscal TFJA (Área 04)</option>
                      <option value="Paralegal & Operador Zero-Touch IA">Paralegal / Operador de Ingesta Documental Zero-Touch</option>
                    </select>
                    <span class="material-symbols-outlined absolute right-3 ${outlineText} pointer-events-none text-[18px]">expand_more</span>
                  </div>
                </div>

                <!-- Campo Contraseña con Medidor de Fortaleza Dinámico -->
                <div class="space-y-1">
                  <div class="flex items-center justify-between">
                    <label class="text-xs ${headingText} font-semibold">Crea una Contraseña Segura</label>
                    <span class="text-[11px] font-bold ${outlineText}" id="strength-label">Sin ingresar</span>
                  </div>
                  <div class="relative flex items-center">
                    <span class="material-symbols-outlined absolute left-3.5 ${outlineText} text-[18px] pointer-events-none">lock</span>
                    <input
                      class="w-full ${inputClasses} text-sm rounded-lg pl-10 pr-10 py-2.5 border-0 outline-none transition-all"
                      id="reg-password"
                      placeholder="Mínimo 8 caracteres, números y símbolos"
                      required
                      type="password"
                    />
                    <button
                      id="toggle-reg-pass-btn"
                      class="absolute right-3 ${outlineText} hover:${headingText} p-1 rounded-md"
                      type="button"
                    >
                      <span class="material-symbols-outlined text-[18px]" id="reg-eye-icon">visibility</span>
                    </button>
                  </div>
                  <!-- Medidor dinámico de fortaleza en 3 segmentos -->
                  <div class="pt-1.5 space-y-1">
                    <div class="grid grid-cols-3 gap-1.5 h-1.5">
                      <div class="rounded-full ${isLight ? 'bg-[#d8e3fb]' : 'bg-surface-container-highest'} transition-colors duration-200" id="bar-1"></div>
                      <div class="rounded-full ${isLight ? 'bg-[#d8e3fb]' : 'bg-surface-container-highest'} transition-colors duration-200" id="bar-2"></div>
                      <div class="rounded-full ${isLight ? 'bg-[#d8e3fb]' : 'bg-surface-container-highest'} transition-colors duration-200" id="bar-3"></div>
                    </div>
                    <p class="text-[11px] ${outlineText}" id="strength-hint">
                      Sugerencia: Usa mayúsculas, un número y un símbolo (ej. #, $, !).
                    </p>
                  </div>
                </div>

                <!-- Confirmar Contraseña con Check Inmediato -->
                <div class="space-y-1">
                  <div class="flex items-center justify-between">
                    <label class="text-xs ${headingText} font-semibold">Confirmar Contraseña</label>
                    <span class="hidden items-center gap-1 text-[11px] font-bold text-emerald-500 bg-emerald-500/15 px-1.5 py-0.2 rounded" id="confirm-match-badge">
                      <span class="material-symbols-outlined text-[13px]">check</span> Las contraseñas coinciden
                    </span>
                  </div>
                  <div class="relative flex items-center">
                    <span class="material-symbols-outlined absolute left-3.5 ${outlineText} text-[18px] pointer-events-none">lock_reset</span>
                    <input
                      class="w-full ${inputClasses} text-sm rounded-lg pl-10 pr-10 py-2.5 border-0 outline-none transition-all"
                      id="reg-confirm-password"
                      placeholder="Repite la contraseña exacta"
                      required
                      type="password"
                    />
                    <span class="material-symbols-outlined absolute right-3 text-emerald-500 hidden text-[20px]" id="confirm-icon-check">verified</span>
                  </div>
                </div>

                <!-- Checkbox Términos y Secreto Profesional -->
                <div class="pt-1">
                  <label class="flex items-start space-x-2.5 cursor-pointer">
                    <input class="mt-0.5 h-4 w-4 rounded text-primary focus:ring-primary accent-primary" required type="checkbox" />
                    <span class="text-xs ${mutedText} leading-snug">
                      Acepto el <a class="text-primary underline font-medium" href="javascript:void(0)">Aviso de Privacidad y Secreto Profesional</a> y autorizo la indexación criptográfica SHA-256 de mis expedientes conforme a la normativa de protección de datos.
                    </span>
                  </label>
                </div>

                <!-- Botón Completar Registro -->
                <div class="pt-2">
                  <button
                    class="w-full ${primaryBtn} py-3 px-5 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center justify-center space-x-2"
                    type="submit"
                  >
                    <span class="material-symbols-outlined text-[20px]">how_to_reg</span>
                    <span>Completar Registro Jurídico</span>
                  </button>
                  <div class="flex items-center justify-center space-x-1.5 mt-2 text-[11px] ${outlineText}">
                    <span class="material-symbols-outlined text-[14px] text-emerald-500">verified</span>
                    <span>Validación criptográfica y alta inmediata en el Árbol Documental.</span>
                  </div>
                </div>
              </form>
            </div>

          </div>
        </div>

        <!-- Pie institucional de soporte y transparencia -->
        <div class="mt-6 flex flex-wrap items-center justify-center gap-6 text-[12px] ${outlineText} text-center">
          <span class="flex items-center gap-1.5">
            <span class="material-symbols-outlined text-[16px] text-primary">phone_in_talk</span>
            Mesa de Ayuda Legal Tech: 55 8492 1100
          </span>
          <span class="hidden sm:inline">•</span>
          <span class="flex items-center gap-1.5">
            <span class="material-symbols-outlined text-[16px] text-cyan-400">domain</span>
            Certificación Bóveda Judicial: Folio #SL-VAULT-2026
          </span>
          <span class="hidden sm:inline">•</span>
          <span class="flex items-center gap-1.5">
            <span class="material-symbols-outlined text-[16px] text-emerald-500">security</span>
            Encriptación SHA-256 Activa
          </span>
        </div>

      </div>
    </div>
  `;

  bindAuthTemplateEvents(container, isLight);
}

// Mantener compatibilidad si se invoca como modal desde algún botón secundario
export function renderLoginModal() {
  store.logout();
}

function bindAuthTemplateEvents(container, isLight) {
  const baseBarClass = `rounded-full ${isLight ? 'bg-[#d8e3fb]' : 'bg-surface-container-highest'} transition-colors duration-200`;

  // Cerrar el toast superior
  document.getElementById('close-flash-toast-btn')?.addEventListener('click', () => {
    document.getElementById('flash-toast')?.classList.add('hidden');
  });

  // Alternar entre Tema Oscuro (Fidelity Dark) y Tema Claro (Plantilla de referencia)
  document.getElementById('toggle-auth-theme-btn')?.addEventListener('click', () => {
    store.toggleLoginTheme();
  });

  // Control de cambio de pestaña (Login / Registro)
  const tabLogin = document.getElementById('tab-login');
  const tabRegister = document.getElementById('tab-register');
  const panelLogin = document.getElementById('panel-login');
  const panelRegister = document.getElementById('panel-register');

  const activeTabClass = `flex-1 py-2.5 px-4 rounded-lg text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all duration-200 ${isLight ? 'bg-white text-[#004e9f] shadow-sm' : 'bg-primary-container text-white shadow-sm'}`;
  const inactiveTabClass = `flex-1 py-2.5 px-4 rounded-lg text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-200 ${isLight ? 'text-[#414753] hover:text-[#111c2d]' : 'text-on-surface-variant hover:text-white'}`;

  tabLogin?.addEventListener('click', () => {
    panelLogin?.classList.remove('hidden');
    panelRegister?.classList.add('hidden');
    tabLogin.className = activeTabClass;
    tabRegister.className = inactiveTabClass;
  });

  tabRegister?.addEventListener('click', () => {
    panelLogin?.classList.add('hidden');
    panelRegister?.classList.remove('hidden');
    tabRegister.className = activeTabClass;
    tabLogin.className = inactiveTabClass;
  });

  // Botones de Selección Rápida de Rol Demo
  container.querySelectorAll('[data-quick-role]').forEach(btn => {
    btn.addEventListener('click', () => {
      const roleId = btn.getAttribute('data-quick-role');
      const user = DEMO_USERS.find(u => u.id === roleId);
      if (!user) return;
      store.state.currentUser = user;
      const emailInput = document.getElementById('login-email');
      if (emailInput) emailInput.value = user.email;
      renderLoginScreen(container);
      showToast(`Perfil seleccionado: ${user.name} (${user.roleTitle}). Pulsa "Iniciar Sesión".`, 'info');
    });
  });

  // Alternador de visibilidad de contraseña
  const togglePass = (inputId, iconId) => {
    const input = document.getElementById(inputId);
    const icon = document.getElementById(iconId);
    if (!input || !icon) return;
    if (input.type === 'password') {
      input.type = 'text';
      icon.textContent = 'visibility_off';
    } else {
      input.type = 'password';
      icon.textContent = 'visibility';
    }
  };

  document.getElementById('toggle-login-pass-btn')?.addEventListener('click', () => {
    togglePass('login-password', 'login-eye-icon');
  });

  document.getElementById('toggle-reg-pass-btn')?.addEventListener('click', () => {
    togglePass('reg-password', 'reg-eye-icon');
  });

  // Simulación de estado Loading con Spinner
  const runLoginSpinner = (andEnterApp = true) => {
    const btnText = document.getElementById('btn-login-text');
    const btnSpinner = document.getElementById('btn-login-spinner');
    const btnSubmit = document.getElementById('btn-login-submit');
    if (!btnText || !btnSpinner || !btnSubmit) return;

    btnText.classList.add('hidden');
    btnSpinner.classList.remove('hidden');
    btnSpinner.classList.add('flex');
    btnSubmit.setAttribute('disabled', 'true');
    btnSubmit.classList.add('opacity-90', 'cursor-wait');

    setTimeout(() => {
      if (andEnterApp) {
        const emailVal = document.getElementById('login-email')?.value;
        store.loginWithCredentials(emailVal);
        showToast(`Bienvenido(a), ${store.state.currentUser.name} • Bóveda Legal Activa`, 'success');
      } else {
        btnText.classList.remove('hidden');
        btnSpinner.classList.add('hidden');
        btnSpinner.classList.remove('flex');
        btnSubmit.removeAttribute('disabled');
        btnSubmit.classList.remove('opacity-90', 'cursor-wait');
        const flashToast = document.getElementById('flash-toast');
        flashToast?.classList.remove('hidden');
        showToast('Conexión verificada con Servidor Sovereign-01 (TLS 1.3 OK)', 'success');
      }
    }, andEnterApp ? 950 : 2000);
  };

  document.getElementById('form-login')?.addEventListener('submit', (e) => {
    e.preventDefault();
    runLoginSpinner(true);
  });

  document.getElementById('simulate-spinner-only-btn')?.addEventListener('click', () => {
    runLoginSpinner(false);
  });

  document.getElementById('efirma-access-btn')?.addEventListener('click', () => {
    store.loginWithRole('role-partner');
    showToast('Autenticado con Certificado Digital e.firma PJF (Dra. Elena Valdés)', 'success');
  });

  document.getElementById('forgot-pass-btn')?.addEventListener('click', () => {
    const email = document.getElementById('login-email')?.value || 'tu correo corporativo';
    showToast(`Enlace criptográfico de recuperación enviado a ${email}`, 'info');
  });

  // Validación en vivo de teléfono a 10 dígitos
  const phoneInput = document.getElementById('reg-phone');
  phoneInput?.addEventListener('input', (e) => {
    const cleanVal = e.target.value.replace(/\D/g, '').slice(0, 10);
    e.target.value = cleanVal;
    const badge = document.getElementById('phone-valid-badge');
    const checkIcon = document.getElementById('phone-check-icon');
    if (cleanVal.length === 10) {
      badge?.classList.remove('hidden');
      badge?.classList.add('inline-flex');
      checkIcon?.classList.remove('hidden');
    } else {
      badge?.classList.add('hidden');
      badge?.classList.remove('inline-flex');
      checkIcon?.classList.add('hidden');
    }
  });

  // Medidor Dinámico de Fortaleza de Contraseña y coincidencia
  const regPass = document.getElementById('reg-password');
  const regConfirm = document.getElementById('reg-confirm-password');

  const checkMatch = () => {
    const p1 = regPass?.value || '';
    const p2 = regConfirm?.value || '';
    const badge = document.getElementById('confirm-match-badge');
    const icon = document.getElementById('confirm-icon-check');
    if (p1 && p2 && p1 === p2) {
      badge?.classList.remove('hidden');
      badge?.classList.add('inline-flex');
      icon?.classList.remove('hidden');
    } else {
      badge?.classList.add('hidden');
      badge?.classList.remove('inline-flex');
      icon?.classList.add('hidden');
    }
  };

  regPass?.addEventListener('input', (e) => {
    const val = e.target.value;
    const bar1 = document.getElementById('bar-1');
    const bar2 = document.getElementById('bar-2');
    const bar3 = document.getElementById('bar-3');
    const label = document.getElementById('strength-label');
    const hint = document.getElementById('strength-hint');
    if (!bar1 || !bar2 || !bar3 || !label || !hint) return;

    bar1.className = baseBarClass;
    bar2.className = baseBarClass;
    bar3.className = baseBarClass;

    if (!val) {
      label.textContent = 'Sin ingresar';
      label.className = 'text-[11px] font-bold text-outline';
      hint.textContent = 'Sugerencia: Usa mayúsculas, un número y un símbolo (ej. #, $, !).';
      checkMatch();
      return;
    }

    let score = 0;
    if (val.length >= 6) score++;
    if (val.length >= 8 && /[A-Z]/.test(val) && /[0-9]/.test(val)) score++;
    if (val.length >= 10 && /[^A-Za-z0-9]/.test(val)) score++;

    if (score <= 1 || val.length < 6) {
      bar1.className = 'rounded-full bg-red-600 transition-colors duration-200';
      label.textContent = 'Débil';
      label.className = 'text-[11px] font-bold text-red-500';
      hint.textContent = 'Insegura: Agrega letras mayúsculas y mínimo 8 caracteres.';
    } else if (score === 2) {
      bar1.className = 'rounded-full bg-amber-500 transition-colors duration-200';
      bar2.className = 'rounded-full bg-amber-500 transition-colors duration-200';
      label.textContent = 'Media';
      label.className = 'text-[11px] font-bold text-amber-500';
      hint.textContent = 'Aceptable: Agrega caracteres especiales como @, #, $, % para mayor seguridad.';
    } else {
      bar1.className = 'rounded-full bg-emerald-500 transition-colors duration-200';
      bar2.className = 'rounded-full bg-emerald-500 transition-colors duration-200';
      bar3.className = 'rounded-full bg-emerald-500 transition-colors duration-200';
      label.textContent = 'Fuerte y Robusta';
      label.className = 'text-[11px] font-bold text-emerald-500';
      hint.textContent = 'Excelente: Tu contraseña cumple con el estándar de seguridad Sovereign Vault.';
    }
    checkMatch();
  });

  regConfirm?.addEventListener('input', checkMatch);

  document.getElementById('form-register')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const fullName = document.getElementById('reg-fullname')?.value || 'Lic. Nuevo Abogado';
    const email = document.getElementById('reg-email')?.value || 'abogado@sovereignvault.legal';
    const phone = document.getElementById('reg-phone')?.value || '5500000000';
    const specialty = document.getElementById('reg-specialty')?.value || 'Abogado Litigante';

    store.registerUser({ fullName, email, phone, specialty });
    showToast(`Cuenta creada y verificada por SMS (${phone}). ¡Bienvenido(a), ${fullName}!`, 'success');
  });
}
