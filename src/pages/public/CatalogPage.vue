<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useSearchStore } from '@/stores/search';
import { useCondominiumsStore } from '@/stores/condominiums';
import TerrainCard from '@/components/catalog/TerrainCard.vue';
import { 
  Search, 
  SlidersHorizontal, 
  X, 
  MapPin, 
  Building2, 
  Maximize2, 
  DollarSign, 
  Layers,
  Sparkles
} from 'lucide-vue-next';

const route = useRoute();
const searchStore = useSearchStore();
const condominiumsStore = useCondominiumsStore();

const localKeyword = ref(searchStore.filters.keyword || '');
let debounceTimeout: ReturnType<typeof setTimeout> | null = null;

watch(localKeyword, (newVal) => {
  if (debounceTimeout) clearTimeout(debounceTimeout);
  debounceTimeout = setTimeout(() => {
    searchStore.setKeyword(newVal);
  }, 250);
});

onMounted(() => {
  // Se veio rota com slug de condomínio (/condominios/:slug/terrenos)
  if (route.params.slug) {
    const condo = condominiumsStore.getBySlug(route.params.slug as string);
    if (condo) {
      searchStore.setFilter('condominiumId', condo.id);
    }
  }

  // Se veio query param como ?tipo=esquina
  if (route.query.tipo) {
    searchStore.setFilter('terrainType', String(route.query.tipo));
  }
});

const clearAll = () => {
  localKeyword.value = '';
  searchStore.clearFilters();
};
</script>

