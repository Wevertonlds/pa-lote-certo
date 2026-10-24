<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { useRoute, RouterLink } from 'vue-router';
import { TerrainService } from '@/services/TerrainService';
import { CondominiumService } from '@/services/CondominiumService';
import { ContactService } from '@/services/ContactService';
import { LeadService } from '@/services/LeadService';
import { SEOService } from '@/services/SEOService';
import { formatCurrency, formatArea, generateWhatsAppLink } from '@/utils/formatters';
import type { Terrain, Condominium, LeisureArea } from '@/types';
import { 
  Building2, 
  MapPin, 
  MessageSquare, 
  ChevronRight, 
  ChevronLeft,
  ChevronUp,
  ChevronDown,
  Send, 
  Waves,
  CheckCircle2,
  ArrowRight,
  Maximize2
} from 'lucide-vue-next';

const route = useRoute();
const terrain = ref<Terrain | null>(null);
const condominium = ref<Condominium | null>(null);
const activePhoto = ref('');
const whatsappUrl = ref('');
const loading = ref(true);

// Estado do Carrossel Vertical de Áreas de Lazer
const leisureStartIndex = ref(0);
const VISIBLE_LEISURE_COUNT = 3;

// Formulário de contato lateral
const leadForm = ref({
  name: '',
  phone: '',
  email: '',
  message: '',
});
const leadSubmitting = ref(false);
const leadSuccess = ref(false);

const loadData = async () => {
  loading.value = true;
  const slug = route.params.slug as string;
  const t = await TerrainService.getBySlug(slug);
  terrain.value = t;

  if (t) {
    activePhoto.value = t.coverImage || (t.photos && t.photos[0]) || '';

    const [condo, contact] = await Promise.all([
      CondominiumService.getById(t.condominiumId),
      ContactService.getSettings()
    ]);
    condominium.value = condo;
    leisureStartIndex.value = 0;

    whatsappUrl.value = generateWhatsAppLink({
      whatsappNumber: contact.whatsapp,
      terrainTitle: t.title,
      condominiumName: condo ? condo.name : t.condominiumName,
      block: t.block,
      lot: t.lot,
      area: t.area,
      price: t.price,
      origin: `Página Detalhes do Terreno (${t.title})`
    });

    leadForm.value.message = `Tenho interesse no terreno "${t.title}" (Quadra ${t.block}, Lote ${t.lot}) e gostaria de agendar uma visita e saber as condições.`;

    SEOService.updatePageMeta({
      title: t.seoTitle || `${t.title} - Quadra ${t.block} Lote ${t.lot} | Lote Certo`,
      description: t.seoDescription || t.shortDescription,
    });
  }
  loading.value = false;
};

onMounted(loadData);
watch(() => route.params.slug, loadData);

// Controles da Galeria de Fotos do Terreno
const currentPhotoIndex = computed(() => {
  if (!terrain.value || !terrain.value.photos) return 0;
  const idx = terrain.value.photos.indexOf(activePhoto.value);
  return idx >= 0 ? idx : 0;
});

const nextPhoto = () => {
  if (!terrain.value || !terrain.value.photos || terrain.value.photos.length === 0) return;
  const nextIdx = (currentPhotoIndex.value + 1) % terrain.value.photos.length;
  activePhoto.value = terrain.value.photos[nextIdx];
};

const prevPhoto = () => {
  if (!terrain.value || !terrain.value.photos || terrain.value.photos.length === 0) return;
  const prevIdx = (currentPhotoIndex.value - 1 + terrain.value.photos.length) % terrain.value.photos.length;
  activePhoto.value = terrain.value.photos[prevIdx];
};

// Controles do Carrossel Vertical de Lazer (Mostra 3 na vertical e vai passando)
const totalLeisureAreas = computed(() => condominium.value?.leisureAreas.length ?? 0);

const visibleLeisureAreas = computed<LeisureArea[]>(() => {
  if (!condominium.value || !condominium.value.leisureAreas) return [];
  const list = condominium.value.leisureAreas;
  if (list.length <= VISIBLE_LEISURE_COUNT) return list;

  const result: LeisureArea[] = [];
  for (let i = 0; i < VISIBLE_LEISURE_COUNT; i++) {
    const idx = (leisureStartIndex.value + i) % list.length;
    result.push(list[idx]);
  }
  return result;
});

