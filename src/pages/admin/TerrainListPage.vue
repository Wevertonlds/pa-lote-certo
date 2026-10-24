<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { RouterLink } from 'vue-router';
import { useTerrainsStore } from '@/stores/terrains';
import { useCondominiumsStore } from '@/stores/condominiums';
import type { Terrain } from '@/types';
import { formatCurrency, formatArea } from '@/utils/formatters';
import { 
  MapPin, 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  ExternalLink,
  AlertTriangle,
  CheckCircle,
  Building2,
  Sparkles
} from 'lucide-vue-next';

const terrainsStore = useTerrainsStore();
const condominiumsStore = useCondominiumsStore();

const searchQuery = ref('');
const filterStatus = ref('');
const deleteModalOpen = ref(false);
const itemToDelete = ref<Terrain | null>(null);
const actionMessage = ref('');

onMounted(async () => {
  await Promise.all([
    terrainsStore.loadTerrains(),
    condominiumsStore.loadCondominiums()
  ]);
});

const filteredTerrains = computed(() => {
  return terrainsStore.terrains.filter(t => {
    if (filterStatus.value && t.status !== filterStatus.value) {
      return false;
    }
    if (!searchQuery.value) return true;
    const q = searchQuery.value.toLowerCase();
    const matchTitle = t.title.toLowerCase().includes(q);
    const matchBlock = `quadra ${t.block}`.toLowerCase().includes(q) || t.block.toLowerCase().includes(q);
    const matchLot = `lote ${t.lot}`.toLowerCase().includes(q) || t.lot.toLowerCase().includes(q);
    const matchCondo = (t.condominiumName || '').toLowerCase().includes(q);
    return matchTitle || matchBlock || matchLot || matchCondo;
  });
});

const confirmDelete = (terrain: Terrain) => {
  itemToDelete.value = terrain;
  deleteModalOpen.value = true;
};

const executeDelete = async () => {
  if (!itemToDelete.value) return;
  await terrainsStore.deleteTerrain(itemToDelete.value.id);
  actionMessage.value = `Terreno "${itemToDelete.value.title}" excluído com sucesso!`;
  deleteModalOpen.value = false;
  itemToDelete.value = null;
  setTimeout(() => actionMessage.value = '', 4000);
};

const getStatusBadge = (status: Terrain['status']) => {
  switch (status) {
    case 'disponivel':
      return { label: 'Disponível', bg: 'bg-sky-100 text-sky-800' };
    case 'reservado':
      return { label: 'Reservado', bg: 'bg-amber-100 text-amber-800' };
    case 'vendido':
      return { label: 'Vendido', bg: 'bg-slate-200 text-slate-700' };
    case 'nao_publicado':
      return { label: 'Oculto', bg: 'bg-rose-100 text-rose-800' };
    default:
      return { label: status, bg: 'bg-slate-100 text-slate-700' };
  }
};
</script>

