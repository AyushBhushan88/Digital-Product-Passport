import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class IngestionService {
  private readonly logger = new Logger(IngestionService.name);

  constructor(@InjectQueue('ingestion') private ingestionQueue: Queue) {}

  async ingestSupplierData(data: any) {
    // Perform basic format validation
    if (!data || Object.keys(data).length === 0) {
      throw new Error('Invalid supplier data payload');
    }

    // Add job to the queue
    const job = await this.ingestionQueue.add('process-supplier-data', {
      payload: data,
      timestamp: new Date().toISOString(),
    });

    this.logger.log(`Job added to ingestion queue: ${job.id}`);

    return {
      status: 'Accepted',
      jobId: job.id,
    };
  }
}
