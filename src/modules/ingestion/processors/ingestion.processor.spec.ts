import { Test, TestingModule } from '@nestjs/testing';
import { IngestionProcessor } from './ingestion.processor';
import { Job } from 'bullmq';
import { PrismaService } from '../../../prisma/prisma.service';
import { ConnectorRegistry } from '../connectors/connector.registry';
import { CryptoService } from '../../crypto/crypto.service';
import { BlockchainService } from '../../blockchain/blockchain.service';

describe('IngestionProcessor', () => {
  let processor: IngestionProcessor;
  let mockPrisma: any;
  let mockConnectorRegistry: any;
  let mockCryptoService: any;
  let mockBlockchainService: any;

  beforeEach(async () => {
    mockPrisma = {
      rawEvent: {
        update: jest.fn().mockResolvedValue({ id: 'raw-123', status: 'PROCESSED' }),
      },
      auditLog: {
        create: jest.fn().mockResolvedValue({ id: 'audit-123' }),
      },
    };

    mockConnectorRegistry = {
      get: jest.fn().mockReturnValue(null),
    };

    mockCryptoService = {
      hashPayload: jest.fn().mockReturnValue('mocked-hash'),
    };

    mockBlockchainService = {
      mintDigitalTwin: jest.fn().mockResolvedValue('0x-mock-tx'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IngestionProcessor,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
        {
          provide: ConnectorRegistry,
          useValue: mockConnectorRegistry,
        },
        {
          provide: CryptoService,
          useValue: mockCryptoService,
        },
        {
          provide: BlockchainService,
          useValue: mockBlockchainService,
        },
      ],
    }).compile();

    processor = module.get<IngestionProcessor>(IngestionProcessor);
  });

  it('should be defined', () => {
    expect(processor).toBeDefined();
  });

  it('should process a job, audit log, and mint digital twin', async () => {
    const mockJob = {
      id: '1',
      name: 'process-supplier-data',
      data: {
        rawEventId: 'raw-123',
        payload: { sector: 'FASHION', test: 'data' },
        timestamp: new Date().toISOString(),
      },
    } as Job;

    const result = await processor.process(mockJob);

    expect(mockCryptoService.hashPayload).toHaveBeenCalled();
    expect(mockPrisma.auditLog.create).toHaveBeenCalled();
    expect(mockBlockchainService.mintDigitalTwin).toHaveBeenCalledWith('mocked-hash');

    expect(mockPrisma.rawEvent.update).toHaveBeenCalledWith({
      where: { id: 'raw-123' },
      data: expect.objectContaining({ status: 'PROCESSED' }),
    });

    expect(result).toEqual(expect.objectContaining({
      success: true,
      onChainTx: '0x-mock-tx',
    }));
  });
});
