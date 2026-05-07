import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Game } from './schemas/game.schema';
import { Role } from '../users/schemas/user.schema';

@Injectable()
export class GamesService {
  constructor(@InjectModel(Game.name) private gameModel: Model<Game>) {}

  // O'yinlar ro'yxatini olish (Filter bilan)
  async findAll(query: { categoryId?: string; search?: string; minPrice?: number; maxPrice?: number }) {
    const filter: any = { isActive: true };

    if (query.categoryId) {
      filter.categoryId = query.categoryId;
    }

    if (query.search) {
      filter.title = { $regex: query.search, $options: 'i' };
    }

    if (query.minPrice || query.maxPrice) {
      filter.price = {};
      if (query.minPrice) filter.price.$gte = query.minPrice;
      if (query.maxPrice) filter.price.$lte = query.maxPrice;
    }

    return this.gameModel
      .find(filter)
      .populate('sellerId', 'fullName email')
      .populate('categoryId', 'name')
      .sort({ createdAt: -1 })
      .exec();
  }

  // Bitta o'yinni ID orqali olish
  async findOne(id: string) {
    const game = await this.gameModel
      .findById(id)
      .populate('sellerId', 'fullName email')
      .populate('categoryId', 'name')
      .exec();
    if (!game) {
      throw new NotFoundException('O\'yin topilmadi');
    }
    return game;
  }

  // Yangi o'yin qo'shish
  async create(gameData: any, user: any) {
    const newGame = new this.gameModel({
      ...gameData,
      sellerId: user.sub,
    });
    return newGame.save();
  }

  // O'yinni yangilash (Faqat egasi yoki Admin)
  async update(id: string, updateData: any, user: any) {
    const game = await this.gameModel.findById(id);
    if (!game) {
      throw new NotFoundException('O\'yin topilmadi');
    }

    if (user.role !== Role.ADMIN && game.sellerId.toString() !== user.sub) {
      throw new ForbiddenException('Sizda bu o\'yinni tahrirlash huquqi yo\'q');
    }

    return this.gameModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
  }

  // O'yinni o'chirish (Soft delete yoki Hard delete)
  async remove(id: string, user: any) {
    const game = await this.gameModel.findById(id);
    if (!game) {
      throw new NotFoundException('O\'yin topilmadi');
    }

    if (user.role !== Role.ADMIN && game.sellerId.toString() !== user.sub) {
      throw new ForbiddenException('Sizda bu o\'yinni o\'chirish huquqi yo\'q');
    }

    await this.gameModel.findByIdAndDelete(id).exec();
    return { success: true, message: "O'yin muvaffaqiyatli o'chirildi" };
  }
}
