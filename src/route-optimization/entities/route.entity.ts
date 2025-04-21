import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('routes')
export class Route {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({ description: 'Unique identifier for the route' })
  id: string;

  @Column('jsonb')
  @ApiProperty({ description: 'Optimized route data' })
  optimized_route: {
    order_id: string;
    vehicle_id: string;
    arrival_time: string;
  }[];

  @Column('float')
  @ApiProperty({ description: 'Total distance of the route in kilometers' })
  total_distance: number;

  @Column()
  @ApiProperty({ description: 'Estimated time for the route' })
  estimated_time: string;

  @Column('jsonb')
  @ApiProperty({ description: 'List of waypoints along the route' })
  waypoints: {
    label: string;
    lat: number;
    lng: number;
  }[];

  @Column()
  @ApiProperty({ description: 'Encoded polyline string for the route' })
  route_polyline: string;

  @Column('jsonb')
  @ApiProperty({ description: 'Step-by-step directions for the route' })
  steps: {
    instruction: string;
    distance: number;
    duration: string;
  }[];

  @Column()
  @ApiProperty({ description: 'Webhook URL for status updates' })
  webhook_url: string;

  @Column('jsonb')
  @ApiProperty({ description: 'Input data used for optimization' })
  input_data: any;

  @CreateDateColumn()
  @ApiProperty({ description: 'Timestamp when the route was created' })
  created_at: Date;

  @UpdateDateColumn()
  @ApiProperty({ description: 'Timestamp when the route was last updated' })
  updated_at: Date;
} 