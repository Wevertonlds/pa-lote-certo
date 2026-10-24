import type { BrandingSettings, ApiResponse } from '@/types';
import { INITIAL_BRANDING } from './mockData';
import { getStoredData, setStoredData, simulateDelay } from './storageHelper';

const STORAGE_KEY = 'branding_settings';

export const BrandingService = {
  async getSettings(): Promise<BrandingSettings> {
    await simulateDelay(100);
    const stored = getStoredData<BrandingSettings>(STORAGE_KEY, INITIAL_BRANDING);
    // If previously saved with the old emerald default, migrate smoothly
    if (
      stored.primaryColor === '#064e3b' || 
      !stored.primaryColor || 
      stored.brandName === 'Lote Certo Imóveis' || 
      !stored.brandName
    ) {
      const migrated = {
        ...stored,
        brandName: 'Lote Certo',
        logoUrl: '/favicon.svg',
        faviconUrl: '/favicon.svg',
        primaryColor: INITIAL_BRANDING.primaryColor,
        secondaryColor: INITIAL_BRANDING.secondaryColor,
        accentColor: INITIAL_BRANDING.accentColor,
        bgColor: INITIAL_BRANDING.bgColor
      };
      setStoredData(STORAGE_KEY, migrated);
      this.applyCSSVariables(migrated);
      return migrated;
    }
    return stored;
  },

  async updateSettings(data: Partial<BrandingSettings>): Promise<ApiResponse<BrandingSettings>> {
    await simulateDelay(200);
    const current = await this.getSettings();
    const updated = { ...current, ...data };
    setStoredData(STORAGE_KEY, updated);
    this.applyCSSVariables(updated);

    return {
      success: true,
      data: updated,
      message: 'Identidade visual atualizada com sucesso!'
    };
  },

  async resetToDefaults(): Promise<ApiResponse<BrandingSettings>> {
    await simulateDelay(150);
    setStoredData(STORAGE_KEY, INITIAL_BRANDING);
    this.applyCSSVariables(INITIAL_BRANDING);
    return {
      success: true,
      data: INITIAL_BRANDING,
      message: 'Padrões visuais restaurados com sucesso!'
    };
  },

  applyCSSVariables(branding: BrandingSettings): void {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    if (branding.primaryColor) root.style.setProperty('--color-brand-primary', branding.primaryColor);
    if (branding.secondaryColor) root.style.setProperty('--color-brand-secondary', branding.secondaryColor);
    if (branding.accentColor) root.style.setProperty('--color-brand-accent', branding.accentColor);
    if (branding.bgColor) root.style.setProperty('--color-brand-bg', branding.bgColor);
    if (branding.fontHeading) root.style.setProperty('--font-heading', branding.fontHeading);
    if (branding.fontBody) root.style.setProperty('--font-body', branding.fontBody);
  }
};
