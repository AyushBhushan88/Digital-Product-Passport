import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';

@Processor('ingestion')
export class IngestionProcessor extends WorkerHost {
  private readonly logger = new Logger(IngestionProcessor.name);

  async process(job: Job<any, any, string>): Promise<any> {
    const { id, name, data } = job;
    this.logger.log(`Starting processing job ${id} [${name}]`);

    // Simulate heavy processing (D-07 Raw Event storage and sector mapping will live here)
    await new Promise((resolve) => setTimeout(resolve, 2000));

    this.logger.log(`Payload processed for job ${id}: ${JSON.stringify(data.payload).substring(0, 100)}...`);

    // Logic for future expansion:
    // 1. Store raw event in PostgreSQL
    // 2. Validate against sector-specific schemas (Fashion, Electronics)
    // 3. Trigger downstream twin updates

    this.logger.log(`Completed job ${id}`);
    return { success: true, processedAt: new Date().toISOString() };
  }
}
