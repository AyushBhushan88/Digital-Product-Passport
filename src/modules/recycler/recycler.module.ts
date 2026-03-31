import { Module } from '@nestjs/common';
import { RecyclerController } from './recycler.controller';
import { BlockchainModule } from '../blockchain/blockchain.module';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [BlockchainModule, PrismaModule],
  controllers: [RecyclerController],
})
export class RecyclerModule {}
