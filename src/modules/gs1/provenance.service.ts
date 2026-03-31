import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ProvenanceService {
  private readonly logger = new Logger(ProvenanceService.name);

  constructor(private prisma: PrismaService) {}

  async getTimeline(gtin: string, serial: string): Promise<any[]> {
    this.logger.log(`Generating provenance timeline for GTIN: ${gtin}, Serial: ${serial}`);

    // 1. Fetch related RawEvents (those matching the identifiers in their payload)
    // In a real system, we'd have a 'Product' model to link them, but for now we search
    const rawEvents = await this.prisma.rawEvent.findMany({
      where: {
        payload: {
          path: ['gtin'],
          equals: gtin,
        },
        // We'd also filter by serial if it were a direct field
      },
      orderBy: { createdAt: 'asc' },
    });

    // 2. Build timeline events
    const timeline = [];

    for (const event of rawEvents) {
      timeline.push({
        type: 'INGESTION',
        title: 'Product Data Ingested',
        description: `Verified supplier data received for sector: ${event.sector}`,
        timestamp: event.createdAt,
        status: event.status,
      });

      // 3. Find related AuditLogs for each RawEvent
      const auditLogs = await this.prisma.auditLog.findMany({
        where: { entityId: event.id, entityType: 'RawEvent' },
        orderBy: { createdAt: 'asc' },
      });

      for (const log of auditLogs) {
        timeline.push({
          type: 'AUDIT',
          title: 'Cryptographic Fingerprint Generated',
          description: `Immutable hash recorded: ${log.hash.substring(0, 12)}...`,
          timestamp: log.createdAt,
          actor: log.actor,
        });
      }
    }

    // Sort by timestamp
    return timeline.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }
}
