import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { IngestionController } from './ingestion.controller';
import { IngestionService } from './ingestion.service';
import { IngestionProcessor } from './processors/ingestion.processor';
import { PrismaModule } from '../../prisma/prisma.module';
import { BulkIngestionController } from './bulk-ingestion.controller';
import { BulkIngestionService } from './bulk-ingestion.service';

@Module({
  imports: [
    PrismaModule,
    BullModule.registerQueue({
      name: 'ingestion',
    }),
  ],
  controllers: [IngestionController, BulkIngestionController],
  providers: [IngestionService, IngestionProcessor, BulkIngestionService],
})
export class IngestionModule {}
