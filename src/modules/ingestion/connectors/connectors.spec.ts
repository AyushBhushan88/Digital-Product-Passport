import { Test, TestingModule } from '@nestjs/testing';
import { ConnectorRegistry } from './connector.registry';
import { SapS4HanaConnector } from './sap-s4hana.connector';

describe('Connectors', () => {
  let registry: ConnectorRegistry;
  let sapConnector: SapS4HanaConnector;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConnectorRegistry, SapS4HanaConnector],
    }).compile();

    registry = module.get<ConnectorRegistry>(ConnectorRegistry);
    sapConnector = module.get<SapS4HanaConnector>(SapS4HanaConnector);
    registry.register(sapConnector);
  });

  it('should register and retrieve connectors', () => {
    const retrieved = registry.get('SAP_S4HANA');
    expect(retrieved).toBeDefined();
    expect(retrieved?.name).toBe('SAP_S4HANA');
  });

  it('should map SAP S/4HANA fields correctly', () => {
    const sapPayload = {
      MaterialNumber: 'SAP-999',
      CarbonFootprint_Amount: '12.5',
      UoM: 'kgCO2e',
    };

    const mapped = sapConnector.map(sapPayload);

    expect(mapped.externalId).toBe('SAP-999');
    expect(mapped.carbonFootprint).toBe(12.5);
    expect(mapped.metadata.uom).toBe('kgCO2e');
    expect(mapped.metadata.source).toBe('SAP_S4HANA');
  });
});
