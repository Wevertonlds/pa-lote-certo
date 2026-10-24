<script setup lang="ts">
import { onMounted } from 'vue';
import PublicHeader from '@/components/layout/PublicHeader.vue';
import PublicFooter from '@/components/layout/PublicFooter.vue';
import { useBrandingStore } from '@/stores/branding';
import { useCondominiumsStore } from '@/stores/condominiums';
import { useTerrainsStore } from '@/stores/terrains';

const brandingStore = useBrandingStore();
const condominiumsStore = useCondominiumsStore();
const terrainsStore = useTerrainsStore();

onMounted(async () => {
  await Promise.all([
    brandingStore.loadSettings(),
    condominiumsStore.loadCondominiums(),
    terrainsStore.loadTerrains()
  ]);
});
</script>

<template>
  <div class="min-h-screen flex flex-col bg-[#faf8f5]">
    <PublicHeader />
    <main class="flex-grow">
      <router-view />
    </main>
    <PublicFooter />
  </div>
</template>
