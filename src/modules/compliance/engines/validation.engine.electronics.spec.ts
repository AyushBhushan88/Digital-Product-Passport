import { ValidationEngine } from './validation.engine';
import { Category } from '../../battery/battery.types';

describe('ValidationEngine (Electronics)', () => {
  let engine: ValidationEngine;

  beforeEach(() => {
    engine = new ValidationEngine();
  });

  const validElectronicsData = {
    '@context': 'https://schema.org',
    '@type': 'lp:ElectronicsPassport',
    manufacturer: 'TechCorp',
    serialNumber: 'SN-ELECT-123',
    modelNumber: 'TC-X100',
    bom: [
      { component: 'Battery', externalId: 'BAT-123' },
      { component: 'Motherboard', externalId: 'MB-456' },
    ],
    substanceCompliance: {
      rohs: true,
      reach: true,
    },
  };

  it('should validate complete electronics data', () => {
    const result = engine.validate(validElectronicsData, Category.ELECTRONICS);
    expect(result.success).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('should reject electronics data missing BOM', () => {
    const invalidData = { ...validElectronicsData };
    delete (invalidData as any).bom;

    const result = engine.validate(invalidData, Category.ELECTRONICS);
    expect(result.success).toBe(false);
    expect(result.errors).toContainEqual(
      expect.objectContaining({ field: 'bom' })
    );
  });

  it('should reject electronics data missing compliance data', () => {
    const invalidData = { ...validElectronicsData };
    delete (invalidData as any).substanceCompliance;

    const result = engine.validate(invalidData, Category.ELECTRONICS);
    expect(result.success).toBe(false);
    expect(result.errors).toContainEqual(
      expect.objectContaining({ field: 'substanceCompliance' })
    );
  });
});
