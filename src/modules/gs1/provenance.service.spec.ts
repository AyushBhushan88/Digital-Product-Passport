import { Test, TestingModule } from '@nestjs/testing';
import { ProvenanceService } from './provenance.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('ProvenanceService', () => {
  let service: ProvenanceService;
  let mockPrisma: any;

  beforeEach(async () => {
    mockPrisma = {
      rawEvent: {
        findMany: jest.fn().mockResolvedValue([
          { id: 'raw-1', sector: 'FASHION', createdAt: new Date('2026-01-01'), status: 'PROCESSED' }
        ]),
      },
      auditLog: {
        findMany: jest.fn().mockResolvedValue([
          { id: 'log-1', hash: 'abc123hash', createdAt: new Date('2026-01-02'), actor: 'SYSTEM' }
        ]),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProvenanceService,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
      ],
    }).compile();

    service = module.get<ProvenanceService>(ProvenanceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should aggregate raw events and audit logs into a timeline', async () => {
    const timeline = await service.getTimeline('12345678901234', 'SN-999');

    expect(timeline).toHaveLength(2);
    expect(timeline[0].type).toBe('INGESTION');
    expect(timeline[1].type).toBe('AUDIT');
    expect(mockPrisma.rawEvent.findMany).toHaveBeenCalled();
    expect(mockPrisma.auditLog.findMany).toHaveBeenCalledWith(expect.objectContaining({
      where: { entityId: 'raw-1', entityType: 'RawEvent' }
    }));
  });
});
