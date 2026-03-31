import { CarbonEngine, CarbonInput } from './carbon.engine';
import { BadRequestException } from '@nestjs/common';

describe('CarbonEngine', () => {
  let engine: CarbonEngine;

  beforeEach(() => {
    engine = new CarbonEngine();
  });

  const sampleInput: CarbonInput = {
    materialComposition: [
      { material: 'lithium', weight: 10 },
      { material: 'cobalt', weight: 5 },
    ],
    productionEnergyKWh: 1000,
    gridEmissionFactor: 0.5,
    transportationCO2e: 50,
    chemistry: 'NCM',
  };

  it('should correctly calculate the total carbon footprint', () => {
    // materialFootprint = (10 * 15) + (5 * 25) = 150 + 125 = 275
    // productionFootprint = 1000 * 0.5 = 500
    // total = 275 + 500 + 50 = 825
    const result = engine.calculate(sampleInput);
    expect(result.totalCO2e).toBe(825);
  });

  it('should calculate carbon intensity if capacity is provided', () => {
    const capacityKWh = 50;
    const result = engine.calculate(sampleInput, capacityKWh);
    expect(result.carbonIntensity).toBe(825 / 50);
  });

  it('should throw error if material composition is missing', () => {
    const invalidInput = { ...sampleInput, materialComposition: [] };
    expect(() => engine.calculate(invalidInput)).toThrow(BadRequestException);
  });

  it('should throw error if production energy is invalid', () => {
    const invalidInput = { ...sampleInput, productionEnergyKWh: -10 };
    expect(() => engine.calculate(invalidInput)).toThrow(BadRequestException);
  });

  it('should use default emission factor for unknown materials', () => {
    const inputWithUnknown = {
      ...sampleInput,
      materialComposition: [{ material: 'unknown', weight: 10 }],
    };
    // unknown factor = 2.0 (default)
    // materialFootprint = 10 * 2 = 20
    // total = 20 + 500 + 50 = 570
    const result = engine.calculate(inputWithUnknown);
    expect(result.totalCO2e).toBe(570);
  });
});
