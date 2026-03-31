import { ValidationEngine } from './validation.engine';
import { Category } from '../../battery/battery.types';

describe('ValidationEngine (Fashion)', () => {
  let engine: ValidationEngine;

  beforeEach(() => {
    engine = new ValidationEngine();
  });

  const validFashionData = {
    '@context': 'https://schema.org',
    '@type': 'lp:FashionPassport',
    manufacturer: 'EcoWear',
    serialNumber: 'SN-FASH-001',
    materialOrigin: 'India',
    weavingOrigin: 'Turkey',
    dyeingOrigin: 'Italy',
    assemblyOrigin: 'Portugal',
    composition: [{ material: 'Organic Cotton', percentage: 100 }],
  };

  it('should validate complete fashion data', () => {
    const result = engine.validate(validFashionData, Category.FASHION);
    expect(result.success).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('should reject fashion data missing tier origins', () => {
    const invalidData = { ...validFashionData };
    delete (invalidData as any).weavingOrigin;

    const result = engine.validate(invalidData, Category.FASHION);
    expect(result.success).toBe(false);
    expect(result.errors).toContainEqual(
      expect.objectContaining({ field: 'weavingOrigin' })
    );
  });

  it('should reject fashion data missing composition', () => {
    const invalidData = { ...validFashionData };
    delete (invalidData as any).composition;

    const result = engine.validate(invalidData, Category.FASHION);
    expect(result.success).toBe(false);
    expect(result.errors).toContainEqual(
      expect.objectContaining({ field: 'composition' })
    );
  });
});
