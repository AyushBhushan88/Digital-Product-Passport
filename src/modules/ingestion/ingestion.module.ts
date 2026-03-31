import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { IngestionController } from './ingestion.controller';
import { IngestionService } from './ingestion.service';
import { IngestionProcessor } from './processors/ingestion.processor';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'ingestion',
    }),
  ],
  controllers: [IngestionController],
  providers: [IngestionService, IngestionProcessor],
})
export class IngestionModule {}
