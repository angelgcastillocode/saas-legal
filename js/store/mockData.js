/**
 * Datos de Demostración Persistentes — SaaS Legal ("The Sovereign Vault" v2.4 AI)
 * Replica con fidelidad 100% los casos, clientes, documentos y métricas del diseño Stitch,
 * estructurados además para el Árbol de 3 Niveles (Cliente -> Tipo de Documento -> Archivo)
 * y la Nomenclatura Estandarizada ([Tipo]_[Fecha]_[NombreOriginal].ext).
 */

export const DEMO_USERS = [
  {
    id: 'role-partner',
    name: 'Dra. Elena Valdés',
    roleTitle: 'Socia Directora Legal Tech',
    roleCode: 'PARTNER',
    email: 'elena.valdes@sovereignvault.legal',
    badge: 'Acceso Total • Socia',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAtu2XNiRZEmiRhO2qCuVzuQL_bYnDQrytTZzZP1DTbHkEua0PyjURYjQ3a7lxMOj9vEsHcCGEP0nCXTKWL12ozkZeeWpWlWYKUwNQo94RhmdtUgyxeHX4HP36_UgV60MtUbgQ1QiQmLQqmzW_sJCkYtr9vdUNQgdcSMpJ0ew3vUiEQzGK6EWeBcFHcVCasfHQLViXBifmuC9BAdBvDa1Y-gDPcig2ROhNxZbEKZ2o',
    permissions: {
      canApproveBatch: true,
      canConfigureAI: true,
      canDeleteRecords: true,
      canGeneratePartnerReport: true
    }
  },
  {
    id: 'role-litigator',
    name: 'Lic. Roberto Méndez Aranda',
    roleTitle: 'Abogado Titular de Litigio',
    roleCode: 'LITIGATOR',
    email: 'roberto.mendez@sovereignvault.legal',
    badge: 'Litigio & Juzgados',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=160&q=80',
    permissions: {
      canApproveBatch: true,
      canConfigureAI: false,
      canDeleteRecords: false,
      canGeneratePartnerReport: false
    }
  },
  {
    id: 'role-paralegal',
    name: 'Lic. Sofía Ramírez',
    roleTitle: 'Paralegal • Ingesta & Archivo IA',
    roleCode: 'PARALEGAL',
    email: 'sofia.ramirez@sovereignvault.legal',
    badge: 'Operador Zero-Touch',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=160&q=80',
    permissions: {
      canApproveBatch: false,
      canConfigureAI: false,
      canDeleteRecords: false,
      canGeneratePartnerReport: false
    }
  }
];

export const INITIAL_CLIENTS = [
  {
    id: 'CLI-9402',
    name: 'TechCorp Iberoamérica S.A.',
    type: 'Corporativo',
    rfc: 'TIB190822KL9',
    representative: 'Lic. Rodrigo Méndez Aranda',
    email: 'juridico@techcorp-ibero.com',
    phone: '+52 55 8492 1100',
    sector: 'Tecnología & Cloud',
    status: 'Activo',
    createdAt: '2024-01-15'
  },
  {
    id: 'CLI-7719',
    name: 'Innova Logistics S.L.',
    type: 'Corporativo',
    rfc: 'ILO200411M82',
    representative: 'Ing. Carlos Salvatierra',
    email: 'legal@innovalogistics.es',
    phone: '+52 55 4190 8821',
    sector: 'Cadena de Suministro',
    status: 'Activo',
    createdAt: '2024-03-10'
  },
  {
    id: 'CLI-1002',
    name: 'Banco Santander Corporativo',
    type: 'Gran Cuenta',
    rfc: 'BSC950101AA1',
    representative: 'Mtro. Alejandro Garza',
    email: 'contencioso@santander-corp.mx',
    phone: '+52 55 5169 4300',
    sector: 'Banca & Finanzas',
    status: 'Activo',
    createdAt: '2023-06-20'
  },
  {
    id: 'CLI-4410',
    name: 'Grupo Farmacéutico del Norte',
    type: 'Corporativo',
    rfc: 'GFN180312P90',
    representative: 'Dra. Patricia Elizondo',
    email: 'regulatorio@farmanorte.mx',
    phone: '+52 81 8345 9010',
    sector: 'Salud & Biotecnología',
    status: 'Activo',
    createdAt: '2023-11-04'
  },
  {
    id: 'CLI-5501',
    name: 'Grupo Logístico Federal',
    type: 'Gran Cuenta',
    rfc: 'GLF170909TR4',
    representative: 'Lic. Fernando Alcántara',
    email: 'direccion.legal@logisticofederal.mx',
    phone: '+52 55 9102 3340',
    sector: 'Transporte Federal',
    status: 'Activo',
    createdAt: '2024-02-19'
  },
  {
    id: 'CLI-6104',
    name: 'Operadora Hotelera del Norte',
    type: 'Corporativo',
    rfc: 'OHN160521QW2',
    representative: 'Lic. Mariana Villarreal',
    email: 'fiscal@operadorahotelera.mx',
    phone: '+52 81 1290 4412',
    sector: 'Turismo & Hospitalidad',
    status: 'Activo',
    createdAt: '2023-08-12'
  },
  {
    id: 'CLI-3090',
    name: 'Banco Metropolitano Corp',
    type: 'Gran Cuenta',
    rfc: 'BMC011120LP8',
    representative: 'Lic. Héctor Bustamante',
    email: 'litigio.civil@bancometropolitano.mx',
    phone: '+52 55 3090 7700',
    sector: 'Banca Múltiple',
    status: 'Activo',
    createdAt: '2022-09-01'
  },
  {
    id: 'CLI-8210',
    name: 'Manufacturas Aeronáuticas MX',
    type: 'Gran Cuenta',
    rfc: 'MAM140719JK1',
    representative: 'Ing. Gustavo Mondragón',
    email: 'relaciones.laborales@aeromx-mfg.com',
    phone: '+52 442 219 8080',
    sector: 'Industria Aeroespacial',
    status: 'Activo',
    createdAt: '2024-01-05'
  },
  {
    id: 'CLI-3349',
    name: 'Consorcio Vías del Norte',
    type: 'Corporativo',
    rfc: 'CVN150228HG6',
    representative: 'Arq. Esteban Domínguez',
    email: 'licitaciones@viasdelnorte.mx',
    phone: '+52 81 4410 9200',
    sector: 'Infraestructura & Obra Pública',
    status: 'Activo',
    createdAt: '2023-04-17'
  }
];

