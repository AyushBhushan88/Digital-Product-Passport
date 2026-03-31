import { Test, TestingModule } from '@nestjs/testing';
import { PassportController } from './passport.controller';
import { ProvenanceService } from './provenance.service';
import { BlockchainService } from '../blockchain/blockchain.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('PassportController', () => {
  let controller: PassportController;
  let mockPrisma: any;
  let mockProvenance: any;

  beforeEach(async () => {
    mockPrisma = {
      rawEvent: {
        findFirst: jest.fn().mockResolvedValue({
          id: 'raw-123',
          sector: 'FASHION',
          payload: { brand: 'Zara', model: 'Cotton Shirt', onChainTx: '0xabc' }
        }),
      },
    };

    mockProvenance = {
      getTimeline: jest.fn().mockResolvedValue([{ title: 'Event 1' }]),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [PassportController],
      providers: [
        { provide: PrismaService, useValue: mockPrisma },
        { provide: ProvenanceService, useValue: mockProvenance },
        { provide: BlockchainService, useValue: {} },
      ],
    }).compile();

    controller = module.get<PassportController>(PassportController);
  });

  it('should return aggregated product passport data', async () => {
    const result = await controller.getPassport('12345678901234', 'SN-999');

    expect(result.product.brand).toBe('Zara');
    expect(result.onChainStatus.verified).toBe(true);
    expect(result.provenance).toHaveLength(1);
    expect(result.gs1DigitalLink).toContain('01/12345678901234/21/SN-999');
  });
});
