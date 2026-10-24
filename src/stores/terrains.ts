import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Terrain } from '@/types';
import { TerrainService } from '@/services/TerrainService';

export const useTerrainsStore = defineStore('terrains', () => {
  const terrains = ref<Terrain[]>([]);
  const loading = ref(false);

  async function loadTerrains() {
    loading.value = true;
    try {
      terrains.value = await TerrainService.getAll();
    } finally {
      loading.value = false;
    }
  }

  function getBySlug(slug: string): Terrain | undefined {
    return terrains.value.find(t => t.slug === slug);
  }

  function getById(id: string): Terrain | undefined {
    return terrains.value.find(t => t.id === id);
  }

  function getByCondominiumId(condominiumId: string): Terrain[] {
    return terrains.value.filter(t => t.condominiumId === condominiumId && t.isPublished);
  }

  async function createTerrain(data: Omit<Terrain, 'id' | 'createdAt' | 'updatedAt'>) {
    const res = await TerrainService.create(data);
    await loadTerrains();
    return res;
  }

  async function updateTerrain(id: string, data: Partial<Terrain>) {
    const res = await TerrainService.update(id, data);
    await loadTerrains();
    return res;
  }

  async function deleteTerrain(id: string) {
    const res = await TerrainService.delete(id);
    await loadTerrains();
    return res;
  }

  return {
    terrains,
    loading,
    loadTerrains,
    getBySlug,
    getById,
    getByCondominiumId,
    createTerrain,
    updateTerrain,
    deleteTerrain,
  };
});
