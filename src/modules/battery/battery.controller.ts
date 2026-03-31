import { Controller, Post, Body } from '@nestjs/common';
import { BatteryService } from './battery.service';

@Controller('api/battery')
export class BatteryController {
  constructor(private readonly batteryService: BatteryService) {}

  @Post('ingest')
  async ingest(@Body() data: any) {
    return this.batteryService.ingest(data);
  }
}
