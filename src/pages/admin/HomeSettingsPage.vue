<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { HomePageService } from '@/services/HomePageService';
import type { HomePageSettings, BannerSlide } from '@/types';
import { INITIAL_HOME_SETTINGS } from '@/services/mockData';
import { Home, Save, Plus, Trash2, CheckCircle, Eye, EyeOff } from 'lucide-vue-next';

const settings = ref<HomePageSettings>(INITIAL_HOME_SETTINGS);
const isSubmitting = ref(false);
const feedbackMessage = ref('');

onMounted(async () => {
  settings.value = await HomePageService.getSettings();
});

const addBanner = () => {
  settings.value.banners.push({
    id: `banner-${Date.now()}`,
    title: 'Novo Título do Banner',
    subtitle: 'Subtítulo descritivo do empreendimento ou oportunidade.',
    desktopImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=80',
    mobileImage: '',
    buttonText: 'Explorar Terrenos',
    buttonLink: '/terrenos',
    order: settings.value.banners.length + 1,
    isActive: true,
  });
};

const removeBanner = (index: number) => {
  settings.value.banners.splice(index, 1);
};

const handleSave = async () => {
  isSubmitting.value = true;
  try {
    await HomePageService.updateSettings(settings.value);
    feedbackMessage.value = 'Configurações da Página Inicial salvas com sucesso!';
    setTimeout(() => feedbackMessage.value = '', 4000);
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <div class="max-w-5xl mx-auto space-y-8 pb-16">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="font-heading text-2xl font-bold text-slate-900">
          Configuração da Página Inicial
        </h1>
        <p class="text-xs text-slate-500 mt-1">
          Gerencie banners do carrossel, títulos das seções e controle de visibilidade.
        </p>
      </div>

      <button
        @click="handleSave"
        :disabled="isSubmitting"
        class="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-5 py-2.5 rounded-xl text-xs font-semibold shadow-sm shadow-brand-600/20 transition-all disabled:opacity-50"
      >
        <Save class="w-4 h-4 text-white" />
        <span>{{ isSubmitting ? 'Salvando...' : 'Salvar Alterações' }}</span>
      </button>
    </div>

    <div v-if="feedbackMessage" class="bg-sky-50 border border-sky-200 text-sky-900 p-4 rounded-xl text-xs flex items-center gap-2">
      <CheckCircle class="w-4 h-4 text-brand-600 shrink-0" />
      <span>{{ feedbackMessage }}</span>
    </div>

    <!-- 1. Banners do Carrossel (Requisito 4.2 e 10 Aba B) -->
    <div class="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
      <div class="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <h2 class="font-heading text-base font-bold text-slate-900">
            1. Carrossel de Banners Principais
          </h2>
          <p class="text-xs text-slate-500">
            Imagens em alta definição, títulos marcantes e links de ação.
          </p>
        </div>

        <button
          @click="addBanner"
          type="button"
          class="inline-flex items-center gap-1.5 bg-slate-900 text-white px-3.5 py-1.5 rounded-xl text-xs font-semibold hover:bg-black"
        >
          <Plus class="w-3.5 h-3.5 text-brand-400" />
          <span>Adicionar Slide</span>
        </button>
      </div>

      <div class="space-y-6">
        <div
          v-for="(banner, idx) in settings.banners"
          :key="banner.id"
          class="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-4 relative"
        >
          <div class="flex items-center justify-between border-b border-slate-200/60 pb-2">
            <span class="text-xs font-bold text-slate-700">Slide #{{ idx + 1 }}</span>
            <div class="flex items-center gap-3">
              <label class="flex items-center gap-1.5 text-xs text-slate-600 cursor-pointer">
                <input v-model="banner.isActive" type="checkbox" class="rounded" />
                <span>Ativo</span>
              </label>
              <button
                v-if="settings.banners.length > 1"
                @click="removeBanner(idx)"
                class="text-rose-500 hover:text-rose-700 p-1"
                title="Remover slide"
              >
                <Trash2 class="w-4 h-4" />
              </button>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="sm:col-span-2">
              <label class="block text-[11px] font-semibold text-slate-600 mb-1">Título do Banner</label>
              <input
                v-model="banner.title"
                type="text"
                class="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-xs"
              />
            </div>

            <div class="sm:col-span-2">
              <label class="block text-[11px] font-semibold text-slate-600 mb-1">Subtítulo</label>
              <input
                v-model="banner.subtitle"
                type="text"
                class="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-xs"
              />
            </div>

            <div>
              <label class="block text-[11px] font-semibold text-slate-600 mb-1">URL Imagem Desktop</label>
              <input
                v-model="banner.desktopImage"
                type="url"
                class="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-xs"
              />
            </div>

            <div>
              <label class="block text-[11px] font-semibold text-slate-600 mb-1">URL Imagem Mobile (Opcional)</label>
              <input
                v-model="banner.mobileImage"
                type="url"
                placeholder="https://..."
                class="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-xs"
              />
            </div>

            <div>
              <label class="block text-[11px] font-semibold text-slate-600 mb-1">Texto do Botão de Ação</label>
              <input
                v-model="banner.buttonText"
                type="text"
                class="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-xs"
              />
            </div>

            <div>
              <label class="block text-[11px] font-semibold text-slate-600 mb-1">Link de Destino</label>
              <input
                v-model="banner.buttonLink"
                type="text"
                class="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-xs"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 2. Visibilidade de Seções -->
    <div class="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
      <h2 class="font-heading text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
        2. Visibilidade de Seções na Home
      </h2>

      <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <label
          v-for="(val, key) in settings.visibleSections"
          :key="key"
          class="flex items-center gap-2 p-3 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer"
        >
          <input
            v-model="settings.visibleSections[key]"
            type="checkbox"
            class="w-4 h-4 text-brand-600 focus:ring-brand-500 rounded"
          />
          <span class="text-xs font-semibold text-slate-700 capitalize">
            {{ key }}
          </span>
        </label>
      </div>
    </div>

    <!-- 3. Títulos das Seções & Chamada Comercial (CTA) -->
    <div class="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
      <h2 class="font-heading text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
        3. Títulos e Chamada para Ação (CTA)
      </h2>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">Título: Condomínios em Destaque</label>
          <input
            v-model="settings.featuredCondominiumsTitle"
            type="text"
            class="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
          />
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">Subtítulo: Condomínios</label>
          <input
            v-model="settings.featuredCondominiumsSubtitle"
            type="text"
            class="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
          />
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">Título: Terrenos em Destaque</label>
          <input
            v-model="settings.featuredTerrainsTitle"
            type="text"
            class="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
          />
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">Subtítulo: Terrenos</label>
          <input
            v-model="settings.featuredTerrainsSubtitle"
            type="text"
            class="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
          />
        </div>

        <div class="sm:col-span-2 pt-2 border-t border-slate-100">
          <label class="block text-xs font-semibold text-slate-700 mb-1">Título da Seção de Atendimento / WhatsApp</label>
          <input
            v-model="settings.ctaTitle"
            type="text"
            class="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
          />
        </div>

        <div class="sm:col-span-2">
          <label class="block text-xs font-semibold text-slate-700 mb-1">Subtítulo da Seção de Atendimento</label>
          <input
            v-model="settings.ctaSubtitle"
            type="text"
            class="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
          />
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">Texto do Botão Principal do Atendimento</label>
          <input
            v-model="settings.ctaButtonText"
            type="text"
            class="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
          />
        </div>
      </div>
    </div>
  </div>
</template>
