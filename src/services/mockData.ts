import type {
  Condominium,
  Terrain,
  BannerSlide,
  BrandingSettings,
  HomePageSettings,
  ContactSettings,
  SEOSettings,
  MarketingSettings,
  MediaAsset,
  Lead
} from '@/types';

export const INITIAL_BRANDING: BrandingSettings = {
  brandName: 'Lote Certo',
  slogan: 'Curadoria exclusiva de terrenos em condomínios fechados',
  logoUrl: '/favicon.svg',
  faviconUrl: '/favicon.svg',
  primaryColor: '#0A89CB',
  secondaryColor: '#0a192f',
  accentColor: '#e11d48',
  bgColor: '#f8fafc',
  fontHeading: 'Playfair Display',
  fontBody: 'Plus Jakarta Sans',
};

export const INITIAL_BANNERS: BannerSlide[] = [
  {
    id: 'banner-1',
    title: 'Onde o seu projeto de vida encontra o espaço ideal',
    subtitle: 'Os melhores terrenos residenciais nos mais prestigiados condomínios fechados da região.',
    desktopImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=80',
    mobileImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    buttonText: 'Explorar Terrenos',
    buttonLink: '/terrenos',
    order: 1,
    isActive: true,
  },
  {
    id: 'banner-2',
    title: 'Viva cercado por natureza, segurança e sofisticação',
    subtitle: 'Lotes de alto padrão com infraestrutura completa, clube privativo e lazer para toda a família.',
    desktopImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=2000&q=80',
    mobileImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
    buttonText: 'Conhecer Condomínios',
    buttonLink: '/condominios',
    order: 2,
    isActive: true,
  },
  {
    id: 'banner-3',
    title: 'Lotes de esquina e com vista para área verde',
    subtitle: 'Condições especiais de lançamento e parcelamento direto com o incorporador.',
    desktopImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2000&q=80',
    mobileImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
    buttonText: 'Falar com Consultor',
    buttonLink: '#atendimento',
    order: 3,
    isActive: true,
  }
];

