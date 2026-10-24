<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter, RouterLink } from 'vue-router';
import { useTerrainsStore } from '@/stores/terrains';
import { useCondominiumsStore } from '@/stores/condominiums';
import type { Terrain, TerrainStatus, TerrainType } from '@/types';
import { slugify } from '@/utils/slug';
import { 
  MapPin, 
  ArrowLeft, 
  Save, 
  Trash2, 
  Plus, 
  CheckCircle,
  Building2,
  DollarSign
} from 'lucide-vue-next';

const route = useRoute();
const router = useRouter();
const terrainsStore = useTerrainsStore();
const condominiumsStore = useCondominiumsStore();

const isEditing = computed(() => !!route.params.id);
const terrainId = computed(() => route.params.id as string);

const form = ref<Omit<Terrain, 'id' | 'createdAt' | 'updatedAt'>>({
  title: '',
  slug: '',
  condominiumId: '',
  condominiumName: '',
  block: '',
  lot: '',
  area: 450,
  price: 350000,
  priceOnRequest: false,
  terrainType: 'plano',
  shortDescription: '',
  fullDescription: '',
  coverImage: '',
  photos: [],
  features: ['Plano', 'Pronto para Construir'],
  status: 'disponivel',
  isFeatured: false,
  isPublished: true,
  seoTitle: '',
  seoDescription: '',
});

const newFeatureItem = ref('');
const photoInputUrl = ref('');
const isSubmitting = ref(false);
const feedbackMessage = ref('');

onMounted(async () => {
  await Promise.all([
    terrainsStore.loadTerrains(),
    condominiumsStore.loadCondominiums()
  ]);

  if (isEditing.value) {
    const existing = terrainsStore.getById(terrainId.value);
    if (existing) {
      form.value = {
        title: existing.title,
        slug: existing.slug,
        condominiumId: existing.condominiumId,
        condominiumName: existing.condominiumName || '',
        block: existing.block,
        lot: existing.lot,
        area: existing.area,
        price: existing.price,
        priceOnRequest: existing.priceOnRequest,
        terrainType: existing.terrainType,
        shortDescription: existing.shortDescription,
        fullDescription: existing.fullDescription,
        coverImage: existing.coverImage,
        photos: [...existing.photos],
        features: [...existing.features],
        status: existing.status,
        isFeatured: existing.isFeatured,
        isPublished: existing.isPublished,
        seoTitle: existing.seoTitle || '',
        seoDescription: existing.seoDescription || '',
      };
    }
  } else if (condominiumsStore.condominiums.length > 0) {
    form.value.condominiumId = condominiumsStore.condominiums[0].id;
    form.value.condominiumName = condominiumsStore.condominiums[0].name;
  }
});

const handleCondoChange = (e: Event) => {
  const cId = (e.target as HTMLSelectElement).value;
  form.value.condominiumId = cId;
  const condo = condominiumsStore.getById(cId);
  form.value.condominiumName = condo?.name || '';
};

const handleTitleChange = () => {
  if (!isEditing.value || !form.value.slug) {
    form.value.slug = slugify(`${form.value.title}-q${form.value.block}-l${form.value.lot}`);
  }
};

const addFeature = () => {
  if (!newFeatureItem.value.trim()) return;
  form.value.features.push(newFeatureItem.value.trim());
  newFeatureItem.value = '';
};

const removeFeature = (idx: number) => {
  form.value.features.splice(idx, 1);
};

const addPhoto = () => {
  if (!photoInputUrl.value.trim()) return;
  form.value.photos.push(photoInputUrl.value.trim());
  if (!form.value.coverImage) {
    form.value.coverImage = photoInputUrl.value.trim();
  }
  photoInputUrl.value = '';
};

const removePhoto = (idx: number) => {
  form.value.photos.splice(idx, 1);
};

const setAsCover = (url: string) => {
  form.value.coverImage = url;
};

