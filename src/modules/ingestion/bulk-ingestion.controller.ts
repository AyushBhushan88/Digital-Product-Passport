import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Body,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { BulkIngestionService } from './bulk-ingestion.service';

@Controller('api/ingest')
export class BulkIngestionController {
  constructor(private readonly bulkIngestionService: BulkIngestionService) {}

  @Post('bulk')
  @HttpCode(HttpStatus.ACCEPTED)
  @UseInterceptors(FileInterceptor('file'))
  async bulkIngest(
    @UploadedFile() file: Express.Multer.File,
    @Body('sector') sector?: string,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const { originalname, buffer } = file;

    try {
      if (originalname.endsWith('.csv')) {
        return await this.bulkIngestionService.processCsv(buffer, sector);
      } else if (originalname.endsWith('.json')) {
        return await this.bulkIngestionService.processJson(buffer, sector);
      } else {
        throw new BadRequestException('Unsupported file format. Use CSV or JSON.');
      }
    } catch (error) {
      throw new BadRequestException(`Bulk ingestion failed: ${error.message}`);
    }
  }
}
