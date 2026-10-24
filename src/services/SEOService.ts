import type { SEOSettings, ApiResponse } from '@/types';
import { INITIAL_SEO_SETTINGS } from './mockData';
import { getStoredData, setStoredData, simulateDelay } from './storageHelper';

const STORAGE_KEY = 'seo_settings';

export const SEOService = {
  async getSettings(): Promise<SEOSettings> {
    await simulateDelay(100);
    return getStoredData<SEOSettings>(STORAGE_KEY, INITIAL_SEO_SETTINGS);
  },

  async updateSettings(data: Partial<SEOSettings>): Promise<ApiResponse<SEOSettings>> {
    await simulateDelay(200);
    const current = await this.getSettings();
    const updated = { ...current, ...data };
    setStoredData(STORAGE_KEY, updated);

    return {
      success: true,
      data: updated,
      message: 'Configurações de SEO salvas!'
    };
  },

  updatePageMeta(params: {
    title?: string;
    description?: string;
    canonical?: string;
    ogImage?: string;
  }): void {
    if (typeof document === 'undefined') return;

    if (params.title) {
      document.title = params.title;
    }

    if (params.description) {
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.setAttribute('name', 'description');
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute('content', params.description);

      let ogDesc = document.querySelector('meta[property="og:description"]');
      if (ogDesc) ogDesc.setAttribute('content', params.description);
    }
  }
};
