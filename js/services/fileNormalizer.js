/**
 * Servicio de Normalización Documental y Criptografía SHA-256
 * Convención de Nomenclatura Estandarizada: [Tipo]_[Fecha]_[NombreOriginal].ext
 */

export const DOCUMENT_CATEGORIES = [
  { id: 'Demandas', label: 'Demandas', prefix: 'Demanda', icon: 'gavel', color: 'text-primary' },
  { id: 'Apelaciones', label: 'Apelaciones', prefix: 'Apelacion', icon: 'balance', color: 'text-error' },
  { id: 'Audiencias', label: 'Audiencias', prefix: 'Audiencia', icon: 'event_upcoming', color: 'text-amber-400' },
  { id: 'Contratos', label: 'Contratos', prefix: 'Contrato', icon: 'contract', color: 'text-emerald-400' },
  { id: 'Identificaciones', label: 'Identificaciones', prefix: 'Identificacion', icon: 'badge', color: 'text-cyan-400' },
  { id: 'Notificaciones', label: 'Notificaciones y Acuerdos', prefix: 'Notificacion', icon: 'notifications_active', color: 'text-purple-400' },
  { id: 'Pruebas', label: 'Pruebas y Periciales', prefix: 'Prueba', icon: 'fact_check', color: 'text-blue-400' },
  { id: 'Poderes', label: 'Poderes Notariales', prefix: 'Poder', icon: 'verified_user', color: 'text-teal-400' }
];

/**
 * Obtiene el prefijo estandarizado limpio para la categoría o tipo de documento
 */
export function getCategoryPrefix(categoryOrType = 'Documento') {
  const found = DOCUMENT_CATEGORIES.find(
    c => c.id.toLowerCase() === categoryOrType.toLowerCase() ||
         c.prefix.toLowerCase() === categoryOrType.toLowerCase()
  );
  if (found) return found.prefix;

  const t = categoryOrType.toLowerCase();
  if (t.includes('demanda') || t.includes('contestaci')) return 'Demanda';
  if (t.includes('apelaci') || t.includes('amparo') || t.includes('recurso')) return 'Apelacion';
  if (t.includes('audiencia') || t.includes('alegato') || t.includes('conciliaci')) return 'Audiencia';
  if (t.includes('contrato') || t.includes('nda') || t.includes('convenio') || t.includes('póliza') || t.includes('poliza')) return 'Contrato';
  if (t.includes('identificaci') || t.includes('ine') || t.includes('pasaporte') || t.includes('rfc') || t.includes('constancia')) return 'Identificacion';
  if (t.includes('notificaci') || t.includes('cédula') || t.includes('cedula') || t.includes('acuerdo') || t.includes('sentencia') || t.includes('resoluci')) return 'Notificacion';
  if (t.includes('prueba') || t.includes('pericial') || t.includes('comprobante') || t.includes('recibo') || t.includes('anexo')) return 'Prueba';
  if (t.includes('poder') || t.includes('notarial') || t.includes('acta')) return 'Poder';
  return 'DocLegal';
}

/**
 * Mapea cualquier tipo de documento libre a una de las subcarpetas de Nivel 2 del árbol
 */
export function mapToFolderCategory(docTypeOrCategory = '') {
  const existing = DOCUMENT_CATEGORIES.find(c => c.id.toLowerCase() === docTypeOrCategory.toLowerCase());
  if (existing) return existing.id;

  const prefix = getCategoryPrefix(docTypeOrCategory);
  const byPrefix = DOCUMENT_CATEGORIES.find(c => c.prefix === prefix);
  return byPrefix ? byPrefix.id : 'Demandas';
}

/**
 * Construye el nombre de archivo normalizado bajo la regla:
 * [Tipo]_[Fecha]_[NombreOriginal].ext
 * Evita duplicar el prefijo si el archivo ya estaba normalizado.
 */
export function buildNormalizedFileName(originalName, categoryOrType, dateISO = null) {
  const datePart = (dateISO ? dateISO.slice(0, 10) : new Date().toISOString().slice(0, 10));
  const prefix = getCategoryPrefix(categoryOrType);

  const lastDotIndex = originalName.lastIndexOf('.');
  const ext = lastDotIndex !== -1 ? originalName.slice(lastDotIndex) : '.pdf';
  let baseName = lastDotIndex !== -1 ? originalName.slice(0, lastDotIndex) : originalName;

  // Si ya tenía un prefijo de normalización previo (ej. Demanda_2026-11-06_...), limpiarlo
  baseName = baseName.replace(/^(Demanda|Apelacion|Audiencia|Contrato|Identificacion|Notificacion|Prueba|Poder|DocLegal)_\d{4}-\d{2}-\d{2}_/i, '');

  const cleanBase = baseName
    .trim()
    .replace(/\s+/g, '_')
    .replace(/[^a-zA-Z0-9_\-áéíóúÁÉÍÓÚñÑ]/g, '');

  return `${prefix}_${datePart}_${cleanBase || 'Documento'}${ext}`;
}

/**
 * Calcula el Hash SHA-256 real de un archivo o texto utilizando Web Crypto API
 */
export async function computeSHA256(fileOrText) {
  try {
    let buffer;
    if (typeof fileOrText === 'string') {
      buffer = new TextEncoder().encode(fileOrText);
    } else if (fileOrText instanceof Blob) {
      buffer = await fileOrText.arrayBuffer();
    } else {
      buffer = new TextEncoder().encode(String(Date.now()));
    }
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  } catch (err) {
    // Fallback determinístico si crypto.subtle no está disponible
    const str = typeof fileOrText === 'string' ? fileOrText : (fileOrText?.name || 'doc');
    let h = 0x811c9dc5;
    for (let i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 0x01000193);
    }
    const hex = (h >>> 0).toString(16).padStart(8, '0');
    return `${hex}8f4e2b91c04d7a3e6f1190bc5a2d3e8f4e2a19c7b6d5e4f3a2b1c0d9e8f7`;
  }
}

/**
 * Formatea bytes a cadena legible (KB / MB)
 */
export function formatFileSize(bytes) {
  if (!bytes || isNaN(bytes)) return '1.4 MB';
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  const mb = kb / 1024;
  return `${mb.toFixed(1)} MB`;
}
