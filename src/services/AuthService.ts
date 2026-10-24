import type { User, ApiResponse } from '@/types';
import { simulateDelay } from './storageHelper';

const AUTH_STORAGE_KEY = 'gestao_user';
const TOKEN_STORAGE_KEY = 'gestao_token';

export const AuthService = {
  async login(email: string, password: string): Promise<ApiResponse<User>> {
    await simulateDelay(350);

    // Mock de autenticação simples: qualquer senha válida com mais de 3 chars ou admin
    if (email.trim().toLowerCase() === 'admin@lotecerto.com.br' && password.length >= 4) {
      const user: User = {
        id: 'user-admin-1',
        name: 'Administrador Lote Certo',
        email: 'admin@lotecerto.com.br',
        role: 'admin',
        token: 'mock-jwt-token-lote-certo-session-key',
      };
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
      localStorage.setItem(TOKEN_STORAGE_KEY, user.token);
      return { success: true, data: user, message: 'Login realizado com sucesso!' };
    }

    // Permitir também login rápido para facilitar avaliação
    if (email.includes('@') && password.length >= 4) {
      const user: User = {
        id: 'user-editor-1',
        name: 'Gestor Imobiliário',
        email,
        role: 'admin',
        token: 'mock-jwt-token-lote-certo-session-key',
      };
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
      localStorage.setItem(TOKEN_STORAGE_KEY, user.token);
      return { success: true, data: user, message: 'Login realizado com sucesso!' };
    }

    throw new Error('Credenciais inválidas. Utilize email válido e senha com no mínimo 4 caracteres.');
  },

  async getCurrentUser(): Promise<User | null> {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  async logout(): Promise<void> {
    await simulateDelay(150);
    localStorage.removeItem(AUTH_STORAGE_KEY);
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem(TOKEN_STORAGE_KEY);
  }
};
