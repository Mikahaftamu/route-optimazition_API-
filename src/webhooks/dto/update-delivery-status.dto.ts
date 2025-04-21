import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum, IsOptional, ValidateNested, IsObject, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { DeliveryStatusEnum } from '../entities/delivery-status.entity';

class LocationDto {
  @ApiProperty({ description: 'Latitude coordinate' })
  @IsNumber()
  lat: number;

  @ApiProperty({ description: 'Longitude coordinate' })
  @IsNumber()
  lng: number;
}

class MetadataDto {
  @ApiProperty({ description: 'Current location', required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => LocationDto)
  location?: LocationDto;

  @ApiProperty({ description: 'Estimated arrival time', required: false })
  @IsOptional()
  @IsString()
  estimated_arrival?: string;

  @ApiProperty({ description: 'Actual arrival time', required: false })
  @IsOptional()
  @IsString()
  actual_arrival?: string;

  @ApiProperty({ description: 'Additional notes', required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateDeliveryStatusDto {
  @ApiProperty({ description: 'ID of the route' })
  @IsString()
  route_id: string;

  @ApiProperty({ description: 'ID of the order' })
  @IsString()
  order_id: string;

  @ApiProperty({ description: 'Current status of the delivery', enum: DeliveryStatusEnum })
  @IsEnum(DeliveryStatusEnum)
  status: DeliveryStatusEnum;

  @ApiProperty({ description: 'Additional status information', required: false })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => MetadataDto)
  metadata?: MetadataDto;
} 