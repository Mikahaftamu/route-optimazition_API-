-- Create the database if it doesn't exist
CREATE DATABASE route_optimization;

-- Connect to the database
\c route_optimization;

-- Create enum type for delivery status
CREATE TYPE delivery_status_enum AS ENUM ('pending', 'in_transit', 'delivered', 'failed');

-- Create the routes table
CREATE TABLE IF NOT EXISTS routes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    optimized_route JSONB NOT NULL,
    total_distance FLOAT NOT NULL,
    estimated_time VARCHAR(50) NOT NULL,
    waypoints JSONB NOT NULL,
    route_polyline TEXT NOT NULL,
    steps JSONB NOT NULL,
    webhook_url TEXT NOT NULL,
    input_data JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create the delivery_statuses table
CREATE TABLE IF NOT EXISTS delivery_statuses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    route_id UUID NOT NULL REFERENCES routes(id),
    order_id VARCHAR(255) NOT NULL,
    status delivery_status_enum NOT NULL DEFAULT 'pending',
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for faster queries
CREATE INDEX idx_routes_created_at ON routes(created_at);
CREATE INDEX idx_delivery_statuses_route_id ON delivery_statuses(route_id);
CREATE INDEX idx_delivery_statuses_order_id ON delivery_statuses(order_id);
CREATE INDEX idx_delivery_statuses_created_at ON delivery_statuses(created_at);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update the updated_at column
CREATE TRIGGER update_routes_updated_at
    BEFORE UPDATE ON routes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_delivery_statuses_updated_at
    BEFORE UPDATE ON delivery_statuses
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 