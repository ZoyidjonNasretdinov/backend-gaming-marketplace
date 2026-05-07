import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../users/schemas/user.schema';

@ApiTags('🛒 Buyurtmalar (Orders)')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @Roles(Role.USER, Role.ADMIN, Role.SELLER)
  @ApiOperation({ summary: 'O\'yin sotib olish' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['gameId'],
      properties: {
        gameId: { type: 'string', example: '65f1... (Game ObjectId)' },
      },
    },
  })
  create(@Body('gameId') gameId: string, @Request() req: any) {
    return this.ordersService.create(gameId, req.user);
  }

  @Get('my')
  @Roles(Role.USER, Role.ADMIN, Role.SELLER)
  @ApiOperation({ summary: 'Mening buyurtmalarim' })
  findMyOrders(@Request() req: any) {
    return this.ordersService.findMyOrders(req.user.sub);
  }

  @Get('all')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Barcha buyurtmalar (Faqat Admin)' })
  findAll() {
    return this.ordersService.findAll();
  }
}
