import { Test, TestingModule } from '@nestjs/testing';
import { CryptoService } from './crypto.service';

describe('CryptoService', () => {
  let service: CryptoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CryptoService],
    }).compile();

    service = module.get<CryptoService>(CryptoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should generate consistent SHA-256 hashes for the same payload', () => {
    const payload = { b: 2, a: 1 };
    const payload2 = { a: 1, b: 2 };

    const hash1 = service.hashPayload(payload);
    const hash2 = service.hashPayload(payload2);

    expect(hash1).toBe(hash2);
    expect(hash1).toHaveLength(64); // SHA-256 hex length
  });

  it('should generate different hashes for different payloads', () => {
    const hash1 = service.hashPayload({ a: 1 });
    const hash2 = service.hashPayload({ a: 2 });

    expect(hash1).not.toBe(hash2);
  });
});
