import { Test, TestingModule } from '@nestjs/testing';
import { IngestionService } from './ingestion.service';
import { getQueueToken } from '@nestjs/bullmq';

describe('IngestionService', () => {
  let service: IngestionService;
  let mockQueue: any;

  beforeEach(async () => {
    mockQueue = {
      add: jest.fn().mockResolvedValue({ id: 'job-123' }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IngestionService,
        {
          provide: getQueueToken('ingestion'),
          useValue: mockQueue,
        },
      ],
    }).compile();

    service = module.get<IngestionService>(IngestionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should add a job to the queue when valid data is provided', async () => {
    const testData = { brand: 'H&M', items: [{ id: '1' }] };
    const result = await service.ingestSupplierData(testData);

    expect(mockQueue.add).toHaveBeenCalledWith(
      'process-supplier-data',
      expect.objectContaining({
        payload: testData,
        timestamp: expect.any(String),
      }),
    );
    expect(result).toEqual({
      status: 'Accepted',
      jobId: 'job-123',
    });
  });

  it('should throw an error when empty data is provided', async () => {
    await expect(service.ingestSupplierData({})).rejects.toThrow('Invalid supplier data payload');
  });
});
