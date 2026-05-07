import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../users/schemas/user.schema';
import { DashboardService } from './dashboard.service';

@ApiTags('📊 Dashboard & Statistika')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('admin/stats')
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: '🛡️ Admin uchun umumiy statistika',
    description: 'Platformadagi jami foydalanuvchilar, sotuvchilar, o\'yinlar va umumiy tushumni ko\'rish.',
  })
  @ApiResponse({ status: 200, description: 'Admin statistikasi' })
  async getAdminStats() {
    return this.dashboardService.getAdminStats();
  }

  @Get('seller/stats')
  @Roles(Role.SELLER)
  @ApiOperation({
    summary: '🏪 Seller uchun shaxsiy statistika',
    description: 'Sotuvchining o\'z o\'yinlari soni va ulardan kelgan tushumni ko\'rish.',
  })
  @ApiResponse({ status: 200, description: 'Seller statistikasi' })
  async getSellerStats(@Request() req: any) {
    return this.dashboardService.getSellerStats(req.user.sub);
  }

  @Get('user/cabinet')
  @Roles(Role.USER, Role.ADMIN, Role.SELLER)
  @ApiOperation({
    summary: '👤 User kabineti (Asosiy ma\'lumotlar)',
    description: 'Foydalanuvchining roli va tizimdagi holati haqida qisqacha ma\'lumot.',
  })
  async getUserDashboard(@Request() req: any) {
    return {
      success: true,
      role: req.user.role,
      message: 'Xush kelibsiz! Bu sizning shaxsiy kabinetingiz.',
      user: req.user,
    };
  }
}
