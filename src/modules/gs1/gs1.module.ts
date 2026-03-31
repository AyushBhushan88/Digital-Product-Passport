import { Module, Global } from '@nestjs/common';
import { Gs1Service } from './gs1.service';
import { ResolverController } from './resolver.controller';
import { PassportController } from './passport.controller';
import { ProvenanceService } from './provenance.service';

@Global()
@Module({
  providers: [Gs1Service, ProvenanceService],
  controllers: [ResolverController, PassportController],
  exports: [Gs1Service, ProvenanceService],
})
export class Gs1Module {}
