export enum BatteryMaterial {
  COBALT = 'cobalt',
  LITHIUM = 'lithium',
  NICKEL = 'nickel',
  LEAD = 'lead',
}

export interface MaterialComposition {
  material: BatteryMaterial;
  weight: number; // in kg
  percentage: number;
}

export interface CarbonFootprint {
  totalCO2e: number; // kgCO2e
  carbonIntensity: number; // kgCO2e/kWh
  referencePeriod: {
    start: Date;
    end: Date;
  };
}

export interface BatteryPassport {
  '@context': (string | object)[];
  '@type': string;
  id: string; // Internal UUID
  externalId: string; // GS1 Digital Link or similar
  serialNumber: string;
  batchID: string;
  manufacturer: {
    name: string;
    address: string;
    identifier: string; // e.g., VAT or company ID
  };
  productionDate: Date;
  model: string;
  capacityAh: number;
  voltageV: number;
  carbonFootprint: CarbonFootprint;
  materialComposition: MaterialComposition[];
  stateOfHealth?: {
    currentSoH: number; // percentage
    updatedAt: Date;
  };
  metadata: Record<string, any>; // Flexible for other JSON-LD data
}
