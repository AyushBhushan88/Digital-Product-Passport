import { ValidationEngine } from './validation.engine';

describe('ValidationEngine', () => {
  let engine: ValidationEngine;

  beforeEach(() => {
    engine = new ValidationEngine();
  });

  const validData = {
    '@context': 'https://schema.org',
    '@type': 'lp:BatteryPassport',
    manufacturer: 'Test Mfg',
    serialNumber: 'SN123456',
    chemistry: 'LFP',
    carbonFootprint: {
      totalCO2e: 100.5,
    },
    disassemblyInstructions: 'http://example.com/disassembly',
  };

  it('should return success: true for valid data', () => {
    const result = engine.validate(validData);
    expect(result.success).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('should reject missing critical fields', () => {
    const invalidData = { ...validData };
    delete (invalidData as any).serialNumber;
    
    const result = engine.validate(invalidData);
    expect(result.success).toBe(false);
    expect(result.errors).toContainEqual(
      expect.objectContaining({ field: 'serialNumber' })
    );
  });

  it('should reject missing JSON-LD context', () => {
    const invalidData = { ...validData };
    delete (invalidData as any)['@context'];
    
    const result = engine.validate(invalidData);
    expect(result.success).toBe(false);
    expect(result.errors).toContainEqual(
      expect.objectContaining({ field: '@context' })
    );
  });

  it('should reject invalid data types for carbon footprint', () => {
    const invalidData = {
      ...validData,
      carbonFootprint: { totalCO2e: 'invalid' },
    };
    
    const result = engine.validate(invalidData);
    expect(result.success).toBe(false);
    expect(result.errors).toContainEqual(
      expect.objectContaining({ field: 'carbonFootprint.totalCO2e' })
    );
  });

  it('should return warnings for missing non-critical fields', () => {
    const dataWithMissingNonCritical = { ...validData };
    delete (dataWithMissingNonCritical as any).disassemblyInstructions;
    
    const result = engine.validate(dataWithMissingNonCritical);
    expect(result.success).toBe(true);
    expect(result.errors).toHaveLength(0);
    expect(result.warnings).toContainEqual(
      expect.objectContaining({ field: 'disassemblyInstructions' })
    );
  });
});
