/**
 * Utilitário de persistência local para garantir reatividade e persistência entre reloads.
 */
export function getStoredData<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) {
      localStorage.setItem(key, JSON.stringify(fallback));
      return fallback;
    }
    return JSON.parse(item) as T;
  } catch (error) {
    console.error(`[storageHelper] Erro ao recuperar chave ${key}:`, error);
    return fallback;
  }
}

export function setStoredData<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`[storageHelper] Erro ao salvar chave ${key}:`, error);
  }
}

export function simulateDelay(ms: number = 200): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
