import { Controller, Post, Body, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { RouteOptimizationService } from './route-optimization.service';
import { OptimizeRoutesDto } from './dto/optimize-routes.dto';
import { Route } from './entities/route.entity';

@ApiTags('Route Optimization')
@Controller('api')
export class RouteOptimizationController {
  constructor(private readonly routeOptimizationService: RouteOptimizationService) {}

  @Post('optimize-routes')
  @ApiOperation({ summary: 'Optimize delivery routes' })
  @ApiResponse({
    status: 201,
    description: 'The route has been successfully optimized.',
    type: Route,
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async optimizeRoutes(@Body() optimizeRoutesDto: OptimizeRoutesDto) {
    return this.routeOptimizationService.optimizeRoutes(optimizeRoutesDto);
  }

  @Get('routes/:routeId')
  @ApiOperation({ summary: 'Get optimized route by ID' })
  @ApiResponse({
    status: 200,
    description: 'The route has been successfully retrieved.',
    type: Route,
  })
  @ApiResponse({ status: 404, description: 'Route not found.' })
  async getRoute(@Param('routeId') routeId: string) {
    return this.routeOptimizationService.getRoute(routeId);
  }
} 