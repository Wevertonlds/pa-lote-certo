<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter, RouterLink } from 'vue-router';
import { useCondominiumsStore } from '@/stores/condominiums';
import type { Condominium, LeisureArea } from '@/types';
import { slugify } from '@/utils/slug';
import { 
  Building2, 
  ArrowLeft, 
  Save, 
  Plus, 
  Trash2, 
  Image, 
  Sparkles, 
  CheckCircle,
  AlertCircle
} from 'lucide-vue-next';

const route = useRoute();
const router = useRouter();
const condominiumsStore = useCondominiumsStore();

const isEditing = computed(() => !!route.params.id);
const condoId = computed(() => route.params.id as string);

const form = ref<Omit<Condominium, 'id' | 'createdAt' | 'updatedAt'>>({
  name: '',
  slug: '',
  city: '',
  state: 'MG',
  address: '',
  shortDescription: '',
  fullDescription: '',
  coverImage: '',
  gallery: [],
  infrastructure: [
    'Portaria 24h blindada com reconhecimento facial',
    'Fiação 100% subterrânea',
    'Rede de fibra ótica de alta velocidade'
  ],
  leisureAreas: [
    {
      id: 'leisure-item-1',
      title: 'Piscina de Borda Infinita',
      description: 'Complexo aquático com raia aquecida e solarium.',
      image: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=800&q=80',
    }
  ],
  features: ['Alto Padrão', 'Segurança 24h', 'Clube Resort'],
  isPublished: true,
  isFeatured: false,
  seoTitle: '',
  seoDescription: '',
});

const newInfraItem = ref('');
const newFeatureItem = ref('');
const galleryInputUrl = ref('');
const isSubmitting = ref(false);
const feedbackMessage = ref('');

onMounted(async () => {
  await condominiumsStore.loadCondominiums();
  if (isEditing.value) {
    const existing = condominiumsStore.getById(condoId.value);
    if (existing) {
      form.value = {
        name: existing.name,
        slug: existing.slug,
        city: existing.city,
        state: existing.state,
        address: existing.address,
        shortDescription: existing.shortDescription,
        fullDescription: existing.fullDescription,
        coverImage: existing.coverImage,
        gallery: [...existing.gallery],
        infrastructure: [...existing.infrastructure],
        leisureAreas: JSON.parse(JSON.stringify(existing.leisureAreas)),
        features: [...existing.features],
        isPublished: existing.isPublished,
        isFeatured: existing.isFeatured,
        seoTitle: existing.seoTitle || '',
        seoDescription: existing.seoDescription || '',
      };
    }
  }
});

const handleNameChange = () => {
  if (!isEditing.value || !form.value.slug) {
    form.value.slug = slugify(form.value.name);
  }
};

const addInfra = () => {
  if (!newInfraItem.value.trim()) return;
  form.value.infrastructure.push(newInfraItem.value.trim());
  newInfraItem.value = '';
};

const removeInfra = (index: number) => {
  form.value.infrastructure.splice(index, 1);
};

const addFeature = () => {
  if (!newFeatureItem.value.trim()) return;
  form.value.features.push(newFeatureItem.value.trim());
  newFeatureItem.value = '';
};

const removeFeature = (index: number) => {
  form.value.features.splice(index, 1);
};

const addGalleryImage = () => {
  if (!galleryInputUrl.value.trim()) return;
  form.value.gallery.push(galleryInputUrl.value.trim());
  galleryInputUrl.value = '';
};

const removeGalleryImage = (index: number) => {
  form.value.gallery.splice(index, 1);
};

// CRUD de Área de Lazer no cadastro do Condomínio (Prompt Requisito 7.3 e 10 Aba C)
const addLeisureArea = () => {
  form.value.leisureAreas.push({
    id: `leisure-${Date.now()}`,
    title: 'Nova Área de Lazer',
    description: 'Descrição do ambiente e diferenciais para os moradores.',
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
  });
};

const removeLeisureArea = (index: number) => {
  form.value.leisureAreas.splice(index, 1);
};