export const INITIAL_CONDOMINIUMS: Condominium[] = [
  {
    id: 'condo-alphaville-reserva',
    name: 'Alphaville Reserva',
    slug: 'alphaville-reserva',
    city: 'Uberlândia',
    state: 'MG',
    address: 'Av. dos Vinhedos, 4500 - Zona Sul',
    shortDescription: 'O mais exclusivo condomínio horizontal da Zona Sul, com clube privativo completo e segurança com biometria facial.',
    fullDescription: 'O Alphaville Reserva representa o ápice do urbanismo sustentável e contemporâneo. Localizado na área mais nobre da Zona Sul, oferece cabeamento subterrâneo, paisagismo assinado por renomados arquitetos, clube de lazer resort e segurança com monitoramento perimetral inteligente 24 horas.',
    coverImage: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'
    ],
    infrastructure: [
      'Rede elétrica 100% subterrânea',
      'Portaria blindada 24h com reconhecimento facial',
      'Fibra ótica dedicada de alta velocidade',
      'Iluminação pública com lâmpadas LED inteligentes',
      'Sistema de reuso de águas pluviais',
      'Asfalto com drenagem sustentável'
    ],
    leisureAreas: [
      {
        id: 'leisure-1',
        title: 'Complexo Aquático com Borda Infinita',
        description: 'Piscinas adulto com raia semiolímpica aquecida, deck molhado e piscina infantil integrada ao paisagismo.',
        image: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=800&q=80',
        icon: 'Waves'
      },
      {
        id: 'leisure-2',
        title: 'Espaço Fitness & Wellness Panorâmico',
        description: 'Academia completa com aparelhos Life Fitness, salas de pilates, yoga e vista panorâmica para a reserva verde.',
        image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80',
        icon: 'Dumbbell'
      },
      {
        id: 'leisure-3',
        title: 'Complexo de Raquetes e Quadras Esportivas',
        description: '2 quadras de tênis de saibro iluminadas, 4 quadras de Beach Tennis e quadra poliesportiva oficial.',
        image: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?auto=format&fit=crop&w=800&q=80',
        icon: 'Trophy'
      },
      {
        id: 'leisure-4',
        title: 'Lounge Gourmet & Salão Nobre de Festas',
        description: 'Ambientes climatizados decorados em alto padrão, equipados com cozinha industrial e adega climatizada.',
        image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
        icon: 'Utensils'
      },
      {
        id: 'leisure-5',
        title: 'Parque Linear & Trilha Ecológica',
        description: 'Pista de caminhada e corrida de 3,5 km em meio a 120 mil m² de mata nativa preservada.',
        image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80',
        icon: 'Trees'
      }
    ],
    features: ['Alto Padrão', 'Segurança 24h', 'Rede Subterrânea', 'Clube Resort', 'Mata Preservada'],
    isPublished: true,
    isFeatured: true,
    seoTitle: 'Terrenos no Condomínio Alphaville Reserva | Uberlândia',
    seoDescription: 'Encontre lotes e terrenos à venda no Alphaville Reserva em Uberlândia. Infraestrutura nobre, clube de lazer e segurança perimetral.',
    createdAt: '2025-01-10T10:00:00Z',
    updatedAt: '2025-01-15T15:30:00Z',
  },
  {
    id: 'condo-quintas-do-lago',
    name: 'Quintas do Lago Residencial',
    slug: 'quintas-do-lago-residencial',
    city: 'Nova Lima',
    state: 'MG',
    address: 'Rodovia MG-030, Km 14',
    shortDescription: 'Terrenos amplos com vista deslumbrante para montanhas e lago privativo para esportes náuticos sem motor.',
    fullDescription: 'O Quintas do Lago une a atmosfera bucólica da serra à conveniência moderna de morar próximo aos melhores colégios e centros gastronômicos. Terrenos a partir de 800 m² cercados por vegetação exuberante, nascentes naturais e um lago contemplativo de 40 mil m².',
    coverImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80'
    ],
    infrastructure: [
      'Segurança armada motorizada 24h',
      'Portaria de serviços e moradores independentes',
      'Heliporto homologado',
      'Estação de tratamento de esgoto ecológica própria',
      'Central de compostagem e sustentabilidade'
    ],
    leisureAreas: [
      {
        id: 'leisure-6',
        title: 'Lago Privativo & Deck Náutico',
        description: 'Lago natural para stand-up paddle, caiaque e píer de observação do pôr do sol.',
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
        icon: 'Anchor'
      },
      {
        id: 'leisure-7',
        title: 'Club House & Espaço Equestre',
        description: 'Hípica com baias de apoio e sede social rústico-contemporânea para encontros exclusivos.',
        image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
        icon: 'Home'
      },
      {
        id: 'leisure-8',
        title: 'Spa & Sauna Úmida/Seca',
        description: 'Área de relaxamento completa com ofurô, hidro aquecida e salas de massagem.',
        image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
        icon: 'Sparkles'
      }
    ],
    features: ['Lotes Acima de 800m²', 'Lago Privativo', 'Vista para Montanhas', 'Heliponto', 'Segurança Armada'],
    isPublished: true,
    isFeatured: true,
    seoTitle: 'Terrenos no Quintas do Lago Residencial | Nova Lima',
    seoDescription: 'Lotes e terrenos no Quintas do Lago em Nova Lima. Terrenos a partir de 800m², lago exclusivo e natureza preservada.',
    createdAt: '2025-01-08T09:00:00Z',
    updatedAt: '2025-01-14T11:20:00Z',
  },
  {
    id: 'condo-reserva-dos-ipes',
    name: 'Reserva dos Ipês',
    slug: 'reserva-dos-ipes',
    city: 'Campinas',
    state: 'SP',
    address: 'Estrada dos Nobres, 1200 - Distrito Gramado',
    shortDescription: 'Lotes planos de 450 a 650 m² com cabeamento subterrâneo e acesso direto às principais rodovias.',
    fullDescription: 'Projetado para quem valoriza praticidade e qualidade de vida, o Reserva dos Ipês conta com topografia privilegiada de lotes 100% planos, praças temáticas com ipês coloridos e um clube moderno desenhado para integração comunitária.',
    coverImage: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80'
    ],
    infrastructure: [
      'Topografia plana de fácil construção',
      'Portaria 24 horas blindada',
      'Fiação subterrânea nas alamedas principais',
      'Gás canalizado encanado',
      'Internet fibra ótica de 1Gbps'
    ],
    leisureAreas: [
      {
        id: 'leisure-9',
        title: 'Piscina Recreativa e Infantil',
        description: 'Piscina com solarium integrado, prainha e vestiários climatizados.',
        image: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=800&q=80',
        icon: 'Waves'
      },
      {
        id: 'leisure-10',
        title: 'Playground Lúdico & Brinquedoteca',
        description: 'Espaço infantil ao ar livre em piso emborrachado com brinquedos de madeira certificada.',
        image: 'https://images.unsplash.com/photo-1596464716127-f2a82984de30?auto=format&fit=crop&w=800&q=80',
        icon: 'Smile'
      },
      {
        id: 'leisure-11',
        title: 'Quadra Poliesportiva e Churrasqueiras',
        description: 'Dois quiosques gourmet equipados com churrasqueira a carvão e chopeira artesanal.',
        image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
        icon: 'Flame'
      }
    ],
    features: ['Topografia Plana', 'Pronto para Construir', 'Localização Privilegiada', 'Cabeamento Subterrâneo'],
    isPublished: true,
    isFeatured: false,
    seoTitle: 'Terrenos no Condomínio Reserva dos Ipês | Campinas',
    seoDescription: 'Lotes planos de 450m² a 650m² à venda no Reserva dos Ipês em Campinas. Estrutura completa e lazer para sua família.',
    createdAt: '2025-01-05T14:00:00Z',
    updatedAt: '2025-01-12T16:00:00Z',
  }
];

