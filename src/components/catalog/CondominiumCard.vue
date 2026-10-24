<script setup lang="ts">
import { computed } from 'vue';
import { RouterLink } from 'vue-router';
import type { Condominium } from '@/types';
import { useTerrainsStore } from '@/stores/terrains';
import { 
  MapPin, 
  Building2, 
  ArrowRight, 
  Layers,
  Sparkles
} from 'lucide-vue-next';

const props = defineProps<{
  condominium: Condominium;
}>();

const terrainsStore = useTerrainsStore();

const availableTerrainsCount = computed(() => {
  return terrainsStore.terrains.filter(
    t => t.condominiumId === props.condominium.id && t.isPublished && t.status === 'disponivel'
  ).length;
});
</script>

<template>
  <div class="group bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-card hover:shadow-premium-hover transition-all duration-300 flex flex-col h-full">
    <!-- Imagem de Capa -->
    <div class="relative aspect-[16/10] overflow-hidden bg-slate-100">
      <img
        :src="condominium.coverImage || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80'"
        :alt="condominium.name"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        loading="lazy"
      />

      <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

      <!-- Badges -->
      <div class="absolute top-3 left-3 flex items-center gap-2">
        <span 
          v-if="condominium.isFeatured"
          class="text-[11px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full bg-crimson-600 text-white shadow-sm flex items-center gap-1"
        >
          <Sparkles class="w-3 h-3" />
          Destaque
        </span>
      </div>

      <!-- Contador de Lotes Disponíveis -->
      <div class="absolute bottom-3 left-3 flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 text-white text-xs font-medium">
        <Layers class="w-3.5 h-3.5 text-brand-400" />
        <span>{{ availableTerrainsCount }} {{ availableTerrainsCount === 1 ? 'lote disponível' : 'lotes disponíveis' }}</span>
      </div>
    </div>

    <!-- Conteúdo -->
    <div class="p-6 flex-1 flex flex-col justify-between">
      <div>
        <div class="flex items-center gap-1.5 text-xs text-slate-500 font-medium mb-1.5">
          <MapPin class="w-3.5 h-3.5 text-brand-600" />
          <span>{{ condominium.city }}, {{ condominium.state }}</span>
        </div>

        <h3 class="font-heading text-xl font-bold text-slate-900 group-hover:text-brand-600 transition-colors mb-2">
          {{ condominium.name }}
        </h3>

        <p class="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4">
          {{ condominium.shortDescription }}
        </p>

        <!-- Diferenciais em pílulas -->
        <div class="flex flex-wrap gap-1.5 mb-6">
          <span
            v-for="feature in condominium.features.slice(0, 3)"
            :key="feature"
            class="text-[11px] font-medium bg-slate-50 text-slate-600 px-2.5 py-0.5 rounded-md border border-slate-200"
          >
            {{ feature }}
          </span>
        </div>
      </div>

      <!-- Ações -->
      <div class="pt-3 border-t border-slate-100 flex items-center justify-between">
        <RouterLink
          :to="`/condominios/${condominium.slug}`"
          class="text-xs font-semibold text-slate-700 hover:text-brand-600 flex items-center gap-1"
        >
          <span>Conhecer Estrutura</span>
        </RouterLink>

        <RouterLink
          :to="`/condominios/${condominium.slug}/terrenos`"
          class="inline-flex items-center gap-1.5 bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-sm shadow-brand-600/20 transition-all"
        >
          <span>Ver Terrenos</span>
          <ArrowRight class="w-3.5 h-3.5 text-brand-100" />
        </RouterLink>
      </div>
    </div>
  </div>
</template>
