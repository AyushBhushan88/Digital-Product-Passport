import { Test, TestingModule } from '@nestjs/testing';
import { IngestionProcessor } from './ingestion.processor';
import { Job } from 'bullmq';
import { PrismaService } from '../../../prisma/prisma.service';
import { ConnectorRegistry } from '../connectors/connector.registry';
import { CryptoService } from '../../crypto/crypto.service';
import { BlockchainService } from '../../blockchain/blockchain.service';
import { Gs1Service } from '../../gs1/gs1.service';

describe('IngestionProcessor', () => {
  let processor: IngestionProcessor;
  let mockPrisma: any;
  let mockConnectorRegistry: any;
  let mockCryptoService: any;
  let mockBlockchainService: any;
  let mockGs1Service: any;

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

    mockGs1Service = {
      generateDigitalLink: jest.fn().mockReturnValue('https://id.looppass.io/01/123/21/456'),
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
        {
          provide: Gs1Service,
          useValue: mockGs1Service,
        },
      ],
    }).compile();

    processor = module.get<IngestionProcessor>(IngestionProcessor);
  });

  it('should be defined', () => {
    expect(processor).toBeDefined();
  });

  it('should process a job, audit log, mint, and assign GS1 identity', async () => {
    const mockJob = {
      id: '1',
      name: 'process-supplier-data',
      data: {
        rawEventId: 'raw-123',
        payload: { sector: 'FASHION', test: 'data', gtin: '12345678901234', serial: 'SN-999' },
        timestamp: new Date().toISOString(),
      },
    } as Job;

    const result = await processor.process(mockJob);

    expect(mockCryptoService.hashPayload).toHaveBeenCalled();
    expect(mockPrisma.auditLog.create).toHaveBeenCalled();
    expect(mockBlockchainService.mintDigitalTwin).toHaveBeenCalled();
    expect(mockGs1Service.generateDigitalLink).toHaveBeenCalledWith('12345678901234', 'SN-999');

    expect(mockPrisma.rawEvent.update).toHaveBeenCalledWith({
      where: { id: 'raw-123' },
      data: expect.objectContaining({ status: 'PROCESSED' }),
    });

    expect(result).toEqual(expect.objectContaining({
      success: true,
      onChainTx: '0x-mock-tx',
      digitalLink: 'https://id.looppass.io/01/123/21/456',
    }));
  });
});
