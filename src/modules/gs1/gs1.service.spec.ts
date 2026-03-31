import { Test, TestingModule } from '@nestjs/testing';
import { Gs1Service } from './gs1.service';

describe('Gs1Service', () => {
  let service: Gs1Service;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Gs1Service],
    }).compile();

    service = module.get<Gs1Service>(Gs1Service);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should generate a valid GS1 Digital Link URI', () => {
    const gtin = '12345678901234';
    const serial = 'SN-123';
    const uri = service.generateDigitalLink(gtin, serial);

    expect(uri).toBe(`https://id.looppass.io/01/${gtin}/21/${serial}`);
  });

  it('should validate GTIN and Serial correctly', () => {
    expect(service.validateIdentifiers('12345678901234', 'ABC')).toBe(true);
    expect(service.validateIdentifiers('123', 'ABC')).toBe(false); // Invalid GTIN length
    expect(service.validateIdentifiers('12345678901234', 'SN-with-special-!@#')).toBe(false); // Invalid serial
  });
});
