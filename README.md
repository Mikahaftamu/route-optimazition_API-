# AI-Powered Route Optimization API for E-Commerce Platforms

A NestJS-based API service that provides intelligent route optimization for e-commerce delivery operations. The service uses advanced algorithms to optimize delivery routes based on multiple factors including time windows, vehicle capacity, traffic conditions, and delivery priorities.

## Features

### 1. Route Optimization
- Real-time route calculation and optimization using custom algorithms
- Multi-stop delivery planning with efficient path finding
- Priority-based order sequencing
- Time window constraints handling
- Vehicle capacity management
- Traffic-aware routing with configurable traffic factors
- Distance and duration calculations using Haversine formula
- Custom waypoint generation and optimization

### 2. Webhooks System
- Real-time delivery status updates
- Event-driven architecture
- Status tracking for individual orders
- Delivery history tracking
- Metadata support for additional information

### 3. Analytics
- Route performance metrics
- Delivery efficiency analysis
- Historical data tracking
- Performance reporting

## Project Structure

```
src/
├── analytics/                 # Analytics module
│   ├── dto/                  # Data Transfer Objects
│   ├── entities/             # Database entities
│   ├── analytics.controller.ts
│   ├── analytics.service.ts
│   └── analytics.module.ts
├── route-optimization/       # Route optimization module
│   ├── dto/                 # Data Transfer Objects
│   ├── entities/            # Database entities
│   ├── route-optimization.controller.ts
│   ├── route-optimization.service.ts
│   └── route-optimization.module.ts
├── webhooks/                # Webhooks module
│   ├── dto/                # Data Transfer Objects
│   ├── entities/           # Database entities
│   ├── webhooks.controller.ts
│   ├── webhooks.service.ts
│   └── webhooks.module.ts
├── app.module.ts           # Main application module
└── main.ts                # Application entry point
```

## API Endpoints

### Route Optimization
- `POST /route-optimization/optimize` - Generate optimized delivery routes
- `GET /route-optimization/routes` - Get all optimized routes
- `GET /route-optimization/routes/:id` - Get specific route details

### Webhooks
- `POST /webhooks/delivery-status` - Update delivery status
- `GET /webhooks/delivery-status/:routeId/:orderId` - Get delivery status
- `GET /webhooks/delivery-history/:routeId` - Get delivery history

### Analytics
- `GET /analytics - Get route performance metrics

## Setup and Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd [project-directory]
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Initialize the database:
```bash
npm run db:init
```

5. Start the development server:
```bash
npm run dev
```

## Environment Variables

- `PORT` - Server port (default: 3000)
- `DATABASE_URL` - Database connection string
- `NODE_ENV` - Environment (development/production)
- `API_KEY` - API authentication key
- `TRAFFIC_FACTOR` - Traffic multiplier for duration calculations (default: 1.5)

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build the application
- `npm run start` - Start production server
- `npm run test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:cov` - Generate test coverage
- `npm run test:debug` - Debug tests
- `npm run test:e2e` - Run end-to-end tests
- `npm run test:all` - Run all tests including linting
- `npm run db:init` - Initialize database

## API Documentation

The API documentation is available via Swagger UI at `/api/docs` when running the server.

## Testing

The project includes comprehensive testing:
- Unit tests for individual components
- Integration tests for module interactions
- End-to-end tests for API endpoints
- Test coverage reporting

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 
