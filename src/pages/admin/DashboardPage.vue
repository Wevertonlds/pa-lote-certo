<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { RouterLink } from 'vue-router';
import { DashboardService } from '@/services/DashboardService';
import { LeadService } from '@/services/LeadService';
import type { DashboardMetrics, Lead } from '@/types';
import { formatDate } from '@/utils/formatters';
import { 
  Building2, 
  MapPin, 
  CheckCircle, 
  Clock, 
  Archive, 
  EyeOff, 
  Users, 
  Plus, 
  ArrowUpRight,
  Phone,
  Mail
} from 'lucide-vue-next';

const metrics = ref<DashboardMetrics>({
  totalCondominiums: 0,
  totalTerrains: 0,
  availableTerrains: 0,
  reservedTerrains: 0,
  soldTerrains: 0,
  unpublishedTerrains: 0,
  totalLeads: 0,
});

const recentLeads = ref<Lead[]>([]);
const loading = ref(true);

onMounted(async () => {
  loading.value = true;
  const [m, leads] = await Promise.all([
    DashboardService.getMetrics(),
    LeadService.getAll()
  ]);
  metrics.value = m;
  recentLeads.value = leads.slice(0, 5);
  loading.value = false;
});
</script>

<template>
  <div class="space-y-8">
    <!-- Cabeçalho do Dashboard -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="font-heading text-2xl sm:text-3xl font-bold text-slate-900">
          Visão Geral do Catálogo
        </h1>
        <p class="text-xs sm:text-sm text-slate-500 mt-1">
          Métricas consolidadas e atividades comerciais em tempo real.
        </p>
      </div>

      <div class="flex items-center gap-2">
        <RouterLink
          to="/gestao/condominios/novo"
          class="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-black text-white px-3.5 py-2 rounded-xl text-xs font-semibold shadow-sm transition-all"
        >
          <Plus class="w-3.5 h-3.5 text-brand-400" />
          <span>Novo Condomínio</span>
        </RouterLink>

        <RouterLink
          to="/gestao/terrenos/novo"
          class="inline-flex items-center gap-1.5 bg-brand-600 hover:bg-brand-700 text-white px-3.5 py-2 rounded-xl text-xs font-semibold shadow-sm shadow-brand-600/20 transition-all"
        >
          <Plus class="w-3.5 h-3.5 text-white" />
          <span>Novo Terreno</span>
        </RouterLink>
      </div>
    </div>

    <!-- Cards de Métricas Principais (Prompt Requisito 9.1) -->
    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
      <!-- 1. Condomínios -->
      <div class="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-card">
        <div class="w-8 h-8 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center mb-3">
          <Building2 class="w-4 h-4" />
        </div>
        <span class="text-xs font-semibold text-slate-500 block">Condomínios</span>
        <span class="text-2xl font-bold text-slate-900">{{ metrics.totalCondominiums }}</span>
      </div>

      <!-- 2. Terrenos Totais -->
      <div class="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-card">
        <div class="w-8 h-8 rounded-lg bg-slate-100 text-slate-800 flex items-center justify-center mb-3">
          <MapPin class="w-4 h-4" />
        </div>
        <span class="text-xs font-semibold text-slate-500 block">Total Terrenos</span>
        <span class="text-2xl font-bold text-slate-900">{{ metrics.totalTerrains }}</span>
      </div>

      <!-- 3. Disponíveis -->
      <div class="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-card">
        <div class="w-8 h-8 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center mb-3">
          <CheckCircle class="w-4 h-4" />
        </div>
        <span class="text-xs font-semibold text-slate-500 block">Disponíveis</span>
        <span class="text-2xl font-bold text-brand-600">{{ metrics.availableTerrains }}</span>
      </div>

      <!-- 4. Reservados -->
      <div class="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-card">
        <div class="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center mb-3">
          <Clock class="w-4 h-4" />
        </div>
        <span class="text-xs font-semibold text-slate-500 block">Reservados</span>
        <span class="text-2xl font-bold text-amber-700">{{ metrics.reservedTerrains }}</span>
      </div>

      <!-- 5. Vendidos -->
      <div class="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-card">
        <div class="w-8 h-8 rounded-lg bg-slate-200 text-slate-700 flex items-center justify-center mb-3">
          <Archive class="w-4 h-4" />
        </div>
        <span class="text-xs font-semibold text-slate-500 block">Vendidos</span>
        <span class="text-2xl font-bold text-slate-700">{{ metrics.soldTerrains }}</span>
      </div>

      <!-- 6. Total Leads -->
      <div class="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-card">
        <div class="w-8 h-8 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center mb-3">
          <Users class="w-4 h-4" />
        </div>
        <span class="text-xs font-semibold text-slate-500 block">Leads Recebidos</span>
        <span class="text-2xl font-bold text-purple-700">{{ metrics.totalLeads }}</span>
      </div>
    </div>

    <!-- Tabela de Contatos Recentes dos Visitantes -->
    <div class="bg-white rounded-2xl border border-slate-200 shadow-card overflow-hidden">
      <div class="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h3 class="font-heading text-lg font-bold text-slate-900">
            Contatos e Solicitações Recentes
          </h3>
          <p class="text-xs text-slate-500">
            Visitantes que preencheram o formulário de atendimento no site.
          </p>
        </div>

        <span class="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
          {{ recentLeads.length }} leads
        </span>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse text-xs">
          <thead>
            <tr class="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 uppercase tracking-wider">
              <th class="p-4">Interessado</th>
              <th class="p-4">Contato</th>
              <th class="p-4">Terreno de Interesse</th>
              <th class="p-4">Origem</th>
              <th class="p-4">Data</th>
              <th class="p-4">Status</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 text-slate-700">
            <tr v-for="lead in recentLeads" :key="lead.id" class="hover:bg-slate-50/60">
              <td class="p-4 font-semibold text-slate-900">
                {{ lead.name }}
              </td>
              <td class="p-4">
                <div>{{ lead.phone }}</div>
                <div v-if="lead.email" class="text-slate-400">{{ lead.email }}</div>
              </td>
              <td class="p-4">
                <span v-if="lead.terrainTitle" class="font-medium text-slate-900">{{ lead.terrainTitle }}</span>
                <span v-else class="text-slate-400">Interesse Geral</span>
              </td>
              <td class="p-4 text-slate-500">
                {{ lead.source }}
              </td>
              <td class="p-4 text-slate-500">
                {{ formatDate(lead.createdAt) }}
              </td>
              <td class="p-4">
                <span
                  :class="[
                    'px-2.5 py-1 rounded-full font-semibold uppercase tracking-wider text-[10px]',
                    lead.status === 'novo' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
                  ]"
                >
                  {{ lead.status }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
