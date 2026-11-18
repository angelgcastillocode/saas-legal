/**
 * Generador de Reportes CSV, Informes Ejecutivos de Socio y Exportación Certificada
 */

export function downloadBatchCSV(batchDocs = []) {
  const headers = [
    'ID_Documento',
    'Nombre_Original',
    'Nombre_Normalizado',
    'Cliente',
    'Carpeta_Tipo',
    'Tipo_Especifico',
    'Expediente_Vinculado',
    'Confianza_IA',
    'SHA256'
  ];

  const rows = batchDocs.map(d => [
    d.id || '',
    `"${(d.originalName || '').replace(/"/g, '""')}"`,
    `"${(d.normalizedName || '').replace(/"/g, '""')}"`,
    `"${(d.clientName || '').replace(/"/g, '""')}"`,
    `"${(d.category || '').replace(/"/g, '""')}"`,
    `"${(d.docTypeLabel || '').replace(/"/g, '""')}"`,
    `"${(d.caseId || '').replace(/"/g, '""')}"`,
    `${d.confidence || 98}%`,
    d.sha256 || ''
  ]);

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  triggerBrowserDownload(blob, `Reporte_Ingesta_ZeroTouch_${new Date().toISOString().slice(0, 10)}.csv`);
}

export function downloadRepositoryManifest(state) {
  const manifest = {
    system: 'SaaS Legal — The Sovereign Vault v2.4 AI',
    exportedAt: new Date().toISOString(),
    exportedBy: state.currentUser?.name || 'Dra. Elena Valdés',
    hierarchyRule: 'Nivel 1: Cliente -> Nivel 2: Tipo de Documento -> Nivel 3: Archivo Normalizado ([Tipo]_[Fecha]_[NombreOriginal])',
    totalClients: state.clients.length,
    totalCases: state.cases.length,
    totalDocuments: state.documents.length,
    tree: state.clients.map(client => ({
      clientId: client.id,
      clientName: client.name,
      rfc: client.rfc,
      folders: state.documents
        .filter(d => d.clientId === client.id)
        .reduce((acc, doc) => {
          acc[doc.category] = acc[doc.category] || [];
          acc[doc.category].push({
            normalizedName: doc.normalizedName,
            originalName: doc.originalName,
            caseId: doc.caseId,
            confidence: doc.confidence,
            sha256: doc.sha256
          });
          return acc;
        }, {})
    }))
  };

  const blob = new Blob([JSON.stringify(manifest, null, 2)], { type: 'application/json;charset=utf-8' });
  triggerBrowserDownload(blob, `Indice_Certificado_Repositorio_${new Date().toISOString().slice(0, 10)}.json`);
}

export function triggerBrowserDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 300);
}
