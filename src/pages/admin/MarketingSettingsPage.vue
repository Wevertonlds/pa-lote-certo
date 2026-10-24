<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { MarketingService } from '@/services/MarketingService';
import type { MarketingSettings } from '@/types';
import { INITIAL_MARKETING_SETTINGS } from '@/services/mockData';
import { TrendingUp, Save, CheckCircle, ShieldCheck } from 'lucide-vue-next';

const form = ref<MarketingSettings>({ ...INITIAL_MARKETING_SETTINGS });
const isSubmitting = ref(false);
const feedbackMessage = ref('');

onMounted(async () => {
  form.value = await MarketingService.getSettings();
});

const handleSave = async () => {
  isSubmitting.value = true;
  try {
    await MarketingService.updateSettings(form.value);
    feedbackMessage.value = 'Configurações de marketing salvas com sucesso!';
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
          Marketing Digital & Tráfego Pago
        </h1>
        <p class="text-xs text-slate-500 mt-1">
          Rastreamento de campanhas de tráfego, eventos de conversão e conformidade LGPD.
        </p>
      </div>

      <button
        @click="handleSave"
        :disabled="isSubmitting"
        class="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-5 py-2.5 rounded-xl text-xs font-semibold shadow-sm shadow-brand-600/20 transition-all disabled:opacity-50"
      >
        <Save class="w-4 h-4 text-white" />
        <span>{{ isSubmitting ? 'Salvando...' : 'Salvar Configurações' }}</span>
      </button>
    </div>

    <div v-if="feedbackMessage" class="bg-sky-50 border border-sky-200 text-sky-900 p-4 rounded-xl text-xs flex items-center gap-2">
      <CheckCircle class="w-4 h-4 text-brand-600 shrink-0" />
      <span>{{ feedbackMessage }}</span>
    </div>

    <div class="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
      <h2 class="font-heading text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
        Rastreamento de Conversões & Privacidade
      </h2>

      <div class="space-y-4">
        <label class="flex items-start gap-3 p-4 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer">
          <input
            v-model="form.utmCaptureEnabled"
            type="checkbox"
            class="w-4 h-4 text-emerald-600 rounded mt-0.5"
          />
          <div>
            <span class="text-xs font-bold text-slate-900 block">Captura Automática de Parâmetros UTM</span>
            <span class="text-xs text-slate-500">Preserva utm_source, utm_medium e utm_campaign durante toda a navegação e nos leads enviados.</span>
          </div>
        </label>

        <label class="flex items-start gap-3 p-4 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer">
          <input
            v-model="form.conversionEventsEnabled"
            type="checkbox"
            class="w-4 h-4 text-emerald-600 rounded mt-0.5"
          />
          <div>
            <span class="text-xs font-bold text-slate-900 block">Disparar Eventos de Intenção de Conversão</span>
            <span class="text-xs text-slate-500">Registra cliques em botões de WhatsApp, ligações e envios de formulário de contato.</span>
          </div>
        </label>

        <label class="flex items-start gap-3 p-4 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer">
          <input
            v-model="form.cookieConsentEnabled"
            type="checkbox"
            class="w-4 h-4 text-emerald-600 rounded mt-0.5"
          />
          <div>
            <span class="text-xs font-bold text-slate-900 block">Política de Privacidade e Cookies (LGPD)</span>
            <span class="text-xs text-slate-500">Ativa o banner de consentimento e conformidade com a Lei Geral de Proteção de Dados.</span>
          </div>
        </label>
      </div>
    </div>
  </div>
</template>
