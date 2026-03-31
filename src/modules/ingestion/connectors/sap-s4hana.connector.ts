import { Injectable } from '@nestjs/common';
import { BaseConnector } from './connector.registry';

@Injectable()
export class SapS4HanaConnector implements BaseConnector {
  readonly name = 'SAP_S4HANA';

  map(payload: any): any {
    // Example SAP S/4HANA mapping
    // External: { MaterialNumber: "ABC-123", CarbonFootprint_Amount: "5.2", UoM: "kgCO2e" }
    // Internal: { externalId: "ABC-123", carbonFootprint: 5.2, metadata: { uom: "kgCO2e" } }
    
    return {
      ...payload,
      externalId: payload.MaterialNumber || payload.externalId,
      carbonFootprint: payload.CarbonFootprint_Amount ? parseFloat(payload.CarbonFootprint_Amount) : payload.carbonFootprint,
      metadata: {
        ...(payload.metadata || {}),
        uom: payload.UoM,
        source: 'SAP_S4HANA',
      },
    };
  }
}
