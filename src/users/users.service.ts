import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, Role } from './schemas/user.schema';
import { Order } from '../orders/schemas/order.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Order.name) private orderModel: Model<Order>,
  ) {}

  // Barcha foydalanuvchilarni olish (Filter bilan)
  async findAll(query: { role?: Role; search?: string }) {
    const filter: any = {};

    if (query.role) {
      filter.role = query.role;
    }

    if (query.search) {
      filter.$or = [
        { fullName: { $regex: query.search, $options: 'i' } },
        { email: { $regex: query.search, $options: 'i' } },
      ];
    }

    return this.userModel.find(filter).select('-passwordHash').sort({ createdAt: -1 }).exec();
  }

  // Bitta foydalanuvchini ID orqali olish
  async findOne(id: string) {
    const user = await this.userModel.findById(id).select('-passwordHash').exec();
    if (!user) {
      throw new NotFoundException('Foydalanuvchi topilmadi');
    }
    return user;
  }

  // Foydalanuvchini yangilash
  async update(id: string, updateData: any) {
    if (updateData.password) {
      const salt = await bcrypt.genSalt(10);
      updateData.passwordHash = await bcrypt.hash(updateData.password, salt);
      delete updateData.password;
    }

    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .select('-passwordHash')
      .exec();

    if (!updatedUser) {
      throw new NotFoundException('Foydalanuvchi topilmadi');
    }
    return updatedUser;
  }

  // Foydalanuvchini o'chirish
  async remove(id: string) {
    const result = await this.userModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('Foydalanuvchi topilmadi');
    }
    return { success: true, message: "Foydalanuvchi muvaffaqiyatli o'chirildi" };
  }

  // Userning sotib olgan o'yinlari (Buyurtmalari)
  async getMyOrders(userId: string) {
    return this.orderModel.find({ userId }).populate('gameId').sort({ createdAt: -1 }).exec();
  }
}
