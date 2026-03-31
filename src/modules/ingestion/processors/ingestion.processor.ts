import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { ConnectorRegistry } from '../connectors/connector.registry';
import { CryptoService } from '../../crypto/crypto.service';
import { BlockchainService } from '../../blockchain/blockchain.service';

@Processor('ingestion')
export class IngestionProcessor extends WorkerHost {
  private readonly logger = new Logger(IngestionProcessor.name);

  constructor(
    private prisma: PrismaService,
    private connectorRegistry: ConnectorRegistry,
    private cryptoService: CryptoService,
    private blockchainService: BlockchainService,
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

      // 2. Cryptographic Hashing (D-13)
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

      // Simulate heavy processing (D-07 Raw Event storage and sector mapping)
      await new Promise((resolve) => setTimeout(resolve, 500));

      // 5. Sector Mapping Simulation
      const sector = payload.sector || 'BATTERY';
      this.logger.log(`Mapping data for sector: ${sector}`);

      switch (sector) {
        case 'FASHION':
          this.logger.log(`Processing Fashion Tier mapping for job ${id} (ID: ${payload.externalId})`);
          break;
        case 'ELECTRONICS':
          this.logger.log(`Processing Electronics BOM mapping for job ${id} (ID: ${payload.externalId})`);
          break;
        case 'BATTERY':
          this.logger.log(`Processing Battery Regulation mapping for job ${id} (ID: ${payload.externalId})`);
          break;
        default:
          this.logger.warn(`Unknown sector ${sector}, using generic mapping`);
      }

      // 6. Update RawEvent to PROCESSED
      if (rawEventId) {
        await this.prisma.rawEvent.update({
          where: { id: rawEventId },
          data: { 
            status: 'PROCESSED',
            payload: payload, // Update with transformed payload
          },
        });
      }

      this.logger.log(`Payload processed for job ${id}: ${JSON.stringify(payload).substring(0, 100)}...`);
      this.logger.log(`Completed job ${id}`);

      return { success: true, processedAt: new Date().toISOString(), rawEventId, onChainTx };
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
