import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DeliveryStatus, DeliveryStatusEnum } from './entities/delivery-status.entity';
import { UpdateDeliveryStatusDto } from './dto/update-delivery-status.dto';

@Injectable()
export class WebhooksService {
  constructor(
    @InjectRepository(DeliveryStatus)
    private deliveryStatusRepository: Repository<DeliveryStatus>,
  ) {}

  async updateDeliveryStatus(updateDeliveryStatusDto: UpdateDeliveryStatusDto) {
    const deliveryStatus = this.deliveryStatusRepository.create({
      route_id: updateDeliveryStatusDto.route_id,
      order_id: updateDeliveryStatusDto.order_id,
      status: updateDeliveryStatusDto.status,
      metadata: updateDeliveryStatusDto.metadata,
    });

    return this.deliveryStatusRepository.save(deliveryStatus);
  }

  async getDeliveryStatus(routeId: string, orderId: string) {
    return this.deliveryStatusRepository.findOne({
      where: {
        route_id: routeId,
        order_id: orderId,
      },
      order: {
        created_at: 'DESC',
      },
    });
  }

  async getDeliveryHistory(routeId: string) {
    return this.deliveryStatusRepository.find({
      where: {
        route_id: routeId,
      },
      order: {
        created_at: 'DESC',
      },
    });
  }
} 