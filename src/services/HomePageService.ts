import type { HomePageSettings, BannerSlide, ApiResponse } from '@/types';
import { INITIAL_HOME_SETTINGS } from './mockData';
import { getStoredData, setStoredData, simulateDelay } from './storageHelper';

const STORAGE_KEY = 'homepage_settings';

export const HomePageService = {
  async getSettings(): Promise<HomePageSettings> {
    await simulateDelay(150);
    return getStoredData<HomePageSettings>(STORAGE_KEY, INITIAL_HOME_SETTINGS);
  },

  async updateSettings(data: Partial<HomePageSettings>): Promise<ApiResponse<HomePageSettings>> {
    await simulateDelay(200);
    const current = await this.getSettings();
    const updated = { ...current, ...data };
    setStoredData(STORAGE_KEY, updated);

    return {
      success: true,
      data: updated,
      message: 'Configurações da Página Inicial atualizadas!'
    };
  },

  async updateBanners(banners: BannerSlide[]): Promise<ApiResponse<BannerSlide[]>> {
    await simulateDelay(150);
    const settings = await this.getSettings();
    settings.banners = banners;
    setStoredData(STORAGE_KEY, settings);

    return {
      success: true,
      data: banners,
      message: 'Banners atualizados com sucesso!'
    };
  }
};
