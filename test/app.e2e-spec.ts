import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from './../src/prisma/prisma.service';
import { getQueueToken } from '@nestjs/bullmq';

describe('LoopPass E2E', () => {
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

  const mockQueue = {
    add: jest.fn().mockImplementation(() => {
      return Promise.resolve({ id: 'mock-job-id' });
    }),
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(mockPrisma)
      .overrideProvider(getQueueToken('ingestion'))
      .useValue(mockQueue)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('Battery Ingestion', () => {
    const validBatteryPayload = {
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
        totalCO2e: 231,
      },
      disassemblyInstructions: 'https://eco.com/guides/xpro',
    };

    it('/api/battery/ingest (POST) - Success', () => {
      return request(app.getHttpServer() as any)
        .post('/api/battery/ingest')
        .send(validBatteryPayload)
        .expect(201)
        .then((response) => {
          expect(response.body.status).toBe('Success');
          expect(response.body.id).toBe('mock-uuid');
        });
    });
  });

  describe('Async Supplier Ingestion (Phase 2)', () => {
    it('/api/ingest/supplier-data (POST) - Success (202 Accepted)', () => {
      const supplierData = {
        brand: 'FastFashionCo',
        batchId: 'BATCH-001',
        materials: [
          { name: 'Organic Cotton', origin: 'India', weight: 1000 },
        ],
      };

      return request(app.getHttpServer() as any)
        .post('/api/ingest/supplier-data')
        .send(supplierData)
        .expect(202)
        .then((response) => {
          expect(response.body.status).toBe('Accepted');
          expect(response.body.jobId).toBe('mock-job-id');
          expect(mockQueue.add).toHaveBeenCalled();
        });
    });

    it('/api/ingest/supplier-data (POST) - Reject empty payload', () => {
      return request(app.getHttpServer() as any)
        .post('/api/ingest/supplier-data')
        .send({})
        .expect(400);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
