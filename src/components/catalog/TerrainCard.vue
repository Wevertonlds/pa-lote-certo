<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';
import { RouterLink } from 'vue-router';
import type { Terrain } from '@/types';
import { formatCurrency, formatArea, generateWhatsAppLink } from '@/utils/formatters';
import { ContactService } from '@/services/ContactService';
import { 
  Building2, 
  Maximize2, 
  MessageSquare, 
  ArrowUpRight,
  Sparkles,
  Compass
} from 'lucide-vue-next';

const props = defineProps<{
  terrain: Terrain;
}>();

const whatsappNumber = ref('');

onMounted(async () => {
  const contact = await ContactService.getSettings();
  whatsappNumber.value = contact.whatsapp;
});

const formattedPrice = computed(() => {
  if (props.terrain.priceOnRequest || props.terrain.price === null) {
    return 'Consulte-nos';
  }
  return formatCurrency(props.terrain.price);
});

const statusBadge = computed(() => {
  switch (props.terrain.status) {
    case 'disponivel':
      return { label: 'Disponível', bg: 'bg-brand-600/90 text-white border-brand-400/40' };
    case 'reservado':
      return { label: 'Reservado', bg: 'bg-amber-600/90 text-white border-amber-400/40' };
    case 'vendido':
      return { label: 'Vendido', bg: 'bg-slate-700/90 text-slate-200 border-slate-500/40' };
    default:
      return { label: 'Sob Consulta', bg: 'bg-slate-600/90 text-white border-slate-400/40' };
  }
});

const typeLabel = computed(() => {
  const map: Record<string, string> = {
    esquina: 'Lote de Esquina',
    plano: 'Terreno Plano',
    aclive: 'Suave Aclive',
    declive: 'Suave Declive',
    ilha: 'Em Ilha',
    vista_verde: 'Vista para Mata'
  };
  return map[props.terrain.terrainType] || props.terrain.terrainType;
});

const whatsappLink = computed(() => {
  return generateWhatsAppLink({
    whatsappNumber: whatsappNumber.value,
    terrainTitle: props.terrain.title,
    condominiumName: props.terrain.condominiumName,
    block: props.terrain.block,
    lot: props.terrain.lot,
    area: props.terrain.area,
    price: props.terrain.price,
    origin: 'Card de Terreno'
  });
});
</script>

<template>
  <div class="group bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-card hover:shadow-premium-hover transition-all duration-300 flex flex-col h-full">
    <!-- Imagem e Badges -->
    <div class="relative aspect-[16/10] overflow-hidden bg-slate-100">
      <img
        :src="terrain.coverImage || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80'"
        :alt="terrain.title"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        loading="lazy"
      />

      <!-- Overlay gradient -->
      <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />

      <!-- Status Badge -->
      <div class="absolute top-3 left-3 flex items-center gap-2">
        <span 
          :class="[
            'text-[11px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full backdrop-blur-md border shadow-sm',
            statusBadge.bg
          ]"
        >
          {{ statusBadge.label }}
        </span>

        <span
          v-if="terrain.isFeatured"
          class="text-[11px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full bg-crimson-600 text-white shadow-sm flex items-center gap-1 font-bold"
        >
          <Sparkles class="w-3 h-3" />
          Destaque
        </span>
      </div>

      <!-- Tipo de Terreno Badge -->
      <div class="absolute bottom-3 left-3">
        <span class="text-xs font-medium text-white/95 bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/20">
          {{ typeLabel }}
        </span>
      </div>

      <!-- Identificação Quadra e Lote -->
      <div class="absolute bottom-3 right-3 text-right">
        <span class="text-xs font-semibold text-white/90 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/10">
          Q. {{ terrain.block }} • Lote {{ terrain.lot }}
        </span>
      </div>
    </div>

    <!-- Conteúdo do Card -->
    <div class="p-5 flex-1 flex flex-col justify-between">
      <div>
        <!-- Condomínio -->
        <div class="flex items-center gap-1.5 text-xs text-brand-600 font-semibold uppercase tracking-wider mb-1.5">
          <Building2 class="w-3.5 h-3.5 text-brand-500" />
          <span>{{ terrain.condominiumName || 'Condomínio Fechado' }}</span>
        </div>

        <!-- Título -->
        <h3 class="font-heading text-lg font-bold text-slate-900 group-hover:text-brand-600 transition-colors line-clamp-2 leading-snug mb-2">
          {{ terrain.title }}
        </h3>

        <!-- Descrição Curta -->
        <p class="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4">
          {{ terrain.shortDescription }}
        </p>

        <!-- Detalhes: Metragem & Preço -->
        <div class="flex items-center justify-between py-3 border-y border-slate-100 mb-4">
          <div class="flex items-center gap-1.5 text-slate-700">
            <Maximize2 class="w-4 h-4 text-slate-400" />
            <span class="text-sm font-semibold">{{ formatArea(terrain.area) }}</span>
          </div>

          <div class="text-right">
            <span class="text-xs text-slate-400 block font-medium">Valor</span>
            <span class="text-base sm:text-lg font-bold text-brand-600 font-sans">
              {{ formattedPrice }}
            </span>
          </div>
        </div>
      </div>

      <!-- Botões de Ação -->
      <div class="grid grid-cols-2 gap-2 pt-1">
        <RouterLink
          :to="`/terrenos/${terrain.slug}`"
          class="flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold py-2.5 px-3 rounded-xl text-xs transition-colors"
        >
          <span>Ver Detalhes</span>
          <ArrowUpRight class="w-3.5 h-3.5 text-slate-500" />
        </RouterLink>

        <a
          :href="whatsappLink"
          target="_blank"
          rel="noopener noreferrer"
          class="flex items-center justify-center gap-1.5 bg-brand-600 hover:bg-brand-700 text-white font-semibold py-2.5 px-3 rounded-xl text-xs transition-all shadow-sm shadow-brand-600/20"
        >
          <MessageSquare class="w-3.5 h-3.5 text-white" />
          <span>Atendimento</span>
        </a>
      </div>
    </div>
  </div>
</template>
