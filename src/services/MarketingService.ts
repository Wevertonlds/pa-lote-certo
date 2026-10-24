import type { MarketingSettings, ApiResponse } from '@/types';
import { INITIAL_MARKETING_SETTINGS } from './mockData';
import { getStoredData, setStoredData, simulateDelay } from './storageHelper';

const STORAGE_KEY = 'marketing_settings';

export const MarketingService = {
  async getSettings(): Promise<MarketingSettings> {
    await simulateDelay(100);
    return getStoredData<MarketingSettings>(STORAGE_KEY, INITIAL_MARKETING_SETTINGS);
  },

  async updateSettings(data: Partial<MarketingSettings>): Promise<ApiResponse<MarketingSettings>> {
    await simulateDelay(200);
    const current = await this.getSettings();
    const updated = { ...current, ...data };
    setStoredData(STORAGE_KEY, updated);

    return {
      success: true,
      data: updated,
      message: 'Configurações de marketing salvas!'
    };
  },

  trackEvent(eventName: string, params: Record<string, any> = {}): void {
    console.info(`[Analytics Event] ${eventName}:`, params);
    // Prepared for future GA4 / GTM push:
    if (typeof window !== 'undefined' && (window as any).dataLayer) {
      (window as any).dataLayer.push({ event: eventName, ...params });
    }
  }
};