export const INITIAL_CASES = [
  {
    id: 'EXP-2024-8841-CIV',
    title: 'Juicio Ejecutivo Mercantil: TechCorp vs. GlobalTech',
    subtitle: 'Demanda Mercantil v. GlobalTech',
    matter: 'Mercantil',
    clientId: 'CLI-9402',
    clientName: 'TechCorp Iberoamérica S.A.',
    court: '3º de lo Civil de 1ª Instancia (Sede Central Judicial)',
    lawyer: 'Dra. Elena Valdés',
    amount: '$1,250,000 USD',
    amountNote: 'Pagarés ejecutivos adjuntos',
    stage: 'Etapa Probatoria',
    status: 'En trámite',
    statusColor: 'emerald',
    priority: 'Alta Prioridad',
    hasUpcomingHearing: true,
    pendingAIReview: false,
    lastDocName: 'Demanda_2026-11-06_Actividad03-1RA_EVA-FBD-ISC.pdf',
    lastUpdateText: 'Hace 8 min • 99.4% verificado'
  },
  {
    id: 'EXP-2024-9102',
    title: 'Contrato de Suministro y Arrendamiento',
    subtitle: 'Juicio Ordinario Mercantil',
    matter: 'Mercantil',
    clientId: 'CLI-5501',
    clientName: 'Grupo Logístico Federal',
    court: 'Juzgado 8vo Distrito en Materia Civil',
    lawyer: 'Dra. Elena Valdés',
    amount: '$840,000 USD',
    amountNote: 'Garantía líquida depositada',
    stage: 'Instrucción',
    status: 'En trámite',
    statusColor: 'emerald',
    priority: 'Alta Prioridad',
    hasUpcomingHearing: false,
    pendingAIReview: false,
    lastDocName: 'Contrato_2026-11-06_Anexo_Adendum_2024.pdf',
    lastUpdateText: 'Hace 8 min • 100% verificado'
  },
  {
    id: 'EXP-2023-8819',
    title: 'Nulidad de Resolución Fiscal SAT',
    subtitle: 'Juicio Contencioso Administrativo',
    matter: 'Administrativo',
    clientId: 'CLI-6104',
    clientName: 'Operadora Hotelera del Norte',
    court: 'Sala Regional Metropolitana TFJA',
    lawyer: 'Lic. Roberto Méndez Aranda',
    amount: '$4,920,000 MXN',
    amountNote: 'Crédito fiscal impugnado',
    stage: 'Alegatos',
    status: 'En alegatos',
    statusColor: 'amber',
    priority: 'Normal',
    hasUpcomingHearing: false,
    pendingAIReview: true,
    lastDocName: 'Audiencia_2026-11-05_Escrito_Alegatos_Finales.docx',
    lastUpdateText: 'Ayer 18:45 • Firma electrónica'
  },
  {
    id: 'EXP-2022-3104',
    title: 'Reclamación por Daños y Perjuicios Civiles',
    subtitle: 'Responsabilidad Objetiva Civil',
    matter: 'Civil',
    clientId: 'CLI-3090',
    clientName: 'Banco Metropolitano Corp',
    court: 'Juzgado 22º Civil de Primera Instancia',
    lawyer: 'Dra. Elena Valdés',
    amount: '$3,100,000 MXN',
    amountNote: 'Peritaje valuatorio integrado',
    stage: 'Cierre de Instrucción',
    status: 'Pendiente de sentencia',
    statusColor: 'primary',
    priority: 'Alta Prioridad',
    hasUpcomingHearing: false,
    pendingAIReview: false,
    lastDocName: 'Notificacion_2026-11-04_Acuerdo_Cierre_Instruccion.pdf',
    lastUpdateText: '2 días atrás • Boleta oficial'
  },
  {
    id: 'EXP-2024-0012',
    title: 'Conflicto Colectivo de Naturaleza Económica',
    subtitle: 'Materia Laboral Colectiva',
    matter: 'Laboral',
    clientId: 'CLI-8210',
    clientName: 'Manufacturas Aeronáuticas MX',
    court: 'Tribunal Laboral Federal de Asuntos Colectivos',
    lawyer: 'Lic. Roberto Méndez Aranda',
    amount: '$6,500,000 MXN',
    amountNote: 'Pliego de emplazamiento sindical',
    stage: 'Conciliación',
    status: 'En trámite',
    statusColor: 'emerald',
    priority: 'Normal',
    hasUpcomingHearing: true,
    pendingAIReview: false,
    lastDocName: 'Contrato_2026-11-03_Convenio_Modificatorio_CCT.pdf',
    lastUpdateText: '3 días atrás • Dictaminado'
  },
  {
    id: 'EXP-2023-5100-LAB',
    title: 'Juicio Ordinario Laboral Reinstalación',
    subtitle: 'Defensa Patronal Corporativa',
    matter: 'Laboral',
    clientId: 'CLI-9402',
    clientName: 'TechCorp Iberoamérica S.A.',
    court: 'Tribunal Laboral Local CDMX',
    lawyer: 'Lic. Roberto Méndez Aranda',
    amount: '$480,000 MXN',
    amountNote: 'Contingencia calculada',
    stage: 'Desahogo de Pruebas',
    status: 'En trámite',
    statusColor: 'emerald',
    priority: 'Normal',
    hasUpcomingHearing: false,
    pendingAIReview: false,
    lastDocName: 'Prueba_2026-10-28_Recibos_Nomina_Timbrados.pdf',
    lastUpdateText: 'Hace 5 días • 99.1% verificado'
  },
  {
    id: 'EXP-2025-0104-CORP',
    title: 'Marco Contractual y Confidencialidad Logística',
    subtitle: 'Blindaje Corporativo & NDA Bilateral',
    matter: 'Mercantil',
    clientId: 'CLI-7719',
    clientName: 'Innova Logistics S.L.',
    court: 'Centro de Arbitraje de México (CAM)',
    lawyer: 'Dra. Elena Valdés',
    amount: '$920,000 USD',
    amountNote: 'Penalidad convencional por incumplimiento',
    stage: 'Vigente / Auditoría',
    status: 'En trámite',
    statusColor: 'emerald',
    priority: 'Normal',
    hasUpcomingHearing: false,
    pendingAIReview: false,
    lastDocName: 'Contrato_2026-11-06_Contrato_Prestacion_Servicios_Confidencial.docx',
    lastUpdateText: 'Hoy 16:23 • Auto-creado por IA'
  },
  {
    id: 'EXP-2023-1102-ADM',
    title: 'Impugnación de Licitación Pública Federal',
    subtitle: 'Recurso de Revisión Administrativa',
    matter: 'Administrativo',
    clientId: 'CLI-3349',
    clientName: 'Consorcio Vías del Norte',
    court: 'Tribunal Colegiado en Materia Administrativa',
    lawyer: 'Lic. Roberto Méndez Aranda',
    amount: '$18,400,000 MXN',
    amountNote: 'Fianza de cumplimiento exhibida',
    stage: 'Resolución Interlocutoria',
    status: 'Pendiente de Revisión IA',
    statusColor: 'amber',
    priority: 'Alta Prioridad',
    hasUpcomingHearing: false,
    pendingAIReview: true,
    lastDocName: 'Notificacion_2026-11-06_Folio_Resolucion_Tribunal_Notif_639.pdf',
    lastUpdateText: 'Hoy 16:23 • Super-Res Aplicado'
  },
  {
    id: 'EXP-2023-4512-NOT',
    title: 'Protocolización de Poderes y Garantías Sindicadas',
    subtitle: 'Representación Legal Corporativa',
    matter: 'Mercantil',
    clientId: 'CLI-1002',
    clientName: 'Banco Santander Corporativo',
    court: 'Notaría Pública No. 42 CDMX / Registro Público',
    lawyer: 'Dra. Elena Valdés',
    amount: '$12,000,000 USD',
    amountNote: 'Línea de crédito corporativa',
    stage: 'Inscrito',
    status: 'En trámite',
    statusColor: 'emerald',
    priority: 'Normal',
    hasUpcomingHearing: false,
    pendingAIReview: false,
    lastDocName: 'Poder_2026-11-06_Poder_Notarial_Apostillado_2024.pdf',
    lastUpdateText: 'Hoy 16:23 • 98.9% verificado'
  }
];

