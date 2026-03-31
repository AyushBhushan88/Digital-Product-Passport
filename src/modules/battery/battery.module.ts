import { Module } from '@nestjs/common';
import { BatteryController } from './battery.controller';
import { BatteryService } from './battery.service';
import { ComplianceModule } from '../compliance/compliance.module';

@Module({
  imports: [ComplianceModule],
  controllers: [BatteryController],
  providers: [BatteryService],
})
export class BatteryModule {}
