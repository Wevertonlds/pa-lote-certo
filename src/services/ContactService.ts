import type { ContactSettings, ApiResponse } from '@/types';
import { INITIAL_CONTACT_SETTINGS } from './mockData';
import { getStoredData, setStoredData, simulateDelay } from './storageHelper';

const STORAGE_KEY = 'contact_settings';

export const ContactService = {
  async getSettings(): Promise<ContactSettings> {
    await simulateDelay(100);
    return getStoredData<ContactSettings>(STORAGE_KEY, INITIAL_CONTACT_SETTINGS);
  },

  async updateSettings(data: Partial<ContactSettings>): Promise<ApiResponse<ContactSettings>> {
    await simulateDelay(200);
    const current = await this.getSettings();
    const updated = { ...current, ...data };
    setStoredData(STORAGE_KEY, updated);

    return {
      success: true,
      data: updated,
      message: 'Configurações de contato salvas!'
    };
  }
};
