<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { RouterLink } from 'vue-router';
import { useBrandingStore } from '@/stores/branding';
import { ContactService } from '@/services/ContactService';
import { generateWhatsAppLink } from '@/utils/formatters';
import { 
  Building2, 
  MapPin, 
  Phone, 
  MessageSquare, 
  Menu, 
  X
} from 'lucide-vue-next';
import BrandIcon from '@/components/common/BrandIcon.vue';

const brandingStore = useBrandingStore();
const isScrolled = ref(false);
const mobileMenuOpen = ref(false);
const whatsappUrl = ref('');

const handleScroll = () => {
  isScrolled.value = window.scrollY > 30;
};

onMounted(async () => {
  window.addEventListener('scroll', handleScroll);
  const contact = await ContactService.getSettings();
  whatsappUrl.value = generateWhatsAppLink({
    whatsappNumber: contact.whatsapp,
    origin: 'Cabeçalho'
  });
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<template>
  <header 
    :class="[
      'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
      isScrolled 
        ? 'glass-nav shadow-premium py-3 border-b border-slate-200/50' 
        : 'bg-gradient-to-b from-black/60 via-black/20 to-transparent py-5'
    ]"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between">
        <!-- Logo / Marca -->
        <RouterLink to="/" class="flex items-center gap-3 group">
          <div 
            class="w-11 h-11 rounded-2xl bg-black flex items-center justify-center border border-white/10 shadow-lg group-hover:border-brand-500/50 group-hover:scale-105 transition-all p-2"
          >
            <BrandIcon size-class="w-7 h-7" color="#0A89CB" />
          </div>
          <div>
            <span 
              :class="[
                'font-heading text-xl font-bold tracking-tight block transition-colors leading-tight',
                isScrolled ? 'text-slate-900' : 'text-white drop-shadow-md'
              ]"
            >
              {{ brandingStore.branding.brandName || 'Lote Certo' }}
            </span>
            <div class="flex items-center gap-1 mt-0.5">
              <span class="h-1 w-3 rounded-full bg-brand-500"></span>
              <span class="h-1 w-3 rounded-full bg-white"></span>
              <span class="h-1 w-3 rounded-full bg-crimson-600"></span>
              <span 
                :class="[
                  'text-[9px] tracking-widest uppercase font-semibold transition-colors ml-1',
                  isScrolled ? 'text-slate-500' : 'text-slate-300'
                ]"
              >
                Lotes & Condomínios
              </span>
            </div>
          </div>
        </RouterLink>

        <!-- Navegação Desktop -->
        <nav class="hidden md:flex items-center gap-8">
          <RouterLink 
            to="/" 
            :class="[
              'text-sm font-medium transition-colors hover:text-brand-400',
              isScrolled ? 'text-slate-700 hover:text-brand-600' : 'text-white/90'
            ]"
          >
            Início
          </RouterLink>

          <RouterLink 
            to="/condominios" 
            :class="[
              'text-sm font-medium transition-colors hover:text-brand-400 flex items-center gap-1.5',
              isScrolled ? 'text-slate-700 hover:text-brand-600' : 'text-white/90'
            ]"
          >
            <Building2 class="w-4 h-4 text-brand-400" />
            Condomínios
          </RouterLink>

          <RouterLink 
            to="/terrenos" 
            :class="[
              'text-sm font-medium transition-colors hover:text-brand-400 flex items-center gap-1.5',
              isScrolled ? 'text-slate-700 hover:text-brand-600' : 'text-white/90'
            ]"
          >
            <MapPin class="w-4 h-4 text-brand-400" />
            Catálogo de Terrenos
          </RouterLink>

          <a 
            href="#atendimento" 
            :class="[
              'text-sm font-medium transition-colors hover:text-brand-400',
              isScrolled ? 'text-slate-700 hover:text-brand-600' : 'text-white/90'
            ]"
          >
            Atendimento
          </a>
        </nav>

        <!-- CTA WhatsApp & Contato -->
        <div class="hidden md:flex items-center gap-3">
          <a
            :href="whatsappUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-2 bg-gradient-to-r from-brand-600 to-brand-800 hover:from-brand-500 hover:to-brand-700 text-white px-4 py-2.5 rounded-full text-xs font-semibold tracking-wide uppercase shadow-md shadow-brand-500/20 hover:shadow-lg hover:brightness-110 active:scale-95 transition-all border border-brand-400/20"
          >
            <MessageSquare class="w-4 h-4 text-brand-200" />
            <span>Falar com Atendente</span>
          </a>
        </div>

        <!-- Botão Mobile Menu Hamburger -->
        <div class="flex md:hidden">
          <button
            @click="mobileMenuOpen = !mobileMenuOpen"
            :class="[
              'p-2 rounded-lg transition-colors',
              isScrolled ? 'text-slate-900 bg-slate-100' : 'text-white bg-black/40'
            ]"
            aria-label="Abrir Menu"
          >
            <Menu v-if="!mobileMenuOpen" class="w-6 h-6" />
            <X v-else class="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Drawer Menu -->
    <div 
      v-if="mobileMenuOpen" 
      class="md:hidden bg-white/95 backdrop-blur-lg border-b border-slate-200 px-6 py-6 space-y-4 shadow-xl"
    >
      <RouterLink 
        to="/" 
        @click="mobileMenuOpen = false"
        class="block py-2 text-slate-800 font-medium hover:text-brand-800"
      >
        Início
      </RouterLink>
      <RouterLink 
        to="/condominios" 
        @click="mobileMenuOpen = false"
        class="flex items-center gap-2 py-2 text-slate-800 font-medium hover:text-brand-800"
      >
        <Building2 class="w-5 h-5 text-gold-600" />
        Condomínios
      </RouterLink>
      <RouterLink 
        to="/terrenos" 
        @click="mobileMenuOpen = false"
        class="flex items-center gap-2 py-2 text-slate-800 font-medium hover:text-brand-800"
      >
        <MapPin class="w-5 h-5 text-gold-600" />
        Catálogo de Terrenos
      </RouterLink>
      <a 
        href="#atendimento" 
        @click="mobileMenuOpen = false"
        class="flex items-center gap-2 py-2 text-slate-800 font-medium hover:text-brand-800"
      >
        <Phone class="w-5 h-5 text-gold-600" />
        Atendimento
      </a>
      <div class="pt-4 border-t border-slate-100">
        <a
          :href="whatsappUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="flex items-center justify-center gap-2 w-full bg-emerald-600 text-white py-3 rounded-xl font-semibold shadow"
        >
          <MessageSquare class="w-5 h-5" />
          Falar no WhatsApp
        </a>
      </div>
    </div>
  </header>
</template>
