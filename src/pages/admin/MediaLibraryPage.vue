<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { MediaService } from '@/services/MediaService';
import type { MediaAsset } from '@/types';
import { Image, Plus, Trash2, CheckCircle, Tag } from 'lucide-vue-next';

const mediaList = ref<MediaAsset[]>([]);
const selectedCategory = ref<string>('todos');
const newTitle = ref('');
const newUrl = ref('');
const newCategory = ref<MediaAsset['category']>('geral');
const feedbackMessage = ref('');
const isSubmitting = ref(false);

const loadMedia = async () => {
  mediaList.value = await MediaService.getAll();
};

onMounted(loadMedia);

const filteredMedia = computed(() => {
  if (selectedCategory.value === 'todos') return mediaList.value;
  return mediaList.value.filter(m => m.category === selectedCategory.value);
});

const handleAddMedia = async () => {
  if (!newTitle.value.trim() || !newUrl.value.trim()) return;
  isSubmitting.value = true;
  try {
    await MediaService.add({
      title: newTitle.value.trim(),
      altText: newTitle.value.trim(),
      url: newUrl.value.trim(),
      category: newCategory.value,
    });
    feedbackMessage.value = 'Mídia adicionada com sucesso!';
    newTitle.value = '';
    newUrl.value = '';
    await loadMedia();
    setTimeout(() => feedbackMessage.value = '', 3000);
  } finally {
    isSubmitting.value = false;
  }
};

const handleDeleteMedia = async (id: string) => {
  if (confirm('Deseja excluir esta mídia?')) {
    await MediaService.delete(id);
    await loadMedia();
  }
};
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="font-heading text-2xl font-bold text-slate-900">
        Biblioteca de Mídia
      </h1>
      <p class="text-xs text-slate-500 mt-1">
        Central de fotos, imagens de condomínios, lotes, áreas de lazer e banners.
      </p>
    </div>

    <div v-if="feedbackMessage" class="bg-sky-50 border border-sky-200 text-sky-900 p-4 rounded-xl text-xs flex items-center gap-2">
      <CheckCircle class="w-4 h-4 text-brand-600 shrink-0" />
      <span>{{ feedbackMessage }}</span>
    </div>

    <!-- Adicionar Nova Mídia -->
    <div class="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
      <h2 class="text-xs font-bold uppercase tracking-wider text-slate-700">
        Cadastrar Nova Imagem / Mídia
      </h2>
      <div class="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <div>
          <label class="block text-[11px] font-semibold text-slate-600 mb-1">Título da Imagem</label>
          <input
            v-model="newTitle"
            type="text"
            placeholder="Ex: Piscina do Clube"
            class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
          />
        </div>
        <div class="sm:col-span-2">
          <label class="block text-[11px] font-semibold text-slate-600 mb-1">URL da Imagem</label>
          <input
            v-model="newUrl"
            type="url"
            placeholder="https://images.unsplash.com/photo-..."
            class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
          />
        </div>
        <div>
          <label class="block text-[11px] font-semibold text-slate-600 mb-1">Categoria</label>
          <select
            v-model="newCategory"
            class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
          >
            <option value="condominio">Condomínio</option>
            <option value="terreno">Terreno</option>
            <option value="lazer">Lazer</option>
            <option value="banner">Banner</option>
            <option value="geral">Geral</option>
          </select>
        </div>
      </div>
      <div class="flex justify-end">
        <button
          type="button"
          @click="handleAddMedia"
          :disabled="isSubmitting"
          class="bg-brand-600 hover:bg-brand-700 text-white px-5 py-2 rounded-xl text-xs font-semibold shadow-sm shadow-brand-600/20 flex items-center gap-1.5 transition-all"
        >
          <Plus class="w-4 h-4" />
          <span>Salvar Mídia</span>
        </button>
      </div>
    </div>

    <!-- Filtro de Categorias -->
    <div class="flex items-center gap-2 overflow-x-auto pb-2">
      <button
        v-for="cat in ['todos', 'condominio', 'terreno', 'lazer', 'banner', 'geral']"
        :key="cat"
        @click="selectedCategory = cat"
        :class="[
          'px-3.5 py-1.5 rounded-full text-xs font-semibold capitalize transition-colors',
          selectedCategory === cat ? 'bg-brand-900 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
        ]"
      >
        {{ cat }}
      </button>
    </div>

    <!-- Grid de Imagens -->
    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      <div
        v-for="asset in filteredMedia"
        :key="asset.id"
        class="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm flex flex-col justify-between group"
      >
        <div class="relative aspect-[16/10] bg-slate-100 overflow-hidden">
          <img :src="asset.url" :alt="asset.altText" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          <span class="absolute top-2 left-2 bg-black/60 text-white text-[10px] uppercase font-semibold px-2 py-0.5 rounded backdrop-blur-sm">
            {{ asset.category }}
          </span>
        </div>
        <div class="p-3 flex items-center justify-between">
          <span class="text-xs font-semibold text-slate-800 truncate">{{ asset.title }}</span>
          <button
            @click="handleDeleteMedia(asset.id)"
            class="text-rose-500 hover:text-rose-700 p-1 rounded hover:bg-rose-50"
            title="Excluir imagem"
          >
            <Trash2 class="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
