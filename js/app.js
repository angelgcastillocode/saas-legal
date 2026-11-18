/**
 * Punto de Entrada y Enrutador SPA — SaaS Legal ("The Sovereign Vault" v2.4 AI)
 */

import { store } from './store/state.js';
import { DEMO_USERS } from './store/mockData.js';
import { renderDashboardView } from './views/dashboardView.js';
import { renderImporterView } from './views/importerView.js';
import { renderRepositoryView } from './views/repositoryView.js';
import { renderClientsView } from './views/clientsView.js';
import { renderCasesView } from './views/casesView.js';
import { renderHearingsView } from './views/hearingsView.js';
import { renderSettingsView } from './views/settingsView.js';
import { renderLoginScreen } from './views/loginView.js';
import { openGlobalSearchModal, showToast } from './components/globalSearchModal.js';

function initPdfWorker() {
  try {
    if (window.pdfjsLib && window.pdfjsLib.GlobalWorkerOptions) {
      window.pdfjsLib.GlobalWorkerOptions.workerSrc =
        'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
    }
  } catch (e) {
    // Fallback silencioso
  }
}

function renderActiveView() {
  const authContainer = document.getElementById('auth-screen-container');
  const appShell = document.getElementById('app-shell-container');
  const mainContainer = document.getElementById('spa-main-container');

  // Si el usuario no ha iniciado sesión, mostrar la pantalla completa de Login & Registro fiel a la plantilla
  if (!store.state.isAuthenticated) {
    appShell?.classList.add('hidden');
    authContainer?.classList.remove('hidden');
    renderLoginScreen(authContainer);
    return;
  }

  authContainer?.classList.add('hidden');
  appShell?.classList.remove('hidden');

  if (!mainContainer) return;

  const route = store.state.activeRoute || 'dashboard';
  updateSidebarAndHeaderUI(route);

  switch (route) {
    case 'dashboard':
      renderDashboardView(mainContainer);
      break;
    case 'importador':
      renderImporterView(mainContainer);
      break;
    case 'documentos':
      renderRepositoryView(mainContainer);
      break;
    case 'clientes':
      renderClientsView(mainContainer);
      break;
    case 'expedientes':
      renderCasesView(mainContainer);
      break;
    case 'audiencias':
      renderHearingsView(mainContainer);
      break;
    case 'ajustes':
      renderSettingsView(mainContainer);
      break;
    default:
      renderDashboardView(mainContainer);
      break;
  }
}

function updateSidebarAndHeaderUI(activeRoute) {
  document.querySelectorAll('[data-nav-route]').forEach(link => {
    const route = link.getAttribute('data-nav-route');
    const isActive = route === activeRoute;
    if (route === 'importador') {
      link.className = isActive
        ? 'w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold shadow-[0_0_24px_rgba(45,142,255,0.55)] ring-2 ring-white/30 transition-all duration-200'
        : 'w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-primary-container text-white rounded-xl text-sm font-semibold shadow-[0_0_20px_rgba(25,120,229,0.35)] hover:bg-primary transition-all duration-200';
      return;
    }

    if (isActive) {
      link.className = 'flex items-center gap-3 px-4 py-2.5 transition-all bg-primary/15 text-primary font-semibold rounded-xl border border-primary/20';
      link.setAttribute('aria-current', 'page');
    } else {
      link.className = 'flex items-center gap-3 px-4 py-2.5 rounded-xl text-on-surface-variant hover:bg-surface-container-low hover:text-white transition-all border border-transparent';
      link.removeAttribute('aria-current');
    }
  });

  const { monthlyQuotaUsed, monthlyQuotaMax } = store.state.stats;
  const pct = ((monthlyQuotaUsed / monthlyQuotaMax) * 100).toFixed(1);
  const quotaPctEl = document.getElementById('sidebar-quota-pct');
  const quotaBarEl = document.getElementById('sidebar-quota-bar');
  const quotaTextEl = document.getElementById('sidebar-quota-text');
  if (quotaPctEl) quotaPctEl.textContent = `${pct}%`;
  if (quotaBarEl) quotaBarEl.style.width = `${pct}%`;
  if (quotaTextEl) quotaTextEl.textContent = `${(monthlyQuotaUsed / 1000).toFixed(1)}k / 100k este mes`;

  const user = store.state.currentUser || DEMO_USERS[0];
  const avatarEl = document.getElementById('header-user-avatar');
  const nameEl = document.getElementById('header-user-name');
  const roleEl = document.getElementById('header-user-role');
  const roleSelectEl = document.getElementById('header-role-switcher');

  if (avatarEl) avatarEl.src = user.avatar;
  if (nameEl) nameEl.textContent = user.name;
  if (roleEl) roleEl.textContent = user.roleTitle;
  if (roleSelectEl && DEMO_USERS.some(u => u.id === user.id)) {
    roleSelectEl.value = user.id;
  }
}

function bindShellEvents() {
  document.querySelectorAll('[data-nav-route]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const route = el.getAttribute('data-nav-route');
      store.setRoute(route);
    });
  });

  const headerSearch = document.getElementById('header-global-search');
  headerSearch?.addEventListener('focus', () => {
    openGlobalSearchModal(headerSearch.value);
    headerSearch.blur();
  });

  window.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (store.state.isAuthenticated) openGlobalSearchModal('');
    }
    if (e.key === 'Escape') {
      const modalRoot = document.getElementById('global-modal-root');
      if (modalRoot && modalRoot.innerHTML.trim() !== '') {
        modalRoot.innerHTML = '';
      }
    }
  });

  const roleSwitcher = document.getElementById('header-role-switcher');
  roleSwitcher?.addEventListener('change', (e) => {
    store.switchUserRole(e.target.value);
    showToast(`Rol activo cambiado a: ${store.state.currentUser.name} (${store.state.currentUser.roleTitle})`, 'info');
  });

  // Botones para cerrar sesión / ir a la pantalla de Login
  document.getElementById('header-login-modal-btn')?.addEventListener('click', () => {
    store.logout();
  });

  document.getElementById('sidebar-logout-btn')?.addEventListener('click', () => {
    store.logout();
  });

  document.getElementById('header-notifications-btn')?.addEventListener('click', () => {
    store.setRoute('audiencias');
    showToast('Mostrando 2 alertas críticas de término fatal (48h)', 'warning');
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initPdfWorker();
  bindShellEvents();
  renderActiveView();

  store.subscribe((_state, reason) => {
    if (reason === 'ingest' && store.state.importerBatch.isProcessing) {
      updateSidebarAndHeaderUI(store.state.activeRoute);
      return;
    }
    renderActiveView();
  });
});
