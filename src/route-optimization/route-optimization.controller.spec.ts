import { Test, TestingModule } from '@nestjs/testing';
import { RouteOptimizationController } from './route-optimization.controller';
import { RouteOptimizationService } from './route-optimization.service';

describe('RouteOptimizationController', () => {
  let controller: RouteOptimizationController;
  let service: RouteOptimizationService;

  const mockOptimizedRoute = {
    optimized_route: [
      {
        order_id: '101',
        vehicle_id: 'v1',
        arrival_time: '09:30',
      },
    ],
    total_distance: 35.6,
    estimated_time: '2h 15m',
    waypoints: [
      {
        label: 'Warehouse',
        lat: 40.7128,
        lng: -74.0060,
      },
    ],
    route_polyline: 'encoded_polyline_string_here',
    steps: [
      {
        instruction: 'Head north on Elm St',
        distance: 1.2,
        duration: '5m',
      },
    ],
    webhook_url: 'http://localhost:3000/api/webhooks/status',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RouteOptimizationController],
      providers: [
        {
          provide: RouteOptimizationService,
          useValue: {
            optimizeRoutes: jest.fn().mockResolvedValue(mockOptimizedRoute),
            getRoute: jest.fn().mockResolvedValue(mockOptimizedRoute),
          },
        },
      ],
    }).compile();

    controller = module.get<RouteOptimizationController>(RouteOptimizationController);
    service = module.get<RouteOptimizationService>(RouteOptimizationService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('optimizeRoutes', () => {
    it('should return an optimized route', async () => {
      const input = {
        orders: [
          {
            id: '101',
            address: '123 Main St',
            priority: 1,
            time_window: '9:00-12:00',
            location: { lat: 40.7157, lng: -74.0152 },
          },
        ],
        vehicles: [
          {
            id: 'v1',
            capacity: 50,
            start_location: { lat: 40.7128, lng: -74.0060 },
          },
        ],
        depots: [
          {
            id: 'd1',
            name: 'Warehouse 1',
            location: { lat: 40.7128, lng: -74.0060 },
          },
        ],
        constraints: {
          max_distance: 100,
          avoid_highways: false,
          traffic_enabled: true,
        },
      };

      const result = await controller.optimizeRoutes(input);

      expect(result).toEqual(mockOptimizedRoute);
      expect(service.optimizeRoutes).toHaveBeenCalledWith(input);
    });
  });

  describe('getRoute', () => {
    it('should return a route by ID', async () => {
      const routeId = '1';
      const result = await controller.getRoute(routeId);

      expect(result).toEqual(mockOptimizedRoute);
      expect(service.getRoute).toHaveBeenCalledWith(routeId);
    });
  });
}); 