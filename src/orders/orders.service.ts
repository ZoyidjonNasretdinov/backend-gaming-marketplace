import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order } from './schemas/order.schema';
import { Game } from '../games/schemas/game.schema';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
    @InjectModel(Game.name) private gameModel: Model<Game>,
  ) {}

  async create(gameId: string, user: any) {
    const game = await this.gameModel.findById(gameId);
    if (!game) {
      throw new NotFoundException('O\'yin topilmadi');
    }

    const newOrder = new this.orderModel({
      userId: user.sub,
      gameId: game._id,
      amount: game.price,
      status: 'COMPLETED',
    });

    return newOrder.save();
  }

  async findMyOrders(userId: string) {
    return this.orderModel
      .find({ userId })
      .populate('gameId', 'title imageUrl price')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findAll() {
    return this.orderModel
      .find()
      .populate('userId', 'fullName email')
      .populate('gameId', 'title price')
      .sort({ createdAt: -1 })
      .exec();
  }
}
