import { Controller, Post, Body, HttpCode, HttpStatus, BadRequestException } from '@nestjs/common';
import { IngestionService } from './ingestion.service';

@Controller('api/ingest')
export class IngestionController {
  constructor(private readonly ingestionService: IngestionService) {}

  @Post('supplier-data')
  @HttpCode(HttpStatus.ACCEPTED)
  async ingestSupplierData(@Body() data: any) {
    try {
      return await this.ingestionService.ingestSupplierData(data);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
