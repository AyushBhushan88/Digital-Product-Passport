import { Test, TestingModule } from '@nestjs/testing';
import { BulkIngestionService } from './bulk-ingestion.service';
import { IngestionService } from './ingestion.service';

describe('BulkIngestionService', () => {
  let service: BulkIngestionService;
  let mockIngestionService: any;

  beforeEach(async () => {
    mockIngestionService = {
      ingestSupplierData: jest.fn().mockResolvedValue({ status: 'Accepted' }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BulkIngestionService,
        {
          provide: IngestionService,
          useValue: mockIngestionService,
        },
      ],
    }).compile();

    service = module.get<BulkIngestionService>(BulkIngestionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should process a CSV buffer and call IngestionService for each row', async () => {
    const csvContent = 'brand,sector\nH&M,FASHION\nZara,FASHION';
    const buffer = Buffer.from(csvContent);

    const result = await service.processCsv(buffer);

    expect(result.total).toBe(2);
    expect(mockIngestionService.ingestSupplierData).toHaveBeenCalledTimes(2);
    expect(mockIngestionService.ingestSupplierData).toHaveBeenCalledWith(
      expect.objectContaining({ brand: 'H&M', sector: 'FASHION' })
    );
  });

  it('should process a JSON buffer and call IngestionService for each item', async () => {
    const jsonContent = JSON.stringify([
      { brand: 'Samsung', sector: 'ELECTRONICS' },
      { brand: 'Apple', sector: 'ELECTRONICS' }
    ]);
    const buffer = Buffer.from(jsonContent);

    const result = await service.processJson(buffer);

    expect(result.total).toBe(2);
    expect(mockIngestionService.ingestSupplierData).toHaveBeenCalledTimes(2);
  });
});
