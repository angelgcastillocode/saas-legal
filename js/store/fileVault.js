/**
 * Almacén Binario Local (IndexedDB) para el Visor Web y Descarga Remota
 * Guarda los archivos reales subidos desde el PC para que puedan abrirse
 * en el Visor Web integrado o descargarse con su nomenclatura estandarizada.
 */

const DB_NAME = 'SaaSLegalVaultDB';
const DB_VERSION = 1;
const STORE_NAME = 'files';

function openVaultDB() {
  return new Promise((resolve, reject) => {
    if (!window.indexedDB) {
      resolve(null);
      return;
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'docId' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => resolve(null);
  });
}

export async function saveFileToVault(docId, fileBlob, extractedText = '') {
  try {
    const db = await openVaultDB();
    if (!db) return false;
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.put({
        docId,
        blob: fileBlob,
        name: fileBlob?.name || docId,
        type: fileBlob?.type || 'application/octet-stream',
        extractedText,
        savedAt: new Date().toISOString()
      });
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => resolve(false);
    });
  } catch (e) {
    console.warn('Error guardando archivo en Vault IndexedDB:', e);
    return false;
  }
}

export async function getFileFromVault(docId) {
  try {
    const db = await openVaultDB();
    if (!db) return null;
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(docId);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => resolve(null);
    });
  } catch (e) {
    return null;
  }
}

export async function clearVaultDB() {
  try {
    const db = await openVaultDB();
    if (!db) return;
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).clear();
  } catch (e) {
    // ignore
  }
}
