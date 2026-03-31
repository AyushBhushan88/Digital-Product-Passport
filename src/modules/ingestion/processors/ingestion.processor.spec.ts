import { Test, TestingModule } from '@nestjs/testing';
import { IngestionProcessor } from './ingestion.processor';
import { Job } from 'bullmq';

describe('IngestionProcessor', () => {
  let processor: IngestionProcessor;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IngestionProcessor],
    }).compile();

    processor = module.get<IngestionProcessor>(IngestionProcessor);
  });

  it('should be defined', () => {
    expect(processor).toBeDefined();
  });

  it('should process a job successfully', async () => {
    const mockJob = {
      id: '1',
      name: 'process-supplier-data',
      data: {
        payload: { test: 'data' },
        timestamp: new Date().toISOString(),
      },
    } as Job;

    const result = await processor.process(mockJob);

    expect(result).toEqual(expect.objectContaining({
      success: true,
      processedAt: expect.any(String),
    }));
  });
});
