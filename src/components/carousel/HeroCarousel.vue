<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';
import type { BannerSlide } from '@/types';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-vue-next';

const props = defineProps<{
  banners: BannerSlide[];
}>();

const activeBanners = computed(() => {
  return props.banners
    .filter(b => b.isActive)
    .sort((a, b) => a.order - b.order);
});

const currentIndex = ref(0);
const isPaused = ref(false);
let timer: ReturnType<typeof setInterval> | null = null;

const nextSlide = () => {
  if (activeBanners.value.length === 0) return;
  currentIndex.value = (currentIndex.value + 1) % activeBanners.value.length;
};

const prevSlide = () => {
  if (activeBanners.value.length === 0) return;
  currentIndex.value = (currentIndex.value - 1 + activeBanners.value.length) % activeBanners.value.length;
};

const goToSlide = (index: number) => {
  currentIndex.value = index;
};

const startTimer = () => {
  if (timer) clearInterval(timer);
  timer = setInterval(() => {
    if (!isPaused.value) {
      nextSlide();
    }
  }, 6000);
};

onMounted(() => {
  startTimer();
});

onUnmounted(() => {
  if (timer) clearInterval(timer);
});
</script>

<template>
  <div 
    class="relative w-full h-[620px] md:h-[720px] overflow-hidden bg-slate-950 select-none"
    @mouseenter="isPaused = true"
    @mouseleave="isPaused = false"
  >
    <!-- Slides -->
    <div 
      v-for="(banner, index) in activeBanners" 
      :key="banner.id"
      :class="[
        'absolute inset-0 transition-opacity duration-1000 ease-in-out',
        index === currentIndex ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'
      ]"
    >
      <!-- Background Image com Overlays -->
      <picture>
        <source 
          v-if="banner.mobileImage" 
          media="(max-width: 640px)" 
          :srcset="banner.mobileImage" 
        />
        <img 
          :src="banner.desktopImage" 
          :alt="banner.title"
          class="w-full h-full object-cover object-center transform scale-105 transition-transform duration-10000 ease-out"
          :class="{ 'scale-100': index === currentIndex }"
          loading="eager"
        />
      </picture>

      <!-- Gradient Overlays para Máxima Legibilidade e Sofisticação -->
      <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-black/40 to-black/60" />
      <div class="absolute inset-0 bg-gradient-to-r from-brand-950/80 via-transparent to-black/40" />

      <!-- Conteúdo do Slide -->
      <div class="absolute inset-0 flex items-center">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div class="max-w-3xl space-y-6 pt-16">
            <span class="inline-block px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-widest bg-brand-500/20 text-brand-300 border border-brand-400/30 backdrop-blur-sm">
              Empreendimentos Exclusivos
            </span>

            <h1 class="font-heading text-3xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.15] drop-shadow-lg">
              {{ banner.title }}
            </h1>

            <p class="text-base sm:text-xl text-slate-200 font-light leading-relaxed max-w-2xl drop-shadow">
              {{ banner.subtitle }}
            </p>

            <div class="pt-2 flex flex-wrap gap-4">
              <a
                v-if="banner.buttonText"
                :href="banner.buttonLink || '/terrenos'"
                class="inline-flex items-center gap-2.5 bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-400 hover:to-brand-500 text-white font-bold px-7 py-3.5 rounded-full text-sm uppercase tracking-wider shadow-lg shadow-brand-500/25 active:scale-95 transition-all border border-brand-400/30"
              >
                <span>{{ banner.buttonText }}</span>
                <ArrowRight class="w-4 h-4" />
              </a>

              <a
                href="#busca"
                class="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-medium px-6 py-3.5 rounded-full text-sm backdrop-blur-md border border-white/20 transition-all"
              >
                Buscar Terrenos
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Controles de Navegação (Setas) -->
    <button
      v-if="activeBanners.length > 1"
      @click="prevSlide"
      class="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition-all opacity-70 hover:opacity-100"
      aria-label="Slide anterior"
    >
      <ChevronLeft class="w-6 h-6" />
    </button>

    <button
      v-if="activeBanners.length > 1"
      @click="nextSlide"
      class="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition-all opacity-70 hover:opacity-100"
      aria-label="Próximo slide"
    >
      <ChevronRight class="w-6 h-6" />
    </button>

    <!-- Indicadores (Pontos) -->
    <div 
      v-if="activeBanners.length > 1"
      class="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2.5 bg-black/30 backdrop-blur-md px-4 py-2 rounded-full border border-white/10"
    >
      <button
        v-for="(_, idx) in activeBanners"
        :key="idx"
        @click="goToSlide(idx)"
        :class="[
          'h-2.5 rounded-full transition-all duration-300',
          idx === currentIndex ? 'w-8 bg-brand-400 shadow-sm shadow-brand-400/60' : 'w-2.5 bg-white/40 hover:bg-white/80'
        ]"
        :aria-label="`Ir para slide ${idx + 1}`"
      />
    </div>
  </div>
</template>
