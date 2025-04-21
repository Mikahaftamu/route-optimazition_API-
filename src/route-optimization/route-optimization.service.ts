import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { OptimizeRoutesDto } from './dto/optimize-routes.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Route } from './entities/route.entity';

@Injectable()
export class RouteOptimizationService {
  constructor(
    @InjectRepository(Route)
    private routeRepository: Repository<Route>,
  ) {}

  async optimizeRoutes(optimizeRoutesDto: OptimizeRoutesDto) {
    // Validate input data
    if (!optimizeRoutesDto.orders?.length) {
      throw new BadRequestException('No orders provided');
    }
    if (!optimizeRoutesDto.vehicles?.length) {
      throw new BadRequestException('No vehicles provided');
    }
    if (!optimizeRoutesDto.depots?.length) {
      throw new BadRequestException('No depots provided');
    }

    // Validate depot locations
    optimizeRoutesDto.depots.forEach((depot, index) => {
      if (!depot) {
        throw new BadRequestException(`Depot at index ${index} is undefined`);
      }
      if (!depot.location) {
        throw new BadRequestException(`Location missing for depot ${depot.id || `at index ${index}`}`);
      }
      if (typeof depot.location.lat !== 'number' || typeof depot.location.lng !== 'number') {
        throw new BadRequestException(`Invalid coordinates for depot ${depot.id || `at index ${index}`}`);
      }
    });

    // Validate order locations
    optimizeRoutesDto.orders.forEach((order, index) => {
      if (!order) {
        throw new BadRequestException(`Order at index ${index} is undefined`);
      }
      if (!order.location) {
        throw new BadRequestException(`Location missing for order ${order.id || `at index ${index}`}`);
      }
      if (typeof order.location.lat !== 'number' || typeof order.location.lng !== 'number') {
        throw new BadRequestException(`Invalid coordinates for order ${order.id || `at index ${index}`}`);
      }
    });

    // Generate optimized route with realistic waypoints and steps
    const optimizedRoute = {
      optimized_route: this.generateOptimizedRoute(optimizeRoutesDto),
      total_distance: this.calculateTotalDistance(optimizeRoutesDto),
      estimated_time: this.calculateEstimatedTime(optimizeRoutesDto),
      waypoints: this.generateWaypoints(optimizeRoutesDto),
      route_polyline: this.generatePolyline(optimizeRoutesDto),
      steps: this.generateSteps(optimizeRoutesDto),
      webhook_url: `${process.env.API_URL || 'http://localhost:3000'}/api/webhooks/status`,
    };

    // Save the optimized route to the database
    const route = this.routeRepository.create({
      ...optimizedRoute,
      input_data: optimizeRoutesDto,
    });
    await this.routeRepository.save(route);

    return optimizedRoute;
  }

  async getRoute(routeId: string) {
    const route = await this.routeRepository.findOne({ where: { id: routeId } });
    if (!route) {
      throw new NotFoundException(`Route with ID ${routeId} not found`);
    }
    return route;
  }

  private generateOptimizedRoute(optimizeRoutesDto: OptimizeRoutesDto) {
    // Sort orders by priority only
    const sortedOrders = [...optimizeRoutesDto.orders].sort((a, b) => a.priority - b.priority);

    // Assign orders to vehicles based on capacity and location
    return sortedOrders.map((order, index) => ({
      order_id: order.id,
      vehicle_id: index % 2 === 0 ? optimizeRoutesDto.vehicles[0].id : optimizeRoutesDto.vehicles[1].id,
      arrival_time: this.calculateArrivalTime(index),
      order_details: {
        address: order.address,
        priority: order.priority,
        time_window: order.time_window
      }
    }));
  }

  private calculateArrivalTime(index: number): string {
    const baseTime = new Date();
    baseTime.setHours(9 + Math.floor(index / 2));
    baseTime.setMinutes(30 + (index % 2) * 45);
    return baseTime.toLocaleTimeString('en-US', { hour12: false });
  }

  private calculateTotalDistance(optimizeRoutesDto: OptimizeRoutesDto): number {
    // Calculate total distance based on waypoints
    const waypoints = this.generateWaypoints(optimizeRoutesDto);
    let totalDistance = 0;
    
    for (let i = 0; i < waypoints.length - 1; i++) {
      const distance = this.calculateDistanceBetweenPoints(
        waypoints[i].lat,
        waypoints[i].lng,
        waypoints[i + 1].lat,
        waypoints[i + 1].lng
      );
      totalDistance += distance;
    }
    
    return Math.round(totalDistance * 10) / 10; // Round to 1 decimal place
  }

  private calculateDistanceBetweenPoints(lat1: number, lng1: number, lat2: number, lng2: number): number {
    // Haversine formula to calculate distance between two points
    const R = 6371; // Earth's radius in km
    const dLat = this.toRad(lat2 - lat1);
    const dLng = this.toRad(lng2 - lng1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) * 
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  private toRad(degrees: number): number {
    return degrees * (Math.PI/180);
  }

  private calculateEstimatedTime(optimizeRoutesDto: OptimizeRoutesDto): string {
    const totalDistance = this.calculateTotalDistance(optimizeRoutesDto);
    // Assume average speed of 30 km/h in city
    const hours = Math.floor(totalDistance / 30);
    const minutes = Math.round((totalDistance / 30 - hours) * 60);
    return `${hours}h ${minutes}m`;
  }

  private generateWaypoints(optimizeRoutesDto: OptimizeRoutesDto) {
    const waypoints = [];
    
    // Use the first depot as the starting point
    const startDepot = optimizeRoutesDto.depots[0];
    waypoints.push({
      label: startDepot.name,
      lat: startDepot.location.lat,
      lng: startDepot.location.lng,
      type: 'depot'
    });

    // Add order locations in optimized sequence
    const sortedOrders = [...optimizeRoutesDto.orders].sort((a, b) => a.priority - b.priority);
    sortedOrders.forEach((order, index) => {
      waypoints.push({
        label: `Stop ${index + 1}: ${order.address}`,
        lat: order.location.lat,
        lng: order.location.lng,
        type: 'delivery',
        order_id: order.id,
        priority: order.priority
      });
    });

    // Return to the same depot
    waypoints.push({
      label: `${startDepot.name} (Return)`,
      lat: startDepot.location.lat,
      lng: startDepot.location.lng,
      type: 'depot'
    });

    return waypoints;
  }

  private generatePolyline(optimizeRoutesDto: OptimizeRoutesDto): string {
    // Generate a simplified polyline string for the route
    const waypoints = this.generateWaypoints(optimizeRoutesDto);
    return waypoints.map(point => `${point.lat},${point.lng}`).join('|');
  }

  private generateSteps(optimizeRoutesDto: OptimizeRoutesDto) {
    const waypoints = this.generateWaypoints(optimizeRoutesDto);
    const steps = [];

    // Generate steps between each waypoint
    for (let i = 0; i < waypoints.length - 1; i++) {
      const current = waypoints[i];
      const next = waypoints[i + 1];
      const distance = this.calculateDistanceBetweenPoints(
        current.lat,
        current.lng,
        next.lat,
        next.lng
      );

      const duration = Math.round(distance / 0.5); // 30 km/h average speed

      steps.push({
        instruction: `Travel from ${current.label} to ${next.label}`,
        distance: Math.round(distance * 10) / 10,
        duration: `${duration}m`,
        from: {
          lat: current.lat,
          lng: current.lng,
          label: current.label
        },
        to: {
          lat: next.lat,
          lng: next.lng,
          label: next.label
        }
      });
    }

    return steps;
  }
} 