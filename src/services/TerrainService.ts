import type { Terrain, SearchQueryFilters, ApiResponse } from '@/types';
import { INITIAL_TERRAINS } from './mockData';
import { getStoredData, setStoredData, simulateDelay } from './storageHelper';
import { CondominiumService } from './CondominiumService';
import { filterTerrains } from '@/utils/searchParser';
import { slugify } from '@/utils/slug';

const STORAGE_KEY = 'terrains_data';

export const TerrainService = {
  async getAll(): Promise<Terrain[]> {
    await simulateDelay(200);
    return getStoredData<Terrain[]>(STORAGE_KEY, INITIAL_TERRAINS);
  },

  async getPublished(): Promise<Terrain[]> {
    const list = await this.getAll();
    return list.filter(t => t.isPublished);
  },

  async getFeatured(): Promise<Terrain[]> {
    const list = await this.getPublished();
    return list.filter(t => t.isFeatured && t.status === 'disponivel');
  },

  async getById(id: string): Promise<Terrain | null> {
    const list = await this.getAll();
    return list.find(t => t.id === id) || null;
  },

  async getBySlug(slug: string): Promise<Terrain | null> {
    const list = await this.getAll();
    return list.find(t => t.slug === slug) || null;
  },

  async getByCondominiumId(condominiumId: string): Promise<Terrain[]> {
    const list = await this.getAll();
    return list.filter(t => t.condominiumId === condominiumId && t.isPublished);
  },

  async search(filters: SearchQueryFilters): Promise<Terrain[]> {
    await simulateDelay(150);
    const [terrains, condominiums] = await Promise.all([
      this.getAll(),
      CondominiumService.getAll()
    ]);
    return filterTerrains(terrains, condominiums, filters);
  },

  async create(data: Omit<Terrain, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Terrain>> {
    await simulateDelay(250);
    const list = await this.getAll();

    // Auto populate condominiumName if not passed
    let condominiumName = data.condominiumName;
    if (!condominiumName && data.condominiumId) {
      const condo = await CondominiumService.getById(data.condominiumId);
      condominiumName = condo?.name || '';
    }

    const newTerrain: Terrain = {
      ...data,
      condominiumName,
      id: `terrain-${Date.now()}`,
      slug: data.slug?.trim() ? slugify(data.slug) : slugify(`${data.title}-q${data.block}-l${data.lot}`),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    list.unshift(newTerrain);
    setStoredData(STORAGE_KEY, list);

    return {
      success: true,
      data: newTerrain,
      message: 'Terreno cadastrado com sucesso!'
    };
  },

  async update(id: string, data: Partial<Terrain>): Promise<ApiResponse<Terrain>> {
    await simulateDelay(250);
    const list = await this.getAll();
    const index = list.findIndex(t => t.id === id);

    if (index === -1) {
      throw new Error('Terreno não encontrado.');
    }

    let condoName = data.condominiumName || list[index].condominiumName;
    if (data.condominiumId && data.condominiumId !== list[index].condominiumId) {
      const condo = await CondominiumService.getById(data.condominiumId);
      condoName = condo?.name || '';
    }

    const updated: Terrain = {
      ...list[index],
      ...data,
      condominiumName: condoName,
      slug: data.slug ? slugify(data.slug) : (data.title ? slugify(`${data.title}-q${data.block || list[index].block}-l${data.lot || list[index].lot}`) : list[index].slug),
      updatedAt: new Date().toISOString(),
    };

    list[index] = updated;
    setStoredData(STORAGE_KEY, list);

    return {
      success: true,
      data: updated,
      message: 'Terreno atualizado com sucesso!'
    };
  },

  async delete(id: string): Promise<ApiResponse<boolean>> {
    await simulateDelay(250);
    const list = await this.getAll();
    const filtered = list.filter(t => t.id !== id);

    if (filtered.length === list.length) {
      throw new Error('Terreno não encontrado para exclusão.');
    }

    setStoredData(STORAGE_KEY, filtered);
    return {
      success: true,
      data: true,
      message: 'Terreno excluído com sucesso!'
    };
  }
};
