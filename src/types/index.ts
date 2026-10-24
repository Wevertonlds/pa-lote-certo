export type TerrainStatus = 'disponivel' | 'reservado' | 'vendido' | 'nao_publicado';
export type TerrainType = 'plano' | 'esquina' | 'aclive' | 'declive' | 'ilha' | 'vista_verde' | 'outro';

export interface MediaAsset {
  id: string;
  title: string;
  altText: string;
  url: string;
  category: 'condominio' | 'terreno' | 'banner' | 'lazer' | 'geral';
  sizeBytes?: number;
  createdAt: string;
}

export interface LeisureArea {
  id: string;
  title: string;
  description: string;
  image: string;
  icon?: string;
}

export interface Condominium {
  id: string;
  name: string;
  slug: string;
  city: string;
  state: string;
  address: string;
  shortDescription: string;
  fullDescription: string;
  coverImage: string;
  gallery: string[];
  infrastructure: string[];
  leisureAreas: LeisureArea[];
  features: string[];
  isPublished: boolean;
  isFeatured: boolean;
  seoTitle?: string;
  seoDescription?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Terrain {
  id: string;
  title: string;
  slug: string;
  condominiumId: string;
  condominiumName?: string;
  block: string; // Quadra
  lot: string; // Lote
  area: number; // m²
  price: number | null;
  priceOnRequest: boolean;
  terrainType: TerrainType;
  shortDescription: string;
  fullDescription: string;
  coverImage: string;
  photos: string[];
  features: string[];
  status: TerrainStatus;
  isFeatured: boolean;
  isPublished: boolean;
  seoTitle?: string;
  seoDescription?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BannerSlide {
  id: string;
  title: string;
  subtitle: string;
  desktopImage: string;
  mobileImage?: string;
  buttonText: string;
  buttonLink: string;
  order: number;
  isActive: boolean;
}

export interface BrandingSettings {
  brandName: string;
  slogan: string;
  logoUrl: string;
  faviconUrl: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  bgColor: string;
  fontHeading: string;
  fontBody: string;
}

export interface HomePageSettings {
  banners: BannerSlide[];
  featuredCondominiumsTitle: string;
  featuredCondominiumsSubtitle: string;
  featuredTerrainsTitle: string;
  featuredTerrainsSubtitle: string;
  ctaTitle: string;
  ctaSubtitle: string;
  ctaButtonText: string;
  ctaButtonLink: string;
  ctaBackgroundImage?: string;
  visibleSections: {
    hero: boolean;
    search: boolean;
    featuredCondos: boolean;
    featuredTerrains: boolean;
    differentials: boolean;
    cta: boolean;
  };
}

export interface ContactSettings {
  whatsapp: string;
  phone: string;
  email: string;
  instagram: string;
  address: string;
  businessHours: string;
  defaultMessageTemplate: string;
}

export interface SEOSettings {
  defaultTitle: string;
  defaultDescription: string;
  organizationName: string;
  siteUrl: string;
  defaultOgImage: string;
  googleAnalyticsId: string;
  googleTagManagerId: string;
  googleAdsId: string;
}

export interface MarketingSettings {
  utmCaptureEnabled: boolean;
  conversionEventsEnabled: boolean;
  cookieConsentEnabled: boolean;
}

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email?: string;
  terrainId?: string;
  terrainTitle?: string;
  condominiumId?: string;
  condominiumName?: string;
  message: string;
  source: string;
  status: 'novo' | 'em_atendimento' | 'convertido' | 'descartado';
  createdAt: string;
}

export interface DashboardMetrics {
  totalCondominiums: number;
  totalTerrains: number;
  availableTerrains: number;
  reservedTerrains: number;
  soldTerrains: number;
  unpublishedTerrains: number;
  totalLeads: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'editor';
  token: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface SearchQueryFilters {
  keyword?: string;
  condominiumId?: string;
  city?: string;
  minArea?: number;
  maxArea?: number;
  minPrice?: number;
  maxPrice?: number;
  terrainType?: string;
  features?: string[];
  status?: TerrainStatus;
}
