import type { MediaAsset, ApiResponse } from '@/types';
import { INITIAL_MEDIA_ASSETS } from './mockData';
import { getStoredData, setStoredData, simulateDelay } from './storageHelper';

const STORAGE_KEY = 'media_assets_data';

export const MediaService = {
  async getAll(): Promise<MediaAsset[]> {
    await simulateDelay(150);
    return getStoredData<MediaAsset[]>(STORAGE_KEY, INITIAL_MEDIA_ASSETS);
  },

  async getByCategory(category: MediaAsset['category']): Promise<MediaAsset[]> {
    const list = await this.getAll();
    return list.filter(m => m.category === category);
  },

  async add(data: Omit<MediaAsset, 'id' | 'createdAt'>): Promise<ApiResponse<MediaAsset>> {
    await simulateDelay(200);
    const list = await this.getAll();

    const newAsset: MediaAsset = {
      ...data,
      id: `media-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    list.unshift(newAsset);
    setStoredData(STORAGE_KEY, list);

    return {
      success: true,
      data: newAsset,
      message: 'Mídia adicionada com sucesso!'
    };
  },

  async delete(id: string): Promise<ApiResponse<boolean>> {
    await simulateDelay(200);
    const list = await this.getAll();
    const filtered = list.filter(m => m.id !== id);
    setStoredData(STORAGE_KEY, filtered);

    return {
      success: true,
      data: true,
      message: 'Mídia removida com sucesso!'
    };
  }
};
