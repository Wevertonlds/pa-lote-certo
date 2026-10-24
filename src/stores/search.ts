import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { SearchQueryFilters, Terrain } from '@/types';
import { useTerrainsStore } from './terrains';
import { useCondominiumsStore } from './condominiums';
import { filterTerrains } from '@/utils/searchParser';

export const useSearchStore = defineStore('search', () => {
  const filters = ref<SearchQueryFilters>({
    keyword: '',
    condominiumId: undefined,
    city: undefined,
    minArea: undefined,
    maxArea: undefined,
    minPrice: undefined,
    maxPrice: undefined,
    terrainType: undefined,
    status: undefined,
  });

  const terrainsStore = useTerrainsStore();
  const condominiumsStore = useCondominiumsStore();

  const filteredTerrains = computed<Terrain[]>(() => {
    return filterTerrains(
      terrainsStore.terrains,
      condominiumsStore.condominiums,
      filters.value
    );
  });

  const availableCities = computed<string[]>(() => {
    const set = new Set<string>();
    condominiumsStore.condominiums.forEach(c => {
      if (c.city) set.add(c.city);
    });
    return Array.from(set);
  });

  function setKeyword(keyword: string) {
    filters.value.keyword = keyword;
  }

  function setFilter<K extends keyof SearchQueryFilters>(key: K, value: SearchQueryFilters[K]) {
    filters.value[key] = value;
  }

  function clearFilters() {
    filters.value = {
      keyword: '',
      condominiumId: undefined,
      city: undefined,
      minArea: undefined,
      maxArea: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      terrainType: undefined,
      status: undefined,
    };
  }

  const hasActiveFilters = computed(() => {
    return !!(
      filters.value.keyword ||
      filters.value.condominiumId ||
      filters.value.city ||
      filters.value.minArea ||
      filters.value.maxArea ||
      filters.value.minPrice ||
      filters.value.maxPrice ||
      filters.value.terrainType ||
      filters.value.status
    );
  });

  return {
    filters,
    filteredTerrains,
    availableCities,
    hasActiveFilters,
    setKeyword,
    setFilter,
    clearFilters,
  };
});
