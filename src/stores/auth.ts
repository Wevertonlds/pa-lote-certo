import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { User } from '@/types';
import { AuthService } from '@/services/AuthService';

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function init() {
    user.value = await AuthService.getCurrentUser();
  }

  async function login(email: string, pass: string) {
    loading.value = true;
    error.value = null;
    try {
      const res = await AuthService.login(email, pass);
      user.value = res.data;
      return res;
    } catch (err: any) {
      error.value = err.message || 'Erro ao realizar login.';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function logout() {
    await AuthService.logout();
    user.value = null;
  }

  const isAuthenticated = () => AuthService.isAuthenticated();

  return {
    user,
    loading,
    error,
    init,
    login,
    logout,
    isAuthenticated,
  };
});
