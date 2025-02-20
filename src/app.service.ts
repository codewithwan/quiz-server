import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  checkHealth(): { status: string; timestamp: string } {
    return { status: 'Healthy', timestamp: new Date().toISOString() };
  }
} 