export const INITIAL_TERRAINS: Terrain[] = [
  {
    id: 'terrain-1',
    title: 'Lote de Esquina com Vista Panorâmica para Reserva',
    slug: 'lote-esquina-vista-panoramica-reserva-q12-l08',
    condominiumId: 'condo-alphaville-reserva',
    condominiumName: 'Alphaville Reserva',
    block: '12',
    lot: '08',
    area: 520,
    price: 495000,
    priceOnRequest: false,
    terrainType: 'esquina',
    shortDescription: 'Excelente terreno de esquina com testada ampla de 24 metros, localizado na parte alta do condomínio.',
    fullDescription: 'Uma oportunidade ímpar para construir uma residência de arquitetura imponente. O lote 08 da quadra 12 possui posição de esquina privilegiada, permitindo duas frentes arrojadas e ventilação cruzada permanente. Confronta com área verde de preservação permanente nos fundos.',
    coverImage: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
    photos: [
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80'
    ],
    features: ['Esquina', 'Sol da Manhã', 'Vista Livre', 'Próximo ao Clube', 'Plano'],
    status: 'disponivel',
    isFeatured: true,
    isPublished: true,
    seoTitle: 'Terreno de Esquina 520m² no Alphaville Reserva | Quadra 12 Lote 08',
    seoDescription: 'Terreno de esquina à venda no Alphaville Reserva com 520m². Excelente topografia, vista para reserva e sol da manhã.',
    createdAt: '2025-01-11T11:00:00Z',
    updatedAt: '2025-01-16T10:00:00Z',
  },
  {
    id: 'terrain-2',
    title: 'Terreno Plano Residencial de 450 m² na Alameda Central',
    slug: 'terreno-plano-450m-alameda-central-q07-l15',
    condominiumId: 'condo-alphaville-reserva',
    condominiumName: 'Alphaville Reserva',
    block: '07',
    lot: '15',
    area: 450,
    price: 380000,
    priceOnRequest: false,
    terrainType: 'plano',
    shortDescription: 'Terreno 100% plano com 15 metros de frente por 30 de fundos. Pronto para início imediato de obras.',
    fullDescription: 'Lote residencial perfeito para quem busca economia na terraplanagem e agilidade na construção. Localizado em alameda plana e arborizada, a apenas 250 metros do club house do condomínio. Vizinhos já consolidados nas laterais.',
    coverImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    photos: [
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'
    ],
    features: ['100% Plano', 'Alameda Nobre', 'Pronto para Construir', 'Vizinhos Definidos'],
    status: 'disponivel',
    isFeatured: true,
    isPublished: true,
    seoTitle: 'Terreno Plano 450m² no Alphaville Reserva | Quadra 07 Lote 15',
    seoDescription: 'Lote residencial 100% plano de 450 m² no Alphaville Reserva. Alameda nobre com cabeamento subterrâneo.',
    createdAt: '2025-01-12T13:30:00Z',
    updatedAt: '2025-01-15T09:15:00Z',
  },
  {
    id: 'terrain-3',
    title: 'Lote Amplo de 1.150 m² Frente para o Lago Privativo',
    slug: 'lote-amplo-1150m-frente-lago-q03-l02',
    condominiumId: 'condo-quintas-do-lago',
    condominiumName: 'Quintas do Lago Residencial',
    block: '03',
    lot: '02',
    area: 1150,
    price: 890000,
    priceOnRequest: false,
    terrainType: 'declive',
    shortDescription: 'Propriedade cinematográfica com acesso privativo às margens do lago e bosque nativo privativo.',
    fullDescription: 'Para projetos residenciais de alto impacto arquitetônico com múltiplos pavimentos e vista perene para o espelho d’água. Topografia com leve declive suave propícia para integração com piscina de borda infinita debruçada sobre o lago.',
    coverImage: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=1200&q=80',
    photos: [
      'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80'
    ],
    features: ['Frente para Lago', 'Área Acima de 1000m²', 'Vista Panorâmica', 'Bosque Privativo'],
    status: 'disponivel',
    isFeatured: true,
    isPublished: true,
    seoTitle: 'Terreno Exclusivo 1.150m² Frente ao Lago no Quintas do Lago',
    seoDescription: 'Lote cinematográfico de 1.150m² com margem para o lago no Quintas do Lago Residencial. Vista definitiva e exclusividade.',
    createdAt: '2025-01-09T16:00:00Z',
    updatedAt: '2025-01-14T14:45:00Z',
  },
  {
    id: 'terrain-4',
    title: 'Terreno em Ilha de 850 m² com Vista para as Montanhas',
    slug: 'terreno-ilha-850m-vista-montanhas-q05-l20',
    condominiumId: 'condo-quintas-do-lago',
    condominiumName: 'Quintas do Lago Residencial',
    block: '05',
    lot: '20',
    area: 850,
    price: null,
    priceOnRequest: true,
    terrainType: 'ilha',
    shortDescription: 'Posição central em ilha (sem vizinhos de fundos colados), vista de 360 graus para a serra.',
    fullDescription: 'Lote especial posicionado no cul-de-sac de menor fluxo do empreendimento. Máxima privacidade acústica e visual, ideal para quem busca sossego e integração com o clima serrano de Nova Lima.',
    coverImage: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
    photos: [
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80'
    ],
    features: ['Ilha (Sem Fundos)', 'Preço Sob Consulta', 'Rua Sem Saída', 'Vista para Serra'],
    status: 'reservado',
    isFeatured: false,
    isPublished: true,
    seoTitle: 'Lote em Ilha 850m² no Quintas do Lago | Vista Montanhas',
    seoDescription: 'Terreno em ilha no Quintas do Lago. Rua tranquila, 850m² e vista deslumbrante para a natureza.',
    createdAt: '2025-01-10T08:30:00Z',
    updatedAt: '2025-01-16T12:00:00Z',
  },
  {
    id: 'terrain-5',
    title: 'Lote de 480 m² com Topografia em Suave Aclive',
    slug: 'lote-480m-suave-aclive-q09-l04',
    condominiumId: 'condo-reserva-dos-ipes',
    condominiumName: 'Reserva dos Ipês',
    block: '09',
    lot: '04',
    area: 480,
    price: 310000,
    priceOnRequest: false,
    terrainType: 'aclive',
    shortDescription: 'Suave aclive que favorece garagem subterrânea e living elevado com vista aberta da praça dos ipês.',
    fullDescription: 'Excelente custo-benefício no condomínio Reserva dos Ipês. Testada de 16 metros, permitindo ótima incidência solar e aproveitamento máximo do terreno com ampla área de lazer nos fundos.',
    coverImage: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
    photos: [
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80'
    ],
    features: ['Suave Aclive', 'Testada de 16m', 'Sol da Tarde', 'Próximo à Portaria'],
    status: 'disponivel',
    isFeatured: true,
    isPublished: true,
    seoTitle: 'Terreno 480m² no Reserva dos Ipês | Campinas',
    seoDescription: 'Lote residencial de 480m² no condomínio Reserva dos Ipês em Campinas. Excelente oportunidade de investimento.',
    createdAt: '2025-01-06T11:00:00Z',
    updatedAt: '2025-01-13T17:10:00Z',
  },
  {
    id: 'terrain-6',
    title: 'Lote de 450 m² Vendido na Quadra das Acácias',
    slug: 'lote-450m-quadra-acacias-q02-l11',
    condominiumId: 'condo-reserva-dos-ipes',
    condominiumName: 'Reserva dos Ipês',
    block: '02',
    lot: '11',
    area: 450,
    price: 290000,
    priceOnRequest: false,
    terrainType: 'plano',
    shortDescription: 'Lote já comercializado pela equipe Lote Certo no lançamento.',
    fullDescription: 'Exemplo de sucesso de comercialização recente. Terreno plano adquirido para construção unifamiliar.',
    coverImage: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80',
    photos: [
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80'
    ],
    features: ['Vendido', 'Plano'],
    status: 'vendido',
    isFeatured: false,
    isPublished: true,
    seoTitle: 'Lote Comercializado no Reserva dos Ipês',
    seoDescription: 'Lote vendido no Reserva dos Ipês.',
    createdAt: '2025-01-02T10:00:00Z',
    updatedAt: '2025-01-10T11:00:00Z',
  }
];

