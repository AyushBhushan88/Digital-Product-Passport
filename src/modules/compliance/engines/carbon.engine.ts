import { Injectable, BadRequestException } from '@nestjs/common';

export interface CarbonInput {
  materialComposition: {
    material: string;
    weight: number; // in kg
  }[];
  productionEnergyKWh: number;
  gridEmissionFactor: number; // kgCO2e/kWh
  transportationCO2e: number; // kgCO2e
  chemistry: string;
}

export interface CarbonResult {
  totalCO2e: number;
  carbonIntensity: number; // kgCO2e/kWh (if applicable to capacity)
}

@Injectable()
export class CarbonEngine {
  // Emission factors (kgCO2e per kg of material) - Placeholders based on industry averages
  private readonly materialEmissionFactors: Record<string, number> = {
    cobalt: 25.0,
    lithium: 15.0,
    nickel: 18.0,
    lead: 2.5,
    graphite: 5.0,
    aluminum: 12.0,
    copper: 4.5,
  };

  /**
   * Calculates the carbon footprint of a battery based on the EU-mandated formula (D-03).
   * (material mass * material emission factor) + (production energy * grid emission factor) + transportation footprint.
   */
  calculate(input: CarbonInput, capacityKWh?: number): CarbonResult {
    this.validateInput(input);

    let materialFootprint = 0;
    for (const item of input.materialComposition) {
      const factor = this.materialEmissionFactors[item.material.toLowerCase()] || 2.0; // Default factor
      materialFootprint += item.weight * factor;
    }

    const productionFootprint = input.productionEnergyKWh * input.gridEmissionFactor;
    const totalCO2e = materialFootprint + productionFootprint + input.transportationCO2e;

    return {
      totalCO2e,
      carbonIntensity: capacityKWh ? totalCO2e / capacityKWh : 0,
    };
  }

  private validateInput(input: CarbonInput) {
    if (!input.materialComposition || input.materialComposition.length === 0) {
      throw new BadRequestException('Material composition is required for carbon calculation');
    }
    if (input.productionEnergyKWh <= 0) {
      throw new BadRequestException('Production energy must be greater than zero');
    }
  }

  /**
   * Placeholder for enhanced sustainability metrics (D-03).
   * Will include circularity scores, recyclability index, etc.
   */
  calculateEnhancedMetrics(input: any) {
    // TODO: Implement enhanced metrics for advanced manufacturers
    return {
      circularityScore: 0,
      recyclabilityIndex: 0,
    };
  }
}
