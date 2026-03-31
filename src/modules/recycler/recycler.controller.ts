import { Controller, Get, Post, Param, Headers, UnauthorizedException, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { BlockchainService } from '../blockchain/blockchain.service';

@Controller('api/recycler')
export class RecyclerController {
  private readonly logger = new Logger(RecyclerController.name);

  constructor(
    private prisma: PrismaService,
    private blockchainService: BlockchainService,
  ) {}

  private validateRecycler(authHeader: string) {
    // Simple simulation of recycler authentication (D-31)
    if (authHeader !== 'RECYCLER_SECRET_KEY') {
      throw new UnauthorizedException('Invalid or missing recycler credentials');
    }
  }

  @Get('disassembly/:rawEventId')
  async getDisassemblyGuide(
    @Param('rawEventId') rawEventId: string,
    @Headers('authorization') auth: string,
  ) {
    this.validateRecycler(auth);

    const event = await this.prisma.rawEvent.findUnique({
      where: { id: rawEventId },
    });

    if (!event) {
      throw new NotFoundException('Product record not found');
    }

    const payload = event.payload as any;

    // Return sensitive disassembly and substance data (UX-04)
    return {
      productId: rawEventId,
      gtin: payload.gtin,
      serial: payload.serial,
      disassemblyManual: payload.disassemblyInstructions || payload.disassemblyManual || 'https://looppass.io/guides/generic-disassembly.pdf',
      substancesOfConcern: payload.substances || [
        { name: 'Lead', concentration: '0.1%', status: 'REPORTABLE' },
        { name: 'Cadmium', concentration: '0.01%', status: 'RESTRICTED' },
      ],
      compliance: payload.substanceCompliance || { rohs: true, reach: true },
    };
  }

  @Post('mark-recycled/:rawEventId')
  async markAsRecycled(
    @Param('rawEventId') rawEventId: string,
    @Headers('authorization') auth: string,
  ) {
    this.validateRecycler(auth);

    const event = await this.prisma.rawEvent.findUnique({
      where: { id: rawEventId },
    });

    if (!event) {
      throw new NotFoundException('Product record not found');
    }

    const payload = event.payload as any;
    
    // 1. Update status on-chain (UX-05, BCN-01)
    const onChainTx = await this.blockchainService.updateTwinStatus(rawEventId, 'RECYCLED');

    // 2. Create Audit Log for the lifecycle change (D-14)
    await this.prisma.auditLog.create({
      data: {
        action: 'MARK_RECYCLED',
        entityType: 'RawEvent',
        entityId: rawEventId,
        actor: 'RECYCLER_PORTAL',
        hash: payload.onChainTx || '0x0', // Linking to original mint hash if available
        metadata: {
          txHash: onChainTx,
          status: 'RECYCLED',
          timestamp: new Date().toISOString(),
        },
      },
    });

    // 3. Update local record status
    await this.prisma.rawEvent.update({
      where: { id: rawEventId },
      data: {
        payload: {
          ...payload,
          lifecycleStatus: 'RECYCLED',
          lastRecycledTx: onChainTx,
        },
      },
    });

    return {
      success: true,
      message: 'Product marked as RECYCLED on-chain',
      txHash: onChainTx,
    };
  }
}