export const INITIAL_HOME_SETTINGS: HomePageSettings = {
  banners: INITIAL_BANNERS,
  featuredCondominiumsTitle: 'Condomínios em Destaque',
  featuredCondominiumsSubtitle: 'Empreendimentos planejados com infraestrutura nobre, clubes completos e segurança perimetral.',
  featuredTerrainsTitle: 'Oportunidades Selecionadas',
  featuredTerrainsSubtitle: 'Lotes residenciais exclusivos com excelente topografia e localização privilegiada.',
  ctaTitle: 'Pronto para encontrar o terreno perfeito para a sua nova casa?',
  ctaSubtitle: 'Nossos corretores especialistas estão a postos para apresentar os melhores lotes e agendar sua visita aos condomínios.',
  ctaButtonText: 'Conversar com Especialista no WhatsApp',
  ctaButtonLink: '#atendimento',
  ctaBackgroundImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=80',
  visibleSections: {
    hero: true,
    search: true,
    featuredCondos: true,
    featuredTerrains: true,
    differentials: true,
    cta: true,
  }
};

export const INITIAL_CONTACT_SETTINGS: ContactSettings = {
  whatsapp: '34999998888',
  phone: '(34) 3222-7700',
  email: 'contato@lotecertoimoveis.com.br',
  instagram: '@lotecerto.imoveis',
  address: 'Av. dos Vinhedos, 1200 - Morada da Colina, Uberlândia - MG',
  businessHours: 'Segunda a Sexta: 08:30 às 18:30 | Sábados: 09:00 às 13:00',
  defaultMessageTemplate: 'Olá! Gostaria de falar com um corretor sobre os terrenos disponíveis.'
};

