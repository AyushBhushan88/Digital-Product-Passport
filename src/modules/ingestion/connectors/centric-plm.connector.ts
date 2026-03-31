import { Injectable } from '@nestjs/common';
import { BaseConnector } from './connector.registry';

@Injectable()
export class CentricPlmConnector implements BaseConnector {
  readonly name = 'CENTRIC_PLM';

  map(payload: any): any {
    // Example Centric PLM mapping
    // External: { StyleCode: "FSH-789", Composition_Percentage: "100%", Material: "Cotton" }
    // Internal: { externalId: "FSH-789", metadata: { material: "Cotton", composition: "100%" } }

    return {
      ...payload,
      externalId: payload.StyleCode || payload.externalId,
      sector: 'FASHION',
      metadata: {
        ...(payload.metadata || {}),
        material: payload.Material,
        composition: payload.Composition_Percentage,
        source: 'CENTRIC_PLM',
      },
    };
  }
}
