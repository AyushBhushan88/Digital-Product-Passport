import { Test, TestingModule } from '@nestjs/testing';
import { IngestionService } from './ingestion.service';
import { getQueueToken } from '@nestjs/bullmq';
import { PrismaService } from '../../prisma/prisma.service';

describe('IngestionService', () => {
  let service: IngestionService;
  let mockQueue: any;
  let mockPrisma: any;

  beforeEach(async () => {
    mockQueue = {
      add: jest.fn().mockResolvedValue({ id: 'job-123' }),
    };

    mockPrisma = {
      rawEvent: {
        create: jest.fn().mockResolvedValue({ id: 'raw-123', status: 'PENDING' }),
        update: jest.fn().mockResolvedValue({ id: 'raw-123', status: 'PENDING', jobId: 'job-123' }),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IngestionService,
        {
          provide: getQueueToken('ingestion'),
          useValue: mockQueue,
        },
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
      ],
    }).compile();

    service = module.get<IngestionService>(IngestionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should persist raw event and add job to queue', async () => {
    const testData = { sector: 'FASHION', brand: 'H&M', items: [{ id: '1' }] };
    const result = await service.ingestSupplierData(testData);

    expect(mockPrisma.rawEvent.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        type: 'SUPPLIER_DATA',
        sector: 'FASHION',
        payload: testData,
        status: 'PENDING',
      }),
    });

    expect(mockQueue.add).toHaveBeenCalledWith(
      'process-supplier-data',
      expect.objectContaining({
        rawEventId: 'raw-123',
        payload: testData,
      }),
    );

    expect(mockPrisma.rawEvent.update).toHaveBeenCalledWith({
      where: { id: 'raw-123' },
      data: { jobId: 'job-123' },
    });

    expect(result).toEqual({
      status: 'Accepted',
      jobId: 'job-123',
      rawEventId: 'raw-123',
    });
  });

  it('should throw an error when empty data is provided', async () => {
    await expect(service.ingestSupplierData({})).rejects.toThrow('Invalid supplier data payload');
  });
});
