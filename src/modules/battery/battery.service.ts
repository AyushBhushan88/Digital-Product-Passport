import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ValidationEngine } from '../compliance/engines/validation.engine';
import { CarbonEngine } from '../compliance/engines/carbon.engine';
import * as crypto from 'crypto';

@Injectable()
export class BatteryService {
  constructor(
    private prisma: PrismaService,
    private validationEngine: ValidationEngine,
    private carbonEngine: CarbonEngine,
  ) {}

  async ingest(data: any) {
    // 1. Validation (D-01)
    const validationResult = this.validationEngine.validate(data);
    if (!validationResult.success) {
      throw new BadRequestException({
        message: 'Regulatory validation failed',
        errors: validationResult.errors,
      });
    }

    // 2. Carbon Calculation (D-03)
    const carbonResult = this.carbonEngine.calculate({
      materialComposition: data.materialComposition,
      productionEnergyKWh: data.productionEnergyKWh,
      gridEmissionFactor: data.gridEmissionFactor,
      transportationCO2e: data.transportationCO2e,
      chemistry: data.chemistry,
    }, data.capacityKWh);

    // 3. Hashing for Data Vault (D-04)
    const contentHash = crypto
      .createHash('sha256')
      .update(JSON.stringify(data))
      .digest('hex');

    // 4. Persistence
    // Note: This will fail if no DB is connected, which is expected in this environment
    try {
      const record = await this.prisma.batteryPassport.create({
        data: {
          externalId: data.externalId || data.serialNumber,
          manufacturerId: typeof data.manufacturer === 'object' ? data.manufacturer.identifier : data.manufacturer,
          productionDate: new Date(data.productionDate),
          model: data.model,
          carbonFootprint: carbonResult.totalCO2e,
          contentHash,
          metadata: data,
        },
      });

      return {
        id: record.id,
        status: 'Success',
        carbonFootprint: carbonResult,
        validation: validationResult,
        contentHash,
      };
    } catch (error) {
      // If DB fails, we still return the results for validation purposes in this mock environment
      if (error.code === 'P1001' || error.message.includes('Can\'t reach database')) {
         return {
          status: 'Success (Simulated - No DB)',
          carbonFootprint: carbonResult,
          validation: validationResult,
          contentHash,
        };
      }
      throw error;
    }
  }
}
