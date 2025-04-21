# AI-Powered Route Optimization API

A scalable, AI-driven Route Optimization API tailored for modern e-commerce logistics. This API provides real-time, optimized delivery routes that reduce operational costs, improve delivery accuracy, and enhance logistics visibility.

## Features

- AI-Driven Route Optimization
- Real-Time Traffic Data Integration
- Multi-Vehicle / Multi-Depot Optimization
- Predictive Delivery Time Estimations
- Real-Time Webhooks for Tracking
- Waypoint-Based Route Information
- Comprehensive Analytics Dashboard API
- Fully Documented with Swagger/OpenAPI

## Tech Stack

- Backend Framework: Nest.js
- Database: PostgreSQL
- API Documentation: Swagger (OpenAPI 3.0)
- Mapping & Traffic: Google Maps API / Mapbox Directions API

## Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/route-optimization-api.git
cd route-optimization-api
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_DATABASE=route_optimization
API_URL=http://localhost:3000
GOOGLE_MAPS_API_KEY=your_api_key
```

4. Start the development server:
```bash
npm run start:dev
```

The API will be available at `http://localhost:3000`.

## API Documentation

Once the server is running, you can access the Swagger documentation at:
```
http://localhost:3000/api/docs
```

## API Endpoints

### POST /api/optimize-routes
Optimizes delivery routes based on provided orders, vehicles, and constraints.

### GET /api/routes/{routeId}
Retrieves a previously computed route with live updates.

### POST /api/webhooks/status
Accepts delivery status updates from driver apps.

### GET /api/analytics
Returns delivery route efficiency metrics and performance KPIs.

## Example Usage

```typescript
// Example request to optimize routes
const response = await fetch('http://localhost:3000/api/optimize-routes', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    orders: [
      {
        id: "101",
        address: "123 Main St",
        priority: 1,
        time_window: "9:00-12:00",
        location: { lat: 40.7157, lng: -74.0152 }
      }
    ],
    vehicles: [
      {
        id: "v1",
        capacity: 50,
        start_location: { lat: 40.7128, lng: -74.0060 }
      }
    ],
    depots: [
      {
        id: "d1",
        name: "Warehouse 1",
        location: { lat: 40.7128, lng: -74.0060 }
      }
    ],
    constraints: {
      max_distance: 100,
      avoid_highways: false,
      traffic_enabled: true
    }
  })
});
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 