export const INITIAL_DOCUMENTS = [
  {
    id: 'doc-1',
    originalName: 'Actividad03-1RA EVA-FBD-ISC.pdf',
    normalizedName: 'Demanda_2026-11-06_Actividad03-1RA_EVA-FBD-ISC.pdf',
    category: 'Demandas',
    docTypeLabel: 'Escrito Inicial de Demanda',
    clientId: 'CLI-9402',
    clientName: 'TechCorp Iberoamérica S.A.',
    caseId: 'EXP-2024-8841-CIV',
    court: '3º de lo Civil de 1ª Instancia',
    confidence: 99.4,
    sizeLabel: '14.2 MB',
    fojas: 48,
    uploadedAt: 'Hoy, 16:23',
    dateISO: '2026-11-06',
    sha256: '8f4e2b91c04d7a3e6f1190bc5a2d3e8f4e2a19c7b6d5e4f3a2b1c0d9e8f7a19c',
    ext: 'pdf',
    chips: [
      { label: 'Fojas', value: '48' },
      { label: 'Cuantía', value: '$1,250,000 USD' },
      { label: 'Demandado', value: 'Logística Global S.A.' }
    ],
    alertBadge: null,
    entities: {
      actor: 'TechCorp Iberoamérica S.A.',
      actorMeta: 'RFC: TIB190822KL9 • 100% Coincidencia',
      demandado: 'GlobalTech Solutions S.A. de C.V.',
      demandadoMeta: 'Persona Moral • Domicilio procesal extraído',
      representante: 'Lic. Rodrigo Méndez Aranda',
      representanteMeta: 'Poder Notarial No. 44,120',
      obligacion: '$1,250,000.00 USD',
      obligacionMeta: 'Más 4.5% moratorio pactado'
    },
    ocrSnippet: '"...que por medio del presente ocurso vengo a demandar en la VÍA EJECUTIVA MERCANTIL a la moral GlobalTech Solutions S.A., el pago de la cantidad cierta y líquida derivada de los 3 pagarés vencidos al 1 de septiembre de 2024..."',
    fullPreviewText: `JUICIO EJECUTIVO MERCANTIL
EXPEDIENTE: EXP-2024-8841-CIV
ACTOR: TECHCORP IBEROAMÉRICA S.A.
DEMANDADO: GLOBALTECH SOLUTIONS S.A. DE C.V.

C. JUEZ TERCERO DE LO CIVIL DE PRIMERA INSTANCIA EN MATERIA MERCANTIL.
PRESENTE.

LIC. RODRIGO MÉNDEZ ARANDA, en mi carácter de Apoderado General para Pleitos y Cobranzas de la moral denominada TECHCORP IBEROAMÉRICA S.A. (RFC: TIB190822KL9), personalidad que acredito debidamente con el testimonio de la Escritura Pública número 44,120, ante Usted con el debido respeto comparezco para exponer:

Que por medio del presente escrito inicial y en la VÍA EJECUTIVA MERCANTIL, vengo a demandar de GLOBALTECH SOLUTIONS S.A. DE C.V. el cumplimiento de las siguientes:

PRESTACIONES:
A) El pago de la cantidad de $1,250,000.00 USD (UN MILLÓN DOSCIENTOS CINCUENTA MIL DÓLARES 00/100 MONEDA DE CURSO LEGAL EN EE.UU.) por concepto de suerte principal derivada de tres pagarés ejecutivos suscritos y vencidos.
B) El pago de los intereses moratorios pactados a razón del 4.5% mensual desde la fecha de constitución en mora hasta la total solución del adeudo.
C) El pago de gastos y costas judiciales que el presente juicio origine.`,
    engineLogs: [
      '[16:23:01.04] Ingesta buffer 14.2 MB finalizada',
      '[16:23:01.21] Modelo Legal-LLM-Spanish-70B activado',
      '[16:23:01.44] Detectado: "Demanda Ejecutiva Mercantil"',
      '[16:23:01.62] 3 entidades corporativas relacionadas',
      '[16:23:01.89] Plazo 72h registrado en Agenda Judicial',
      '[16:23:02.01] Cripto-Hash SHA-256 generado y anclado'
    ]
  },
  {
    id: 'doc-2',
    originalName: 'Contestacion_Demanda_Excepciones.pdf',
    normalizedName: 'Demanda_2026-11-05_Contestacion_Demanda_Excepciones.pdf',
    category: 'Demandas',
    docTypeLabel: 'Contestación y Excepciones',
    clientId: 'CLI-9402',
    clientName: 'TechCorp Iberoamérica S.A.',
    caseId: 'EXP-2024-8841-CIV',
    court: '3º de lo Civil de 1ª Instancia',
    confidence: 98.2,
    sizeLabel: '8.4 MB',
    fojas: 32,
    uploadedAt: 'Ayer, 11:15',
    dateISO: '2026-11-05',
    sha256: '4a9c1d82e77b3f5091a8c2d4e6f8012399ab4c5d6e7f8091a2b3c4d5e6f7b921',
    ext: 'pdf',
    chips: [
      { label: 'Fojas', value: '32' },
      { label: 'Excepción', value: 'Incompetencia por declinatoria', isError: true }
    ],
    alertBadge: null,
    entities: {
      actor: 'TechCorp Iberoamérica S.A.',
      actorMeta: 'Parte Actora Principal',
      demandado: 'GlobalTech Solutions S.A. de C.V.',
      demandadoMeta: 'Promovente de Excepciones Procesales',
      representante: 'Lic. Martín Cárdenas Solís',
      representanteMeta: 'Apoderado de la Demandada',
      obligacion: '$1,250,000.00 USD',
      obligacionMeta: 'Controvertida parcialmente en intereses'
    },
    ocrSnippet: '"...vengo en tiempo y forma a dar CONTESTACIÓN A LA DEMANDA instaurada en contra de mi representada, oponiendo desde este momento la EXCEPCIÓN DE INCOMPETENCIA POR DECLINATORIA y la de falta de acción..."',
    fullPreviewText: `CONTESTACIÓN DE DEMANDA Y OPOSICIÓN DE EXCEPCIONES
EXPEDIENTE: EXP-2024-8841-CIV

C. JUEZ TERCERO DE LO CIVIL DE PRIMERA INSTANCIA.
PRESENTE.

Comparezco en representación de la parte demandada para dar formal contestación al escrito inicial de demanda, oponiendo la EXCEPCIÓN DE INCOMPETENCIA POR DECLINATORIA con fundamento en la cláusula arbitral invocada en el contrato marco de suministro.

Se solicita se dé vista a la parte actora por el término de ley de tres días hábiles para que manifieste lo que a su derecho convenga.`,
    engineLogs: [
      '[11:15:10.12] Ingesta buffer 8.4 MB finalizada',
      '[11:15:10.48] Clasificado en carpeta: Demandas / Contestación',
      '[11:15:10.77] Alerta procesal: Excepción de incompetencia detectada',
      '[11:15:11.02] Cripto-Hash SHA-256 verificado'
    ]
  },
  {
    id: 'doc-3',
    originalName: 'Prueba_Documental_Contrato_Original.pdf',
    normalizedName: 'Prueba_2024-10-14_Prueba_Documental_Contrato_Original.pdf',
    category: 'Pruebas',
    docTypeLabel: 'Prueba Documental Privada',
    clientId: 'CLI-9402',
    clientName: 'TechCorp Iberoamérica S.A.',
    caseId: 'EXP-2024-8841-CIV',
    court: '3º de lo Civil de 1ª Instancia',
    confidence: 99.8,
    sizeLabel: '4.1 MB',
    fojas: 12,
    uploadedAt: '14 Oct 2024',
    dateISO: '2024-10-14',
    sha256: '7c3e9a10b4d2f8e6123098ab45cd67ef89ab01cd23ef456789ab01cd23ef45c1',
    ext: 'pdf',
    chips: [
      { label: 'Fojas', value: '12' },
      { label: 'Cláusula', value: 'Cláusula arbitral detectada (ICC París)', isPrimary: true }
    ],
    alertBadge: null,
    entities: {
      actor: 'TechCorp Iberoamérica S.A.',
      actorMeta: 'Proveedor Tecnológico',
      demandado: 'GlobalTech Solutions S.A. de C.V.',
      demandadoMeta: 'Cliente Licenciatario',
      representante: 'Lic. Rodrigo Méndez Aranda',
      representanteMeta: 'Firmante acreditado',
      obligacion: '$1,250,000.00 USD',
      obligacionMeta: 'Anexo Técnico 1 y 3 Pagarés'
    },
    ocrSnippet: '"...CLÁUSULA DÉCIMA OCTAVA (SOLUCIÓN DE CONTROVERSIAS): Para la interpretación y cumplimiento de las obligaciones cambiarias de los pagarés anexos, las partes se someten expresamente a los Tribunales Mercantiles..."',
    fullPreviewText: `ANEXO PROBATORIO DOCUMENTAL N° 1
CONTRATO MARCO DE LICENCIAMIENTO Y SUMINISTRO DE INFRAESTRUCTURA
EXPEDIENTE: EXP-2024-8841-CIV

Celebrado entre TECHCORP IBEROAMÉRICA S.A. y GLOBALTECH SOLUTIONS S.A. DE C.V.
Consta de 12 fojas útiles con firmas autógrafas y sello digital de tiempo.`,
    engineLogs: [
      '[09:40:11.05] Ingesta buffer 4.1 MB finalizada',
      '[09:40:11.39] Clasificado en carpeta: Pruebas',
      '[09:40:11.61] Cláusula jurisdiccional y arbitral extraída (99.8%)'
    ]
  },
  {
    id: 'doc-4',
    originalName: 'Cedula_Notificacion_Judicial_Auto.pdf',
    normalizedName: 'Notificacion_2024-10-12_Cedula_Notificacion_Judicial_Auto.pdf',
    category: 'Notificaciones',
    docTypeLabel: 'Cédula de Notificación Personal',
    clientId: 'CLI-9402',
    clientName: 'TechCorp Iberoamérica S.A.',
    caseId: 'EXP-2024-8841-CIV',
    court: '3º de lo Civil de 1ª Instancia',
    confidence: 96.5,
    sizeLabel: '1.9 MB',
    fojas: 4,
    uploadedAt: '12 Oct 2024',
    dateISO: '2024-10-12',
    sha256: '1f2e3d4c5b6a7980112233445566778899aabbccddeeff001122334455667788',
    ext: 'pdf',
    chips: [
      { label: 'Plazo legal procesal', value: '72 horas para desahogo de vista', isError: true },
      { label: 'Notificado', value: 'Notificador Judicial No. 4' }
    ],
    alertBadge: 'Término vence en 3 días',
    entities: {
      actor: 'TechCorp Iberoamérica S.A.',
      actorMeta: 'Notificado en domicilio procesal',
      demandado: 'GlobalTech Solutions S.A. de C.V.',
      demandadoMeta: 'Contraparte',
      representante: 'C. Actuario Adscrito al Juzgado 3º',
      representanteMeta: 'Fe Pública Judicial',
      obligacion: 'Término Fatal: 3 Días Hábiles',
      obligacionMeta: 'Desahogo de vista de excepciones'
    },
    ocrSnippet: '"...SE CONCEDE A LA PARTE ACTORA EL TÉRMINO LEGAL DE TRES DÍAS HÁBILES (72 HORAS) contados a partir del día siguiente al en que surta efectos la presente notificación, para que desahogue la vista ordenada..."',
    fullPreviewText: `CÉDULA DE NOTIFICACIÓN JUDICIAL POR INSTRUCTIVO
JUZGADO TERCERO DE LO CIVIL DE PRIMERA INSTANCIA
EXPEDIENTE: EXP-2024-8841-CIV

En la Ciudad de México, siendo las 13:40 horas, el suscrito Actuario Judicial adscrito notifica formalmente el proveído dictado en autos por el cual se da vista a la parte actora por el término fatal de 3 días hábiles.`,
    engineLogs: [
      '[13:45:02.11] OCR de sello de juzgado completado',
      '[13:45:02.50] Término procesal de 72 horas detectado',
      '[13:45:02.88] Alerta vinculada al calendario de Audiencias'
    ]
  },
  {
    id: 'doc-5',
    originalName: 'Contrato_Prestacion_Servicios_Confidencial.docx',
    normalizedName: 'Contrato_2026-11-06_Contrato_Prestacion_Servicios_Confidencial.docx',
    category: 'Contratos',
    docTypeLabel: 'Acuerdo de Confidencialidad y NDA Bilateral',
    clientId: 'CLI-7719',
    clientName: 'Innova Logistics S.L.',
    caseId: 'EXP-2025-0104-CORP',
    court: 'Centro de Arbitraje de México (CAM)',
    confidence: 97.8,
    sizeLabel: '2.8 MB',
    fojas: 14,
    uploadedAt: 'Hoy, 16:23',
    dateISO: '2026-11-06',
    sha256: '9b8a7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b',
    ext: 'docx',
    chips: [
      { label: 'Cláusulas', value: '14 Cláusulas' },
      { label: 'Origen', value: 'Auto-creado por IA', isPrimary: true }
    ],
    alertBadge: null,
    entities: {
      actor: 'Innova Logistics S.L.',
      actorMeta: 'RFC: ILO200411M82',
      demandado: 'Operadores Portuarios del Pacífico S.A.',
      demandadoMeta: 'Parte Receptora de Información',
      representante: 'Ing. Carlos Salvatierra',
      representanteMeta: 'Representante Legal',
      obligacion: '$920,000.00 USD',
      obligacionMeta: 'Pena convencional por divulgación'
    },
    ocrSnippet: '"...PRIMERA. OBJETO DEL ACUERDO: Ambas partes se obligan a mantener bajo estricta reserva y confidencialidad toda la información logística, rutas aduanales y algoritmos de trazabilidad compartidos..."',
    fullPreviewText: `CONTRATO DE PRESTACIÓN DE SERVICIOS LOGÍSTICOS Y ACUERDO DE CONFIDENCIALIDAD (NDA BILATERAL)
EXPEDIENTE INTERNO: EXP-2025-0104-CORP
CLIENTE: INNOVA LOGISTICS S.L.

Consta de 14 cláusulas relativas a propiedad industrial, secreto comercial y penalidades convencionales por $920,000 USD.`,
    engineLogs: [
      '[16:23:16.02] Extracción DOCX mediante motor Mammoth completada',
      '[16:23:16.35] Expediente nuevo auto-creado: EXP-2025-0104-CORP',
      '[16:23:16.71] Clasificado en carpeta: Contratos (97.8%)'
    ]
  },
  {
    id: 'doc-6',
    originalName: 'Folio_Resolucion_Tribunal_Notif_639.pdf',
    normalizedName: 'Notificacion_2026-11-06_Folio_Resolucion_Tribunal_Notif_639.pdf',
    category: 'Notificaciones',
    docTypeLabel: 'Notificación de Resolución',
    clientId: 'CLI-3349',
    clientName: 'Consorcio Vías del Norte',
    caseId: 'EXP-2023-1102-ADM',
    court: 'Tribunal Colegiado en Materia Administrativa',
    confidence: 86.4,
    sizeLabel: '8.1 MB',
    fojas: 19,
    uploadedAt: 'Hoy, 16:23',
    dateISO: '2026-11-06',
    sha256: '3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d',
    ext: 'pdf',
    chips: [
      { label: 'Calidad Escaneo', value: '150 DPI • Super-Res IA Aplicado' },
      { label: 'Revisión', value: 'Confianza Media • Validar Carpeta', isError: true }
    ],
    alertBadge: 'Validar Clasificación IA',
    entities: {
      actor: 'Consorcio Vías del Norte S.A. de C.V.',
      actorMeta: 'Quejoso / Recurrente',
      demandado: 'Secretaría de Infraestructura y Comunicaciones',
      demandadoMeta: 'Autoridad Responsable',
      representante: 'Arq. Esteban Domínguez',
      representanteMeta: 'Representante Común',
      obligacion: '$18,400,000.00 MXN',
      obligacionMeta: 'Suspensión definitiva en revisión'
    },
    ocrSnippet: '"...VISTOS para resolver los autos del recurso de revisión administrativa relativo al fallo de la licitación pública federal número LPF-2023-881..."',
    fullPreviewText: `RESOLUCIÓN INTERLOCUTORIA - TRIBUNAL COLEGIADO EN MATERIA ADMINISTRATIVA
EXPEDIENTE: EXP-2023-1102-ADM
PROMOVENTE: CONSORCIO VÍAS DEL NORTE S.A. DE C.V.

Documento escaneado a 150 DPI procesado con filtro de super-resolución neuronal. Se recomienda validación por el abogado titular.`,
    engineLogs: [
      '[16:23:17.10] WARN: Folio escaneado con baja resolución (150 DPI)',
      '[16:23:17.55] Filtro super-resolución IA aplicado',
      '[16:23:17.90] Clasificado en Notificaciones (86.4% - Requiere validación)'
    ]
  },
  {
    id: 'doc-7',
    originalName: 'Poder_Notarial_Apostillado_2024.pdf',
    normalizedName: 'Poder_2026-11-06_Poder_Notarial_Apostillado_2024.pdf',
    category: 'Poderes',
    docTypeLabel: 'Poder General para Pleitos y Cobranzas',
    clientId: 'CLI-1002',
    clientName: 'Banco Santander Corporativo',
    caseId: 'EXP-2023-4512-NOT',
    court: 'Notaría Pública No. 42',
    confidence: 98.9,
    sizeLabel: '5.4 MB',
    fojas: 6,
    uploadedAt: 'Hoy, 16:23',
    dateISO: '2026-11-06',
    sha256: '6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f',
    ext: 'pdf',
    chips: [
      { label: 'Fojas', value: '6 Fojas Protocolizadas' },
      { label: 'Apostilla', value: 'Convención de La Haya Verificada', isPrimary: true }
    ],
    alertBadge: null,
    entities: {
      actor: 'Banco Santander Corporativo S.A.',
      actorMeta: 'Poderdante',
      demandado: 'N/A (Instrumento Notarial)',
      demandadoMeta: 'Escritura Pública No. 91,402',
      representante: 'Dra. Elena Valdés / Mtro. Alejandro Garza',
      representanteMeta: 'Apoderados Generales',
      obligacion: 'Facultades de Dominio y Litigio',
      obligacionMeta: 'Vigencia Plena Certificada'
    },
    ocrSnippet: '"...OTORGA PODER GENERAL PARA PLEITOS Y COBRANZAS Y ACTOS DE ADMINISTRACIÓN EN MATERIA LABORAL Y MERCANTIL, con todas las facultades generales y aún las especiales que requieran cláusula especial..."',
    fullPreviewText: `TESTIMONIO DE ESCRITURA PÚBLICA DE PODER GENERAL
NOTARÍA PÚBLICA NÚMERO 42
EXPEDIENTE: EXP-2023-4512-NOT
PODERDANTE: BANCO SANTANDER CORPORATIVO`,
    engineLogs: [
      '[16:23:18.05] Sello notarial y apostilla detectados por visión artificial',
      '[16:23:18.42] Clasificado en carpeta: Poderes (98.9%)'
    ]
  },
  {
    id: 'doc-8',
    originalName: 'Comprobante_Pago_Aranceles_Judiciales.png',
    normalizedName: 'Prueba_2026-11-06_Comprobante_Pago_Aranceles_Judiciales.png',
    category: 'Pruebas',
    docTypeLabel: 'Comprobante Arancelario',
    clientId: 'CLI-9402',
    clientName: 'TechCorp Iberoamérica S.A.',
    caseId: 'EXP-2024-8841-CIV',
    court: '3º de lo Civil de 1ª Instancia',
    confidence: 99.8,
    sizeLabel: '1.2 MB',
    fojas: 1,
    uploadedAt: 'Hoy, 16:23',
    dateISO: '2026-11-06',
    sha256: '2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b',
    ext: 'png',
    chips: [
      { label: 'Tipo', value: 'Recibo Tributario Judicial' },
      { label: 'Cuaderno', value: 'Anexo Cuaderno Principal' }
    ],
    alertBadge: null,
    entities: {
      actor: 'TechCorp Iberoamérica S.A.',
      actorMeta: 'Ordenante del Pago',
      demandado: 'Fondo de Apoyo a la Administración de Justicia',
      demandadoMeta: 'Beneficiario Oficial',
      representante: 'Tesorería Judicial CDMX',
      representanteMeta: 'Línea de Captura Validada',
      obligacion: '$14,850.00 MXN',
      obligacionMeta: 'Derechos de inscripción de embargo'
    },
    ocrSnippet: '"...COMPROBANTE OFICIAL DE PAGO DE DERECHOS Y ARANCELES JUDICIALES - LÍNEA DE CAPTURA: 9940-2218-8841-00 - IMPORTE PAGADO: $14,850.00 MXN..."',
    fullPreviewText: `RECIBO OFICIAL DE PAGO DE ARANCELES Y DERECHOS JUDICIALES
EXPEDIENTE VINCULADO: EXP-2024-8841-CIV
CLIENTE: TECHCORP IBEROAMÉRICA S.A.
IMPORTE: $14,850.00 MXN`,
    engineLogs: [
      '[16:23:18.90] Imagen PNG procesada con OCR de recibos bancarios',
      '[16:23:19.15] Vinculado a EXP-2024-8841-CIV (99.8%)'
    ]
  },
  {
    id: 'doc-9',
    originalName: 'Recurso_Apelacion_Sala_Segunda.docx',
    normalizedName: 'Apelacion_2026-11-06_Recurso_Apelacion_Sala_Segunda.docx',
    category: 'Apelaciones',
    docTypeLabel: 'Recurso de Apelación Procesal',
    clientId: 'CLI-4410',
    clientName: 'Grupo Farmacéutico del Norte',
    caseId: 'EXP-2024-8841-CIV',
    court: 'Segunda Sala Civil del Tribunal Superior',
    confidence: 99.1,
    sizeLabel: '3.6 MB',
    fojas: 22,
    uploadedAt: 'Hace 24 min',
    dateISO: '2026-11-06',
    sha256: '5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a',
    ext: 'docx',
    chips: [
      { label: 'Sala', value: 'Segunda Sala Civil' },
      { label: 'Urgencia', value: 'Plazo fatal 48h hábiles', isError: true }
    ],
    alertBadge: 'Plazo fatal 48h',
    entities: {
      actor: 'Grupo Farmacéutico del Norte',
      actorMeta: 'Apelante / Agraviado',
      demandado: 'Distribuidora Médica Central S.A.',
      demandadoMeta: 'Parte Apelada',
      representante: 'Dra. Elena Valdés',
      representanteMeta: 'Autorizada en términos amplios',
      obligacion: 'Expresión de 4 Agravios de Fondo',
      obligacionMeta: 'Efecto Devolutivo de Tramitación Inmediata'
    },
    ocrSnippet: '"...que estando en tiempo y forma interpongo RECURSO DE APELACIÓN en contra del auto admisorio de pruebas de fecha 29 de octubre, expresando al efecto los siguientes AGRAVIOS..."',
    fullPreviewText: `RECURSO DE APELACIÓN Y EXPRESIÓN DE AGRAVIOS
SEGUNDA SALA CIVIL DEL H. TRIBUNAL SUPERIOR DE JUSTICIA
PROMOVENTE: GRUPO FARMACÉUTICO DEL NORTE`,
    engineLogs: [
      '[15:58:10.00] Documento DOCX analizado',
      '[15:58:10.45] Plazo fatal de 48h detectado y marcado como urgente'
    ]
  }
];

