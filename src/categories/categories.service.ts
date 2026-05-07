import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category } from './schemas/category.schema';

@Injectable()
export class CategoriesService {
  constructor(@InjectModel(Category.name) private categoryModel: Model<Category>) {}

  async findAll() {
    return this.categoryModel.find().exec();
  }

  async findOne(id: string) {
    const category = await this.categoryModel.findById(id).exec();
    if (!category) {
      throw new NotFoundException('Kategoriya topilmadi');
    }
    return category;
  }

  async create(categoryData: any) {
    const existing = await this.categoryModel.findOne({ name: categoryData.name });
    if (existing) {
      throw new ConflictException('Bunday kategoriya allaqachon mavjud');
    }
    const newCategory = new this.categoryModel(categoryData);
    return newCategory.save();
  }

  async update(id: string, updateData: any) {
    const category = await this.categoryModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
    if (!category) {
      throw new NotFoundException('Kategoriya topilmadi');
    }
    return category;
  }

  async remove(id: string) {
    const result = await this.categoryModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('Kategoriya topilmadi');
    }
    return { success: true, message: 'Kategoriya muvaffaqiyatli o\'chirildi' };
  }
}
