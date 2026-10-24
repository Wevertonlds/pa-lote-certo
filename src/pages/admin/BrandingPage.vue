<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useBrandingStore } from '@/stores/branding';
import type { BrandingSettings } from '@/types';
import { Palette, Save, RotateCcw, CheckCircle, Eye } from 'lucide-vue-next';

const brandingStore = useBrandingStore();
const form = ref<BrandingSettings>({ ...brandingStore.branding });
const isSubmitting = ref(false);
const feedbackMessage = ref('');

onMounted(async () => {
  await brandingStore.loadSettings();
  form.value = { ...brandingStore.branding };
});

const handleSave = async () => {
  isSubmitting.value = true;
  try {
    await brandingStore.updateSettings(form.value);
    feedbackMessage.value = 'Identidade visual atualizada com sucesso!';
    setTimeout(() => feedbackMessage.value = '', 4000);
  } finally {
    isSubmitting.value = false;
  }
};

const handleReset = async () => {
  if (confirm('Deseja restaurar as cores e fontes para o padrão original da plataforma?')) {
    const res = await brandingStore.resetSettings();
    form.value = { ...res.data };
    feedbackMessage.value = 'Padrões visuais restaurados com sucesso!';
    setTimeout(() => feedbackMessage.value = '', 4000);
  }
};
</script>

<template>
  <div class="max-w-4xl mx-auto space-y-8 pb-16">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="font-heading text-2xl font-bold text-slate-900">
          Marca & Identidade Visual
        </h1>
        <p class="text-xs text-slate-500 mt-1">
          Altere dinamicamente o nome da imobiliária, cores institucionais, slogan e tipografia.
        </p>
      </div>

      <div class="flex items-center gap-2">
        <button
          @click="handleReset"
          type="button"
          class="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
        >
          <RotateCcw class="w-3.5 h-3.5 text-slate-500" />
          <span>Restaurar Padrões</span>
        </button>

        <button
          @click="handleSave"
          :disabled="isSubmitting"
          class="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-5 py-2.5 rounded-xl text-xs font-semibold shadow-sm shadow-brand-600/20 transition-all disabled:opacity-50"
        >
          <Save class="w-4 h-4 text-white" />
          <span>{{ isSubmitting ? 'Salvando...' : 'Salvar Identidade' }}</span>
        </button>
      </div>
    </div>

    <div v-if="feedbackMessage" class="bg-sky-50 border border-sky-200 text-sky-900 p-4 rounded-xl text-xs flex items-center gap-2">
      <CheckCircle class="w-4 h-4 text-brand-600 shrink-0" />
      <span>{{ feedbackMessage }}</span>
    </div>

    <!-- Formulário de Marca -->
    <div class="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
      <h2 class="font-heading text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
        1. Dados da Marca
      </h2>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">Nome Comercial da Imobiliária *</label>
          <input
            v-model="form.brandName"
            type="text"
            placeholder="Ex: Lote Certo"
            class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-brand-700"
          />
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">Slogan Institucional</label>
          <input
            v-model="form.slogan"
            type="text"
            placeholder="Ex: Curadoria de lotes e condomínios de alto padrão"
            class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-brand-700"
          />
        </div>
      </div>
    </div>

    <!-- Cores Institucionais Dinâmicas -->
    <div class="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
      <h2 class="font-heading text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
        2. Paleta de Cores (Variáveis CSS Dinâmicas)
      </h2>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Cor Primária -->
        <div class="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
          <label class="block text-xs font-semibold text-slate-700">Cor Primária</label>
          <div class="flex items-center gap-2">
            <input v-model="form.primaryColor" type="color" class="w-9 h-9 rounded cursor-pointer border border-slate-300" />
            <input v-model="form.primaryColor" type="text" class="flex-1 px-2.5 py-1.5 bg-white border border-slate-200 rounded text-xs font-mono" />
          </div>
        </div>

        <!-- Cor Secundária -->
        <div class="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
          <label class="block text-xs font-semibold text-slate-700">Cor Secundária</label>
          <div class="flex items-center gap-2">
            <input v-model="form.secondaryColor" type="color" class="w-9 h-9 rounded cursor-pointer border border-slate-300" />
            <input v-model="form.secondaryColor" type="text" class="flex-1 px-2.5 py-1.5 bg-white border border-slate-200 rounded text-xs font-mono" />
          </div>
        </div>

        <!-- Cor de Destaque -->
        <div class="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
          <label class="block text-xs font-semibold text-slate-700">Cor de Destaque (Accent)</label>
          <div class="flex items-center gap-2">
            <input v-model="form.accentColor" type="color" class="w-9 h-9 rounded cursor-pointer border border-slate-300" />
            <input v-model="form.accentColor" type="text" class="flex-1 px-2.5 py-1.5 bg-white border border-slate-200 rounded text-xs font-mono" />
          </div>
        </div>

        <!-- Cor de Fundo -->
        <div class="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
          <label class="block text-xs font-semibold text-slate-700">Fundo Base</label>
          <div class="flex items-center gap-2">
            <input v-model="form.bgColor" type="color" class="w-9 h-9 rounded cursor-pointer border border-slate-300" />
            <input v-model="form.bgColor" type="text" class="flex-1 px-2.5 py-1.5 bg-white border border-slate-200 rounded text-xs font-mono" />
          </div>
        </div>
      </div>
    </div>

    <!-- Pré-Visualização Dinâmica -->
    <div class="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
      <div class="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700">
        <Eye class="w-4 h-4 text-brand-600" />
        <span>Prévia de Aplicação de Cores e Marca</span>
      </div>

      <div 
        class="p-6 rounded-2xl border transition-all"
        :style="{
          backgroundColor: form.bgColor,
          borderColor: form.primaryColor,
        }"
      >
        <div class="flex items-center justify-between mb-4">
          <span 
            class="font-heading text-xl font-bold"
            :style="{ color: form.primaryColor }"
          >
            {{ form.brandName || 'Nome da Marca' }}
          </span>
          <span 
            class="px-3 py-1 rounded-full text-xs font-bold shadow-sm"
            :style="{ backgroundColor: form.accentColor, color: '#ffffff' }"
          >
            Destaque Exclusivo
          </span>
        </div>
        <p class="text-xs text-slate-600 mb-4">
          {{ form.slogan || 'Slogan institucional da imobiliária' }}
        </p>
        <button
          class="px-5 py-2 rounded-xl text-xs font-bold text-white shadow"
          :style="{ backgroundColor: form.primaryColor }"
        >
          Botão com Cor Primária
        </button>
      </div>
    </div>
  </div>
</template>