export const INITIAL_HEARINGS = [
  {
    id: 'AUD-01',
    caseId: 'EXP-2023-4110',
    clientName: 'TechCorp Iberoamérica S.A.',
    title: 'Audiencia Preliminar Oral',
    timeBadge: 'En 18 horas',
    dateISO: '2026-11-07T09:30',
    judge: 'Mtro. Roberto Mendoza Cárdenas',
    courtroom: 'Juzgado 14º Civil de Cuantía Menor (Sala B)',
    urgency: 'critical',
    matter: 'Civil',
    notes: 'Depuración del procedimiento, conciliación de las partes y admisión de pruebas documentales y periciales.'
  },
  {
    id: 'AUD-02',
    caseId: 'EXP-2024-0988',
    clientName: 'Innova Logistics S.L.',
    title: 'Desahogo de Pruebas Periciales',
    timeBadge: 'Mañana 10:00 AM',
    dateISO: '2026-11-07T10:00',
    judge: 'Dra. Consuelo Navarro',
    courtroom: '3er Tribunal Colegiado en Materia Civil',
    urgency: 'warning',
    matter: 'Mercantil',
    notes: 'Interrogatorio al perito tercero en discordia en materia de contabilidad y valuación de daños logísticos.'
  },
  {
    id: 'AUD-03',
    caseId: 'EXP-2022-7712',
    clientName: 'Manufacturas Aeronáuticas MX',
    title: 'Conciliación Prejudicial Colectiva',
    timeBadge: 'Jueves 12:30 PM',
    dateISO: '2026-11-09T12:30',
    judge: 'Lic. Jorge Villalobos (Conciliador)',
    courtroom: 'Centro Federal de Conciliación y Registro Laboral',
    urgency: 'normal',
    matter: 'Laboral',
    notes: 'Presentación de propuesta económica de revisión salarial y tabulador 2026.'
  },
  {
    id: 'AUD-04',
    caseId: 'EXP-2024-8841-CIV',
    clientName: 'TechCorp Iberoamérica S.A.',
    title: 'Audiencia de Juicio y Alegatos Mercantiles',
    timeBadge: 'Viernes 11:00 AM',
    dateISO: '2026-11-10T11:00',
    judge: 'Lic. Víctor Hugo Santillán',
    courtroom: 'Juzgado 3º de lo Civil de 1ª Instancia',
    urgency: 'critical',
    matter: 'Mercantil',
    notes: 'Exhibición de pagarés originales en el seguro del juzgado y formulación de alegatos verbales.'
  }
];

