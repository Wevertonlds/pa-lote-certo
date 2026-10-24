import type { SearchQueryFilters, Terrain, Condominium } from '@/types';

/**
 * Remove acentos e normaliza para caixa baixa
 */
export function normalizeText(text: string): string {
  if (!text) return '';
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

export interface ParsedSearchCriteria {
  rawQuery: string;
  cleanedTerms: string[];
  minArea?: number;
  maxArea?: number;
  minPrice?: number;
  maxPrice?: number;
  terrainType?: string;
  leisureKeywords: string[];
}

/**
 * Analisador inteligente de busca em linguagem natural
 */
export function parseNaturalLanguageQuery(query: string): ParsedSearchCriteria {
  const normalized = normalizeText(query);
  let workingText = normalized;

  let minPrice: number | undefined;
  let maxPrice: number | undefined;
  let minArea: number | undefined;
  let maxArea: number | undefined;
  let terrainType: string | undefined;
  const leisureKeywords: string[] = [];

  // 1. Interpretar Valores Monetários (Preço)
  // Ex: "ate 300 mil", "ate r$ 300.000", "ate 500 mil", "acima de 250 mil", "300 mil", "300k"
  const priceRegexMax = /(?:ate|maximo|menos de|ate r\$|r\$)\s*(\d+(?:[.,]\d+)?)\s*(mil|k)?/i;
  const priceMaxMatch = workingText.match(priceRegexMax);
  if (priceMaxMatch) {
    let val = parseFloat(priceMaxMatch[1].replace(',', '.'));
    if (priceMaxMatch[2] || val < 1000) {
      val = val * 1000;
    }
    maxPrice = val;
    workingText = workingText.replace(priceMaxMatch[0], ' ');
  }

  const priceRegexMin = /(?:acima de|a partir de|mais de|minimo de)\s*(?:r\$)?\s*(\d+(?:[.,]\d+)?)\s*(mil|k)?/i;
  const priceMinMatch = workingText.match(priceRegexMin);
  if (priceMinMatch) {
    let val = parseFloat(priceMinMatch[1].replace(',', '.'));
    if (priceMinMatch[2] || val < 1000) {
      val = val * 1000;
    }
    minPrice = val;
    workingText = workingText.replace(priceMinMatch[0], ' ');
  }

  // 2. Interpretar Metragem (Área)
  // Ex: "450 m²", "450m2", "450 metros", "acima de 600 metros", "ate 500m2"
  const areaRegexMin = /(?:acima de|a partir de|mais de|minimo)\s*(\d+)\s*(?:m2|m²|metros|metro)/i;
  const areaMinMatch = workingText.match(areaRegexMin);
  if (areaMinMatch) {
    minArea = parseInt(areaMinMatch[1], 10);
    workingText = workingText.replace(areaMinMatch[0], ' ');
  }

  const areaRegexMax = /(?:ate|maximo de|menos de)\s*(\d+)\s*(?:m2|m²|metros|metro)/i;
  const areaMaxMatch = workingText.match(areaRegexMax);
  if (areaMaxMatch) {
    maxArea = parseInt(areaMaxMatch[1], 10);
    workingText = workingText.replace(areaMaxMatch[0], ' ');
  }

  const exactAreaRegex = /(?:de\s*)?(\d+)\s*(?:m2|m²|metros|metro)/i;
  const exactAreaMatch = workingText.match(exactAreaRegex);
  if (exactAreaMatch && !minArea && !maxArea) {
    const area = parseInt(exactAreaMatch[1], 10);
    // Margem de tolerância aproximada de 10% para metragens naturais
    minArea = Math.round(area * 0.9);
    maxArea = Math.round(area * 1.1);
    workingText = workingText.replace(exactAreaMatch[0], ' ');
  }

  // 3. Interpretar Tipos de Terreno
  const typesMap: Record<string, string> = {
    'esquina': 'esquina',
    'plano': 'plano',
    'aclive': 'aclive',
    'declive': 'declive',
    'ilha': 'ilha',
    'vista verde': 'vista_verde',
    'mata': 'vista_verde',
    'reserva': 'vista_verde'
  };

  for (const [key, type] of Object.entries(typesMap)) {
    if (workingText.includes(key)) {
      terrainType = type;
      workingText = workingText.replace(new RegExp(`\\b${key}\\b`, 'g'), ' ');
      break;
    }
  }

  // 4. Interpretar Palavras-Chave de Lazer & Infraestrutura
  const commonLeisure = ['piscina', 'academia', 'quadra', 'tenis', 'beach tennis', 'clube', 'playground', 'lago', 'festa', 'gourmet', 'trilha', 'spa', 'seguranca', 'portaria'];
  for (const word of commonLeisure) {
    if (workingText.includes(word)) {
      leisureKeywords.push(word);
      workingText = workingText.replace(new RegExp(`\\b${word}\\b`, 'g'), ' ');
    }
  }

  // Limpar palavras de preenchimento (stop words em português)
  const stopWords = ['terrenos', 'terreno', 'lotes', 'lote', 'em', 'no', 'na', 'com', 'para', 'de', 'do', 'da', 'condominio', 'residencial', 'fechado', 'um', 'uma'];
  const terms = workingText
    .split(/\s+/)
    .map(t => t.trim())
    .filter(t => t.length > 1 && !stopWords.includes(t));

  return {
    rawQuery: query,
    cleanedTerms: terms,
    minArea,
    maxArea,
    minPrice,
    maxPrice,
    terrainType,
    leisureKeywords,
  };
}

/**
 * Filtra terrenos e condomínios combinando critérios parsed + filtros selecionados
 */
export function filterTerrains(
  terrains: Terrain[],
  condominiums: Condominium[],
  filters: SearchQueryFilters
): Terrain[] {
  let criteria: ParsedSearchCriteria = {
    rawQuery: '',
    cleanedTerms: [],
    leisureKeywords: []
  };

  if (filters.keyword && filters.keyword.trim().length > 0) {
    criteria = parseNaturalLanguageQuery(filters.keyword);
  }

  // Mapa de condomínios por ID para rápido acesso a infraestrutura e lazer
  const condoMap = new Map<string, Condominium>();
  condominiums.forEach(c => condoMap.set(c.id, c));

  return terrains.filter(terrain => {
    // Apenas publicados na visão pública
    if (!terrain.isPublished) return false;

    const condo = condoMap.get(terrain.condominiumId);

    // 1. Filtro explícito de condomínio
    if (filters.condominiumId && terrain.condominiumId !== filters.condominiumId) {
      return false;
    }

    // 2. Filtro explícito de status
    if (filters.status && terrain.status !== filters.status) {
      return false;
    }

    // 3. Tipo de terreno (explícito ou deduzido pela linguagem natural)
    const targetType = filters.terrainType || criteria.terrainType;
    if (targetType) {
      if (targetType === 'vista_verde') {
        const hasFeature = terrain.features.some(f => normalizeText(f).includes('verde') || normalizeText(f).includes('reserva'));
        if (!hasFeature) return false;
      } else if (terrain.terrainType !== targetType) {
        return false;
      }
    }

    // 4. Metragem (mínimo e máximo)
    const effectiveMinArea = filters.minArea ?? criteria.minArea;
    const effectiveMaxArea = filters.maxArea ?? criteria.maxArea;
    if (effectiveMinArea !== undefined && terrain.area < effectiveMinArea) {
      return false;
    }
    if (effectiveMaxArea !== undefined && terrain.area > effectiveMaxArea) {
      return false;
    }

    // 5. Preço (mínimo e máximo)
    const effectiveMinPrice = filters.minPrice ?? criteria.minPrice;
    const effectiveMaxPrice = filters.maxPrice ?? criteria.maxPrice;
    if (effectiveMinPrice !== undefined) {
      if (terrain.price === null || terrain.price < effectiveMinPrice) {
        return false;
      }
    }
    if (effectiveMaxPrice !== undefined) {
      if (terrain.price === null || terrain.price > effectiveMaxPrice) {
        return false;
      }
    }

    // 6. Cidade / Região
    if (filters.city) {
      const cityNorm = normalizeText(filters.city);
      const condoCity = condo ? normalizeText(condo.city) : '';
      if (!condoCity.includes(cityNorm)) {
        return false;
      }
    }

    // 7. Palavras de Lazer ou Infraestrutura deduzidas da busca
    if (criteria.leisureKeywords.length > 0) {
      if (!condo) return false;
      const condoLeisureText = normalizeText(
        condo.leisureAreas.map(l => `${l.title} ${l.description}`).join(' ') + ' ' +
        condo.infrastructure.join(' ')
      );
      const matchesAllLeisure = criteria.leisureKeywords.every(k => condoLeisureText.includes(k));
      if (!matchesAllLeisure) return false;
    }

    // 8. Termos textuais restantes da busca (cidade, nome do condomínio, título, quadra, lote, etc.)
    if (criteria.cleanedTerms.length > 0) {
      const fullSearchCorpus = normalizeText([
        terrain.title,
        terrain.shortDescription,
        terrain.fullDescription,
        `quadra ${terrain.block}`,
        `lote ${terrain.lot}`,
        condo ? condo.name : '',
        condo ? condo.city : '',
        condo ? condo.state : '',
        ...terrain.features,
        ...(condo ? condo.infrastructure : []),
        ...(condo ? condo.features : [])
      ].join(' '));

      const matchesAllTerms = criteria.cleanedTerms.every(term => fullSearchCorpus.includes(term));
      if (!matchesAllTerms) return false;
    }

    return true;
  });
}
