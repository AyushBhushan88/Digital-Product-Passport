import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { PrismaService } from '../../prisma/prisma.service';
import { Category } from '../battery/battery.types';

@Injectable()
export class IngestionService {
  private readonly logger = new Logger(IngestionService.name);

  constructor(
    @InjectQueue('ingestion') private ingestionQueue: Queue,
    private prisma: PrismaService,
  ) {}

  async ingestSupplierData(data: any) {
    // Perform basic format validation
    if (!data || Object.keys(data).length === 0) {
      throw new Error('Invalid supplier data payload');
    }

    // Determine sector using Category enum
    const sector = (data.sector as Category) || Category.BATTERY;

    // 1. Create PENDING RawEvent
    const rawEvent = await this.prisma.rawEvent.create({
      data: {
        type: 'SUPPLIER_DATA',
        sector: sector,
        payload: data,
        status: 'PENDING',
      },
    });

    // 2. Add job to the queue
    const job = await this.ingestionQueue.add('process-supplier-data', {
      rawEventId: rawEvent.id,
      payload: data,
      timestamp: new Date().toISOString(),
    });

    // 3. Update RawEvent with jobId
    await this.prisma.rawEvent.update({
      where: { id: rawEvent.id },
      data: { jobId: job.id },
    });

    this.logger.log(`Job added to ingestion queue: ${job.id} for RawEvent: ${rawEvent.id}`);

    return {
      status: 'Accepted',
      jobId: job.id,
      rawEventId: rawEvent.id,
    };
  }
}
