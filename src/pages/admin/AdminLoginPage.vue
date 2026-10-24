<script setup lang="ts">
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useBrandingStore } from '@/stores/branding';
import { Lock, Mail, ArrowRight, AlertCircle } from 'lucide-vue-next';
import BrandIcon from '@/components/common/BrandIcon.vue';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const brandingStore = useBrandingStore();

const email = ref('admin@lotecerto.com.br');
const password = ref('admin123');
const errorMessage = ref('');
const isSubmitting = ref(false);

const handleLogin = async () => {
  errorMessage.value = '';
  isSubmitting.value = true;
  try {
    await authStore.login(email.value, password.value);
    const redirect = (route.query.redirect as string) || '/gestao';
    router.push(redirect);
  } catch (err: any) {
    errorMessage.value = err.message || 'Erro ao realizar login.';
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-950 via-brand-950 to-black flex items-center justify-center p-4">
    <div class="max-w-md w-full">
      <!-- Card de Login -->
      <div class="bg-white rounded-3xl p-8 sm:p-10 shadow-2xl border border-slate-200/80 space-y-8">
        <div class="text-center space-y-3">
          <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-950 to-black border border-brand-500/40 flex items-center justify-center mx-auto shadow-lg p-2.5">
            <BrandIcon size-class="w-9 h-9" color="#0A89CB" />
          </div>
          <div>
            <h1 class="font-heading text-2xl font-bold text-slate-900">
              Painel de Gestão
            </h1>
            <div class="flex items-center justify-center gap-1 mt-1 mb-1">
              <span class="h-1 w-3 rounded-full bg-brand-500"></span>
              <span class="h-1 w-3 rounded-full bg-slate-300"></span>
              <span class="h-1 w-3 rounded-full bg-crimson-600"></span>
            </div>
            <p class="text-xs text-slate-500 mt-1">
              {{ brandingStore.branding.brandName || 'Lote Certo' }} • Acesso Administrativo
            </p>
          </div>
        </div>

        <div v-if="errorMessage" class="bg-rose-50 border border-rose-200 text-rose-700 p-3.5 rounded-xl text-xs flex items-center gap-2">
          <AlertCircle class="w-4 h-4 shrink-0 text-rose-500" />
          <span>{{ errorMessage }}</span>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-5">
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1.5">
              E-mail do Gestor
            </label>
            <div class="relative">
              <Mail class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                v-model="email"
                required
                type="email"
                placeholder="admin@lotecerto.com.br"
                class="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-600 focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1.5">
              Senha de Acesso
            </label>
            <div class="relative">
              <Lock class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                v-model="password"
                required
                type="password"
                placeholder="••••••••"
                class="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-600 focus:bg-white"
              />
            </div>
          </div>

          <div class="pt-2">
            <button
              type="submit"
              :disabled="isSubmitting"
              class="w-full bg-gradient-to-r from-brand-600 to-brand-800 hover:from-brand-500 hover:to-brand-700 text-white font-bold py-3.5 px-6 rounded-xl text-sm shadow-md shadow-brand-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              <span>{{ isSubmitting ? 'Validando Acesso...' : 'Entrar no Painel' }}</span>
              <ArrowRight class="w-4 h-4 text-white" />
            </button>
          </div>
        </form>

        <div class="pt-4 border-t border-slate-100 text-center">
          <p class="text-[11px] text-slate-400">
            Ambiente com dados mockados prontos para demonstração.
          </p>
          <RouterLink to="/" class="text-xs font-semibold text-brand-800 hover:underline mt-2 inline-block">
            ← Voltar para o Site Público
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>
