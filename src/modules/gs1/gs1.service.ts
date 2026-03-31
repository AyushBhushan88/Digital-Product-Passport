import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class Gs1Service {
  private readonly logger = new Logger(Gs1Service.name);
  private readonly baseUrl = 'https://id.looppass.io';

  generateDigitalLink(gtin: string, serial: string): string {
    if (!this.validateIdentifiers(gtin, serial)) {
      throw new Error('Invalid GS1 identifiers');
    }
    return `${this.baseUrl}/01/${gtin}/21/${serial}`;
  }

  validateIdentifiers(gtin: string, serial: string): boolean {
    // Basic GS1 validation: GTIN should be 14 numeric digits (padded if needed)
    // Serial number should be alphanumeric and up to 20 chars (common SNs use - and _)
    const gtinRegex = /^\d{14}$/;
    const serialRegex = /^[a-zA-Z0-9\-_]{1,20}$/;

    return gtinRegex.test(gtin) && serialRegex.test(serial);
  }
}
