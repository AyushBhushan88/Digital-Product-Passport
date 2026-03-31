import { Controller, Get, Param, BadRequestException } from '@nestjs/common';
import { ProvenanceService } from './provenance.service';
import { BlockchainService } from '../blockchain/blockchain.service';
import { PrismaService } from '../../prisma/prisma.service';

@Controller('p/01')
export class PassportController {
  constructor(
    private provenanceService: ProvenanceService,
    private blockchainService: BlockchainService,
    private prisma: PrismaService,
  ) {}

  @Get(':gtin/21/:serial')
  async getPassport(@Param('gtin') gtin: string, @Param('serial') serial: string) {
    // 1. Fetch the latest RawEvent to get product details
    const latestEvent = await this.prisma.rawEvent.findFirst({
      where: {
        payload: {
          path: ['gtin'],
          equals: gtin,
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!latestEvent) {
      throw new BadRequestException('Product not found in registry');
    }

    const payload = latestEvent.payload as any;

    // 2. Fetch the provenance timeline
    const timeline = await this.provenanceService.getTimeline(gtin, serial);

    // 3. Verify on-chain status if Tx exists
    const onChainStatus = payload.onChainTx ? {
      verified: true,
      txHash: payload.onChainTx,
      explorerUrl: `https://mumbai.polygonscan.com/tx/${payload.onChainTx}`, // Example L2 explorer
    } : { verified: false };

    // 4. Aggregate and return for PWA
    return {
      product: {
        gtin,
        serial,
        brand: payload.brand || 'Unknown',
        model: payload.model || 'Standard Product',
        sector: latestEvent.sector,
      },
      onChainStatus,
      provenance: timeline,
      gs1DigitalLink: `https://id.looppass.io/01/${gtin}/21/${serial}`,
    };
  }
}