const handleSubmit = async () => {
  if (!form.value.title || !form.value.condominiumId || !form.value.block || !form.value.lot) {
    alert('Preencha os campos obrigatórios (Título, Condomínio, Quadra e Lote).');
    return;
  }
  isSubmitting.value = true;
  try {
    if (isEditing.value) {
      await terrainsStore.updateTerrain(terrainId.value, form.value);
      feedbackMessage.value = 'Terreno atualizado com sucesso!';
    } else {
      await terrainsStore.createTerrain(form.value);
      feedbackMessage.value = 'Terreno cadastrado com sucesso!';
    }
    setTimeout(() => {
      router.push('/gestao/terrenos');
    }, 1000);
  } catch (err: any) {
    alert(err.message || 'Erro ao salvar terreno.');
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
          to="/gestao/terrenos"
          class="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition-colors"
        >
          <ArrowLeft class="w-5 h-5" />
        </RouterLink>
        <div>
          <h1 class="font-heading text-2xl font-bold text-slate-900">
            {{ isEditing ? 'Editar Terreno' : 'Cadastrar Novo Terreno' }}
          </h1>
          <p class="text-xs text-slate-500">
            Cadastre as medidas, valores, quadra/lote e vincule ao condomínio.
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
        <span>{{ isSubmitting ? 'Salvando...' : 'Salvar Terreno' }}</span>
      </button>
    </div>

    <div v-if="feedbackMessage" class="bg-sky-50 border border-sky-200 text-sky-900 p-4 rounded-xl text-xs flex items-center gap-2">
      <CheckCircle class="w-4 h-4 text-brand-600 shrink-0" />
      <span>{{ feedbackMessage }}</span>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-8">
      <!-- 1. Identificação & Vinculação ao Condomínio -->
      <div class="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
        <h2 class="font-heading text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
          1. Identificação do Terreno
        </h2>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="sm:col-span-2">
            <label class="block text-xs font-semibold text-slate-700 mb-1">Título do Anúncio *</label>
            <input
              v-model="form.title"
              @input="handleTitleChange"
              required
              type="text"
              placeholder="Ex: Lote de Esquina com Vista para Reserva Verde"
              class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-brand-700"
            />
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">Condomínio Vinculado *</label>
            <select
              :value="form.condominiumId"
              @change="handleCondoChange"
              required
              class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-brand-700"
            >
              <option value="" disabled>Selecione um condomínio</option>
              <option 
                v-for="c in condominiumsStore.condominiums" 
                :key="c.id" 
                :value="c.id"
              >
                {{ c.name }} ({{ c.city }})
              </option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">Slug da URL *</label>
            <input
              v-model="form.slug"
              required
              type="text"
              placeholder="lote-esquina-reserva-q12-l08"
              class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-brand-700"
            />
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">Quadra *</label>
            <input
              v-model="form.block"
              required
              type="text"
              placeholder="Ex: 12"
              class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-brand-700"
            />
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">Lote *</label>
            <input
              v-model="form.lot"
              required
              type="text"
              placeholder="Ex: 08"
              class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-brand-700"
            />
          </div>
        </div>
      </div>

      <!-- 2. Medidas, Valores & Topografia -->
      <div class="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
        <h2 class="font-heading text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
          2. Dimensões, Valor e Topografia
        </h2>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">Área Total (m²) *</label>
            <input
              v-model.number="form.area"
              required
              type="number"
              min="1"
              placeholder="450"
              class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-brand-700"
            />
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">Valor de Venda (R$)</label>
            <input
              v-model.number="form.price"
              :disabled="form.priceOnRequest"
              type="number"
              placeholder="350000"
              class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-brand-700 disabled:bg-slate-100"
            />
            <label class="flex items-center gap-1.5 mt-2 text-[11px] text-slate-600 cursor-pointer">
              <input v-model="form.priceOnRequest" type="checkbox" class="rounded" />
              <span>Preço Sob Consulta</span>
            </label>
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">Tipo / Topografia *</label>
            <select
              v-model="form.terrainType"
              class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-brand-700"
            >
              <option value="plano">Plano</option>
              <option value="esquina">Esquina</option>
              <option value="aclive">Suave Aclive</option>
              <option value="declive">Suave Declive</option>
              <option value="ilha">Em Ilha</option>
              <option value="vista_verde">Vista para Mata</option>
            </select>
          </div>
        </div>
      </div>

      <!-- 3. Descrições -->
      <div class="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <h2 class="font-heading text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
          3. Descrições do Imóvel
        </h2>

        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">Descrição Curta</label>
          <input
            v-model="form.shortDescription"
            type="text"
            placeholder="Resumo de apresentação do lote para cards..."
            class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
          />
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">Descrição Completa</label>
          <textarea
            v-model="form.fullDescription"
            rows="4"
            placeholder="Detalhes de testada, vizinhos, posição solar, possibilidades arquitetônicas..."
            class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
          ></textarea>
        </div>
      </div>

      <!-- 4. Fotos do Lote -->
      <div class="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
        <h2 class="font-heading text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
          4. Fotografias do Lote
        </h2>

        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">Adicionar URL de Foto</label>
          <div class="flex gap-2 mb-3">
            <input
              v-model="photoInputUrl"
              type="url"
              placeholder="https://images.unsplash.com/photo-..."
              class="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
            />
            <button type="button" @click="addPhoto" class="bg-slate-800 text-white px-4 py-2 rounded-xl text-xs font-semibold">
              Adicionar Foto
            </button>
          </div>

          <div class="flex flex-wrap gap-3">
            <div
              v-for="(photo, idx) in form.photos"
              :key="idx"
              class="relative w-32 h-24 rounded-xl overflow-hidden border-2 transition-all group"
              :class="form.coverImage === photo ? 'border-brand-800 shadow' : 'border-slate-200'"
            >
              <img :src="photo" class="w-full h-full object-cover" />
              <button
                type="button"
                @click="removePhoto(idx)"
                class="absolute top-1 right-1 bg-rose-600 text-white p-1 rounded-full opacity-80 hover:opacity-100"
              >
                <Trash2 class="w-3 h-3" />
              </button>
              <button
                type="button"
                @click="setAsCover(photo)"
                class="absolute bottom-1 left-1 right-1 bg-black/60 text-white text-[10px] py-0.5 rounded font-medium"
              >
                {{ form.coverImage === photo ? 'Capa Principal' : 'Definir Capa' }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 5. Status & Publicação -->
      <div class="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <h2 class="font-heading text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
          5. Disponibilidade Comercial e SEO
        </h2>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">Status Comercial *</label>
            <select
              v-model="form.status"
              class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
            >
              <option value="disponivel">Disponível para Venda</option>
              <option value="reservado">Reservado / Em Negociação</option>
              <option value="vendido">Vendido</option>
              <option value="nao_publicado">Não Publicado (Rascunho)</option>
            </select>
          </div>

          <div class="flex items-center gap-6 pt-5">
            <label class="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
              <input v-model="form.isPublished" type="checkbox" class="w-4 h-4 text-brand-600 focus:ring-brand-500 rounded" />
              <span>Publicado no Catálogo</span>
            </label>

            <label class="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
              <input v-model="form.isFeatured" type="checkbox" class="w-4 h-4 text-brand-600 focus:ring-brand-500 rounded" />
              <span>Destaque na Página Inicial</span>
            </label>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-100">
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">Título SEO</label>
            <input
              v-model="form.seoTitle"
              type="text"
              placeholder="Ex: Terreno 520m² de Esquina no Alphaville"
              class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
            />
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">Descrição SEO</label>
            <input
              v-model="form.seoDescription"
              type="text"
              placeholder="Ex: Excelente lote de esquina pronto para construir..."
              class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
            />
          </div>
        </div>
      </div>

      <!-- Botão Salvar Final -->
      <div class="flex justify-end gap-3 pt-4">
        <RouterLink
          to="/gestao/terrenos"
          class="px-5 py-3 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50"
        >
          Cancelar
        </RouterLink>

        <button
          type="submit"
          :disabled="isSubmitting"
          class="bg-brand-600 hover:bg-brand-700 text-white font-bold px-7 py-3 rounded-xl text-xs shadow-md shadow-brand-600/20 transition-all disabled:opacity-50"
        >
          {{ isSubmitting ? 'Salvando...' : 'Salvar Terreno' }}
        </button>
      </div>
    </form>
  </div>
</template>