const nextLeisure = () => {
  if (totalLeisureAreas.value <= VISIBLE_LEISURE_COUNT) return;
  leisureStartIndex.value = (leisureStartIndex.value + 1) % totalLeisureAreas.value;
};

const prevLeisure = () => {
  if (totalLeisureAreas.value <= VISIBLE_LEISURE_COUNT) return;
  leisureStartIndex.value = (leisureStartIndex.value - 1 + totalLeisureAreas.value) % totalLeisureAreas.value;
};

const statusBadge = computed(() => {
  if (!terrain.value) return { label: '', bg: '' };
  switch (terrain.value.status) {
    case 'disponivel':
      return { label: 'Disponível', bg: 'bg-brand-600 text-white' };
    case 'reservado':
      return { label: 'Reservado', bg: 'bg-amber-600 text-white' };
    case 'vendido':
      return { label: 'Vendido', bg: 'bg-slate-700 text-slate-200' };
    default:
      return { label: 'Sob Consulta', bg: 'bg-slate-600 text-white' };
  }
});

const handleLeadSubmit = async () => {
  if (!leadForm.value.name || !leadForm.value.phone || !terrain.value) return;
  leadSubmitting.value = true;
  try {
    await LeadService.create({
      name: leadForm.value.name,
      phone: leadForm.value.phone,
      email: leadForm.value.email,
      terrainId: terrain.value.id,
      terrainTitle: terrain.value.title,
      condominiumName: condominium.value?.name,
      message: leadForm.value.message,
      source: `Formulário Página do Lote (${terrain.value.title})`
    });
    leadSuccess.value = true;
  } catch (err) {
    console.error(err);
  } finally {
    leadSubmitting.value = false;
  }
};
</script>

