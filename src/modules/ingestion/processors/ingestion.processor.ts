import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Processor('ingestion')
export class IngestionProcessor extends WorkerHost {
  private readonly logger = new Logger(IngestionProcessor.name);

  constructor(private prisma: PrismaService) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    const { id, name, data } = job;
    const { rawEventId, payload } = data;

    this.logger.log(`Starting processing job ${id} [${name}] for RawEvent: ${rawEventId}`);

    try {
      // Simulate heavy processing (D-07 Raw Event storage and sector mapping)
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // 1. Sector Mapping Simulation
      const sector = payload.sector || 'BATTERY';
      this.logger.log(`Mapping data for sector: ${sector}`);

      switch (sector) {
        case 'FASHION':
          this.logger.log(`Processing Fashion Tier mapping for job ${id}`);
          break;
        case 'ELECTRONICS':
          this.logger.log(`Processing Electronics BOM mapping for job ${id}`);
          break;
        case 'BATTERY':
          this.logger.log(`Processing Battery Regulation mapping for job ${id}`);
          break;
        default:
          this.logger.warn(`Unknown sector ${sector}, using generic mapping`);
      }

      // 2. Update RawEvent to PROCESSED
      if (rawEventId) {
        await this.prisma.rawEvent.update({
          where: { id: rawEventId },
          data: { status: 'PROCESSED' },
        });
      }

      this.logger.log(`Payload processed for job ${id}: ${JSON.stringify(payload).substring(0, 100)}...`);
      this.logger.log(`Completed job ${id}`);

      return { success: true, processedAt: new Date().toISOString(), rawEventId };
    } catch (error) {
      this.logger.error(`Failed to process job ${id}: ${error.message}`);
      
      if (rawEventId) {
        await this.prisma.rawEvent.update({
          where: { id: rawEventId },
          data: { status: 'FAILED' },
        });
      }

      throw error;
    }
  }
}
