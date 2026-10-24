export function formatCurrency(value: number | null | undefined): string {
  if (value === null || value === undefined || isNaN(value)) {
    return 'Consulte-nos';
  }
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0
  }).format(value);
}

export function formatArea(area: number | null | undefined): string {
  if (!area) return '0 m²';
  return `${new Intl.NumberFormat('pt-BR').format(area)} m²`;
}

export function formatDate(dateString: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(date);
}

export function formatPhone(phone: string): string {
  if (!phone) return '';
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 11) {
    return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  } else if (cleaned.length === 10) {
    return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  }
  return phone;
}

export function generateWhatsAppLink(params: {
  whatsappNumber: string;
  terrainTitle?: string;
  condominiumName?: string;
  block?: string;
  lot?: string;
  area?: number;
  price?: number | null;
  origin?: string;
}): string {
  const cleanNumber = params.whatsappNumber.replace(/\D/g, '');
  if (!cleanNumber) return '';

  let message = 'Olá! ';
  if (params.terrainTitle) {
    message += `Gostaria de mais informações sobre o terreno "${params.terrainTitle}"`;
    if (params.condominiumName) {
      message += ` no condomínio ${params.condominiumName}`;
    }
    if (params.block && params.lot) {
      message += ` (Quadra ${params.block}, Lote ${params.lot})`;
    }
    if (params.area) {
      message += ` com área de ${params.area} m²`;
    }
    if (params.price) {
      message += ` anunciado por ${formatCurrency(params.price)}`;
    }
    message += '. Pode me informar a disponibilidade e condições de pagamento?';
  } else if (params.condominiumName) {
    message += `Gostaria de conhecer os terrenos disponíveis no condomínio ${params.condominiumName}.`;
  } else {
    message += 'Olá! Estava navegando no catálogo de terrenos e gostaria de falar com um corretor.';
  }

  if (params.origin) {
    message += ` (Origem: ${params.origin})`;
  }

  return `https://wa.me/55${cleanNumber}?text=${encodeURIComponent(message)}`;
}
