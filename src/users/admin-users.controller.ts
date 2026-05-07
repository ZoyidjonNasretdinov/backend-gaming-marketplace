import {
  Controller,
  Get,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from './schemas/user.schema';

@ApiTags('🛡️ Admin: Foydalanuvchilar boshqaruvi')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@Controller('admin/users')
export class AdminUsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({
    summary: 'Barcha foydalanuvchilar va sotuvchilarni olish (Filter bilan)',
    description: `
**Admin uchun barcha foydalanuvchilarni ko'rish API.**

Bu yerda siz:
- Rol bo'yicha (ADMIN, SELLER, USER) filter qilishingiz mumkin.
- Ism yoki Email bo'yicha qidirishingiz mumkin.
    `,
  })
  @ApiQuery({ name: 'role', enum: Role, required: false, description: 'Faqat ma\'lum roldagi foydalanuvchilarni ko\'rish' })
  @ApiQuery({ name: 'search', required: false, description: 'Ism yoki email bo\'yicha qidirish' })
  @ApiResponse({ status: 200, description: 'Foydalanuvchilar ro\'yxati' })
  findAll(@Query('role') role?: Role, @Query('search') search?: string) {
    return this.usersService.findAll({ role, search });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Bitta foydalanuvchi ma\'lumotlarini ID orqali ko\'rish' })
  @ApiResponse({ status: 200, description: 'Foydalanuvchi ma\'lumotlari' })
  @ApiResponse({ status: 404, description: 'Topilmadi' })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Foydalanuvchi ma\'lumotlarini tahrirlash' })
  @ApiResponse({ status: 200, description: 'Yangilangan foydalanuvchi' })
  update(@Param('id') id: string, @Body() updateData: any) {
    return this.usersService.update(id, updateData);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Foydalanuvchini tizimdan o\'chirish' })
  @ApiResponse({ status: 200, description: 'Muvaffaqiyatli o\'chirildi' })
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
