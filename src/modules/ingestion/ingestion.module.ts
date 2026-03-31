import { Module, OnModuleInit } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { IngestionController } from './ingestion.controller';
import { IngestionService } from './ingestion.service';
import { IngestionProcessor } from './processors/ingestion.processor';
import { PrismaModule } from '../../prisma/prisma.module';
import { ComplianceModule } from '../compliance/compliance.module';
import { BulkIngestionController } from './bulk-ingestion.controller';
import { BulkIngestionService } from './bulk-ingestion.service';
import { ConnectorRegistry } from './connectors/connector.registry';
import { SapS4HanaConnector } from './connectors/sap-s4hana.connector';
import { CentricPlmConnector } from './connectors/centric-plm.connector';

@Module({
  imports: [
    PrismaModule,
    ComplianceModule,
    BullModule.registerQueue({
      name: 'ingestion',
    }),
  ],
  controllers: [IngestionController, BulkIngestionController],
  providers: [
    IngestionService,
    IngestionProcessor,
    BulkIngestionService,
    ConnectorRegistry,
    SapS4HanaConnector,
    CentricPlmConnector,
  ],
  exports: [ConnectorRegistry],
})
export class IngestionModule implements OnModuleInit {
  constructor(
    private registry: ConnectorRegistry,
    private sap: SapS4HanaConnector,
    private centric: CentricPlmConnector,
  ) {}

  onModuleInit() {
    this.registry.register(this.sap);
    this.registry.register(this.centric);
  }
}