export const INITIAL_FEED = [
  {
    id: 'feed-1',
    fileName: 'Contrato de Suministro Internacional.pdf',
    normalizedName: 'Contrato_2026-11-06_Contrato_Suministro_Internacional.pdf',
    tag: 'Mercantil / Contrato',
    caseId: 'EXP-2024-9102',
    clientName: 'Grupo Logístico Federal',
    timeAgo: 'Hace 8 min',
    confidence: 99.8,
    statusType: 'verified',
    icon: 'picture_as_pdf',
    iconColor: 'text-primary'
  },
  {
    id: 'feed-2',
    fileName: 'Recurso de Apelación - Sala Segunda.docx',
    normalizedName: 'Apelacion_2026-11-06_Recurso_Apelacion_Sala_Segunda.docx',
    tag: 'Litigio / Apelación',
    caseId: 'EXP-2024-8841-CIV',
    clientName: 'Grupo Farmacéutico del Norte',
    timeAgo: 'Hace 24 min',
    confidence: 99.1,
    statusType: 'urgent',
    urgentText: 'Plazo fatal detectado: 48h hábiles restantes',
    icon: 'gavel',
    iconColor: 'text-error'
  },
  {
    id: 'feed-3',
    fileName: 'Póliza de Fianza y Garantía.pdf',
    normalizedName: 'Contrato_2026-11-06_Poliza_Fianza_Garantia.pdf',
    tag: 'Financiero / Garantías',
    caseId: 'EXP-2023-4512-NOT',
    clientName: 'Grupo Salinas S.A.B.',
    timeAgo: 'Hace 1h',
    confidence: 98.7,
    statusType: 'ok',
    icon: 'description',
    iconColor: 'text-amber-400'
  },
  {
    id: 'feed-4',
    fileName: 'Sentencia Interlocutoria Exp. 883.pdf',
    normalizedName: 'Notificacion_2026-11-06_Sentencia_Interlocutoria_Exp_883.pdf',
    tag: 'Resolución Judicial',
    caseId: 'EXP-2023-1102-ADM',
    clientName: 'Consorcio Vías del Norte',
    timeAgo: 'Hace 2h',
    confidence: 92.1,
    statusType: 'pending',
    icon: 'balance',
    iconColor: 'text-secondary'
  }
];

export const INITIAL_AI_SETTINGS = {
  mode: 'hybrid', // 'hybrid' (Client PDF/DOCX + Regex) | 'api' (LLM Real via API Key)
  provider: 'gemini', // 'gemini' | 'openrouter' | 'local'
  apiKey: '',
  modelName: 'gemini-2.5-flash',
  openRouterModel: 'google/gemini-2.5-flash',
  localEndpoint: 'http://localhost:11434/v1/chat/completions',
  autoCreateCase: true,
  redactPII: true,
  lowConfidenceThreshold: 90,
  namingPattern: '[Tipo]_[Fecha]_[NombreOriginal]'
};
