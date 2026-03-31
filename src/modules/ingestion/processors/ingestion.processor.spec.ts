import { Test, TestingModule } from '@nestjs/testing';
import { IngestionProcessor } from './ingestion.processor';
import { Job } from 'bullmq';
import { PrismaService } from '../../../prisma/prisma.service';
import { ConnectorRegistry } from '../connectors/connector.registry';
import { CryptoService } from '../../crypto/crypto.service';

describe('IngestionProcessor', () => {
  let processor: IngestionProcessor;
  let mockPrisma: any;
  let mockConnectorRegistry: any;
  let mockCryptoService: any;

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
      ],
    }).compile();

    processor = module.get<IngestionProcessor>(IngestionProcessor);
  });

  it('should be defined', () => {
    expect(processor).toBeDefined();
  });

  it('should process a job and update RawEvent status', async () => {
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
    expect(mockPrisma.auditLog.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        action: 'INGESTION',
        entityType: 'RawEvent',
        entityId: 'raw-123',
        hash: 'mocked-hash',
      }),
    });

    expect(mockPrisma.rawEvent.update).toHaveBeenCalledWith({
      where: { id: 'raw-123' },
      data: expect.objectContaining({ status: 'PROCESSED' }),
    });

    expect(result).toEqual(expect.objectContaining({
      success: true,
      rawEventId: 'raw-123',
    }));
  });

  it('should apply connector mapping if connector field is present', async () => {
    const mockConnector = {
      name: 'SAP_S4HANA',
      map: jest.fn().mockReturnValue({ externalId: 'SAP-123', mapped: true }),
    };
    mockConnectorRegistry.get.mockReturnValue(mockConnector);

    const mockJob = {
      id: '1',
      name: 'process-supplier-data',
      data: {
        rawEventId: 'raw-123',
        payload: { connector: 'SAP_S4HANA', MaterialNumber: 'SAP-123' },
      },
    } as Job;

    await processor.process(mockJob);

    expect(mockConnectorRegistry.get).toHaveBeenCalledWith('SAP_S4HANA');
    expect(mockConnector.map).toHaveBeenCalled();
  });

  it('should handle errors and update RawEvent to FAILED', async () => {
    mockPrisma.rawEvent.update.mockRejectedValueOnce(new Error('DB Error'));

    const mockJob = {
      id: '2',
      name: 'process-supplier-data',
      data: {
        rawEventId: 'raw-456',
        payload: { test: 'fail' },
      },
    } as Job;

    await expect(processor.process(mockJob)).rejects.toThrow();

    expect(mockPrisma.rawEvent.update).toHaveBeenCalledWith({
      where: { id: 'raw-456' },
      data: { status: 'FAILED' },
    });
  });
});
