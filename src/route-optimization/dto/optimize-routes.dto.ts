import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsObject, IsOptional, ValidateNested, IsNumber, IsString, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

class LocationDto {
  @ApiProperty({ description: 'Latitude coordinate' })
  @IsNumber()
  lat: number;

  @ApiProperty({ description: 'Longitude coordinate' })
  @IsNumber()
  lng: number;
}

class OrderDto {
  @ApiProperty({ description: 'Unique identifier for the order' })
  @IsString()
  id: string;

  @ApiProperty({ description: 'Delivery address' })
  @IsString()
  address: string;

  @ApiProperty({ description: 'Priority level (1 being highest)' })
  @IsNumber()
  priority: number;

  @ApiProperty({ description: 'Time window for delivery (format: HH:mm-HH:mm)' })
  @IsString()
  time_window: string;

  @ApiProperty({ description: 'Location coordinates' })
  @ValidateNested()
  @Type(() => LocationDto)
  location: LocationDto;
}

class VehicleDto {
  @ApiProperty({ description: 'Unique identifier for the vehicle' })
  @IsString()
  id: string;

  @ApiProperty({ description: 'Vehicle capacity in cubic units' })
  @IsNumber()
  capacity: number;

  @ApiProperty({ description: 'Starting location coordinates' })
  @ValidateNested()
  @Type(() => LocationDto)
  start_location: LocationDto;
}

class DepotDto {
  @ApiProperty({ description: 'Unique identifier for the depot' })
  @IsString()
  id: string;

  @ApiProperty({ description: 'Name of the depot' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Location coordinates' })
  @ValidateNested()
  @Type(() => LocationDto)
  location: LocationDto;
}

class ConstraintsDto {
  @ApiProperty({ description: 'Maximum distance in kilometers' })
  @IsNumber()
  max_distance: number;

  @ApiProperty({ description: 'Whether to avoid highways' })
  @IsBoolean()
  avoid_highways: boolean;

  @ApiProperty({ description: 'Whether to consider traffic conditions' })
  @IsBoolean()
  traffic_enabled: boolean;
}

export class OptimizeRoutesDto {
  @ApiProperty({ type: [OrderDto], description: 'List of orders to optimize' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderDto)
  orders: OrderDto[];

  @ApiProperty({ type: [VehicleDto], description: 'List of available vehicles' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VehicleDto)
  vehicles: VehicleDto[];

  @ApiProperty({ type: [DepotDto], description: 'List of depots' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DepotDto)
  depots: DepotDto[];

  @ApiProperty({ type: ConstraintsDto, description: 'Route optimization constraints' })
  @IsObject()
  @ValidateNested()
  @Type(() => ConstraintsDto)
  constraints: ConstraintsDto;
} 