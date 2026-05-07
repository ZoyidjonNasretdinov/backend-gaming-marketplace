import {
  Controller,
  Get,
  Put,
  Delete,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('👤 User Cabinet: Shaxsiy profil')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('profile')
export class ProfileController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @ApiOperation({
    summary: 'Mening profilim',
    description: 'Tizimga kirgan foydalanuvchining to\'liq ma\'lumotlarini olish.',
  })
  @ApiResponse({ status: 200, description: 'Profil ma\'lumotlari' })
  getProfile(@Request() req: any) {
    return this.usersService.findOne(req.user.sub);
  }

  @Put('update')
  @ApiOperation({
    summary: 'Profilni tahrirlash',
    description: 'Ism, email yoki parolni yangilash.',
  })
  @ApiResponse({ status: 200, description: 'Yangilangan profil' })
  updateProfile(@Request() req: any, @Body() updateData: any) {
    return this.usersService.update(req.user.sub, updateData);
  }

  @Delete('delete-account')
  @ApiOperation({
    summary: 'Accountni o\'chirish',
    description: 'Foydalanuvchi o\'z accountini o\'zi o\'chirib yuborishi.',
  })
  @ApiResponse({ status: 200, description: 'Account o\'chirildi' })
  deleteAccount(@Request() req: any) {
    return this.usersService.remove(req.user.sub);
  }

  @Get('my-games')
  @ApiOperation({
    summary: 'Sotib olingan o\'yinlarim',
    description: 'Foydalanuvchi tomonidan sotib olingan barcha o\'yinlar ro\'yxati.',
  })
  @ApiResponse({ status: 200, description: 'O\'yinlar ro\'yxati' })
  getMyGames(@Request() req: any) {
    return this.usersService.getMyOrders(req.user.sub);
  }
}
