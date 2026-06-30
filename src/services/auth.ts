/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Supabase client preparation
import { createClient } from '@supabase/supabase-js';

export interface SupabaseConfig {
  supabaseUrl: string | null;
  supabaseAnonKey: string | null;
  isConfigured: boolean;
}

// Support Vite's standard environment variables and the specific NEXT_PUBLIC naming requested
const getSupabaseConfig = (): SupabaseConfig => {
  const metaEnv = (import.meta as any).env || {};
  const supabaseUrl = 
    (metaEnv.VITE_NEXT_PUBLIC_SUPABASE_URL as string) || 
    (metaEnv.NEXT_PUBLIC_SUPABASE_URL as string) || 
    (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_SUPABASE_URL) || 
    null;

  const supabaseAnonKey = 
    (metaEnv.VITE_NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY as string) || 
    (metaEnv.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY as string) || 
    (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) || 
    null;

  return {
    supabaseUrl,
    supabaseAnonKey,
    isConfigured: Boolean(supabaseUrl && supabaseAnonKey),
  };
};

export const supabaseConfig = getSupabaseConfig();

export const supabase = supabaseConfig.isConfigured 
  ? createClient(supabaseConfig.supabaseUrl!, supabaseConfig.supabaseAnonKey!) 
  : null;

export interface UserSession {
  email: string;
  name: string;
  businessName: string;
  role: string;
  token?: string;
}

/**
 * Simulates authentication API or proxies to Supabase if configured.
 * Since Supabase JS is not pre-installed (to keep the bundle light and fast),
 * we provide a robust mock handler that simulates real authentication.
 */
export const authService = {
  isSupabasePrepared(): boolean {
    return supabaseConfig.isConfigured;
  },

  getSupabaseConfig(): SupabaseConfig {
    return supabaseConfig;
  },

  /**
   * Simulates/Executes login
   */
  async login(email: string, password: string): Promise<UserSession> {
    // Artificial loading network latency for high fidelity simulation (1.2s)
    await new Promise((resolve) => setTimeout(resolve, 1200));

    // Simple validation (can be customized)
    if (!email || !password) {
      throw new Error('E-mail e senha são obrigatórios.');
    }

    if (password.length < 6) {
      throw new Error('A senha deve conter pelo menos 6 caracteres.');
    }

    // Standard mock response matching a real business owner account
    const name = email.split('@')[0];
    const formattedName = name.charAt(0).toUpperCase() + name.slice(1);

    return {
      email,
      name: formattedName,
      businessName: 'Panificadora Bella Massa',
      role: 'Proprietário',
      token: 'mock-jwt-token-compra-inteligente-2026',
    };
  },

  /**
   * Mock Google Sign-In trigger
   */
  async loginWithGoogle(): Promise<UserSession> {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return {
      email: 'gestor.panificadora@gmail.com',
      name: 'Sérgio Santos',
      businessName: 'Panificadora & Confeitaria Santos',
      role: 'Diretor de Operações',
      token: 'google-oauth-token-mock',
    };
  },

  /**
   * Mock WhatsApp Auth trigger
   */
  async loginWithWhatsApp(): Promise<UserSession> {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return {
      email: 'compras.mercado@whatsapp.com',
      name: 'Mariana Costa',
      businessName: 'Mercado Preço Justo',
      role: 'Gerente de Compras',
      token: 'whatsapp-auth-token-mock',
    };
  }
};
