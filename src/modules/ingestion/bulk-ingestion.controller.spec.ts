import { Test, TestingModule } from '@nestjs/testing';
import { BulkIngestionController } from './bulk-ingestion.controller';
import { BulkIngestionService } from './bulk-ingestion.service';
import { BadRequestException } from '@nestjs/common';

describe('BulkIngestionController', () => {
  let controller: BulkIngestionController;
  let mockBulkService: any;

  beforeEach(async () => {
    mockBulkService = {
      processCsv: jest.fn().mockResolvedValue({ total: 10 }),
      processJson: jest.fn().mockResolvedValue({ total: 5 }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [BulkIngestionController],
      providers: [
        {
          provide: BulkIngestionService,
          useValue: mockBulkService,
        },
      ],
    }).compile();

    controller = module.get<BulkIngestionController>(BulkIngestionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call processCsv when a CSV file is uploaded', async () => {
    const mockFile = {
      originalname: 'test.csv',
      buffer: Buffer.from('test,csv'),
    } as Express.Multer.File;

    const result = await controller.bulkIngest(mockFile, 'FASHION');

    expect(mockBulkService.processCsv).toHaveBeenCalledWith(mockFile.buffer, 'FASHION');
    expect(result).toEqual({ total: 10 });
  });

  it('should call processJson when a JSON file is uploaded', async () => {
    const mockFile = {
      originalname: 'test.json',
      buffer: Buffer.from('{"test":"json"}'),
    } as Express.Multer.File;

    const result = await controller.bulkIngest(mockFile, 'ELECTRONICS');

    expect(mockBulkService.processJson).toHaveBeenCalledWith(mockFile.buffer, 'ELECTRONICS');
    expect(result).toEqual({ total: 5 });
  });

  it('should throw BadRequestException if no file is uploaded', async () => {
    await expect(controller.bulkIngest(null as any)).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException for unsupported file format', async () => {
    const mockFile = {
      originalname: 'test.txt',
      buffer: Buffer.from('test'),
    } as Express.Multer.File;

    await expect(controller.bulkIngest(mockFile)).rejects.toThrow('Unsupported file format. Use CSV or JSON.');
  });
});
