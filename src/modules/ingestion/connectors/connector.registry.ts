import { Injectable, Logger } from '@nestjs/common';

export interface BaseConnector {
  name: string;
  map(payload: any): any;
}

@Injectable()
export class ConnectorRegistry {
  private readonly logger = new Logger(ConnectorRegistry.name);
  private connectors = new Map<string, BaseConnector>();

  register(connector: BaseConnector) {
    this.logger.log(`Registering connector: ${connector.name}`);
    this.connectors.set(connector.name, connector);
  }

  get(name: string): BaseConnector | undefined {
    return this.connectors.get(name);
  }
}
