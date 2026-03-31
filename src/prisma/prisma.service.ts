import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    super({});
  }

  async onModuleInit() {
    try {
      await this.$connect();
    } catch (error) {
      // Gracefully handle connection failures in environments without a DB
      console.warn('Prisma failed to connect to the database. Continuing without DB.');
    }
  }
}
