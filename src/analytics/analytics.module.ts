import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import { Route } from '../route-optimization/entities/route.entity';
import { DeliveryStatus } from '../webhooks/entities/delivery-status.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Route, DeliveryStatus])],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
  exports: [AnalyticsService],
})
export class AnalyticsModule {} 