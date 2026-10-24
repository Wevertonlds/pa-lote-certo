import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Condominium } from '@/types';
import { CondominiumService } from '@/services/CondominiumService';

export const useCondominiumsStore = defineStore('condominiums', () => {
  const condominiums = ref<Condominium[]>([]);
  const loading = ref(false);

  async function loadCondominiums() {
    loading.value = true;
    try {
      condominiums.value = await CondominiumService.getAll();
    } finally {
      loading.value = false;
    }
  }

  function getBySlug(slug: string): Condominium | undefined {
    return condominiums.value.find(c => c.slug === slug);
  }

  function getById(id: string): Condominium | undefined {
    return condominiums.value.find(c => c.id === id);
  }

  async function createCondominium(data: Omit<Condominium, 'id' | 'createdAt' | 'updatedAt'>) {
    const res = await CondominiumService.create(data);
    await loadCondominiums();
    return res;
  }

  async function updateCondominium(id: string, data: Partial<Condominium>) {
    const res = await CondominiumService.update(id, data);
    await loadCondominiums();
    return res;
  }

  async function deleteCondominium(id: string) {
    const res = await CondominiumService.delete(id);
    await loadCondominiums();
    return res;
  }

  return {
    condominiums,
    loading,
    loadCondominiums,
    getBySlug,
    getById,
    createCondominium,
    updateCondominium,
    deleteCondominium,
  };
});
