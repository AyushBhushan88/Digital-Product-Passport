import { Test, TestingModule } from '@nestjs/testing';
import { RecyclerController } from './recycler.controller';
import { PrismaService } from '../../prisma/prisma.service';
import { BlockchainService } from '../blockchain/blockchain.service';
import { UnauthorizedException, NotFoundException } from '@nestjs/common';

describe('RecyclerController', () => {
  let controller: RecyclerController;
  let mockPrisma: any;
  let mockBlockchain: any;

  beforeEach(async () => {
    mockPrisma = {
      rawEvent: {
        findUnique: jest.fn(),
        update: jest.fn(),
      },
      auditLog: {
        create: jest.fn(),
      },
    };

    mockBlockchain = {
      updateTwinStatus: jest.fn().mockResolvedValue('0x-new-tx-hash'),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [RecyclerController],
      providers: [
        { provide: PrismaService, useValue: mockPrisma },
        { provide: BlockchainService, useValue: mockBlockchain },
      ],
    }).compile();

    controller = module.get<RecyclerController>(RecyclerController);
  });

  describe('getDisassemblyGuide', () => {
    it('should return disassembly data for authorized recycler', async () => {
      mockPrisma.rawEvent.findUnique.mockResolvedValue({
        id: 'uuid-123',
        payload: { gtin: '123', serial: 'SN1', disassemblyInstructions: 'http://guide.com' },
      });

      const result = await controller.getDisassemblyGuide('uuid-123', 'RECYCLER_SECRET_KEY');
      expect(result.gtin).toBe('123');
      expect(result.disassemblyManual).toBe('http://guide.com');
    });

    it('should throw UnauthorizedException for invalid key', async () => {
      await expect(controller.getDisassemblyGuide('uuid-123', 'WRONG_KEY'))
        .rejects.toThrow(UnauthorizedException);
    });

    it('should throw NotFoundException if product does not exist', async () => {
      mockPrisma.rawEvent.findUnique.mockResolvedValue(null);
      await expect(controller.getDisassemblyGuide('non-existent', 'RECYCLER_SECRET_KEY'))
        .rejects.toThrow(NotFoundException);
    });
  });

  describe('markAsRecycled', () => {
    it('should update on-chain status and create audit log', async () => {
      mockPrisma.rawEvent.findUnique.mockResolvedValue({
        id: 'uuid-123',
        payload: { onChainTx: '0x-original-hash' },
      });

      const result = await controller.markAsRecycled('uuid-123', 'RECYCLER_SECRET_KEY');

      expect(result.success).toBe(true);
      expect(mockBlockchain.updateTwinStatus).toHaveBeenCalledWith('uuid-123', 'RECYCLED');
      expect(mockPrisma.auditLog.create).toHaveBeenCalled();
      expect(mockPrisma.rawEvent.update).toHaveBeenCalled();
    });
  });
});
