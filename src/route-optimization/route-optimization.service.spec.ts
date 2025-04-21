import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RouteOptimizationService } from './route-optimization.service';
import { Route } from './entities/route.entity';

describe('RouteOptimizationService', () => {
  let service: RouteOptimizationService;
  let repository: Repository<Route>;

  const mockRoute = {
    id: '1',
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
    input_data: {},
    created_at: new Date(),
    updated_at: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RouteOptimizationService,
        {
          provide: getRepositoryToken(Route),
          useValue: {
            create: jest.fn().mockReturnValue(mockRoute),
            save: jest.fn().mockResolvedValue(mockRoute),
            findOne: jest.fn().mockResolvedValue(mockRoute),
          },
        },
      ],
    }).compile();

    service = module.get<RouteOptimizationService>(RouteOptimizationService);
    repository = module.get<Repository<Route>>(getRepositoryToken(Route));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
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

      const result = await service.optimizeRoutes(input);

      expect(result).toBeDefined();
      expect(result.optimized_route).toBeDefined();
      expect(result.total_distance).toBeDefined();
      expect(result.estimated_time).toBeDefined();
      expect(result.waypoints).toBeDefined();
      expect(result.route_polyline).toBeDefined();
      expect(result.steps).toBeDefined();
      expect(result.webhook_url).toBeDefined();
    });
  });
}); 