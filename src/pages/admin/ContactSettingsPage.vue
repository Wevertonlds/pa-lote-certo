<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { ContactService } from '@/services/ContactService';
import type { ContactSettings } from '@/types';
import { INITIAL_CONTACT_SETTINGS } from '@/services/mockData';
import { PhoneCall, Save, CheckCircle, MessageSquare } from 'lucide-vue-next';

const form = ref<ContactSettings>({ ...INITIAL_CONTACT_SETTINGS });
const isSubmitting = ref(false);
const feedbackMessage = ref('');

onMounted(async () => {
  form.value = await ContactService.getSettings();
});

const handleSave = async () => {
  isSubmitting.value = true;
  try {
    await ContactService.updateSettings(form.value);
    feedbackMessage.value = 'Configurações de contato atualizadas com sucesso!';
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
          Contatos & Integração WhatsApp
        </h1>
        <p class="text-xs text-slate-500 mt-1">
          Defina os números de telefone, mensagens e canais de atendimento aos visitantes.
        </p>
      </div>

      <button
        @click="handleSave"
        :disabled="isSubmitting"
        class="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-5 py-2.5 rounded-xl text-xs font-semibold shadow-sm shadow-brand-600/20 transition-all disabled:opacity-50"
      >
        <Save class="w-4 h-4 text-white" />
        <span>{{ isSubmitting ? 'Salvando...' : 'Salvar Contatos' }}</span>
      </button>
    </div>

    <div v-if="feedbackMessage" class="bg-sky-50 border border-sky-200 text-sky-900 p-4 rounded-xl text-xs flex items-center gap-2">
      <CheckCircle class="w-4 h-4 text-brand-600 shrink-0" />
      <span>{{ feedbackMessage }}</span>
    </div>

    <div class="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
      <h2 class="font-heading text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
        Canais de Atendimento
      </h2>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">Número do WhatsApp (apenas dígitos) *</label>
          <input
            v-model="form.whatsapp"
            required
            type="text"
            placeholder="34999998888"
            class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
          />
          <span class="text-[10px] text-slate-400 mt-1 block">Utilizado para gerar links diretos de conversa com corretores.</span>
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">Telefone Fixo / Central</label>
          <input
            v-model="form.phone"
            type="text"
            placeholder="(34) 3222-7700"
            class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
          />
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">E-mail Comercial</label>
          <input
            v-model="form.email"
            type="email"
            placeholder="contato@lotecerto.com.br"
            class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
          />
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">Instagram (@)</label>
          <input
            v-model="form.instagram"
            type="text"
            placeholder="@lotecerto.imoveis"
            class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
          />
        </div>

        <div class="sm:col-span-2">
          <label class="block text-xs font-semibold text-slate-700 mb-1">Endereço Físico</label>
          <input
            v-model="form.address"
            type="text"
            placeholder="Av. dos Vinhedos, 1200 - Morada da Colina, Uberlândia - MG"
            class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
          />
        </div>

        <div class="sm:col-span-2">
          <label class="block text-xs font-semibold text-slate-700 mb-1">Horário de Funcionamento</label>
          <input
            v-model="form.businessHours"
            type="text"
            placeholder="Segunda a Sexta: 08:30 às 18:30 | Sábados: 09:00 às 13:00"
            class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
          />
        </div>
      </div>
    </div>
  </div>
</template>
