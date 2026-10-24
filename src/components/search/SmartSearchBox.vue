<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useSearchStore } from '@/stores/search';
import { useCondominiumsStore } from '@/stores/condominiums';
import { 
  Search, 
  SlidersHorizontal, 
  X, 
  Building2, 
  MapPin, 
  Sparkles,
  ArrowRight,
  Maximize2,
  DollarSign
} from 'lucide-vue-next';

const router = useRouter();
const searchStore = useSearchStore();
const condominiumsStore = useCondominiumsStore();

const localKeyword = ref(searchStore.filters.keyword || '');
const showFiltersModal = ref(false);

let debounceTimeout: ReturnType<typeof setTimeout> | null = null;

watch(localKeyword, (newVal) => {
  if (debounceTimeout) clearTimeout(debounceTimeout);
  debounceTimeout = setTimeout(() => {
    searchStore.setKeyword(newVal);
  }, 300);
});

const quickTags = [
  'Lote de esquina',
  'Alphaville',
  'Terrenos até R$ 400 mil',
  'Acima de 500 m²',
  'Condomínio com piscina',
  'Lote residencial plano'
];

const applyQuickTag = (tag: string) => {
  localKeyword.value = tag;
  searchStore.setKeyword(tag);
  router.push('/terrenos');
};

const handleSearchSubmit = () => {
  searchStore.setKeyword(localKeyword.value);
  router.push('/terrenos');
};

const handleClear = () => {
  localKeyword.value = '';
  searchStore.clearFilters();
};
</script>