<template>
  <div class="pt-28 pb-20">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Cabeçalho -->
      <div class="max-w-3xl mb-8">
        <span class="inline-block px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-sky-100 text-brand-700 mb-2">
          Curadoria Imobiliária
        </span>
        <h1 class="font-heading text-4xl sm:text-5xl font-bold text-slate-900 tracking-tight">
          Catálogo de Terrenos
        </h1>
        <p class="text-slate-600 text-sm sm:text-base mt-2">
          Explore nossa seleção rigorosa de lotes residenciais em condomínios de alto padrão.
        </p>
      </div>

      <!-- Barra de Busca Inteligente Superior -->
      <div class="bg-white rounded-2xl p-4 sm:p-5 shadow-card border border-slate-200/90 mb-8">
        <div class="relative">
          <Search class="w-5 h-5 text-brand-600 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            v-model="localKeyword"
            type="text"
            placeholder="Digite naturalmente: ex: 'Lote de esquina no Alphaville', '450m2 plano', 'até 400 mil'..."
            class="w-full pl-12 pr-10 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-brand-700 focus:bg-white"
          />
          <button
            v-if="localKeyword"
            @click="localKeyword = ''; searchStore.setKeyword('')"
            class="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            <X class="w-4 h-4" />
          </button>
        </div>

        <!-- Linha de Filtros Rápidos -->
        <div class="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <!-- Filtro: Condomínio -->
          <div>
            <label class="block text-[11px] font-semibold text-slate-500 mb-1">Condomínio</label>
            <select
              :value="searchStore.filters.condominiumId || ''"
              @change="searchStore.setFilter('condominiumId', ($event.target as HTMLSelectElement).value || undefined)"
              class="w-full text-xs py-2 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none"
            >
              <option value="">Todos</option>
              <option v-for="c in condominiumsStore.condominiums" :key="c.id" :value="c.id">
                {{ c.name }}
              </option>
            </select>
          </div>

          <!-- Filtro: Cidade -->
          <div>
            <label class="block text-[11px] font-semibold text-slate-500 mb-1">Cidade</label>
            <select
              :value="searchStore.filters.city || ''"
              @change="searchStore.setFilter('city', ($event.target as HTMLSelectElement).value || undefined)"
              class="w-full text-xs py-2 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none"
            >
              <option value="">Todas</option>
              <option v-for="city in searchStore.availableCities" :key="city" :value="city">
                {{ city }}
              </option>
            </select>
          </div>

          <!-- Filtro: Tipo de Terreno -->
          <div>
            <label class="block text-[11px] font-semibold text-slate-500 mb-1">Tipo</label>
            <select
              :value="searchStore.filters.terrainType || ''"
              @change="searchStore.setFilter('terrainType', ($event.target as HTMLSelectElement).value || undefined)"
              class="w-full text-xs py-2 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none"
            >
              <option value="">Todos os tipos</option>
              <option value="plano">Plano</option>
              <option value="esquina">Esquina</option>
              <option value="aclive">Aclive</option>
              <option value="declive">Declive</option>
              <option value="ilha">Ilha</option>
            </select>
          </div>

          <!-- Filtro: Preço Máximo -->
          <div>
            <label class="block text-[11px] font-semibold text-slate-500 mb-1">Preço Máximo</label>
            <select
              :value="searchStore.filters.maxPrice || ''"
              @change="searchStore.setFilter('maxPrice', ($event.target as HTMLSelectElement).value ? Number(($event.target as HTMLSelectElement).value) : undefined)"
              class="w-full text-xs py-2 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none"
            >
              <option value="">Sem limite</option>
              <option value="350000">Até R$ 350 mil</option>
              <option value="500000">Até R$ 500 mil</option>
              <option value="750000">Até R$ 750 mil</option>
              <option value="1000000">Até R$ 1 milhão</option>
            </select>
          </div>

          <!-- Filtro: Metragem Mínima -->
          <div>
            <label class="block text-[11px] font-semibold text-slate-500 mb-1">Área Mínima</label>
            <select
              :value="searchStore.filters.minArea || ''"
              @change="searchStore.setFilter('minArea', ($event.target as HTMLSelectElement).value ? Number(($event.target as HTMLSelectElement).value) : undefined)"
              class="w-full text-xs py-2 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none"
            >
              <option value="">Qualquer área</option>
              <option value="400">A partir de 400 m²</option>
              <option value="500">A partir de 500 m²</option>
              <option value="800">A partir de 800 m²</option>
              <option value="1000">A partir de 1.000 m²</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Barra de Status e Contagem -->
      <div class="flex items-center justify-between mb-8 pb-4 border-b border-slate-200">
        <div class="flex items-center gap-2">
          <span class="text-sm font-bold text-slate-900">
            {{ searchStore.filteredTerrains.length }}
          </span>
          <span class="text-sm text-slate-500">
            {{ searchStore.filteredTerrains.length === 1 ? 'terreno encontrado' : 'terrenos encontrados' }}
          </span>
        </div>

        <button
          v-if="searchStore.hasActiveFilters"
          @click="clearAll"
          class="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1"
        >
          <X class="w-3.5 h-3.5" />
          <span>Limpar todos os filtros</span>
        </button>
      </div>

      <!-- Grid de Terrenos -->
      <div 
        v-if="searchStore.filteredTerrains.length > 0"
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        <TerrainCard
          v-for="terrain in searchStore.filteredTerrains"
          :key="terrain.id"
          :terrain="terrain"
        />
      </div>

      <!-- Estado Vazio (Prompt Requisito 4.3: Exibir mensagem amigável quando nenhum terreno for encontrado) -->
      <div 
        v-else 
        class="text-center py-20 bg-white rounded-3xl border border-slate-200 p-8 shadow-card"
      >
        <div class="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
          <Layers class="w-8 h-8" />
        </div>
        <h3 class="font-heading text-2xl font-bold text-slate-800 mb-2">
          Nenhum terreno corresponde aos critérios informados
        </h3>
        <p class="text-sm text-slate-500 max-w-md mx-auto mb-6">
          Experimente suavizar os filtros de busca, aumentar a faixa de preço ou pesquisar por outro condomínio.
        </p>
        <button
          @click="clearAll"
          class="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-6 py-3 rounded-xl text-xs font-semibold shadow-sm shadow-brand-600/20 transition-all"
        >
          Limpar Filtros e Ver Todos os Lotes
        </button>
      </div>
    </div>
  </div>
</template>
