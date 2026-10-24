<script setup lang="ts">
import { ref, computed } from 'vue';
import { useCondominiumsStore } from '@/stores/condominiums';
import CondominiumCard from '@/components/catalog/CondominiumCard.vue';
import { Building2, Search, MapPin } from 'lucide-vue-next';

const condominiumsStore = useCondominiumsStore();
const searchQuery = ref('');
const selectedCity = ref('');

const cities = computed(() => {
  const set = new Set<string>();
  condominiumsStore.condominiums.forEach(c => {
    if (c.city) set.add(c.city);
  });
  return Array.from(set);
});

const filteredCondominiums = computed(() => {
  return condominiumsStore.condominiums.filter(condo => {
    if (!condo.isPublished) return false;

    if (selectedCity.value && condo.city !== selectedCity.value) {
      return false;
    }

    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase();
      const matchName = condo.name.toLowerCase().includes(q);
      const matchCity = condo.city.toLowerCase().includes(q);
      const matchDesc = condo.shortDescription.toLowerCase().includes(q);
      return matchName || matchCity || matchDesc;
    }

    return true;
  });
});
</script>

<template>
  <div class="pt-28 pb-20">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Cabeçalho da Página -->
      <div class="text-center max-w-3xl mx-auto mb-12">
        <span class="inline-block px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-sky-100 text-brand-700 mb-3">
          Empreendimentos Horizontais
        </span>
        <h1 class="font-heading text-4xl sm:text-5xl font-bold text-slate-900 tracking-tight">
          Condomínios Fechados
        </h1>
        <p class="text-slate-600 text-base sm:text-lg mt-3">
          Conheça os empreendimentos mais desejados da região, com infraestrutura de ponta, segurança 24h e clubes privativos.
        </p>
      </div>

      <!-- Barra de Filtro de Condomínios -->
      <div class="bg-white rounded-2xl p-4 shadow-card border border-slate-200/80 mb-12 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div class="relative w-full sm:w-80">
          <Search class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Buscar por nome ou região..."
            class="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-brand-600"
          />
        </div>

        <div class="flex items-center gap-3 w-full sm:w-auto">
          <div class="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <MapPin class="w-4 h-4 text-brand-600" />
            <span>Cidade:</span>
          </div>
          <select
            v-model="selectedCity"
            class="text-xs py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-1 focus:ring-brand-700"
          >
            <option value="">Todas as cidades</option>
            <option v-for="c in cities" :key="c" :value="c">{{ c }}</option>
          </select>
        </div>
      </div>

      <!-- Grid de Condomínios -->
      <div 
        v-if="filteredCondominiums.length > 0"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        <CondominiumCard
          v-for="condo in filteredCondominiums"
          :key="condo.id"
          :condominium="condo"
        />
      </div>

      <!-- Estado Vazio -->
      <div 
        v-else 
        class="text-center py-20 bg-white rounded-3xl border border-slate-200/80 p-8"
      >
        <div class="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
          <Building2 class="w-8 h-8" />
        </div>
        <h3 class="font-heading text-xl font-bold text-slate-800 mb-2">
          Nenhum condomínio encontrado
        </h3>
        <p class="text-sm text-slate-500 mb-6">
          Tente alterar o termo da pesquisa ou selecionar outra cidade.
        </p>
        <button
          @click="searchQuery = ''; selectedCity = ''"
          class="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-5 py-2.5 rounded-xl text-xs font-semibold shadow-sm shadow-brand-600/20 transition-all"
        >
          Limpar Filtros
        </button>
      </div>
    </div>
  </div>
</template>
