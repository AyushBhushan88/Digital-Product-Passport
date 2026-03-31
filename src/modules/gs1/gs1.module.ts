import { Module, Global } from '@nestjs/common';
import { Gs1Service } from './gs1.service';
import { ResolverController } from './resolver.controller';

@Global()
@Module({
  providers: [Gs1Service],
  controllers: [ResolverController],
  exports: [Gs1Service],
})
export class Gs1Module {}
