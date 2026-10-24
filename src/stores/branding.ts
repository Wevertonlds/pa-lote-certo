import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { BrandingSettings } from '@/types';
import { BrandingService } from '@/services/BrandingService';
import { INITIAL_BRANDING } from '@/services/mockData';

export const useBrandingStore = defineStore('branding', () => {
  const branding = ref<BrandingSettings>(INITIAL_BRANDING);
  const loading = ref(false);

  async function loadSettings() {
    loading.value = true;
    try {
      const data = await BrandingService.getSettings();
      branding.value = data;
      BrandingService.applyCSSVariables(data);
    } finally {
      loading.value = false;
    }
  }

  async function updateSettings(data: Partial<BrandingSettings>) {
    const res = await BrandingService.updateSettings(data);
    branding.value = res.data;
    BrandingService.applyCSSVariables(res.data);
    return res;
  }

  async function resetSettings() {
    const res = await BrandingService.resetToDefaults();
    branding.value = res.data;
    BrandingService.applyCSSVariables(res.data);
    return res;
  }

  return {
    branding,
    loading,
    loadSettings,
    updateSettings,
    resetSettings,
  };
});
