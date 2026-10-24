<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { useRoute, RouterLink } from 'vue-router';
import { CondominiumService } from '@/services/CondominiumService';
import { TerrainService } from '@/services/TerrainService';
import { ContactService } from '@/services/ContactService';
import { SEOService } from '@/services/SEOService';
import { generateWhatsAppLink } from '@/utils/formatters';
import type { Condominium, Terrain } from '@/types';
import TerrainCard from '@/components/catalog/TerrainCard.vue';
import { 
  Building2, 
  MapPin, 
  ShieldCheck, 
  Sparkles, 
  MessageSquare, 
  ArrowLeft,
  ChevronRight,
  Layers,
  CheckCircle2,
  Waves
} from 'lucide-vue-next';

const route = useRoute();
const condominium = ref<Condominium | null>(null);
const linkedTerrains = ref<Terrain[]>([]);
const activeImage = ref('');
const whatsappUrl = ref('');
const loading = ref(true);

const loadData = async () => {
  loading.value = true;
  const slug = route.params.slug as string;
  const condo = await CondominiumService.getBySlug(slug);
  condominium.value = condo;

  if (condo) {
    activeImage.value = condo.coverImage;
    const [terrains, contact] = await Promise.all([
      TerrainService.getByCondominiumId(condo.id),
      ContactService.getSettings()
    ]);
    linkedTerrains.value = terrains;

    whatsappUrl.value = generateWhatsAppLink({
      whatsappNumber: contact.whatsapp,
      condominiumName: condo.name,
      origin: `Página Condomínio (${condo.name})`
    });

    SEOService.updatePageMeta({
      title: condo.seoTitle || `${condo.name} | Terrenos em Condomínio Fechado`,
      description: condo.seoDescription || condo.shortDescription,
    });
  }
  loading.value = false;
};

onMounted(loadData);
watch(() => route.params.slug, loadData);
</script>

