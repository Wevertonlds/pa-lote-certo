<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter, useRoute, RouterLink } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useBrandingStore } from '@/stores/branding';
import { 
  LayoutDashboard, 
  Building2, 
  MapPin, 
  Image, 
  Home, 
  Palette, 
  PhoneCall, 
  Search, 
  TrendingUp, 
  LogOut, 
  ExternalLink,
  Menu,
  X,
  UserCheck
} from 'lucide-vue-next';
import BrandIcon from '@/components/common/BrandIcon.vue';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const brandingStore = useBrandingStore();
const sidebarOpen = ref(false);

const navItems = [
  { name: 'Dashboard', path: '/gestao', icon: LayoutDashboard },
  { name: 'Condomínios', path: '/gestao/condominios', icon: Building2 },
  { name: 'Terrenos', path: '/gestao/terrenos', icon: MapPin },
  { name: 'Biblioteca de Mídia', path: '/gestao/midia', icon: Image },
  { name: 'Página Inicial', path: '/gestao/pagina-inicial', icon: Home },
  { name: 'Identidade Visual', path: '/gestao/identidade-visual', icon: Palette },
  { name: 'Contatos & WhatsApp', path: '/gestao/contatos', icon: PhoneCall },
  { name: 'SEO & Metadados', path: '/gestao/seo', icon: Search },
  { name: 'Marketing & Eventos', path: '/gestao/marketing', icon: TrendingUp },
];

onMounted(async () => {
  await authStore.init();
  if (!authStore.isAuthenticated()) {
    router.replace('/gestao/login');
  }
});

const handleLogout = async () => {
  await authStore.logout();
  router.push('/gestao/login');
};
</script>

<template>
  <div class="min-h-screen bg-slate-100 flex flex-col md:flex-row">
    <!-- Mobile Sidebar Backdrop -->
    <div 
      v-if="sidebarOpen" 
      @click="sidebarOpen = false" 
      class="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
    />

    <!-- Sidebar -->
    <aside 
      :class="[
        'fixed md:static inset-y-0 left-0 z-50 w-72 bg-slate-900 text-white flex flex-col transition-transform duration-300 md:translate-x-0 border-r border-slate-800',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      ]"
    >
      <!-- Logo do Painel -->
      <div class="p-6 border-b border-slate-800 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-black border border-white/10 flex items-center justify-center font-bold shadow-md shadow-brand-500/20 p-2">
            <BrandIcon size-class="w-6 h-6" color="#0A89CB" />
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h1 class="text-sm font-bold text-white tracking-wide font-sans">
                PAINEL GESTÃO
              </h1>
            </div>
            <div class="flex items-center gap-1 mt-0.5">
              <span class="h-1 w-2.5 rounded-full bg-brand-500"></span>
              <span class="h-1 w-2.5 rounded-full bg-white"></span>
              <span class="h-1 w-2.5 rounded-full bg-crimson-600"></span>
              <p class="text-[11px] text-slate-400 truncate max-w-[120px] ml-1">
                {{ brandingStore.branding.brandName || 'Lote Certo' }}
              </p>
            </div>
          </div>
        </div>
        <button 
          @click="sidebarOpen = false" 
          class="md:hidden text-slate-400 hover:text-white"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <!-- Links de Navegação -->
      <nav class="flex-1 p-4 space-y-1 overflow-y-auto">
        <RouterLink
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          @click="sidebarOpen = false"
          :class="[
            'flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors',
            route.path === item.path || (item.path !== '/gestao' && route.path.startsWith(item.path))
              ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30 font-semibold'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          ]"
        >
          <component :is="item.icon" class="w-4 h-4 shrink-0" />
          <span>{{ item.name }}</span>
        </RouterLink>
      </nav>

      <!-- Rodapé da Sidebar -->
      <div class="p-4 border-t border-slate-800 space-y-2">
        <RouterLink
          to="/"
          target="_blank"
          class="flex items-center justify-between px-3.5 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <span class="flex items-center gap-2">
            <ExternalLink class="w-3.5 h-3.5 text-gold-400" />
            Visualizar Site Público
          </span>
          <span class="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-300">Abrir</span>
        </RouterLink>

        <button
          @click="handleLogout"
          class="flex items-center gap-2 w-full px-3.5 py-2 rounded-lg text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 transition-colors"
        >
          <LogOut class="w-3.5 h-3.5" />
          <span>Sair da Gestão</span>
        </button>
      </div>
    </aside>

    <!-- Main Content Area -->
    <div class="flex-1 flex flex-col min-w-0">
      <!-- Top Header -->
      <header class="bg-white border-b border-slate-200 px-4 sm:px-6 py-3.5 flex items-center justify-between shadow-sm sticky top-0 z-30">
        <div class="flex items-center gap-3">
          <button 
            @click="sidebarOpen = true"
            class="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            aria-label="Abrir Menu Lateral"
          >
            <Menu class="w-5 h-5" />
          </button>
          <h2 class="text-sm sm:text-base font-semibold text-slate-800 font-sans">
            Ambiente Administrativo
          </h2>
        </div>

        <div class="flex items-center gap-4">
          <div class="hidden sm:flex items-center gap-2 text-xs text-slate-600 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200">
            <UserCheck class="w-3.5 h-3.5 text-emerald-600" />
            <span>{{ authStore.user?.name || 'Administrador' }}</span>
          </div>

          <RouterLink
            to="/"
            class="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-full transition-colors"
          >
            <ExternalLink class="w-3.5 h-3.5" />
            <span>Ver Site</span>
          </RouterLink>
        </div>
      </header>

      <!-- Page Body -->
      <main class="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <router-view />
      </main>
    </div>
  </div>
</template>
