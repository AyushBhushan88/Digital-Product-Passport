import { Injectable, Logger } from '@nestjs/common';
import { IngestionService } from './ingestion.service';
import { parse } from 'csv-parse';
import { Readable } from 'stream';

@Injectable()
export class BulkIngestionService {
  private readonly logger = new Logger(BulkIngestionService.name);

  constructor(private ingestionService: IngestionService) {}

  async processCsv(buffer: Buffer, sector?: string): Promise<{ total: number }> {
    return new Promise((resolve, reject) => {
      let count = 0;
      const parser = parse({
        columns: true,
        skip_empty_lines: true,
        trim: true,
      });

      const readable = new Readable();
      readable.push(buffer);
      readable.push(null);

      readable
        .pipe(parser)
        .on('data', async (row) => {
          count++;
          try {
            // Forward each row to the existing ingestion logic
            await this.ingestionService.ingestSupplierData({
              ...row,
              sector: sector || row.sector,
            });
          } catch (error) {
            this.logger.error(`Failed to ingest bulk row ${count}: ${error.message}`);
          }
        })
        .on('end', () => {
          this.logger.log(`Bulk CSV processing completed: ${count} items queued.`);
          resolve({ total: count });
        })
        .on('error', (err) => {
          this.logger.error(`CSV parsing error: ${err.message}`);
          reject(err);
        });
    });
  }

  async processJson(buffer: Buffer, sector?: string): Promise<{ total: number }> {
    try {
      const data = JSON.parse(buffer.toString());
      const items = Array.isArray(data) ? data : [data];
      let count = 0;

      for (const item of items) {
        count++;
        await this.ingestionService.ingestSupplierData({
          ...item,
          sector: sector || item.sector,
        });
      }

      this.logger.log(`Bulk JSON processing completed: ${count} items queued.`);
      return { total: count };
    } catch (error) {
      this.logger.error(`JSON parsing error: ${error.message}`);
      throw error;
    }
  }
}
