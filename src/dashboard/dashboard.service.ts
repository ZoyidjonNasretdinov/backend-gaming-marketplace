import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, Role } from '../users/schemas/user.schema';
import { Game } from '../games/schemas/game.schema';
import { Order } from '../orders/schemas/order.schema';

@Injectable()
export class DashboardService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Game.name) private gameModel: Model<Game>,
    @InjectModel(Order.name) private orderModel: Model<Order>,
  ) {}

  // Admin uchun umumiy statistika
  async getAdminStats() {
    const [totalUsers, totalSellers, totalGames, totalOrders] = await Promise.all([
      this.userModel.countDocuments({ role: Role.USER }),
      this.userModel.countDocuments({ role: Role.SELLER }),
      this.gameModel.countDocuments(),
      this.orderModel.aggregate([
        { $group: { _id: null, totalRevenue: { $sum: '$amount' }, count: { $sum: 1 } } },
      ]),
    ]);

    return {
      totalUsers,
      totalSellers,
      totalGames,
      totalRevenue: totalOrders[0]?.totalRevenue || 0,
      totalOrders: totalOrders[0]?.count || 0,
    };
  }

  // Seller uchun shaxsiy statistika
  async getSellerStats(sellerId: string) {
    const myGames = await this.gameModel.find({ sellerId }).select('_id');
    const myGameIds = myGames.map((g) => g._id);

    const [gamesCount, ordersInfo] = await Promise.all([
      this.gameModel.countDocuments({ sellerId }),
      this.orderModel.aggregate([
        { $match: { gameId: { $in: myGameIds } } },
        { $group: { _id: null, myRevenue: { $sum: '$amount' }, myOrdersCount: { $sum: 1 } } },
      ]),
    ]);

    return {
      myGamesCount: gamesCount,
      myRevenue: ordersInfo[0]?.myRevenue || 0,
      myOrdersCount: ordersInfo[0]?.myOrdersCount || 0,
    };
  }
}
