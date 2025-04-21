import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Route } from '../route-optimization/entities/route.entity';
import { DeliveryStatus, DeliveryStatusEnum } from '../webhooks/entities/delivery-status.entity';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(Route)
    private routeRepository: Repository<Route>,
    @InjectRepository(DeliveryStatus)
    private deliveryStatusRepository: Repository<DeliveryStatus>,
  ) {}

  async getRouteAnalytics(startDate: Date, endDate: Date) {
    const routes = await this.routeRepository.find({
      where: {
        created_at: Between(startDate, endDate),
      },
    });

    const deliveryStatuses = await this.deliveryStatusRepository.find({
      where: {
        created_at: Between(startDate, endDate),
      },
    });

    const analytics = {
      total_routes: routes.length,
      total_distance: routes.reduce((sum, route) => sum + route.total_distance, 0),
      average_route_time: this.calculateAverageRouteTime(routes),
      delivery_success_rate: this.calculateDeliverySuccessRate(deliveryStatuses),
      total_deliveries: deliveryStatuses.length,
      on_time_deliveries: this.countOnTimeDeliveries(deliveryStatuses),
      delayed_deliveries: this.countDelayedDeliveries(deliveryStatuses),
      failed_deliveries: this.countFailedDeliveries(deliveryStatuses),
      fuel_savings: this.calculateFuelSavings(routes),
      co2_savings: this.calculateCO2Savings(routes),
    };

    return analytics;
  }

  private calculateAverageRouteTime(routes: Route[]): string {
    if (routes.length === 0) return '0h 0m';
    
    const totalMinutes = routes.reduce((sum, route) => {
      const [hours, minutes] = route.estimated_time.split('h ');
      return sum + (parseInt(hours) * 60 + parseInt(minutes));
    }, 0);

    const averageMinutes = totalMinutes / routes.length;
    const hours = Math.floor(averageMinutes / 60);
    const minutes = Math.round(averageMinutes % 60);

    return `${hours}h ${minutes}m`;
  }

  private calculateDeliverySuccessRate(deliveryStatuses: DeliveryStatus[]): number {
    if (deliveryStatuses.length === 0) return 0;
    
    const successfulDeliveries = deliveryStatuses.filter(
      status => status.status === DeliveryStatusEnum.DELIVERED
    ).length;

    return (successfulDeliveries / deliveryStatuses.length) * 100;
  }

  private countOnTimeDeliveries(deliveryStatuses: DeliveryStatus[]): number {
    return deliveryStatuses.filter(status => {
      if (status.status !== DeliveryStatusEnum.DELIVERED) return false;
      const estimatedArrival = new Date(status.metadata?.estimated_arrival || '');
      const actualArrival = new Date(status.metadata?.actual_arrival || '');
      return actualArrival <= estimatedArrival;
    }).length;
  }

  private countDelayedDeliveries(deliveryStatuses: DeliveryStatus[]): number {
    return deliveryStatuses.filter(status => {
      if (status.status !== DeliveryStatusEnum.DELIVERED) return false;
      const estimatedArrival = new Date(status.metadata?.estimated_arrival || '');
      const actualArrival = new Date(status.metadata?.actual_arrival || '');
      return actualArrival > estimatedArrival;
    }).length;
  }

  private countFailedDeliveries(deliveryStatuses: DeliveryStatus[]): number {
    return deliveryStatuses.filter(
      status => status.status === DeliveryStatusEnum.FAILED
    ).length;
  }

  private calculateFuelSavings(routes: Route[]): number {
    // Assuming average fuel consumption of 0.3L/km and fuel cost of $1.5/L
    const FUEL_CONSUMPTION = 0.3; // L/km
    const FUEL_COST = 1.5; // $/L
    const OPTIMIZATION_SAVINGS = 0.15; // 15% savings from optimization

    const totalDistance = routes.reduce((sum, route) => sum + route.total_distance, 0);
    const fuelUsed = totalDistance * FUEL_CONSUMPTION;
    const fuelCost = fuelUsed * FUEL_COST;
    const savings = fuelCost * OPTIMIZATION_SAVINGS;

    return Math.round(savings * 100) / 100;
  }

  private calculateCO2Savings(routes: Route[]): number {
    // Assuming average CO2 emission of 2.3kg/L of fuel
    const CO2_PER_LITER = 2.3; // kg/L
    const FUEL_CONSUMPTION = 0.3; // L/km
    const OPTIMIZATION_SAVINGS = 0.15; // 15% savings from optimization

    const totalDistance = routes.reduce((sum, route) => sum + route.total_distance, 0);
    const fuelUsed = totalDistance * FUEL_CONSUMPTION;
    const co2Emitted = fuelUsed * CO2_PER_LITER;
    const savings = co2Emitted * OPTIMIZATION_SAVINGS;

    return Math.round(savings * 100) / 100;
  }
} 