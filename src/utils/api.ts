/**
 * Utilitário central de requisições HTTP para a aplicação.
 * Projetado para suportar dados mockados locais (Fase 1)
 * e comutar transparentemente para o backend Node.js / Express (Fase 2).
 */
import type { ApiResponse } from '@/types';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
}

export async function apiFetch<T>(endpoint: string, options: RequestOptions = {}): Promise<ApiResponse<T>> {
  const { params, ...customConfig } = options;

  let url = `${API_BASE_URL}${endpoint}`;
  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, String(value));
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      url += `?${queryString}`;
    }
  }

  const token = localStorage.getItem('gestao_token');

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...customConfig.headers,
  };

  try {
    const response = await fetch(url, {
      ...customConfig,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `Erro ${response.status}: Falha na requisição`);
    }

    return data;
  } catch (error: any) {
    console.warn(`[apiFetch] Falha ao comunicar com API real em ${endpoint}:`, error.message);
    throw error;
  }
}