<template>
  <div class="space-y-6">
    <!-- Mensagem de Sucesso -->
    <div v-if="actionMessage" class="bg-sky-50 border border-sky-200 text-sky-900 p-4 rounded-xl text-xs flex items-center gap-2">
      <CheckCircle class="w-4 h-4 text-brand-600 shrink-0" />
      <span>{{ actionMessage }}</span>
    </div>

    <!-- Header & Ações -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="font-heading text-2xl font-bold text-slate-900">
          Gerenciamento de Terrenos
        </h1>
        <p class="text-xs text-slate-500 mt-1">
          Cadastre novos lotes, defina preços, fotos, quadras e disponibilidade comercial.
        </p>
      </div>

      <RouterLink
        to="/gestao/terrenos/novo"
        class="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-4 py-2.5 rounded-xl text-xs font-semibold shadow-sm shadow-brand-600/20 transition-all self-start sm:self-auto"
      >
        <Plus class="w-4 h-4 text-white" />
        <span>Novo Terreno</span>
      </RouterLink>
    </div>

    <!-- Barra de Filtro e Busca -->
    <div class="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
      <div class="relative w-full sm:w-80">
        <Search class="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Filtrar por título, condomínio, quadra ou lote..."
          class="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-brand-700"
        />
      </div>

      <div class="flex items-center gap-3 w-full sm:w-auto">
        <select
          v-model="filterStatus"
          class="text-xs py-2 px-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none"
        >
          <option value="">Todos os status</option>
          <option value="disponivel">Disponível</option>
          <option value="reservado">Reservado</option>
          <option value="vendido">Vendido</option>
          <option value="nao_publicado">Não Publicado</option>
        </select>

        <span class="text-xs text-slate-500 shrink-0">
          {{ filteredTerrains.length }} lotes listados
        </span>
      </div>
    </div>

    <!-- Tabela de Terrenos -->
    <div class="bg-white rounded-2xl border border-slate-200 shadow-card overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse text-xs">
          <thead>
            <tr class="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 uppercase tracking-wider">
              <th class="p-4">Terreno</th>
              <th class="p-4">Condomínio</th>
              <th class="p-4">Quadra / Lote</th>
              <th class="p-4">Área</th>
              <th class="p-4">Valor</th>
              <th class="p-4">Status</th>
              <th class="p-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 text-slate-700">
            <tr v-for="terrain in filteredTerrains" :key="terrain.id" class="hover:bg-slate-50/60">
              <td class="p-4">
                <div class="flex items-center gap-3">
                  <img
                    :src="terrain.coverImage || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=200&q=80'"
                    :alt="terrain.title"
                    class="w-12 h-10 rounded-lg object-cover bg-slate-100 shrink-0 shadow-sm"
                  />
                  <div>
                    <div class="flex items-center gap-1.5">
                      <span class="font-bold text-slate-900">{{ terrain.title }}</span>
                      <span v-if="terrain.isFeatured" class="bg-gold-100 text-gold-900 text-[9px] px-1.5 py-0.5 rounded font-bold">
                        Destaque
                      </span>
                    </div>
                    <span class="text-[11px] text-slate-400 capitalize">Tipo: {{ terrain.terrainType }}</span>
                  </div>
                </div>
              </td>
              <td class="p-4">
                <div class="flex items-center gap-1.5 text-slate-800">
                  <Building2 class="w-3.5 h-3.5 text-gold-600" />
                  <span>{{ terrain.condominiumName }}</span>
                </div>
              </td>
              <td class="p-4 font-semibold text-slate-900">
                Q. {{ terrain.block }} • Lote {{ terrain.lot }}
              </td>
              <td class="p-4">
                {{ formatArea(terrain.area) }}
              </td>
              <td class="p-4 font-semibold text-slate-900">
                {{ terrain.priceOnRequest || terrain.price === null ? 'Sob Consulta' : formatCurrency(terrain.price) }}
              </td>
              <td class="p-4">
                <span
                  :class="[
                    'px-2.5 py-1 rounded-full font-semibold uppercase tracking-wider text-[10px]',
                    getStatusBadge(terrain.status).bg
                  ]"
                >
                  {{ getStatusBadge(terrain.status).label }}
                </span>
              </td>
              <td class="p-4 text-right">
                <div class="flex items-center justify-end gap-1.5">
                  <RouterLink
                    :to="`/terrenos/${terrain.slug}`"
                    target="_blank"
                    class="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
                    title="Ver página pública"
                  >
                    <ExternalLink class="w-4 h-4" />
                  </RouterLink>

                  <RouterLink
                    :to="`/gestao/terrenos/${terrain.id}/editar`"
                    class="p-1.5 text-brand-800 hover:text-brand-950 rounded-lg hover:bg-brand-50"
                    title="Editar terreno"
                  >
                    <Edit2 class="w-4 h-4" />
                  </RouterLink>

                  <button
                    @click="confirmDelete(terrain)"
                    class="p-1.5 text-rose-500 hover:text-rose-700 rounded-lg hover:bg-rose-50"
                    title="Excluir terreno"
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

    <!-- Modal de Confirmação de Exclusão -->
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
            Deseja realmente remover o terreno <strong>"{{ itemToDelete?.title }}"</strong>?
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
