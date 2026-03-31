import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class CryptoService {
  hashPayload(payload: any): string {
    const data = typeof payload === 'string' ? payload : JSON.stringify(this.sortKeys(payload));
    return crypto.createHash('sha256').update(data).digest('hex');
  }

  // Ensure consistent hashing by sorting keys
  private sortKeys(obj: any): any {
    if (obj === null || typeof obj !== 'object') {
      return obj;
    }
    if (Array.isArray(obj)) {
      return obj.map((item) => this.sortKeys(item));
    }
    const sortedKeys = Object.keys(obj).sort();
    const sortedObj: any = {};
    for (const key of sortedKeys) {
      sortedObj[key] = this.sortKeys(obj[key]);
    }
    return sortedObj;
  }
}
