import { Test, TestingModule } from '@nestjs/testing';
import { PassportController } from './passport.controller';
import { ProvenanceService } from './provenance.service';
import { BlockchainService } from '../blockchain/blockchain.service';
import { PrismaService } from '../../prisma/prisma.service';
import { ScorecardService } from './scorecard.service';

describe('PassportController', () => {
  let controller: PassportController;
  let mockPrisma: any;
  let mockProvenance: any;
  let mockScorecard: any;

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

    mockScorecard = {
      calculateScore: jest.fn().mockReturnValue({ total: 85, grade: 'B' }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [PassportController],
      providers: [
        { provide: PrismaService, useValue: mockPrisma },
        { provide: ProvenanceService, useValue: mockProvenance },
        { provide: BlockchainService, useValue: {} },
        { provide: ScorecardService, useValue: mockScorecard },
      ],
    }).compile();

    controller = module.get<PassportController>(PassportController);
  });

  it('should return aggregated passport data including scorecard', async () => {
    const result = await controller.getPassport('12345678901234', 'SN-999');

    expect(result.product.brand).toBe('Zara');
    expect(result.scorecard.grade).toBe('B');
    expect(mockScorecard.calculateScore).toHaveBeenCalled();
  });
});
