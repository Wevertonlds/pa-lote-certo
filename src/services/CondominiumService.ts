import type { Condominium, ApiResponse } from '@/types';
import { INITIAL_CONDOMINIUMS } from './mockData';
import { getStoredData, setStoredData, simulateDelay } from './storageHelper';
import { slugify } from '@/utils/slug';

const STORAGE_KEY = 'condominiums_data';

export const CondominiumService = {
  async getAll(): Promise<Condominium[]> {
    await simulateDelay(200);
    return getStoredData<Condominium[]>(STORAGE_KEY, INITIAL_CONDOMINIUMS);
  },

  async getPublished(): Promise<Condominium[]> {
    const list = await this.getAll();
    return list.filter(c => c.isPublished);
  },

  async getFeatured(): Promise<Condominium[]> {
    const list = await this.getPublished();
    return list.filter(c => c.isFeatured);
  },

  async getById(id: string): Promise<Condominium | null> {
    const list = await this.getAll();
    return list.find(c => c.id === id) || null;
  },

  async getBySlug(slug: string): Promise<Condominium | null> {
    const list = await this.getAll();
    return list.find(c => c.slug === slug) || null;
  },

  async create(data: Omit<Condominium, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Condominium>> {
    await simulateDelay(250);
    const list = await this.getAll();

    const newCondo: Condominium = {
      ...data,
      id: `condo-${Date.now()}`,
      slug: data.slug?.trim() ? slugify(data.slug) : slugify(data.name),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    list.unshift(newCondo);
    setStoredData(STORAGE_KEY, list);

    return {
      success: true,
      data: newCondo,
      message: 'Condomínio cadastrado com sucesso!'
    };
  },

  async update(id: string, data: Partial<Condominium>): Promise<ApiResponse<Condominium>> {
    await simulateDelay(250);
    const list = await this.getAll();
    const index = list.findIndex(c => c.id === id);

    if (index === -1) {
      throw new Error('Condomínio não encontrado.');
    }

    const updated: Condominium = {
      ...list[index],
      ...data,
      slug: data.slug ? slugify(data.slug) : (data.name ? slugify(data.name) : list[index].slug),
      updatedAt: new Date().toISOString(),
    };

    list[index] = updated;
    setStoredData(STORAGE_KEY, list);

    return {
      success: true,
      data: updated,
      message: 'Condomínio atualizado com sucesso!'
    };
  },

  async delete(id: string): Promise<ApiResponse<boolean>> {
    await simulateDelay(250);
    const list = await this.getAll();
    const filtered = list.filter(c => c.id !== id);

    if (filtered.length === list.length) {
      throw new Error('Condomínio não encontrado para exclusão.');
    }

    setStoredData(STORAGE_KEY, filtered);
    return {
      success: true,
      data: true,
      message: 'Condomínio excluído com sucesso!'
    };
  }
};