const handleSubmit = async () => {
  if (!form.value.name || !form.value.city) {
    alert('Preencha os campos obrigatórios.');
    return;
  }
  isSubmitting.value = true;
  try {
    if (isEditing.value) {
      await condominiumsStore.updateCondominium(condoId.value, form.value);
      feedbackMessage.value = 'Condomínio atualizado com sucesso!';
    } else {
      await condominiumsStore.createCondominium(form.value);
      feedbackMessage.value = 'Condomínio criado com sucesso!';
    }
    setTimeout(() => {
      router.push('/gestao/condominios');
    }, 1000);
  } catch (err: any) {
    alert(err.message || 'Erro ao salvar condomínio.');
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <div class="max-w-5xl mx-auto space-y-8 pb-16">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-3">
        <RouterLink
          to="/gestao/condominios"
          class="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition-colors"
        >
          <ArrowLeft class="w-5 h-5" />
        </RouterLink>
        <div>
          <h1 class="font-heading text-2xl font-bold text-slate-900">
            {{ isEditing ? 'Editar Condomínio' : 'Cadastrar Novo Condomínio' }}
          </h1>
          <p class="text-xs text-slate-500">
            {{ isEditing ? 'Atualize as informações do empreendimento' : 'Preencha os dados e configure as áreas de lazer' }}
          </p>
        </div>
      </div>

      <button
        type="button"
        @click="handleSubmit"
        :disabled="isSubmitting"
        class="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-5 py-2.5 rounded-xl text-xs font-semibold shadow-sm shadow-brand-600/20 transition-all disabled:opacity-50"
      >
        <Save class="w-4 h-4 text-white" />
        <span>{{ isSubmitting ? 'Salvando...' : 'Salvar Condomínio' }}</span>
      </button>
    </div>

    <div v-if="feedbackMessage" class="bg-sky-50 border border-sky-200 text-sky-900 p-4 rounded-xl text-xs flex items-center gap-2">
      <CheckCircle class="w-4 h-4 text-brand-600 shrink-0" />
      <span>{{ feedbackMessage }}</span>
    </div>

    <!-- Formulário Principal Dividido em Blocos -->
    <form @submit.prevent="handleSubmit" class="space-y-8">
      <!-- 1. Dados Básicos & Localização -->
      <div class="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
        <h2 class="font-heading text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
          1. Identificação & Localização
        </h2>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">Nome do Condomínio *</label>
            <input
              v-model="form.name"
              @input="handleNameChange"
              required
              type="text"
              placeholder="Ex: Alphaville Reserva"
              class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-brand-700"
            />
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">Slug da URL *</label>
            <input
              v-model="form.slug"
              required
              type="text"
              placeholder="alphaville-reserva"
              class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-brand-700"
            />
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">Cidade *</label>
            <input
              v-model="form.city"
              required
              type="text"
              placeholder="Ex: Uberlândia"
              class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-brand-700"
            />
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">Estado (UF) *</label>
            <input
              v-model="form.state"
              required
              type="text"
              maxlength="2"
              placeholder="MG"
              class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-brand-700 uppercase"
            />
          </div>

          <div class="sm:col-span-2">
            <label class="block text-xs font-semibold text-slate-700 mb-1">Endereço / Referência de Acesso</label>
            <input
              v-model="form.address"
              type="text"
              placeholder="Ex: Av. dos Vinhedos, 4500 - Zona Sul"
              class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-brand-700"
            />
          </div>
        </div>
      </div>

      <!-- 2. Descrições -->
      <div class="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <h2 class="font-heading text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
          2. Descrições
        </h2>

        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">Descrição Curta (para cards)</label>
          <input
            v-model="form.shortDescription"
            type="text"
            placeholder="Resumo em 1 ou 2 frases sobre os principais destaques..."
            class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-brand-700"
          />
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">Descrição Completa</label>
          <textarea
            v-model="form.fullDescription"
            rows="4"
            placeholder="Apresentação detalhada da infraestrutura, localização e estilo de vida..."
            class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-brand-700"
          ></textarea>
        </div>
      </div>

      <!-- 3. Imagem de Capa e Galeria -->
      <div class="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
        <h2 class="font-heading text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
          3. Imagens do Empreendimento
        </h2>

        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">URL da Imagem de Capa *</label>
          <input
            v-model="form.coverImage"
            required
            type="url"
            placeholder="https://images.unsplash.com/photo-..."
            class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-brand-700"
          />
          <div v-if="form.coverImage" class="mt-3 relative w-44 h-28 rounded-xl overflow-hidden border border-slate-200">
            <img :src="form.coverImage" class="w-full h-full object-cover" />
          </div>
        </div>

        <div class="pt-3 border-t border-slate-100">
          <label class="block text-xs font-semibold text-slate-700 mb-1">Galeria de Fotos do Condomínio</label>
          <div class="flex gap-2 mb-3">
            <input
              v-model="galleryInputUrl"
              type="url"
              placeholder="Cole a URL da foto e clique em Adicionar..."
              class="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
            />
            <button
              type="button"
              @click="addGalleryImage"
              class="bg-slate-800 text-white px-4 py-2 rounded-xl text-xs font-semibold"
            >
              Adicionar Foto
            </button>
          </div>

          <div class="flex flex-wrap gap-3">
            <div
              v-for="(img, idx) in form.gallery"
              :key="idx"
              class="relative w-28 h-20 rounded-xl overflow-hidden border border-slate-200 group"
            >
              <img :src="img" class="w-full h-full object-cover" />
              <button
                type="button"
                @click="removeGalleryImage(idx)"
                class="absolute top-1 right-1 bg-rose-600 text-white p-1 rounded-full opacity-80 hover:opacity-100"
              >
                <Trash2 class="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 4. Áreas de Lazer Exclusivas (Requisito Fundamental 7.3: Gerenciadas no Condomínio) -->
      <div class="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
        <div class="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 class="font-heading text-base font-bold text-slate-900">
              4. Áreas de Lazer do Empreendimento
            </h2>
            <p class="text-xs text-slate-500">
              Estas estruturas serão exibidas automaticamente ao lado dos detalhes de cada terreno deste condomínio.
            </p>
          </div>

          <button
            type="button"
            @click="addLeisureArea"
            class="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-xl text-xs font-semibold hover:bg-emerald-100"
          >
            <Plus class="w-3.5 h-3.5" />
            <span>Adicionar Lazer</span>
          </button>
        </div>

        <div class="space-y-4">
          <div
            v-for="(leisure, idx) in form.leisureAreas"
            :key="leisure.id"
            class="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3 relative"
          >
            <button
              type="button"
              @click="removeLeisureArea(idx)"
              class="absolute top-3 right-3 text-rose-500 hover:text-rose-700"
              title="Remover área de lazer"
            >
              <Trash2 class="w-4 h-4" />
            </button>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pr-8">
              <div>
                <label class="block text-[11px] font-semibold text-slate-600 mb-1">Título do Ambiente</label>
                <input
                  v-model="leisure.title"
                  type="text"
                  placeholder="Ex: Piscina Resort"
                  class="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div>
                <label class="block text-[11px] font-semibold text-slate-600 mb-1">URL da Imagem</label>
                <input
                  v-model="leisure.image"
                  type="url"
                  placeholder="https://..."
                  class="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div class="sm:col-span-2">
                <label class="block text-[11px] font-semibold text-slate-600 mb-1">Descrição</label>
                <input
                  v-model="leisure.description"
                  type="text"
                  placeholder="Breve descrição dos equipamentos e atrativos..."
                  class="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 5. Infraestrutura & Diferenciais -->
      <div class="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
        <h2 class="font-heading text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
          5. Infraestrutura Técnica & Diferenciais
        </h2>

        <!-- Infraestrutura -->
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">Itens de Infraestrutura</label>
          <div class="flex gap-2 mb-3">
            <input
              v-model="newInfraItem"
              type="text"
              placeholder="Ex: Asfalto ecológico, Rede de esgoto própria..."
              class="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              @keydown.enter.prevent="addInfra"
            />
            <button type="button" @click="addInfra" class="bg-slate-800 text-white px-4 py-2 rounded-xl text-xs font-semibold">
              Adicionar
            </button>
          </div>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="(item, idx) in form.infrastructure"
              :key="idx"
              class="bg-slate-100 text-slate-700 px-3 py-1 rounded-lg text-xs flex items-center gap-1.5"
            >
              {{ item }}
              <button type="button" @click="removeInfra(idx)" class="text-rose-500 hover:text-rose-700 ml-1">×</button>
            </span>
          </div>
        </div>

        <!-- Diferenciais / Tags -->
        <div class="pt-3 border-t border-slate-100">
          <label class="block text-xs font-semibold text-slate-700 mb-1">Diferenciais em Pílulas</label>
          <div class="flex gap-2 mb-3">
            <input
              v-model="newFeatureItem"
              type="text"
              placeholder="Ex: Cabeamento Subterrâneo, Portaria 24h..."
              class="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              @keydown.enter.prevent="addFeature"
            />
            <button type="button" @click="addFeature" class="bg-slate-800 text-white px-4 py-2 rounded-xl text-xs font-semibold">
              Adicionar
            </button>
          </div>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="(feat, idx) in form.features"
              :key="idx"
              class="bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-lg text-xs flex items-center gap-1.5"
            >
              {{ feat }}
              <button type="button" @click="removeFeature(idx)" class="text-rose-500 hover:text-rose-700 ml-1">×</button>
            </span>
          </div>
        </div>
      </div>

      <!-- 6. Publicação & SEO -->
      <div class="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <h2 class="font-heading text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
          6. Publicação & SEO Técnico
        </h2>

        <div class="flex items-center gap-6 py-2">
          <label class="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
            <input v-model="form.isPublished" type="checkbox" class="w-4 h-4 text-emerald-600 rounded" />
            <span>Condomínio Publicado no Site</span>
          </label>

          <label class="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
            <input v-model="form.isFeatured" type="checkbox" class="w-4 h-4 text-emerald-600 rounded" />
            <span>Destaque na Página Inicial</span>
          </label>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">Título SEO (Tag Title)</label>
            <input
              v-model="form.seoTitle"
              type="text"
              placeholder="Ex: Terrenos no Alphaville Reserva | Uberlândia"
              class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
            />
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">Meta Descrição SEO</label>
            <input
              v-model="form.seoDescription"
              type="text"
              placeholder="Ex: Encontre lotes exclusivos à venda no Alphaville..."
              class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
            />
          </div>
        </div>
      </div>

      <!-- Botão Salvar Final -->
      <div class="flex justify-end gap-3 pt-4">
        <RouterLink
          to="/gestao/condominios"
          class="px-5 py-3 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50"
        >
          Cancelar
        </RouterLink>

        <button
          type="submit"
          :disabled="isSubmitting"
          class="bg-brand-600 hover:bg-brand-700 text-white font-bold px-7 py-3 rounded-xl text-xs shadow-md shadow-brand-600/20 transition-all disabled:opacity-50"
        >
          {{ isSubmitting ? 'Salvando...' : 'Salvar e Publicar' }}
        </button>
      </div>
    </form>
  </div>
</template>
