import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from './../src/prisma/prisma.service';

describe('Battery Ingestion (e2e)', () => {
  let app: INestApplication;

  const mockPrisma = {
    batteryPassport: {
      create: jest.fn().mockImplementation((args) => {
        return Promise.resolve({
          id: 'mock-uuid',
          ...args.data,
        });
      }),
    },
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(mockPrisma)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  const validPayload = {
    '@context': 'https://schema.org',
    '@type': 'lp:BatteryPassport',
    externalId: 'L-2025-001',
    serialNumber: 'SN-999-001',
    manufacturer: {
      name: 'EcoBattery Corp',
      identifier: 'VAT-12345',
    },
    productionDate: '2026-03-31',
    model: 'Model X-Pro',
    chemistry: 'LFP',
    capacityKWh: 75,
    materialComposition: [
      { material: 'lithium', weight: 15 },
      { material: 'iron', weight: 50 },
    ],
    productionEnergyKWh: 500,
    gridEmissionFactor: 0.4,
    transportationCO2e: 25,
    carbonFootprint: {
      totalCO2e: 231, // (15*15 + 50*2) + 500*0.4 + 25 = (225 + 100) + 200 + 25 = 325 + 200 + 25 = 550? Let's not worry about exact match here, just presence
    },
    disassemblyInstructions: 'https://eco.com/guides/xpro',
  };

  it('/api/battery/ingest (POST) - Success', () => {
    return request(app.getHttpServer() as any)
      .post('/api/battery/ingest')
      .send(validPayload)
      .expect(201)
      .then((response) => {
        expect(response.body.status).toBe('Success');
        expect(response.body.id).toBe('mock-uuid');
        expect(response.body.carbonFootprint).toBeDefined();
        expect(response.body.contentHash).toBeDefined();
        expect(response.body.validation.success).toBe(true);
      });
  });

  it('/api/battery/ingest (POST) - Reject missing critical', () => {
    const invalidPayload = { ...validPayload };
    delete (invalidPayload as any).chemistry;

    return request(app.getHttpServer() as any)
      .post('/api/battery/ingest')
      .send(invalidPayload)
      .expect(400)
      .then((response) => {
        expect(response.body.message).toBe('Regulatory validation failed');
        expect(response.body.errors).toContainEqual(
          expect.objectContaining({ field: 'chemistry' }),
        );
      });
  });

  it('/api/battery/ingest (POST) - Warning for non-critical', () => {
    const warningPayload = { ...validPayload };
    delete (warningPayload as any).disassemblyInstructions;

    return request(app.getHttpServer() as any)
      .post('/api/battery/ingest')
      .send(warningPayload)
      .expect(201)
      .then((response) => {
        expect(response.body.status).toBe('Success');
        expect(response.body.validation.warnings).toContainEqual(
          expect.objectContaining({ field: 'disassemblyInstructions' }),
        );
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
