<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { Compass, ArrowLeft } from 'lucide-vue-next';
</script>

<template>
  <div class="min-h-[70vh] flex items-center justify-center px-4 py-24 text-center">
    <div class="max-w-md mx-auto space-y-6">
      <div class="w-20 h-20 rounded-full bg-emerald-50 text-emerald-800 flex items-center justify-center mx-auto shadow-inner">
        <Compass class="w-10 h-10 text-gold-600" />
      </div>

      <span class="text-xs font-bold uppercase tracking-widest text-slate-400">
        Erro 404
      </span>

      <h1 class="font-heading text-3xl sm:text-4xl font-bold text-slate-900">
        Página não encontrada
      </h1>

      <p class="text-sm text-slate-600 leading-relaxed">
        O endereço que você tentou acessar não existe, foi alterado ou está temporariamente indisponível.
      </p>

      <div class="pt-4 flex justify-center gap-3">
        <RouterLink
          to="/"
          class="inline-flex items-center gap-2 bg-brand-800 hover:bg-brand-900 text-white font-semibold px-6 py-3 rounded-xl text-xs shadow transition-all"
        >
          <ArrowLeft class="w-4 h-4" />
          <span>Voltar para a Página Inicial</span>
        </RouterLink>
      </div>
    </div>
  </div>
</template>
