import type { Lead, ApiResponse } from '@/types';
import { INITIAL_LEADS } from './mockData';
import { getStoredData, setStoredData, simulateDelay } from './storageHelper';

const STORAGE_KEY = 'leads_data';

export const LeadService = {
  async getAll(): Promise<Lead[]> {
    await simulateDelay(150);
    return getStoredData<Lead[]>(STORAGE_KEY, INITIAL_LEADS);
  },

  async create(data: Omit<Lead, 'id' | 'createdAt' | 'status'>): Promise<ApiResponse<Lead>> {
    await simulateDelay(250);
    const list = await this.getAll();

    const newLead: Lead = {
      ...data,
      id: `lead-${Date.now()}`,
      status: 'novo',
      createdAt: new Date().toISOString(),
    };

    list.unshift(newLead);
    setStoredData(STORAGE_KEY, list);

    return {
      success: true,
      data: newLead,
      message: 'Contato enviado com sucesso! Um consultor entrará em contato em breve.'
    };
  },

  async updateStatus(id: string, status: Lead['status']): Promise<ApiResponse<Lead>> {
    await simulateDelay(150);
    const list = await this.getAll();
    const index = list.findIndex(l => l.id === id);

    if (index === -1) {
      throw new Error('Lead não encontrado.');
    }

    list[index].status = status;
    setStoredData(STORAGE_KEY, list);

    return {
      success: true,
      data: list[index],
      message: 'Status atualizado com sucesso!'
    };
  }
};
