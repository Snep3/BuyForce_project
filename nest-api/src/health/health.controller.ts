import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common';
import { HealthService } from './health.service';
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  async check() {
    try {
      return await this.healthService.checkHealth();
    } catch (err) {
      throw new HttpException(
        {
          status: 'ERROR',
          message: err.message,
          timestamp: new Date().toISOString(),
        },
        HttpStatus.SERVICE_UNAVAILABLE, // 503
      );
    }
  }
}