<template>
  <div v-if="loading" class="pt-32 pb-20 text-center">
    <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-brand-600 border-t-transparent" />
    <p class="text-sm text-slate-500 mt-3">Carregando informações do condomínio...</p>
  </div>

  <div v-else-if="!condominium" class="pt-32 pb-20 text-center">
    <h2 class="text-2xl font-bold text-slate-800">Condomínio não encontrado</h2>
    <p class="text-slate-500 text-sm mt-2 mb-6">O endereço acessado pode ter sido alterado ou desativado.</p>
    <RouterLink to="/condominios" class="bg-brand-600 text-white px-5 py-2.5 rounded-xl text-xs font-semibold">
      Voltar para Condomínios
    </RouterLink>
  </div>

  <div v-else class="pt-24 pb-20 space-y-16">
    <!-- Breadcrumb -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <nav class="flex items-center gap-2 text-xs text-slate-500">
        <RouterLink to="/" class="hover:text-brand-600">Início</RouterLink>
        <ChevronRight class="w-3 h-3 text-slate-400" />
        <RouterLink to="/condominios" class="hover:text-brand-600">Condomínios</RouterLink>
        <ChevronRight class="w-3 h-3 text-slate-400" />
        <span class="text-slate-800 font-semibold truncate">{{ condominium.name }}</span>
      </nav>
    </div>

    <!-- Topo: Título, Localização & Ações -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-200">
        <div>
          <div class="flex items-center gap-2 text-xs font-semibold text-brand-600 uppercase tracking-widest mb-2">
            <Building2 class="w-4 h-4 text-brand-500" />
            <span>Condomínio Residencial Fechado</span>
          </div>
          <h1 class="font-heading text-3xl sm:text-5xl font-bold text-slate-900 tracking-tight">
            {{ condominium.name }}
          </h1>
          <p class="flex items-center gap-2 text-slate-600 text-sm sm:text-base mt-2">
            <MapPin class="w-4 h-4 text-brand-600" />
            <span>{{ condominium.address }} • {{ condominium.city }} - {{ condominium.state }}</span>
          </p>
        </div>

        <div class="flex items-center gap-3">
          <a
            :href="whatsappUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-2.5 bg-brand-600 hover:bg-brand-500 text-white font-bold px-6 py-3.5 rounded-2xl text-sm shadow-md shadow-brand-500/25 active:scale-95 transition-all border border-brand-400/30"
          >
            <MessageSquare class="w-4 h-4 text-white" />
            <span>Consultar Lotes no WhatsApp</span>
          </a>
        </div>
      </div>
    </div>

    <!-- Galeria de Imagens do Empreendimento -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="space-y-4">
        <!-- Imagem Principal em Destaque -->
        <div class="relative aspect-[21/9] sm:aspect-[16/7] rounded-3xl overflow-hidden bg-slate-950 shadow-premium">
          <img
            :src="activeImage"
            :alt="condominium.name"
            class="w-full h-full object-cover transition-all duration-300"
          />
        </div>

        <!-- Miniaturas da Galeria -->
        <div v-if="condominium.gallery && condominium.gallery.length > 1" class="flex gap-3 overflow-x-auto pb-2">
          <button
            v-for="(img, idx) in condominium.gallery"
            :key="idx"
            @click="activeImage = img"
            :class="[
              'relative w-28 h-20 rounded-xl overflow-hidden shrink-0 border-2 transition-all',
              activeImage === img ? 'border-brand-800 scale-95 shadow-md' : 'border-transparent opacity-70 hover:opacity-100'
            ]"
          >
            <img :src="img" :alt="`${condominium.name} foto ${idx + 1}`" class="w-full h-full object-cover" />
          </button>
        </div>
      </div>
    </div>

    <!-- Apresentação & Infraestrutura -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <!-- Coluna Esquerda: Descrição -->
        <div class="lg:col-span-7 space-y-6">
          <h2 class="font-heading text-2xl sm:text-3xl font-bold text-slate-900">
            Sobre o Empreendimento
          </h2>
          <p class="text-slate-600 text-base leading-relaxed">
            {{ condominium.fullDescription }}
          </p>

          <!-- Diferenciais em Chips -->
          <div class="pt-4">
            <h3 class="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              Diferenciais em Destaque
            </h3>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="feat in condominium.features"
                :key="feat"
                class="bg-emerald-50 text-emerald-900 border border-emerald-200/80 px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5"
              >
                <Sparkles class="w-3.5 h-3.5 text-gold-600" />
                {{ feat }}
              </span>
            </div>
          </div>
        </div>

        <!-- Coluna Direita: Infraestrutura Nobre -->
        <div class="lg:col-span-5 bg-white rounded-3xl p-8 border border-slate-200/90 shadow-card space-y-6">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-brand-900 text-brand-400 flex items-center justify-center">
              <ShieldCheck class="w-6 h-6" />
            </div>
            <div>
              <h3 class="font-heading text-xl font-bold text-slate-900">
                Infraestrutura Completa
              </h3>
              <p class="text-xs text-slate-500">Padrão de engenharia e segurança</p>
            </div>
          </div>

          <ul class="space-y-3">
            <li
              v-for="item in condominium.infrastructure"
              :key="item"
              class="flex items-start gap-3 text-sm text-slate-700"
            >
              <CheckCircle2 class="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
              <span>{{ item }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Áreas de Lazer do Condomínio (Prompt Requisito 5 e 7.3) -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="mb-8">
        <span class="text-xs font-bold uppercase tracking-widest text-brand-600 flex items-center gap-1.5 mb-2">
          <Waves class="w-4 h-4 text-brand-500" />
          Clube Privativo & Conveniência
        </span>
        <h2 class="font-heading text-3xl font-bold text-slate-900">
          Áreas de Lazer Exclusivas
        </h2>
        <p class="text-slate-600 text-sm mt-1">
          Ambientes entregues equipados e decorados para os moradores desfrutarem momentos inesquecíveis.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="leisure in condominium.leisureAreas"
          :key="leisure.id"
          class="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col"
        >
          <div class="relative aspect-[16/10] overflow-hidden bg-slate-100">
            <img
              :src="leisure.image"
              :alt="leisure.title"
              class="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          </div>
          <div class="p-5 flex-1 flex flex-col justify-between">
            <div>
              <h3 class="font-heading text-lg font-bold text-slate-900 mb-2">
                {{ leisure.title }}
              </h3>
              <p class="text-xs text-slate-600 leading-relaxed">
                {{ leisure.description }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Terrenos Vinculados a este Condomínio (Prompt Requisito 5) -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-slate-200">
      <div class="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
        <div>
          <span class="text-xs font-bold uppercase tracking-widest text-brand-600 flex items-center gap-1.5 mb-1">
            <Layers class="w-4 h-4 text-brand-500" />
            Lotes Vinculados
          </span>
          <h2 class="font-heading text-3xl font-bold text-slate-900">
            Terrenos Disponíveis no {{ condominium.name }}
          </h2>
        </div>

        <span class="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full">
          {{ linkedTerrains.length }} {{ linkedTerrains.length === 1 ? 'lote cadastrado' : 'lotes cadastrados' }}
        </span>
      </div>

      <div 
        v-if="linkedTerrains.length > 0"
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        <TerrainCard
          v-for="terrain in linkedTerrains"
          :key="terrain.id"
          :terrain="terrain"
        />
      </div>

      <div v-else class="text-center py-12 bg-white rounded-2xl border border-slate-200 p-8">
        <p class="text-sm text-slate-500 mb-4">No momento não há terrenos disponíveis neste condomínio.</p>
        <a :href="whatsappUrl" target="_blank" class="text-xs font-bold text-brand-600 underline">
          Consulte nossa lista de espera com um corretor no WhatsApp →
        </a>
      </div>
    </div>
  </div>
</template>
