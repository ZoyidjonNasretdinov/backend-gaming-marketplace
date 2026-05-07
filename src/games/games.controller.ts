import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { GamesService } from './games.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../users/schemas/user.schema';

@ApiTags('🎮 O\'yinlar (Games)')
@Controller('games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @Get()
  @ApiOperation({
    summary: 'Barcha o\'yinlarni olish (Filter bilan)',
    description: 'Xaridorlar va barcha foydalanuvchilar uchun o\'yinlar ro\'yxati.',
  })
  @ApiQuery({ name: 'categoryId', required: false, description: 'Kategoriya ID si bo\'yicha filter' })
  @ApiQuery({ name: 'search', required: false, description: 'Nom bo\'yicha qidirish' })
  @ApiQuery({ name: 'minPrice', required: false, type: Number })
  @ApiQuery({ name: 'maxPrice', required: false, type: Number })
  findAll(
    @Query('categoryId') categoryId?: string,
    @Query('search') search?: string,
    @Query('minPrice') minPrice?: number,
    @Query('maxPrice') maxPrice?: number,
  ) {
    return this.gamesService.findAll({ categoryId, search, minPrice, maxPrice });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Bitta o\'yin tafsilotlarini ko\'rish' })
  findOne(@Param('id') id: string) {
    return this.gamesService.findOne(id);
  }

  @Post()
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SELLER, Role.ADMIN)
  @ApiOperation({ summary: 'Yangi o\'yin qo\'shish (Faqat Seller va Admin)' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string', example: 'Cyberpunk 2077' },
        description: { type: 'string', example: 'Futuristik ochiq dunyo o\'yini' },
        price: { type: 'number', example: 59.99 },
        categoryId: { type: 'string', example: '65f1... (Category ObjectId)' },
        imageUrl: { type: 'string', example: 'https://image.com/game.jpg' },
      },
    },
  })
  create(@Body() gameData: any, @Request() req: any) {
    return this.gamesService.create(gameData, req.user);
  }

  @Put(':id')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SELLER, Role.ADMIN)
  @ApiOperation({ summary: 'O\'yinni tahrirlash (Faqat egasi yoki Admin)' })
  update(@Param('id') id: string, @Body() updateData: any, @Request() req: any) {
    return this.gamesService.update(id, updateData, req.user);
  }

  @Delete(':id')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SELLER, Role.ADMIN)
  @ApiOperation({ summary: 'O\'yinni o\'chirish (Faqat egasi yoki Admin)' })
  remove(@Param('id') id: string, @Request() req: any) {
    return this.gamesService.remove(id, req.user);
  }
}
