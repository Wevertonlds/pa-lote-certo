<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { RouterLink } from 'vue-router';
import HeroCarousel from '@/components/carousel/HeroCarousel.vue';
import SmartSearchBox from '@/components/search/SmartSearchBox.vue';
import CondominiumCard from '@/components/catalog/CondominiumCard.vue';
import TerrainCard from '@/components/catalog/TerrainCard.vue';
import { HomePageService } from '@/services/HomePageService';
import { ContactService } from '@/services/ContactService';
import { LeadService } from '@/services/LeadService';
import { useCondominiumsStore } from '@/stores/condominiums';
import { useTerrainsStore } from '@/stores/terrains';
import { INITIAL_HOME_SETTINGS } from '@/services/mockData';
import { generateWhatsAppLink, formatPhone } from '@/utils/formatters';
import type { HomePageSettings } from '@/types';
import { 
  Building2, 
  MapPin, 
  ShieldCheck, 
  FileCheck, 
  Compass, 
  ArrowRight,
  MessageSquare,
  Send,
  Sparkles,
  Phone
} from 'lucide-vue-next';

const condominiumsStore = useCondominiumsStore();
const terrainsStore = useTerrainsStore();

const homeSettings = ref<HomePageSettings>(INITIAL_HOME_SETTINGS);
const whatsappNumber = ref('');
const contactPhone = ref('');
const contactEmail = ref('');

// Formulário de Contato / Atendimento
const leadForm = ref({
  name: '',
  phone: '',
  email: '',
  message: '',
});
const leadSubmitting = ref(false);
const leadSuccess = ref(false);

onMounted(async () => {
  const [settings, contact] = await Promise.all([
    HomePageService.getSettings(),
    ContactService.getSettings()
  ]);
  homeSettings.value = settings;
  whatsappNumber.value = contact.whatsapp;
  contactPhone.value = contact.phone;
  contactEmail.value = contact.email;
});

const featuredCondos = computed(() => {
  return condominiumsStore.condominiums.filter(c => c.isPublished && c.isFeatured).slice(0, 3);
});

const featuredTerrains = computed(() => {
  return terrainsStore.terrains.filter(t => t.isPublished && t.isFeatured && t.status === 'disponivel').slice(0, 6);
});

const whatsappMainUrl = computed(() => {
  return generateWhatsAppLink({
    whatsappNumber: whatsappNumber.value,
    origin: 'Página Inicial - Seção Atendimento'
  });
});

const handleLeadSubmit = async () => {
  if (!leadForm.value.name || !leadForm.value.phone) return;
  leadSubmitting.value = true;
  try {
    await LeadService.create({
      name: leadForm.value.name,
      phone: leadForm.value.phone,
      email: leadForm.value.email,
      message: leadForm.value.message || 'Interesse geral em terrenos em condomínio.',
      source: 'Formulário Página Inicial'
    });
    leadSuccess.value = true;
    leadForm.value = { name: '', phone: '', email: '', message: '' };
  } catch (err) {
    console.error(err);
  } finally {
    leadSubmitting.value = false;
  }
};
</script>

