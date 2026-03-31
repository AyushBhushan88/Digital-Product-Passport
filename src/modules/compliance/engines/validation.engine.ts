import { Injectable } from '@nestjs/common';
import { Category } from '../../battery/battery.types';

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationWarning {
  field: string;
  message: string;
}

export interface ValidationResult {
  success: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

@Injectable()
export class ValidationEngine {
  /**
   * Validates passport data according to the category.
   */
  validate(data: any, category: Category = Category.BATTERY): ValidationResult {
    switch (category) {
      case Category.FASHION:
        return this.validateFashion(data);
      case Category.ELECTRONICS:
        return this.validateElectronics(data);
      case Category.BATTERY:
      default:
        return this.validateBattery(data);
    }
  }

  private validateBattery(data: any): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    // Layer 3: Format & JSON-LD Basic Check
    this.checkJsonLd(data, errors);

    // Layer 1: Critical Regulatory Fields (Feb 2025)
    const criticalFields = ['manufacturer', 'serialNumber', 'chemistry'];
    for (const field of criticalFields) {
      if (!data[field]) {
        errors.push({ field, message: `Critical field '${field}' is missing` });
      }
    }

    // Layer 1: Data Type Validation
    if (data.carbonFootprint) {
      if (typeof data.carbonFootprint.totalCO2e !== 'number') {
        errors.push({
          field: 'carbonFootprint.totalCO2e',
          message: 'Carbon footprint totalCO2e must be a number',
        });
      }
    } else {
      errors.push({
        field: 'carbonFootprint',
        message: 'Critical field \'carbonFootprint\' is missing',
      });
    }

    // Layer 2: Non-Critical / Warnings
    if (!data.disassemblyInstructions) {
      warnings.push({
        field: 'disassemblyInstructions',
        message: 'Recommended field \'disassemblyInstructions\' is missing',
      });
    }

    return { success: errors.length === 0, errors, warnings };
  }

  private validateFashion(data: any): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    this.checkJsonLd(data, errors);

    const criticalFields = [
      'manufacturer',
      'serialNumber',
      'materialOrigin',
      'weavingOrigin',
      'dyeingOrigin',
      'assemblyOrigin',
    ];
    for (const field of criticalFields) {
      if (!data[field]) {
        errors.push({ field, message: `Fashion critical field '${field}' is missing` });
      }
    }

    if (!data.composition) {
      errors.push({ field: 'composition', message: 'Material composition is required for fashion' });
    }

    return { success: errors.length === 0, errors, warnings };
  }

  private validateElectronics(data: any): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    this.checkJsonLd(data, errors);

    const criticalFields = ['manufacturer', 'serialNumber', 'modelNumber', 'bom'];
    for (const field of criticalFields) {
      if (!data[field]) {
        errors.push({ field, message: `Electronics critical field '${field}' is missing` });
      }
    }

    if (!data.substanceCompliance) {
      errors.push({ field: 'substanceCompliance', message: 'RoHS/REACH compliance data is required' });
    }

    return { success: errors.length === 0, errors, warnings };
  }

  private checkJsonLd(data: any, errors: ValidationError[]) {
    if (!data['@context']) {
      errors.push({ field: '@context', message: 'Missing JSON-LD @context' });
    }
    if (!data['@type']) {
      errors.push({ field: '@type', message: 'Missing JSON-LD @type' });
    }
  }
}