<template>
  <div class="w-full max-w-5xl mx-auto -mt-16 relative z-30 px-4">
    <div class="glass-card bg-white/95 backdrop-blur-xl rounded-2xl shadow-premium border border-slate-200/80 p-4 sm:p-6 transition-all hover:shadow-premium-hover">
      <!-- Input de Busca Inteligente Principal -->
      <form @submit.prevent="handleSearchSubmit" class="relative flex flex-col md:flex-row items-center gap-3">
        <div class="relative w-full flex-1">
          <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
            <Search class="w-5 h-5 text-brand-700" />
          </div>

          <input
            v-model="localKeyword"
            type="text"
            placeholder="Busque por linguagem natural: ex. 'Lote de esquina no Alphaville até 500 mil'..."
            class="w-full pl-12 pr-10 py-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-700 focus:bg-white text-sm sm:text-base transition-all"
          />

          <button
            v-if="localKeyword"
            type="button"
            @click="handleClear"
            class="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
            title="Limpar pesquisa"
          >
            <X class="w-4 h-4" />
          </button>
        </div>

        <div class="flex items-center gap-2 w-full md:w-auto">
          <!-- Botão Filtros Avançados -->
          <button
            type="button"
            @click="showFiltersModal = !showFiltersModal"
            :class="[
              'flex-1 md:flex-initial flex items-center justify-center gap-2 px-5 py-4 rounded-xl text-sm font-semibold border transition-all',
              searchStore.hasActiveFilters 
                ? 'bg-brand-50 border-brand-300 text-brand-800' 
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
            ]"
          >
            <SlidersHorizontal class="w-4 h-4 text-brand-600" />
            <span>Filtros</span>
            <span 
              v-if="searchStore.hasActiveFilters" 
              class="w-2 h-2 rounded-full bg-crimson-600"
            />
          </button>

          <!-- Botão Submeter Busca -->
          <button
            type="submit"
            class="flex-1 md:flex-initial flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-7 py-4 rounded-xl text-sm font-semibold shadow-md shadow-brand-600/25 active:scale-95 transition-all"
          >
            <span>Buscar</span>
            <ArrowRight class="w-4 h-4 text-white" />
          </button>
        </div>
      </form>

      <!-- Tags Rápidas de Inspiração -->
      <div class="mt-4 pt-4 border-t border-slate-100 flex items-center gap-2 flex-wrap">
        <span class="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1">
          <Sparkles class="w-3.5 h-3.5 text-brand-500" />
          Exemplos:
        </span>

        <button
          v-for="tag in quickTags"
          :key="tag"
          type="button"
          @click="applyQuickTag(tag)"
          class="text-xs bg-slate-100 hover:bg-brand-50 hover:text-brand-700 text-slate-700 px-3 py-1 rounded-full border border-slate-200 transition-colors"
        >
          {{ tag }}
        </button>
      </div>

      <!-- Filtros Complementares Expansíveis -->
      <div 
        v-if="showFiltersModal" 
        class="mt-4 pt-4 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in slide-in-from-top-2 duration-200"
      >
        <!-- Filtro: Condomínio -->
        <div>
          <label class="block text-xs font-semibold text-slate-600 mb-1 flex items-center gap-1.5">
            <Building2 class="w-3.5 h-3.5 text-brand-600" />
            Condomínio
          </label>
          <select 
            :value="searchStore.filters.condominiumId || ''"
            @change="searchStore.setFilter('condominiumId', ($event.target as HTMLSelectElement).value || undefined)"
            class="w-full text-xs py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-1 focus:ring-brand-600"
          >
            <option value="">Todos os Condomínios</option>
            <option 
              v-for="c in condominiumsStore.condominiums" 
              :key="c.id" 
              :value="c.id"
            >
              {{ c.name }} ({{ c.city }})
            </option>
          </select>
        </div>

        <!-- Filtro: Cidade -->
        <div>
          <label class="block text-xs font-semibold text-slate-600 mb-1 flex items-center gap-1.5">
            <MapPin class="w-3.5 h-3.5 text-brand-600" />
            Cidade / Região
          </label>
          <select 
            :value="searchStore.filters.city || ''"
            @change="searchStore.setFilter('city', ($event.target as HTMLSelectElement).value || undefined)"
            class="w-full text-xs py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-1 focus:ring-brand-600"
          >
            <option value="">Todas as Cidades</option>
            <option v-for="city in searchStore.availableCities" :key="city" :value="city">
              {{ city }}
            </option>
          </select>
        </div>

        <!-- Filtro: Tipo de Terreno -->
        <div>
          <label class="block text-xs font-semibold text-slate-600 mb-1 flex items-center gap-1.5">
            <Maximize2 class="w-3.5 h-3.5 text-brand-600" />
            Tipo de Terreno
          </label>
          <select 
            :value="searchStore.filters.terrainType || ''"
            @change="searchStore.setFilter('terrainType', ($event.target as HTMLSelectElement).value || undefined)"
            class="w-full text-xs py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-1 focus:ring-brand-600"
          >
            <option value="">Todos os tipos</option>
            <option value="plano">Plano</option>
            <option value="esquina">Esquina</option>
            <option value="aclive">Aclive</option>
            <option value="declive">Declive</option>
            <option value="ilha">Ilha</option>
            <option value="vista_verde">Vista para Mata/Verde</option>
          </select>
        </div>

        <!-- Filtro: Preço Máximo -->
        <div>
          <label class="block text-xs font-semibold text-slate-600 mb-1 flex items-center gap-1.5">
            <DollarSign class="w-3.5 h-3.5 text-brand-600" />
            Preço Máximo
          </label>
          <select 
            :value="searchStore.filters.maxPrice || ''"
            @change="searchStore.setFilter('maxPrice', ($event.target as HTMLSelectElement).value ? Number(($event.target as HTMLSelectElement).value) : undefined)"
            class="w-full text-xs py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-1 focus:ring-brand-700"
          >
            <option value="">Sem limite</option>
            <option value="350000">Até R$ 350.000</option>
            <option value="500000">Até R$ 500.000</option>
            <option value="750000">Até R$ 750.000</option>
            <option value="1000000">Até R$ 1.000.000</option>
          </select>
        </div>
      </div>
    </div>
  </div>
</template>
