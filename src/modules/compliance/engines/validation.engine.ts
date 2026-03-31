import { Injectable } from '@nestjs/common';

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
   * Validates battery passport data according to D-01 layered approach.
   * Layer 1 (Critical): Mandatory for Feb 2025 compliance.
   * Layer 2 (Review): Recommended but not immediately blocking.
   * Layer 3 (Format): Basic JSON-LD structure check.
   */
  validate(data: any): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    // Layer 3: Format & JSON-LD Basic Check
    if (!data['@context']) {
      errors.push({ field: '@context', message: 'Missing JSON-LD @context' });
    }
    if (!data['@type']) {
      errors.push({ field: '@type', message: 'Missing JSON-LD @type' });
    }

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

    return {
      success: errors.length === 0,
      errors,
      warnings,
    };
  }
}
