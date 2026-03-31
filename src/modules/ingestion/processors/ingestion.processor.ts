import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { ConnectorRegistry } from '../connectors/connector.registry';
import { CryptoService } from '../../crypto/crypto.service';
import { BlockchainService } from '../../blockchain/blockchain.service';
import { Gs1Service } from '../../gs1/gs1.service';
import { ValidationEngine } from '../../compliance/engines/validation.engine';
import { Category } from '../../battery/battery.types';

@Processor('ingestion')
export class IngestionProcessor extends WorkerHost {
  private readonly logger = new Logger(IngestionProcessor.name);

  constructor(
    private prisma: PrismaService,
    private connectorRegistry: ConnectorRegistry,
    private cryptoService: CryptoService,
    private blockchainService: BlockchainService,
    private gs1Service: Gs1Service,
    private validationEngine: ValidationEngine,
  ) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    const { id, name, data } = job;
    const { rawEventId } = data;
    let { payload } = data;

    this.logger.log(`Starting processing job ${id} [${name}] for RawEvent: ${rawEventId}`);

    try {
      // 1. Enterprise Connector Mapping
      const connectorName = payload.connector || payload.metadata?.source;
      if (connectorName) {
        const connector = this.connectorRegistry.get(connectorName);
        if (connector) {
          this.logger.log(`Applying ${connectorName} mapping for job ${id}`);
          payload = connector.map(payload);
        } else {
          this.logger.warn(`Connector ${connectorName} not found in registry`);
        }
      }

      // 2. Sector Mapping & Validation
      const sector = (payload.sector as Category) || Category.BATTERY;
      this.logger.log(`Validating data for sector: ${sector}`);

      const validationResult = this.validationEngine.validate(payload, sector);
      if (!validationResult.success) {
        const errorMsg = `Validation failed for ${sector}: ${JSON.stringify(validationResult.errors)}`;
        this.logger.error(errorMsg);
        throw new Error(errorMsg);
      }
      this.logger.log(`Validation successful for ${sector}`);

      // 3. Cryptographic Hashing (D-13)
      const payloadHash = this.cryptoService.hashPayload(payload);
      this.logger.log(`Generated payload fingerprint: ${payloadHash.substring(0, 16)}...`);

      // 3. Create Audit Log (D-14)
      if (rawEventId) {
        await this.prisma.auditLog.create({
          data: {
            action: 'INGESTION',
            entityType: 'RawEvent',
            entityId: rawEventId,
            actor: 'SYSTEM',
            hash: payloadHash,
            metadata: {
              jobId: id,
              connector: connectorName,
            },
          },
        });
      }

      // 4. Digital Twin Minting (BCN-01, D-18)
      const onChainTx = await this.blockchainService.mintDigitalTwin(payloadHash);
      this.logger.log(`Digital Twin record initialized on-chain. Tx: ${onChainTx}`);

      // 5. GS1 Digital Link Generation (BCN-03, D-21)
      const gtin = payload.gtin || '01234567890123'; 
      const serial = payload.serial || (id ? id.toString() : 'SN-UNKNOWN');
      const digitalLink = this.gs1Service.generateDigitalLink(gtin, serial);
      this.logger.log(`Assigned GS1 Digital Link: ${digitalLink}`);

      // 6. Update RawEvent to PROCESSED
      if (rawEventId) {
        await this.prisma.rawEvent.update({
          where: { id: rawEventId },
          data: { 
            status: 'PROCESSED',
            payload: {
              ...payload,
              onChainTx,
              digitalLink,
            },
          },
        });
      }

      this.logger.log(`Payload processed for job ${id}: ${JSON.stringify(payload).substring(0, 100)}...`);
      this.logger.log(`Completed job ${id}`);

      return { success: true, processedAt: new Date().toISOString(), rawEventId, onChainTx, digitalLink };
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
