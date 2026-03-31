import { Module } from '@nestjs/common';
import { ValidationEngine } from './engines/validation.engine';
import { CarbonEngine } from './engines/carbon.engine';

@Module({
  providers: [ValidationEngine, CarbonEngine],
  exports: [ValidationEngine, CarbonEngine],
})
export class ComplianceModule {}