<template>
  <div v-if="loading" class="pt-32 pb-20 text-center">
    <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-brand-800 border-t-transparent" />
    <p class="text-sm text-slate-500 mt-3">Carregando detalhes do terreno...</p>
  </div>

  <div v-else-if="!terrain" class="pt-32 pb-20 text-center">
    <h2 class="text-2xl font-bold text-slate-800">Terreno não encontrado</h2>
    <p class="text-slate-500 text-sm mt-2 mb-6">O anúncio pode ter sido comercializado ou desativado.</p>
    <RouterLink to="/terrenos" class="bg-brand-600 text-white px-5 py-2.5 rounded-xl text-xs font-semibold">
      Voltar para o Catálogo
    </RouterLink>
  </div>

  <div v-else class="pt-24 pb-20 space-y-12">
    <!-- Breadcrumbs -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <nav class="flex items-center gap-2 text-xs text-slate-500 flex-wrap">
        <RouterLink to="/" class="hover:text-brand-600">Início</RouterLink>
        <ChevronRight class="w-3 h-3 text-slate-400" />
        <RouterLink to="/terrenos" class="hover:text-brand-600">Catálogo de Terrenos</RouterLink>
        <ChevronRight class="w-3 h-3 text-slate-400" />
        <RouterLink 
          v-if="condominium" 
          :to="`/condominios/${condominium.slug}`" 
          class="hover:text-brand-600"
        >
          {{ condominium.name }}
        </RouterLink>
        <ChevronRight v-if="condominium" class="w-3 h-3 text-slate-400" />
        <span class="text-slate-800 font-semibold truncate">{{ terrain.title }}</span>
      </nav>
    </div>

    <!-- Título, Identificação Quadra/Lote & Status -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-slate-200">
        <div>
          <div class="flex items-center gap-2.5 mb-2 flex-wrap">
            <span :class="['text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full shadow-sm', statusBadge.bg]">
              {{ statusBadge.label }}
            </span>

            <RouterLink 
              v-if="condominium" 
              :to="`/condominios/${condominium.slug}`"
              class="text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full bg-brand-50 text-brand-800 border border-brand-200 hover:bg-brand-100 transition-colors flex items-center gap-1.5"
            >
              <Building2 class="w-3.5 h-3.5 text-brand-500" />
              <span>{{ condominium.name }}</span>
            </RouterLink>

            <span class="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-full">
              Quadra {{ terrain.block }} • Lote {{ terrain.lot }}
            </span>
          </div>

          <h1 class="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight leading-tight">
            {{ terrain.title }}
          </h1>

          <p class="text-slate-500 text-sm sm:text-base mt-2 flex items-center gap-2">
            <MapPin class="w-4 h-4 text-brand-600 shrink-0" />
            <span>{{ condominium ? `${condominium.city} - ${condominium.state} (${condominium.address})` : 'Condomínio Fechado' }}</span>
          </p>
        </div>

        <!-- Preço e WhatsApp CTA -->
        <div class="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end gap-3 shrink-0">
          <div>
            <span class="text-xs text-slate-400 block font-medium lg:text-right">Valor de Venda</span>
            <span class="text-2xl sm:text-3xl font-bold text-brand-600 font-sans">
              {{ terrain.priceOnRequest || terrain.price === null ? 'Consulte-nos' : formatCurrency(terrain.price) }}
            </span>
          </div>

          <a
            :href="whatsappUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-500 text-white font-bold px-6 py-3.5 rounded-2xl text-sm shadow-md shadow-brand-500/25 active:scale-95 transition-all border border-brand-400/30"
          >
            <MessageSquare class="w-4 h-4 text-white" />
            <span>Falar com Atendente no WhatsApp</span>
          </a>
        </div>
      </div>
    </div>

    <!-- SEÇÃO PRINCIPAL: Fotos do Terreno Fixas ao lado do Carrossel Vertical de Áreas de Lazer (3 cards verticais) -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        <!-- COLUNA ESQUERDA (7 Colunas): Foto do Terreno FIXA com troca ao clicar nas miniaturas/setas -->
        <div class="lg:col-span-7 lg:sticky lg:top-24 space-y-4">
          <!-- Foto Principal com Navegação e Badges -->
          <div class="relative aspect-[16/10] sm:aspect-[16/10] rounded-3xl overflow-hidden bg-slate-950 shadow-premium group">
            <img
              :src="activePhoto"
              :alt="terrain.title"
              class="w-full h-full object-cover transition-all duration-300 select-none"
            />

            <!-- Gradiente de acabamento -->
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

            <!-- Contador de Foto e Medida -->
            <div class="absolute top-4 left-4 flex items-center gap-2">
              <span class="bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs font-semibold border border-white/20">
                Foto {{ currentPhotoIndex + 1 }} de {{ terrain.photos.length }}
              </span>
              <span class="bg-emerald-800/90 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs font-semibold border border-emerald-400/30">
                Área: {{ formatArea(terrain.area) }}
              </span>
            </div>

            <!-- Setas de Navegação Direta na Foto -->
            <button
              v-if="terrain.photos && terrain.photos.length > 1"
              @click="prevPhoto"
              class="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition-all opacity-80 hover:opacity-100 group-hover:scale-105"
              aria-label="Foto anterior"
            >
              <ChevronLeft class="w-6 h-6" />
            </button>

            <button
              v-if="terrain.photos && terrain.photos.length > 1"
              @click="nextPhoto"
              class="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition-all opacity-80 hover:opacity-100 group-hover:scale-105"
              aria-label="Próxima foto"
            >
              <ChevronRight class="w-6 h-6" />
            </button>

            <!-- Quadra e Lote identificados -->
            <div class="absolute bottom-4 left-4">
              <span class="text-xs font-bold text-white bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20">
                Quadra {{ terrain.block }} • Lote {{ terrain.lot }}
              </span>
            </div>
          </div>

          <!-- Miniaturas do Lote: Usuário clica e a foto muda instantaneamente -->
          <div v-if="terrain.photos && terrain.photos.length > 1" class="space-y-1.5">
            <span class="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
              Selecione uma foto para visualizar:
            </span>
            <div class="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
              <button
                v-for="(photo, idx) in terrain.photos"
                :key="idx"
                @click="activePhoto = photo"
                :class="[
                  'relative w-24 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer',
                  activePhoto === photo 
                    ? 'border-brand-800 scale-95 shadow-md ring-2 ring-brand-800/40' 
                    : 'border-transparent opacity-70 hover:opacity-100 hover:scale-100'
                ]"
                :aria-label="`Ver foto ${idx + 1}`"
              >
                <img :src="photo" :alt="`Miniatura ${idx + 1}`" class="w-full h-full object-cover" />
              </button>
            </div>
          </div>
        </div>

        <!-- COLUNA DIREITA (5 Colunas): Carrossel Vertical de Áreas de Lazer (3 cards verticais) -->
        <div class="lg:col-span-5 space-y-4">
          <!-- Cabeçalho idêntico à identidade visual de Áreas de Lazer -->
          <div>
            <span class="text-xs font-bold uppercase tracking-widest text-emerald-800 flex items-center gap-1.5 mb-1.5">
              <Waves class="w-4 h-4 text-gold-600" />
              Clube Privativo & Conveniência
            </span>
            <div class="flex items-center justify-between">
              <h2 class="font-heading text-2xl font-bold text-slate-900 tracking-tight">
                Áreas de Lazer Exclusivas
              </h2>

              <!-- Botões de Navegação Vertical (Up / Down) -->
              <div v-if="totalLeisureAreas > VISIBLE_LEISURE_COUNT" class="flex items-center gap-1.5">
                <button
                  @click="prevLeisure"
                  class="w-8 h-8 rounded-full bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 flex items-center justify-center shadow-sm transition-colors"
                  title="Subir área de lazer anterior"
                  aria-label="Área de lazer anterior"
                >
                  <ChevronUp class="w-4 h-4" />
                </button>
                <button
                  @click="nextLeisure"
                  class="w-8 h-8 rounded-full bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 flex items-center justify-center shadow-sm transition-colors"
                  title="Descer próxima área de lazer"
                  aria-label="Próxima área de lazer"
                >
                  <ChevronDown class="w-4 h-4" />
                </button>
              </div>
            </div>
            <p class="text-xs text-slate-500 mt-1">
              Ambientes entregues equipados e decorados para os moradores desfrutarem momentos inesquecíveis.
            </p>
          </div>

          <!-- Indicador do Carrossel Vertical -->
          <div v-if="totalLeisureAreas > VISIBLE_LEISURE_COUNT" class="flex items-center justify-between text-[11px] text-slate-400 font-medium px-1">
            <span>Mostrando 3 de {{ totalLeisureAreas }} áreas de lazer</span>
            <span class="text-emerald-700 font-semibold">Deslize pelas setas para ver mais</span>
          </div>

          <!-- CARDS VERTICAIS: 3 Itens empilhados exatamente como no screenshot -->
          <div class="space-y-4">
            <div
              v-for="leisure in visibleLeisureAreas"
              :key="leisure.id"
              class="bg-white rounded-2xl overflow-hidden border border-slate-200/90 shadow-card hover:shadow-premium-hover transition-all duration-300 group flex flex-col"
            >
              <!-- Imagem da Área de Lazer -->
              <div class="relative aspect-[16/9] w-full overflow-hidden bg-slate-100">
                <img
                  :src="leisure.image"
                  :alt="leisure.title"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>

              <!-- Informações: Título & Descrição -->
              <div class="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 class="font-heading text-lg font-bold text-slate-900 leading-snug group-hover:text-brand-800 transition-colors mb-1.5">
                    {{ leisure.title }}
                  </h3>
                  <p class="text-xs text-slate-600 leading-relaxed line-clamp-2">
                    {{ leisure.description }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Link para ver condomínio -->
          <div class="pt-2">
            <RouterLink
              v-if="condominium"
              :to="`/condominios/${condominium.slug}`"
              class="inline-flex items-center gap-1.5 text-xs font-bold text-brand-800 hover:text-brand-950 transition-colors"
            >
              <span>Conhecer toda a estrutura do condomínio {{ condominium.name }}</span>
              <ArrowRight class="w-3.5 h-3.5 text-gold-600" />
            </RouterLink>
          </div>
        </div>

      </div>
    </div>

    <!-- Informações Detalhadas do Lote, Ficha Técnica e Formulário de Contato -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-slate-200">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <!-- Coluna Esquerda: Descrição Completa e Ficha Técnica -->
        <div class="lg:col-span-8 space-y-8">
          <div>
            <h3 class="font-heading text-2xl font-bold text-slate-900 mb-4">
              Descrição do Imóvel
            </h3>
            <p class="text-slate-600 text-base leading-relaxed whitespace-pre-line">
              {{ terrain.fullDescription }}
            </p>
          </div>

          <!-- Ficha Técnica em Cards -->
          <div class="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-card">
            <h3 class="font-heading text-xl font-bold text-slate-900 mb-6">
              Ficha Técnica do Terreno
            </h3>

            <div class="grid grid-cols-2 sm:grid-cols-4 gap-6">
              <div class="border-l-2 border-brand-800 pl-3">
                <span class="text-xs text-slate-400 block font-medium">Área Total</span>
                <span class="text-lg font-bold text-slate-900 font-sans">{{ formatArea(terrain.area) }}</span>
              </div>

              <div class="border-l-2 border-brand-800 pl-3">
                <span class="text-xs text-slate-400 block font-medium">Quadra / Lote</span>
                <span class="text-lg font-bold text-slate-900 font-sans">Q. {{ terrain.block }} • L. {{ terrain.lot }}</span>
              </div>

              <div class="border-l-2 border-brand-800 pl-3">
                <span class="text-xs text-slate-400 block font-medium">Topografia</span>
                <span class="text-lg font-bold text-slate-900 font-sans capitalize">{{ terrain.terrainType }}</span>
              </div>

              <div class="border-l-2 border-brand-800 pl-3">
                <span class="text-xs text-slate-400 block font-medium">Situação</span>
                <span class="text-lg font-bold text-slate-900 font-sans capitalize">{{ terrain.status }}</span>
              </div>
            </div>

            <!-- Tags de Características -->
            <div class="mt-8 pt-6 border-t border-slate-100">
              <span class="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-3">
                Diferenciais do Lote
              </span>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="feat in terrain.features"
                  :key="feat"
                  class="bg-slate-100 text-slate-700 px-3 py-1 rounded-lg text-xs font-semibold"
                >
                  {{ feat }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Coluna Direita: Formulário de Agendamento de Visita -->
        <div class="lg:col-span-4">
          <div class="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-premium sticky top-28 space-y-6">
            <div>
              <span class="text-xs font-bold uppercase tracking-widest text-emerald-800">
                Atendimento VIP
              </span>
              <h3 class="font-heading text-2xl font-bold text-slate-900 mt-1">
                Agende uma Visita
              </h3>
              <p class="text-xs text-slate-500 mt-1">
                Conheça a posição solar e a vista deste lote pessoalmente com nosso especialista.
              </p>
            </div>

            <div v-if="leadSuccess" class="bg-sky-50 border border-sky-200 text-sky-900 p-4 rounded-xl text-xs flex items-center gap-2.5">
              <CheckCircle2 class="w-5 h-5 text-brand-600 shrink-0" />
              <span>Solicitação enviada com sucesso! Em instantes entraremos em contato.</span>
            </div>

            <form v-else @submit.prevent="handleLeadSubmit" class="space-y-4">
              <div>
                <label class="block text-xs font-semibold text-slate-700 mb-1">Seu Nome *</label>
                <input
                  v-model="leadForm.name"
                  required
                  type="text"
                  placeholder="Nome completo"
                  class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-brand-600"
                />
              </div>

              <div>
                <label class="block text-xs font-semibold text-slate-700 mb-1">WhatsApp / Telefone *</label>
                <input
                  v-model="leadForm.phone"
                  required
                  type="tel"
                  placeholder="(00) 00000-0000"
                  class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-brand-600"
                />
              </div>

              <div>
                <label class="block text-xs font-semibold text-slate-700 mb-1">E-mail</label>
                <input
                  v-model="leadForm.email"
                  type="email"
                  placeholder="seu@email.com"
                  class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-brand-600"
                />
              </div>

              <div>
                <label class="block text-xs font-semibold text-slate-700 mb-1">Mensagem</label>
                <textarea
                  v-model="leadForm.message"
                  rows="3"
                  class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-brand-600"
                ></textarea>
              </div>

              <button
                type="submit"
                :disabled="leadSubmitting"
                class="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-3 px-4 rounded-xl text-xs shadow-md shadow-brand-600/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                <Send class="w-4 h-4 text-white" />
                <span>{{ leadSubmitting ? 'Enviando...' : 'Solicitar Atendimento do Lote' }}</span>
              </button>

              <div class="text-center pt-2">
                <a
                  :href="whatsappUrl"
                  target="_blank"
                  class="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center justify-center gap-1.5"
                >
                  <MessageSquare class="w-3.5 h-3.5" />
                  <span>Prefere falar direto no WhatsApp? Clique aqui</span>
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
