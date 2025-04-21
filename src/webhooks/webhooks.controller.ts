import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { WebhooksService } from './webhooks.service';
import { UpdateDeliveryStatusDto } from './dto/update-delivery-status.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('webhooks')
@Controller('webhooks')
export class WebhooksController {
  constructor(private readonly webhooksService: WebhooksService) {}

  @Post('delivery-status')
  @ApiOperation({ summary: 'Update delivery status' })
  @ApiResponse({ status: 201, description: 'Delivery status updated successfully' })
  async updateDeliveryStatus(@Body() updateDeliveryStatusDto: UpdateDeliveryStatusDto) {
    return this.webhooksService.updateDeliveryStatus(updateDeliveryStatusDto);
  }

  @Get('delivery-status/:routeId/:orderId')
  @ApiOperation({ summary: 'Get delivery status for an order' })
  @ApiResponse({ status: 200, description: 'Returns the current delivery status' })
  async getDeliveryStatus(
    @Param('routeId') routeId: string,
    @Param('orderId') orderId: string,
  ) {
    return this.webhooksService.getDeliveryStatus(routeId, orderId);
  }

  @Get('delivery-history/:routeId')
  @ApiOperation({ summary: 'Get delivery history for a route' })
  @ApiResponse({ status: 200, description: 'Returns the delivery history' })
  async getDeliveryHistory(@Param('routeId') routeId: string) {
    return this.webhooksService.getDeliveryHistory(routeId);
  }
} 