export const INITIAL_SEO_SETTINGS: SEOSettings = {
  defaultTitle: 'Lote Certo | Catálogo Imobiliário de Terrenos & Condomínios Fechados',
  defaultDescription: 'Encontre o terreno dos seus sonhos nos melhores condomínios fechados. Busca inteligente, fotos de alta qualidade e atendimento personalizado.',
  organizationName: 'Lote Certo',
  siteUrl: 'https://lotecertoimoveis.com.br',
  defaultOgImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
  googleAnalyticsId: 'G-DEMO123456',
  googleTagManagerId: 'GTM-DEMO789',
  googleAdsId: 'AW-987654321',
};

export const INITIAL_MARKETING_SETTINGS: MarketingSettings = {
  utmCaptureEnabled: true,
  conversionEventsEnabled: true,
  cookieConsentEnabled: true,
};

export const INITIAL_MEDIA_ASSETS: MediaAsset[] = [
  {
    id: 'media-1',
    title: 'Fachada Portaria Alphaville',
    altText: 'Portaria e pórtico de entrada do Alphaville Reserva',
    url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
    category: 'condominio',
    sizeBytes: 420000,
    createdAt: '2025-01-10T10:00:00Z'
  },
  {
    id: 'media-2',
    title: 'Vista Aérea Lote de Esquina',
    altText: 'Terreno plano de esquina com bosque ao fundo',
    url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
    category: 'terreno',
    sizeBytes: 512000,
    createdAt: '2025-01-11T11:00:00Z'
  },
  {
    id: 'media-3',
    title: 'Piscina de Borda Infinita Clube Alphaville',
    altText: 'Piscina resort com raia e deck molhado',
    url: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=800&q=80',
    category: 'lazer',
    sizeBytes: 380000,
    createdAt: '2025-01-10T10:30:00Z'
  },
  {
    id: 'media-4',
    title: 'Lago Privativo Nova Lima',
    altText: 'Espelho d água e natureza no condomínio Quintas do Lago',
    url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    category: 'condominio',
    sizeBytes: 600000,
    createdAt: '2025-01-08T09:00:00Z'
  }
];

export const INITIAL_LEADS: Lead[] = [
  {
    id: 'lead-1',
    name: 'Carlos Eduardo Mendes',
    phone: '(34) 99123-4567',
    email: 'carlos.mendes@email.com',
    terrainId: 'terrain-1',
    terrainTitle: 'Lote de Esquina com Vista Panorâmica para Reserva',
    condominiumName: 'Alphaville Reserva',
    message: 'Tenho interesse no lote de esquina e gostaria de saber as opções de parcelamento direto.',
    source: 'Detalhes do Terreno (WhatsApp)',
    status: 'em_atendimento',
    createdAt: '2025-01-15T14:20:00Z'
  },
  {
    id: 'lead-2',
    name: 'Mariana Silveira',
    phone: '(31) 98877-6655',
    email: 'mariana.silveira@email.com',
    terrainId: 'terrain-3',
    terrainTitle: 'Lote Amplo de 1.150 m² Frente para o Lago Privativo',
    condominiumName: 'Quintas do Lago Residencial',
    message: 'Gostaria de agendar uma visita no sábado de manhã para conhecer o lote frente ao lago.',
    source: 'Formulário de Contato',
    status: 'novo',
    createdAt: '2025-01-16T10:15:00Z'
  }
];
