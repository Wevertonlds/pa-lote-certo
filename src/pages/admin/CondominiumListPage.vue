<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { RouterLink } from 'vue-router';
import { useCondominiumsStore } from '@/stores/condominiums';
import { useTerrainsStore } from '@/stores/terrains';
import type { Condominium } from '@/types';
import { 
  Building2, 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  ExternalLink,
  AlertTriangle,
  CheckCircle,
  EyeOff
} from 'lucide-vue-next';

const condominiumsStore = useCondominiumsStore();
const terrainsStore = useTerrainsStore();

const searchQuery = ref('');
const deleteModalOpen = ref(false);
const itemToDelete = ref<Condominium | null>(null);
const actionMessage = ref('');

onMounted(async () => {
  await Promise.all([
    condominiumsStore.loadCondominiums(),
    terrainsStore.loadTerrains()
  ]);
});

const filteredCondominiums = computed(() => {
  return condominiumsStore.condominiums.filter(c => {
    if (!searchQuery.value) return true;
    const q = searchQuery.value.toLowerCase();
    return c.name.toLowerCase().includes(q) || c.city.toLowerCase().includes(q);
  });
});

const getTerrainsCount = (condoId: string) => {
  return terrainsStore.terrains.filter(t => t.condominiumId === condoId).length;
};

const confirmDelete = (condo: Condominium) => {
  itemToDelete.value = condo;
  deleteModalOpen.value = true;
};

const executeDelete = async () => {
  if (!itemToDelete.value) return;
  await condominiumsStore.deleteCondominium(itemToDelete.value.id);
  actionMessage.value = `Condomínio "${itemToDelete.value.name}" excluído com sucesso!`;
  deleteModalOpen.value = false;
  itemToDelete.value = null;
  setTimeout(() => actionMessage.value = '', 4000);
};
</script>

<template>
  <div class="space-y-6">
    <!-- Feedback Banner -->
    <div v-if="actionMessage" class="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl text-xs flex items-center gap-2">
      <CheckCircle class="w-4 h-4 text-emerald-600 shrink-0" />
      <span>{{ actionMessage }}</span>
    </div>

    <!-- Header & Ações -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="font-heading text-2xl font-bold text-slate-900">
          Gerenciamento de Condomínios
        </h1>
        <p class="text-xs text-slate-500 mt-1">
          Cadastre novos empreendimentos, configure áreas de lazer e infraestrutura.
        </p>
      </div>

      <RouterLink
        to="/gestao/condominios/novo"
        class="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-4 py-2.5 rounded-xl text-xs font-semibold shadow-sm shadow-brand-600/20 transition-all self-start sm:self-auto"
      >
        <Plus class="w-4 h-4 text-white" />
        <span>Novo Condomínio</span>
      </RouterLink>
    </div>

    <!-- Barra de Busca -->
    <div class="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center justify-between">
      <div class="relative w-full max-w-sm">
        <Search class="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Filtrar por nome ou cidade..."
          class="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-brand-600"
        />
      </div>

      <span class="text-xs text-slate-500">
        {{ filteredCondominiums.length }} condomínios listados
      </span>
    </div>

    <!-- Tabela de Condomínios -->
    <div class="bg-white rounded-2xl border border-slate-200 shadow-card overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse text-xs">
          <thead>
            <tr class="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 uppercase tracking-wider">
              <th class="p-4">Empreendimento</th>
              <th class="p-4">Localização</th>
              <th class="p-4">Lotes Vinculados</th>
              <th class="p-4">Áreas de Lazer</th>
              <th class="p-4">Status</th>
              <th class="p-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 text-slate-700">
            <tr v-for="condo in filteredCondominiums" :key="condo.id" class="hover:bg-slate-50/60">
              <td class="p-4">
                <div class="flex items-center gap-3">
                  <img
                    :src="condo.coverImage || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=200&q=80'"
                    :alt="condo.name"
                    class="w-12 h-10 rounded-lg object-cover bg-slate-100 shrink-0 shadow-sm"
                  />
                  <div>
                    <span class="font-bold text-slate-900 block">{{ condo.name }}</span>
                    <span class="text-[11px] text-slate-400">/condominios/{{ condo.slug }}</span>
                  </div>
                </div>
              </td>
              <td class="p-4">
                {{ condo.city }} - {{ condo.state }}
              </td>
              <td class="p-4">
                <span class="font-semibold text-slate-800">{{ getTerrainsCount(condo.id) }} lotes</span>
              </td>
              <td class="p-4">
                <span class="bg-slate-100 px-2.5 py-1 rounded-full font-medium text-slate-700 text-[11px]">
                  {{ condo.leisureAreas.length }} estruturas
                </span>
              </td>
              <td class="p-4">
                <span
                  :class="[
                    'px-2.5 py-1 rounded-full font-semibold uppercase tracking-wider text-[10px]',
                    condo.isPublished ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                  ]"
                >
                  {{ condo.isPublished ? 'Publicado' : 'Rascunho' }}
                </span>
              </td>
              <td class="p-4 text-right">
                <div class="flex items-center justify-end gap-1.5">
                  <RouterLink
                    :to="`/condominios/${condo.slug}`"
                    target="_blank"
                    class="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
                    title="Ver página pública"
                  >
                    <ExternalLink class="w-4 h-4" />
                  </RouterLink>

                  <RouterLink
                    :to="`/gestao/condominios/${condo.id}/editar`"
                    class="p-1.5 text-brand-800 hover:text-brand-950 rounded-lg hover:bg-brand-50"
                    title="Editar condomínio"
                  >
                    <Edit2 class="w-4 h-4" />
                  </RouterLink>

                  <button
                    @click="confirmDelete(condo)"
                    class="p-1.5 text-rose-500 hover:text-rose-700 rounded-lg hover:bg-rose-50"
                    title="Excluir condomínio"
                  >
                    <Trash2 class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal de Confirmação de Exclusão (Prompt Requisito 9 e 10) -->
    <div 
      v-if="deleteModalOpen"
      class="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
    >
      <div class="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl animate-in zoom-in-95 duration-150">
        <div class="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
          <AlertTriangle class="w-6 h-6" />
        </div>

        <div class="text-center">
          <h3 class="font-heading text-lg font-bold text-slate-900">
            Confirmar Exclusão
          </h3>
          <p class="text-xs text-slate-500 mt-1">
            Tem certeza que deseja excluir o condomínio <strong>"{{ itemToDelete?.name }}"</strong>? Esta ação não poderá ser desfeita.
          </p>
        </div>

        <div class="grid grid-cols-2 gap-3 pt-2">
          <button
            @click="deleteModalOpen = false"
            class="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            Cancelar
          </button>
          <button
            @click="executeDelete"
            class="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow"
          >
            Sim, Excluir
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
