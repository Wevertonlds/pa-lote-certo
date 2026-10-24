import type { DashboardMetrics } from '@/types';
import { CondominiumService } from './CondominiumService';
import { TerrainService } from './TerrainService';
import { LeadService } from './LeadService';

export const DashboardService = {
  async getMetrics(): Promise<DashboardMetrics> {
    const [condos, terrains, leads] = await Promise.all([
      CondominiumService.getAll(),
      TerrainService.getAll(),
      LeadService.getAll()
    ]);

    const available = terrains.filter(t => t.status === 'disponivel').length;
    const reserved = terrains.filter(t => t.status === 'reservado').length;
    const sold = terrains.filter(t => t.status === 'vendido').length;
    const unpublished = terrains.filter(t => !t.isPublished || t.status === 'nao_publicado').length;

    return {
      totalCondominiums: condos.length,
      totalTerrains: terrains.length,
      availableTerrains: available,
      reservedTerrains: reserved,
      soldTerrains: sold,
      unpublishedTerrains: unpublished,
      totalLeads: leads.length,
    };
  }
};
