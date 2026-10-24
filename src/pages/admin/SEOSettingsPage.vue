<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { SEOService } from '@/services/SEOService';
import type { SEOSettings } from '@/types';
import { INITIAL_SEO_SETTINGS } from '@/services/mockData';
import { Search, Save, CheckCircle, Globe } from 'lucide-vue-next';

const form = ref<SEOSettings>({ ...INITIAL_SEO_SETTINGS });
const isSubmitting = ref(false);
const feedbackMessage = ref('');

onMounted(async () => {
  form.value = await SEOService.getSettings();
});

const handleSave = async () => {
  isSubmitting.value = true;
  try {
    await SEOService.updateSettings(form.value);
    feedbackMessage.value = 'Configurações de SEO salvas com sucesso!';
    setTimeout(() => feedbackMessage.value = '', 4000);
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <div class="max-w-4xl mx-auto space-y-8 pb-16">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="font-heading text-2xl font-bold text-slate-900">
          SEO Técnico & Metadados
        </h1>
        <p class="text-xs text-slate-500 mt-1">
          Otimização para mecanismos de busca (Google Search), Open Graph e IDs de rastreamento.
        </p>
      </div>

      <button
        @click="handleSave"
        :disabled="isSubmitting"
        class="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-5 py-2.5 rounded-xl text-xs font-semibold shadow-sm shadow-brand-600/20 transition-all disabled:opacity-50"
      >
        <Save class="w-4 h-4 text-white" />
        <span>{{ isSubmitting ? 'Salvando...' : 'Salvar SEO' }}</span>
      </button>
    </div>

    <div v-if="feedbackMessage" class="bg-sky-50 border border-sky-200 text-sky-900 p-4 rounded-xl text-xs flex items-center gap-2">
      <CheckCircle class="w-4 h-4 text-brand-600 shrink-0" />
      <span>{{ feedbackMessage }}</span>
    </div>

    <!-- Metadados Globais -->
    <div class="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
      <h2 class="font-heading text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
        1. Tags Globais de Indexação
      </h2>

      <div class="space-y-4">
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">Título Padrão do Site (Title Tag)</label>
          <input
            v-model="form.defaultTitle"
            type="text"
            class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
          />
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">Meta Descrição Padrão</label>
          <textarea
            v-model="form.defaultDescription"
            rows="3"
            class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
          ></textarea>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">Nome da Organização</label>
            <input
              v-model="form.organizationName"
              type="text"
              class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
            />
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">URL Canônica Base</label>
            <input
              v-model="form.siteUrl"
              type="url"
              class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
            />
          </div>
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">Imagem Padrão de Compartilhamento (OG Image)</label>
          <input
            v-model="form.defaultOgImage"
            type="url"
            class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
          />
        </div>
      </div>
    </div>

    <!-- Identificadores de Rastreamento (Google) -->
    <div class="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
      <h2 class="font-heading text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
        2. Identificadores Google
      </h2>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">Google Analytics 4 ID</label>
          <input
            v-model="form.googleAnalyticsId"
            type="text"
            placeholder="G-XXXXXXXXXX"
            class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
          />
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">Google Tag Manager ID</label>
          <input
            v-model="form.googleTagManagerId"
            type="text"
            placeholder="GTM-XXXXXXX"
            class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
          />
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">Google Ads ID</label>
          <input
            v-model="form.googleAdsId"
            type="text"
            placeholder="AW-XXXXXXXXX"
            class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
          />
        </div>
      </div>
    </div>
  </div>
</template>