<template>
  <div class="space-y-24 pb-20">
    <!-- 1. Hero Carrossel -->
    <section v-if="homeSettings.visibleSections.hero">
      <HeroCarousel :banners="homeSettings.banners" />
    </section>

    <!-- 2. Busca Inteligente em Linguagem Natural -->
    <section id="busca" v-if="homeSettings.visibleSections.search">
      <SmartSearchBox />
    </section>

    <!-- 3. Condomínios em Destaque -->
    <section 
      v-if="homeSettings.visibleSections.featuredCondos && featuredCondos.length > 0"
      class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
    >
      <div class="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
        <div>
          <span class="text-xs font-bold uppercase tracking-widest text-brand-600 flex items-center gap-1.5 mb-2">
            <Building2 class="w-4 h-4 text-brand-500" />
            Condomínios Selecionados
          </span>
          <h2 class="font-heading text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            {{ homeSettings.featuredCondominiumsTitle }}
          </h2>
          <p class="text-slate-600 text-sm sm:text-base mt-2 max-w-2xl">
            {{ homeSettings.featuredCondominiumsSubtitle }}
          </p>
        </div>

        <RouterLink
          to="/condominios"
          class="inline-flex items-center gap-2 text-sm font-semibold text-brand-600 hover:text-brand-800 group"
        >
          <span>Explorar todos os condomínios</span>
          <ArrowRight class="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </RouterLink>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <CondominiumCard
          v-for="condo in featuredCondos"
          :key="condo.id"
          :condominium="condo"
        />
      </div>
    </section>

    <!-- 4. Terrenos / Lotes em Destaque -->
    <section 
      v-if="homeSettings.visibleSections.featuredTerrains && featuredTerrains.length > 0"
      class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
    >
      <div class="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
        <div>
          <span class="text-xs font-bold uppercase tracking-widest text-brand-600 flex items-center gap-1.5 mb-2">
            <Sparkles class="w-4 h-4 text-brand-500" />
            Oportunidades em Destaque
          </span>
          <h2 class="font-heading text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            {{ homeSettings.featuredTerrainsTitle }}
          </h2>
          <p class="text-slate-600 text-sm sm:text-base mt-2 max-w-2xl">
            {{ homeSettings.featuredTerrainsSubtitle }}
          </p>
        </div>

        <RouterLink
          to="/terrenos"
          class="inline-flex items-center gap-2 text-sm font-semibold text-brand-800 hover:text-brand-950 group"
        >
          <span>Acessar catálogo completo</span>
          <ArrowRight class="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </RouterLink>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <TerrainCard
          v-for="terrain in featuredTerrains"
          :key="terrain.id"
          :terrain="terrain"
        />
      </div>
    </section>

    <!-- 5. Seção de Diferenciais & Curadoria -->
    <section 
      v-if="homeSettings.visibleSections.differentials" 
      class="bg-gradient-to-br from-brand-950 via-slate-900 to-brand-900 text-white py-20"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center max-w-3xl mx-auto mb-16">
          <span class="text-xs font-bold uppercase tracking-widest text-gold-400">
            Nossa Proposta de Valor
          </span>
          <h2 class="font-heading text-3xl sm:text-4xl font-bold text-white tracking-tight mt-2">
            Por que escolher nossa assessoria para o seu lote?
          </h2>
          <p class="text-slate-300 text-sm sm:text-base mt-3">
            Garantimos segurança técnica e jurídica em todas as etapas da escolha do terreno ideal.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm hover:border-gold-500/40 transition-colors">
            <div class="w-12 h-12 rounded-xl bg-gold-500/20 text-gold-400 flex items-center justify-center mb-6">
              <ShieldCheck class="w-6 h-6" />
            </div>
            <h3 class="font-heading text-xl font-bold text-white mb-3">
              Auditoria Jurídica 100% Completa
            </h3>
            <p class="text-slate-300 text-sm leading-relaxed">
              Verificamos certidões imobiliárias, quitação tributária e regularidade cartorária antes de disponibilizar cada lote no catálogo.
            </p>
          </div>

          <div class="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm hover:border-gold-500/40 transition-colors">
            <div class="w-12 h-12 rounded-xl bg-gold-500/20 text-gold-400 flex items-center justify-center mb-6">
              <Compass class="w-6 h-6" />
            </div>
            <h3 class="font-heading text-xl font-bold text-white mb-3">
              Análise Técnica de Topografia & Insolação
            </h3>
            <p class="text-slate-300 text-sm leading-relaxed">
              Orientamos você sobre custo de terraplanagem, melhor posição solar e compatibilidade com o projeto arquitetônico desejado.
            </p>
          </div>

          <div class="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm hover:border-gold-500/40 transition-colors">
            <div class="w-12 h-12 rounded-xl bg-gold-500/20 text-gold-400 flex items-center justify-center mb-6">
              <FileCheck class="w-6 h-6" />
            </div>
            <h3 class="font-heading text-xl font-bold text-white mb-3">
              Negociação Direta & Personalizada
            </h3>
            <p class="text-slate-300 text-sm leading-relaxed">
              Intermediamos as melhores condições de pagamento, financiamento bancário ou parcelamento direto com o incorporador.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- 6. Seção de Atendimento e Conversão Comercial (Prompt Requisito 8) -->
    <section id="atendimento" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="bg-white rounded-3xl border border-slate-200/90 shadow-premium overflow-hidden">
        <div class="grid grid-cols-1 lg:grid-cols-12">
          <!-- Coluna Esquerda: Chamada e WhatsApp -->
          <div class="lg:col-span-5 bg-gradient-to-br from-brand-900 to-slate-900 text-white p-8 sm:p-12 flex flex-col justify-between">
            <div class="space-y-6">
              <span class="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest bg-gold-500/20 text-gold-300 border border-gold-400/30">
                Atendimento Imediato
              </span>

              <h2 class="font-heading text-3xl sm:text-4xl font-bold text-white leading-tight">
                {{ homeSettings.ctaTitle }}
              </h2>

              <p class="text-slate-300 text-sm sm:text-base leading-relaxed">
                {{ homeSettings.ctaSubtitle }}
              </p>

              <div class="pt-4">
                <a
                  :href="whatsappMainUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-3 bg-brand-600 hover:bg-brand-500 text-white font-bold px-6 py-4 rounded-2xl text-sm shadow-lg shadow-brand-500/25 active:scale-95 transition-all w-full sm:w-auto justify-center border border-brand-400/30"
                >
                  <MessageSquare class="w-5 h-5 text-white" />
                  <span>{{ homeSettings.ctaButtonText }}</span>
                </a>
              </div>
            </div>

            <div class="mt-8 pt-8 border-t border-white/10 space-y-2 text-xs text-slate-400">
              <div class="flex items-center gap-2">
                <Phone class="w-4 h-4 text-brand-400" />
                <span>Central de Vendas: {{ formatPhone(contactPhone) }}</span>
              </div>
              <p>Plantão de corretores todos os dias.</p>
            </div>
          </div>

          <!-- Coluna Direita: Formulário de Contato -->
          <div class="lg:col-span-7 p-8 sm:p-12">
            <div class="max-w-md mx-auto">
              <h3 class="font-heading text-2xl font-bold text-slate-900 mb-2">
                Solicite uma Consultoria Personalizada
              </h3>
              <p class="text-xs sm:text-sm text-slate-500 mb-6">
                Informe seus dados para receber o catálogo com plantas, fotos aéreas e tabela de preços atualizada.
              </p>

              <div v-if="leadSuccess" class="bg-sky-50 border border-sky-200 text-sky-900 p-4 rounded-xl text-sm mb-6 flex items-center gap-3">
                <ShieldCheck class="w-5 h-5 text-brand-600 shrink-0" />
                <span>Mensagem enviada com sucesso! Um corretor credenciado falará com você em instantes.</span>
              </div>

              <form v-else @submit.prevent="handleLeadSubmit" class="space-y-4">
                <div>
                  <label class="block text-xs font-semibold text-slate-700 mb-1">
                    Nome Completo *
                  </label>
                  <input
                    v-model="leadForm.name"
                    required
                    type="text"
                    placeholder="Ex: Carlos Eduardo"
                    class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-600 focus:bg-white"
                  />
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-xs font-semibold text-slate-700 mb-1">
                      WhatsApp / Telefone *
                    </label>
                    <input
                      v-model="leadForm.phone"
                      required
                      type="tel"
                      placeholder="(00) 00000-0000"
                      class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-600 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label class="block text-xs font-semibold text-slate-700 mb-1">
                      E-mail (opcional)
                    </label>
                    <input
                      v-model="leadForm.email"
                      type="email"
                      placeholder="seu@email.com"
                      class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-600 focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label class="block text-xs font-semibold text-slate-700 mb-1">
                    Como podemos te ajudar?
                  </label>
                  <textarea
                    v-model="leadForm.message"
                    rows="3"
                    placeholder="Ex: Gostaria de conhecer terrenos com mais de 500m² com lazer completo."
                    class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-600 focus:bg-white"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  :disabled="leadSubmitting"
                  class="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-3.5 px-6 rounded-xl text-sm shadow-md shadow-brand-600/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  <Send class="w-4 h-4 text-white" />
                  <span>{{ leadSubmitting ? 'Enviando...' : 'Receber Informações' }}</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
