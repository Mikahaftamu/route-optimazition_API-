import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

export enum DeliveryStatusEnum {
  PENDING = 'pending',
  IN_TRANSIT = 'in_transit',
  DELIVERED = 'delivered',
  FAILED = 'failed',
}

@Entity('delivery_statuses')
export class DeliveryStatus {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({ description: 'Unique identifier for the delivery status' })
  id: string;

  @Column()
  @ApiProperty({ description: 'ID of the route' })
  route_id: string;

  @Column()
  @ApiProperty({ description: 'ID of the order' })
  order_id: string;

  @Column({
    type: 'enum',
    enum: DeliveryStatusEnum,
    default: DeliveryStatusEnum.PENDING,
  })
  @ApiProperty({ description: 'Current status of the delivery' })
  status: DeliveryStatusEnum;

  @Column({ type: 'jsonb', nullable: true })
  @ApiProperty({ description: 'Additional status information' })
  metadata: {
    location?: {
      lat: number;
      lng: number;
    };
    estimated_arrival?: string;
    actual_arrival?: string;
    notes?: string;
  };

  @CreateDateColumn()
  @ApiProperty({ description: 'Timestamp when the status was created' })
  created_at: Date;

  @UpdateDateColumn()
  @ApiProperty({ description: 'Timestamp when the status was last updated' })
  updated_at: Date;
} 