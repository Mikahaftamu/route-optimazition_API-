import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';

class RouteAnalyticsResponse {
  total_routes: number;
  total_distance: number;
  average_route_time: string;
  delivery_success_rate: number;
  total_deliveries: number;
  on_time_deliveries: number;
  delayed_deliveries: number;
  failed_deliveries: number;
  fuel_savings: number;
  co2_savings: number;
}

@ApiTags('Analytics')
@Controller('api/analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get()
  @ApiOperation({ summary: 'Get route analytics' })
  @ApiQuery({
    name: 'start_date',
    required: true,
    description: 'Start date for analytics (YYYY-MM-DD)',
  })
  @ApiQuery({
    name: 'end_date',
    required: true,
    description: 'End date for analytics (YYYY-MM-DD)',
  })
  @ApiResponse({
    status: 200,
    description: 'The analytics have been successfully retrieved.',
    type: RouteAnalyticsResponse,
  })
  async getRouteAnalytics(
    @Query('start_date') startDate: string,
    @Query('end_date') endDate: string,
  ) {
    return this.analyticsService.getRouteAnalytics(
      new Date(startDate),
      new Date(endDate),
    );
  }
} 