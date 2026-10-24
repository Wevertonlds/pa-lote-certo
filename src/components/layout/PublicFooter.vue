<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { RouterLink } from 'vue-router';
import { useBrandingStore } from '@/stores/branding';
import { ContactService } from '@/services/ContactService';
import { generateWhatsAppLink, formatPhone } from '@/utils/formatters';
import type { ContactSettings } from '@/types';
import { INITIAL_CONTACT_SETTINGS } from '@/services/mockData';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Instagram, 
  MessageSquare,
  Lock,
  ArrowRight
} from 'lucide-vue-next';
import BrandIcon from '@/components/common/BrandIcon.vue';

const brandingStore = useBrandingStore();
const contact = ref<ContactSettings>(INITIAL_CONTACT_SETTINGS);
const whatsappUrl = ref('');

onMounted(async () => {
  contact.value = await ContactService.getSettings();
  whatsappUrl.value = generateWhatsAppLink({
    whatsappNumber: contact.value.whatsapp,
    origin: 'Rodapé'
  });
});
</script>

<template>
  <footer class="bg-gradient-to-b from-slate-950 to-black text-slate-300 pt-16 pb-12 border-t border-slate-800">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-14 border-b border-white/10">
        <!-- Coluna 1: Marca & Slogan -->
        <div class="space-y-4">
          <div class="flex items-center gap-3">
            <div class="w-11 h-11 rounded-2xl bg-black flex items-center justify-center border border-white/10 shadow-lg p-2">
              <BrandIcon size-class="w-7 h-7" color="#0A89CB" />
            </div>
            <div>
              <span class="font-heading text-xl font-bold text-white tracking-tight block">
                {{ brandingStore.branding.brandName || 'Lote Certo' }}
              </span>
              <div class="flex items-center gap-1 mt-1">
                <span class="h-1 w-3.5 rounded-full bg-brand-500"></span>
                <span class="h-1 w-3.5 rounded-full bg-white"></span>
                <span class="h-1 w-3.5 rounded-full bg-crimson-600"></span>
              </div>
            </div>
          </div>
          <p class="text-sm text-slate-400 leading-relaxed">
            {{ brandingStore.branding.slogan }}
          </p>
          <div class="pt-2">
            <a
              :href="whatsappUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-brand-400 hover:text-brand-300 transition-colors"
            >
              <MessageSquare class="w-4 h-4" />
              <span>Atendimento Exclusivo</span>
              <ArrowRight class="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        <!-- Coluna 2: Navegação Rápida -->
        <div>
          <h4 class="text-sm font-semibold uppercase tracking-wider text-white mb-4 font-sans">
            Navegação
          </h4>
          <ul class="space-y-2.5 text-sm">
            <li>
              <RouterLink to="/" class="hover:text-brand-400 transition-colors">Página Inicial</RouterLink>
            </li>
            <li>
              <RouterLink to="/condominios" class="hover:text-brand-400 transition-colors">Condomínios Residenciais</RouterLink>
            </li>
            <li>
              <RouterLink to="/terrenos" class="hover:text-brand-400 transition-colors">Catálogo de Terrenos</RouterLink>
            </li>
            <li>
              <a href="#atendimento" class="hover:text-brand-400 transition-colors">Falar com Consultor</a>
            </li>
          </ul>
        </div>

        <!-- Coluna 3: Condomínios -->
        <div>
          <h4 class="text-sm font-semibold uppercase tracking-wider text-white mb-4 font-sans">
            Destaques
          </h4>
          <ul class="space-y-2.5 text-sm text-slate-400">
            <li>Alphaville Reserva (Uberlândia)</li>
            <li>Quintas do Lago (Nova Lima)</li>
            <li>Reserva dos Ipês (Campinas)</li>
            <li class="pt-1">
              <RouterLink to="/terrenos?tipo=esquina" class="text-brand-400 hover:underline text-xs flex items-center gap-1 font-semibold">
                Ver lotes de esquina →
              </RouterLink>
            </li>
          </ul>
        </div>

        <!-- Coluna 4: Contato & Localização -->
        <div>
          <h4 class="text-sm font-semibold uppercase tracking-wider text-white mb-4 font-sans">
            Atendimento
          </h4>
          <ul class="space-y-3 text-sm text-slate-400">
            <li class="flex items-start gap-2.5">
              <MapPin class="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
              <span>{{ contact.address }}</span>
            </li>
            <li class="flex items-center gap-2.5">
              <Phone class="w-4 h-4 text-brand-400 shrink-0" />
              <span>{{ formatPhone(contact.phone) }}</span>
            </li>
            <li class="flex items-center gap-2.5">
              <Mail class="w-4 h-4 text-brand-400 shrink-0" />
              <span>{{ contact.email }}</span>
            </li>
            <li class="flex items-start gap-2.5">
              <Clock class="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
              <span class="text-xs">{{ contact.businessHours }}</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- Barra inferior com Copyright e botão discreto de GESTÃO -->
      <div class="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
        <div>
          © {{ new Date().getFullYear() }} {{ brandingStore.branding.brandName }}. Todos os direitos reservados.
        </div>

        <div class="flex items-center gap-6">
          <span class="text-slate-400">Ambiente Seguro</span>

          <!-- BOTÃO DISCRETO GESTÃO (Requisito 9) -->
          <RouterLink
            to="/gestao/login"
            class="inline-flex items-center gap-1.5 text-slate-400 hover:text-brand-400 border border-slate-700/60 hover:border-brand-500/60 rounded px-2.5 py-1 text-[11px] transition-all"
            title="Acesso Administrativo ao Painel"
          >
            <Lock class="w-3 h-3 text-brand-400" />
            <span>Gestão</span>
          </RouterLink>
        </div>
      </div>
    </div>
  </footer>
</template>
