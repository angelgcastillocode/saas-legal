/**
 * Store Reactivo Central — SaaS Legal
 * Sincroniza Clientes, Expedientes, Documentos (Árbol de 3 Niveles), Audiencias,
 * Roles de Usuario, Autenticación y Configuración IA en localStorage.
 */

import {
  DEMO_USERS,
  INITIAL_CLIENTS,
  INITIAL_CASES,
  INITIAL_DOCUMENTS,
  INITIAL_HEARINGS,
  INITIAL_FEED,
  INITIAL_AI_SETTINGS
} from './mockData.js';
import {
  buildNormalizedFileName,
  mapToFolderCategory
} from '../services/fileNormalizer.js';
import { clearVaultDB } from './fileVault.js';

const STORAGE_KEY = 'SAAS_LEGAL_VAULT_STATE_V2_5';

class AppStore {
  constructor() {
    this.listeners = new Set();
    this.state = this.loadState();
  }

  getDefaultState() {
    return {
      isAuthenticated: false, // Inicia en la pantalla de Login fiel a la plantilla
      loginTheme: 'dark', // 'dark' (Fidelity Dark) | 'light' (Plantilla Institucional Clara)
      currentUser: DEMO_USERS[0],
      activeRoute: 'dashboard', // 'dashboard' | 'importador' | 'clientes' | 'expedientes' | 'documentos' | 'audiencias' | 'ajustes'
      clients: structuredClone(INITIAL_CLIENTS),
      cases: structuredClone(INITIAL_CASES),
      documents: structuredClone(INITIAL_DOCUMENTS),
      hearings: structuredClone(INITIAL_HEARINGS),
      feed: structuredClone(INITIAL_FEED),
      aiSettings: structuredClone(INITIAL_AI_SETTINGS),
      stats: {
        baseActiveCases: 428,
        baseRegisteredClients: 1840,
        baseDocsClassified: 14290,
        hoursSaved: 320,
        monthlyQuotaUsed: 84500,
        monthlyQuotaMax: 100000
      },
      repositoryFilter: {
        selectedClientId: 'CLI-9402',
        selectedCategory: null,
        selectedCaseId: null,
        selectedDocId: 'doc-1',
        searchQuery: '',
        sortBy: 'recent',
        expandedClients: ['CLI-9402', 'CLI-7719', 'CLI-1002']
      },
      importerBatch: {
        batchId: 892,
        isProcessing: false,
        processedCount: 5,
        totalCount: 5,
        successCount: 5,
        failCount: 0,
        elapsedSeconds: 3.4,
        tokensUsed: 4120,
        avgConfidence: 98.6,
        logs: [],
        recentBatchDocs: []
      }
    };
  }

  loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return this.getDefaultState();
      const parsed = JSON.parse(raw);
      return {
        ...this.getDefaultState(),
        ...parsed,
        repositoryFilter: {
          ...this.getDefaultState().repositoryFilter,
          ...(parsed.repositoryFilter || {})
        },
        aiSettings: {
          ...this.getDefaultState().aiSettings,
          ...(parsed.aiSettings || {})
        }
      };
    } catch (e) {
      console.warn('Restaurando estado por defecto:', e);
      return this.getDefaultState();
    }
  }

  saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch (e) {
      console.warn('No se pudo persistir en localStorage:', e);
    }
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify(reason = 'update') {
    this.saveState();
    for (const listener of this.listeners) {
      try {
        listener(this.state, reason);
      } catch (err) {
        console.error('Error en listener de store:', err);
      }
    }
  }

  setRoute(route, options = {}) {
    this.state.activeRoute = route;
    if (options.clientId) {
      this.state.repositoryFilter.selectedClientId = options.clientId;
      if (!this.state.repositoryFilter.expandedClients.includes(options.clientId)) {
        this.state.repositoryFilter.expandedClients.push(options.clientId);
      }
    }
    if (options.category !== undefined) {
      this.state.repositoryFilter.selectedCategory = options.category;
    }
    if (options.caseId !== undefined) {
      this.state.repositoryFilter.selectedCaseId = options.caseId;
    }
    if (options.docId) {
      this.state.repositoryFilter.selectedDocId = options.docId;
    }
    this.notify('route');
  }

  switchUserRole(userId) {
    const found = DEMO_USERS.find(u => u.id === userId);
    if (found) {
      this.state.currentUser = found;
      this.state.isAuthenticated = true;
      this.notify('role');
    }
  }

  logout() {
    this.state.isAuthenticated = false;
    this.notify('auth');
  }

  loginWithRole(userId) {
    const found = DEMO_USERS.find(u => u.id === userId) || DEMO_USERS[0];
    this.state.currentUser = found;
    this.state.isAuthenticated = true;
    this.notify('auth');
  }

  loginWithCredentials(email) {
    const cleanEmail = (email || '').trim().toLowerCase();
    const matched = DEMO_USERS.find(u => u.email.toLowerCase() === cleanEmail);
    if (matched) {
      this.state.currentUser = matched;
    } else if (cleanEmail) {
      const nameFromEmail = cleanEmail.split('@')[0].replace(/[._-]/g, ' ');
      const formattedName = 'Lic. ' + nameFromEmail.replace(/\b\w/g, l => l.toUpperCase());
      this.state.currentUser = {
        ...DEMO_USERS[0],
        id: 'role-custom',
        name: formattedName,
        email: cleanEmail,
        roleTitle: 'Abogado Titular • Acceso Verificado'
      };
    } else {
      this.state.currentUser = DEMO_USERS[0];
    }
    this.state.isAuthenticated = true;
    this.notify('auth');
  }

  registerUser({ fullName, email, phone, specialty }) {
    const newUser = {
      id: `user-${Date.now()}`,
      name: fullName.trim(),
      roleTitle: specialty || 'Abogado Litigante Asociado',
      roleCode: 'LITIGATOR',
      email: email.trim(),
      phone: phone.trim(),
      badge: 'Cuenta Verificada SMS',
      avatar: DEMO_USERS[1].avatar,
      permissions: {
        canApproveBatch: true,
        canConfigureAI: true,
        canDeleteRecords: true,
        canGeneratePartnerReport: true
      }
    };
    this.state.currentUser = newUser;
    this.state.isAuthenticated = true;
    this.notify('auth');
    return newUser;
  }

  toggleLoginTheme() {
    this.state.loginTheme = this.state.loginTheme === 'light' ? 'dark' : 'light';
    this.notify('loginTheme');
  }

  updateAISettings(partial) {
    this.state.aiSettings = {
      ...this.state.aiSettings,
      ...partial
    };
    this.notify('settings');
  }

  findOrCreateClient(clientNameRaw, extra = {}) {
    const cleanName = (clientNameRaw || 'Cliente General').trim();
    const existing = this.state.clients.find(
      c => c.name.toLowerCase() === cleanName.toLowerCase() ||
           c.name.toLowerCase().includes(cleanName.toLowerCase()) ||
           cleanName.toLowerCase().includes(c.name.toLowerCase())
    );
    if (existing) {
      return { client: existing, isNew: false };
    }

    const isCorp = /S\.A\.|S\.L\.|S\.C\.|Corp|Grupo|Consorcio|Banco|Innova|Logística|Operadora/i.test(cleanName);
    const newId = `CLI-${Math.floor(1000 + Math.random() * 8999)}`;
    const newClient = {
      id: newId,
      name: cleanName,
      type: extra.type || (isCorp ? 'Corporativo' : 'Persona Física'),
      rfc: extra.rfc || (isCorp ? 'GEN240101AA9' : 'XAXX010101000'),
      representative: extra.representative || cleanName,
      email: extra.email || 'contacto@cliente-legal.mx',
      phone: extra.phone || '+52 55 0000 0000',
      sector: extra.sector || (isCorp ? 'Corporativo / Mercantil' : 'Particular'),
      status: 'Activo',
      createdAt: new Date().toISOString().slice(0, 10)
    };

    this.state.clients.unshift(newClient);
    this.state.stats.baseRegisteredClients += 1;
    if (!this.state.repositoryFilter.expandedClients.includes(newId)) {
      this.state.repositoryFilter.expandedClients.unshift(newId);
    }
    return { client: newClient, isNew: true };
  }

  findOrCreateCase({ caseNumberRaw, client, matter, court, title, lastDocName }) {
    const normalizedCaseNum = (caseNumberRaw || '').trim();
    const hasExplicitNumber = normalizedCaseNum &&
      normalizedCaseNum !== 'Sin número (Nuevo)' &&
      normalizedCaseNum !== 'SIN-NUMERO';

    if (hasExplicitNumber) {
      const existing = this.state.cases.find(
        c => c.id.toLowerCase() === normalizedCaseNum.toLowerCase()
      );
      if (existing) {
        existing.lastDocName = lastDocName || existing.lastDocName;
        existing.lastUpdateText = 'Ahora mismo • Ingesta Zero-Touch';
        return { caseItem: existing, isNew: false, displayId: existing.id };
      }
    }

    const displayId = hasExplicitNumber ? normalizedCaseNum : 'Sin número (Nuevo)';
    const existingUnnumbered = !hasExplicitNumber
      ? this.state.cases.find(c => c.clientId === client.id && c.id === 'Sin número (Nuevo)')
      : null;

    if (existingUnnumbered) {
      existingUnnumbered.lastDocName = lastDocName || existingUnnumbered.lastDocName;
      existingUnnumbered.lastUpdateText = 'Ahora mismo • Ingesta Zero-Touch';
      return { caseItem: existingUnnumbered, isNew: false, displayId: 'Sin número (Nuevo)' };
    }

    const newCase = {
      id: displayId,
      internalKey: `CASE-${Date.now()}-${Math.floor(Math.random() * 999)}`,
      title: title || `Expediente ${matter || 'General'} - ${client.name}`,
      subtitle: hasExplicitNumber ? `Juicio ${matter || 'Mercantil'}` : 'Pendiente de asignación de folio judicial',
      matter: matter || 'Mercantil',
      clientId: client.id,
      clientName: client.name,
      court: court || 'Por asignar / Oficialía de Partes Común',
      lawyer: this.state.currentUser?.name || 'Dra. Elena Valdés',
      amount: '$0.00 MXN (En cuantificación)',
      amountNote: 'Creado vía Importador Zero-Touch',
      stage: 'Radicación / Inicial',
      status: hasExplicitNumber ? 'En trámite' : 'Sin número (Nuevo)',
      statusColor: hasExplicitNumber ? 'emerald' : 'amber',
      priority: 'Alta Prioridad',
      hasUpcomingHearing: false,
      pendingAIReview: !hasExplicitNumber,
      lastDocName: lastDocName || 'Documento recién ingerido',
      lastUpdateText: 'Ahora mismo • Auto-clasificado IA'
    };

    this.state.cases.unshift(newCase);
    this.state.stats.baseActiveCases += 1;
    return { caseItem: newCase, isNew: true, displayId };
  }

  ingestProcessedDocument(extractedData) {
    const { client, isNew: isNewClient } = this.findOrCreateClient(extractedData.clientName, {
      rfc: extractedData.rfc,
      representative: extractedData.representative
    });

    const folderCategory = mapToFolderCategory(extractedData.category || extractedData.docTypeLabel);
    const dateISO = new Date().toISOString().slice(0, 10);
    const normalizedName = buildNormalizedFileName(
      extractedData.originalName,
      folderCategory,
      dateISO
    );

    const { caseItem, isNew: isNewCase, displayId } = this.findOrCreateCase({
      caseNumberRaw: extractedData.caseId,
      client,
      matter: extractedData.matter,
      court: extractedData.court,
      title: `${extractedData.docTypeLabel} — ${client.name}`,
      lastDocName: normalizedName
    });

    const newDoc = {
      id: extractedData.id || `doc-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      originalName: extractedData.originalName,
      normalizedName,
      category: folderCategory,
      docTypeLabel: extractedData.docTypeLabel || 'Documento Procesal',
      clientId: client.id,
      clientName: client.name,
      caseId: displayId,
      court: extractedData.court || caseItem.court,
      confidence: Number(extractedData.confidence || 96.4),
      sizeLabel: extractedData.sizeLabel || '1.8 MB',
      fojas: extractedData.fojas || 1,
      uploadedAt: 'Ahora mismo',
      dateISO,
      sha256: extractedData.sha256,
      ext: extractedData.ext || 'pdf',
      chips: extractedData.chips || [
        { label: 'Fojas', value: String(extractedData.fojas || 1) },
        { label: 'Normalizado', value: normalizedName, isPrimary: true }
      ],
      alertBadge: extractedData.confidence < this.state.aiSettings.lowConfidenceThreshold
        ? 'Confianza Baja • Validar'
        : (extractedData.alertBadge || null),
      entities: extractedData.entities || {
        actor: client.name,
        actorMeta: `ID: ${client.id} • Identificado por IA`,
        demandado: extractedData.counterparty || 'Por determinar en autos',
        demandadoMeta: 'Extracción NLP Zero-Touch',
        representante: extractedData.representative || client.representative,
        representanteMeta: 'Personalidad reconocida',
        obligacion: extractedData.amount || 'Cuantía indeterminada',
        obligacionMeta: extractedData.matter || 'Materia General'
      },
      ocrSnippet: extractedData.ocrSnippet || '"...Texto extraído automáticamente mediante el pipeline de ingesta neuronal Zero-Touch v2.4..."',
      fullPreviewText: extractedData.fullPreviewText || extractedData.ocrSnippet || '',
      engineLogs: extractedData.engineLogs || [
        `[${new Date().toLocaleTimeString()}] Archivo procesado por Ingesta Zero-Touch`,
        `[${new Date().toLocaleTimeString()}] Nombre normalizado: ${normalizedName}`,
        `[${new Date().toLocaleTimeString()}] Clasificado en ${client.name} / ${folderCategory}`
      ]
    };

    this.state.documents.unshift(newDoc);
    this.state.stats.baseDocsClassified += 1;
    this.state.stats.hoursSaved += 1;
    this.state.stats.monthlyQuotaUsed = Math.min(
      this.state.stats.monthlyQuotaMax,
      this.state.stats.monthlyQuotaUsed + Math.floor(150 + Math.random() * 250)
    );

    this.state.feed.unshift({
      id: `feed-${Date.now()}-${Math.floor(Math.random() * 999)}`,
      fileName: newDoc.normalizedName,
      originalName: newDoc.originalName,
      tag: `${extractedData.matter || 'Legal'} / ${folderCategory}`,
      caseId: displayId,
      clientName: client.name,
      timeAgo: 'Ahora mismo',
      confidence: newDoc.confidence,
      statusType: newDoc.confidence < this.state.aiSettings.lowConfidenceThreshold ? 'pending' : 'verified',
      icon: newDoc.ext === 'pdf' ? 'picture_as_pdf' : (['png', 'jpg', 'jpeg'].includes(newDoc.ext) ? 'image' : 'description'),
      iconColor: newDoc.ext === 'pdf' ? 'text-primary' : 'text-emerald-400'
    });

    this.state.repositoryFilter.selectedClientId = client.id;
    this.state.repositoryFilter.selectedDocId = newDoc.id;
    if (!this.state.repositoryFilter.expandedClients.includes(client.id)) {
      this.state.repositoryFilter.expandedClients.unshift(client.id);
    }

    this.notify('ingest');
    return {
      doc: newDoc,
      client,
      isNewClient,
      caseItem,
      isNewCase
    };
  }

  reclassifyDocument(docId, { clientId, newClientName, category, caseId, docTypeLabel, confidence }) {
    const doc = this.state.documents.find(d => d.id === docId);
    if (!doc) return null;

    let targetClient = this.state.clients.find(c => c.id === clientId);
    if (!targetClient && newClientName) {
      targetClient = this.findOrCreateClient(newClientName).client;
    }

    if (targetClient) {
      doc.clientId = targetClient.id;
      doc.clientName = targetClient.name;
      if (doc.entities) {
        doc.entities.actor = targetClient.name;
      }
    }

    if (category) {
      doc.category = mapToFolderCategory(category);
    }
    if (docTypeLabel) {
      doc.docTypeLabel = docTypeLabel;
    }
    if (caseId !== undefined && caseId !== null && caseId !== '') {
      doc.caseId = caseId;
    }
    if (confidence !== undefined) {
      doc.confidence = Number(confidence);
      if (doc.confidence >= this.state.aiSettings.lowConfidenceThreshold) {
        doc.alertBadge = null;
      }
    }

    doc.normalizedName = buildNormalizedFileName(doc.originalName, doc.category, doc.dateISO);
    doc.engineLogs = doc.engineLogs || [];
    doc.engineLogs.push(
      `[${new Date().toLocaleTimeString()}] Reclasificado a ${doc.clientName} -> ${doc.category} (${doc.normalizedName})`
    );

    this.notify('reclassify');
    return doc;
  }

  addHearing(hearingData) {
    const newHearing = {
      id: `AUD-${Date.now().toString().slice(-4)}`,
      caseId: hearingData.caseId || 'Sin número (Nuevo)',
      clientName: hearingData.clientName || 'TechCorp Iberoamérica S.A.',
      title: hearingData.title || 'Audiencia Procesal',
      timeBadge: hearingData.timeBadge || 'Próximamente',
      dateISO: hearingData.dateISO || new Date().toISOString().slice(0, 16),
      judge: hearingData.judge || 'Juez Titular en Turno',
      courtroom: hearingData.courtroom || 'Sala de Oralidad',
      urgency: hearingData.urgency || 'warning',
      matter: hearingData.matter || 'Mercantil',
      notes: hearingData.notes || ''
    };
    this.state.hearings.unshift(newHearing);
    this.notify('hearings');
    return newHearing;
  }

  async resetToDemoDefaults() {
    localStorage.removeItem(STORAGE_KEY);
    await clearVaultDB();
    this.state = this.getDefaultState();
    this.state.isAuthenticated = true;
    this.notify('reset');
  }
}

export const store = new AppStore();
