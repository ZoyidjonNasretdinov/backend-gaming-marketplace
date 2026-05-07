import { Controller, Post, Body } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiExtraModels,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';

// ╔══════════════════════════════════════════════════╗
// ║         🔓 AUTH CONTROLLER — GAMING PLATFORM      ║
// ╚══════════════════════════════════════════════════╝

@ApiTags('🔓 Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // ──────────────────────────────────────────────────
  //  POST /auth/register
  //  Yangi gamer accounti yaratish
  // ──────────────────────────────────────────────────
  @Post('register')
  @ApiOperation({
    summary: "🎮 Yangi gamer ro'yxatdan o'tkazish",
    description: `
**Bu endpoint nima qiladi?**

Yangi foydalanuvchi (gamer) accountini yaratadi va ma'lumotlarni MongoDB ga saqlaydi.

---

**Qadamlar:**
1. \`fullName\`, \`email\`, \`password\` va \`role\` maydonlarini to'ldiring
2. So'rov yuboring
3. Muvaffaqiyatli bo'lsa \`201\` status va muvaffaqiyat xabari keladi

---

**Rollar haqida:**
- \`USER\` → Oddiy o'yinchi (default)
- \`SELLER\` → O'yin sotuvchi
- \`ADMIN\` → Platforma boshqaruvchisi

> ⚠️ **Eslatma:** Bir xil email bilan ikki marta ro'yxatdan o'tib bo'lmaydi!
    `,
  })
  @ApiBody({
    description: "Ro'yxatdan o'tish uchun kerakli ma'lumotlar",
    schema: {
      type: 'object',
      required: ['fullName', 'email', 'password'],
      properties: {
        fullName: {
          type: 'string',
          example: 'Sardor Aliyev',
          description: '👤 To\'liq ism-familiya (haqiqiy ismingiz)',
        },
        email: {
          type: 'string',
          format: 'email',
          example: 'sardor@gaming.uz',
          description: '📧 Email manzil (login sifatida ishlatiladi)',
        },
        password: {
          type: 'string',
          format: 'password',
          example: 'gamer#2024',
          description: '🔑 Parol — kamida 6 ta belgi bo\'lishi kerak',
        },
        role: {
          type: 'string',
          enum: ['USER', 'ADMIN', 'SELLER'],
          example: 'USER',
          default: 'USER',
          description:
            '🎭 Rol tanlash: USER (o\'yinchi), SELLER (sotuvchi), ADMIN (boshqaruvchi)',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: "🎉 Muvaffaqiyatli ro'yxatdan o'tdingiz!",
    schema: {
      type: 'object',
      example: {
        success: true,
        message: "Muvaffaqiyatli ro'yxatdan o'tdingiz",
      },
    },
  })
  @ApiResponse({
    status: 409,
    description: '🚫 Conflict — Bu email allaqachon band',
    schema: {
      type: 'object',
      example: {
        statusCode: 409,
        message: "Bu email avval ro'yxatdan o'tgan",
        error: 'Conflict',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: '❌ Bad Request — Noto\'g\'ri ma\'lumot yuborildi',
    schema: {
      type: 'object',
      example: {
        statusCode: 400,
        message: 'Barcha maydonlarni to\'ldiring',
        error: 'Bad Request',
      },
    },
  })
  register(@Body() body: any) {
    return this.authService.register(body);
  }

  // ──────────────────────────────────────────────────
  //  POST /auth/login
  //  Mavjud gamer tizimga kirishi
  // ──────────────────────────────────────────────────
  @Post('login')
  @ApiOperation({
    summary: '🔐 Tizimga kirish (Login)',
    description: `
**Bu endpoint nima qiladi?**

Mavjud foydalanuvchi email va parol orqali tizimga kiradi va **JWT token** oladi.

---

**Qadamlar:**
1. \`email\` va \`password\` kiriting
2. So'rov yuboring
3. Javobdan \`accessToken\` ni nusxalang
4. Swagger yuqorisidagi 🔒 **Authorize** tugmasini bosing
5. Token qutisiga token qiymatini joylashtiring
6. Endi \`Dashboard\` endpointlarini sinab ko'ring!

---

**Token qanday ko'rinadi?**

\`\`\`
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2...
\`\`\`

> 🕐 **Token muddati:** 1 kun (24 soat). Keyin qayta login qiling.
    `,
  })
  @ApiBody({
    description: 'Kirish uchun email va parol',
    schema: {
      type: 'object',
      required: ['email', 'password'],
      properties: {
        email: {
          type: 'string',
          format: 'email',
          example: 'sardor@gaming.uz',
          description: "📧 Ro'yxatdan o'tishda ishlatgan email",
        },
        password: {
          type: 'string',
          format: 'password',
          example: 'gamer#2024',
          description: '🔑 Parolingiz',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: '✅ Muvaffaqiyatli kirildi — Token va user ma\'lumotlari',
    schema: {
      type: 'object',
      example: {
        accessToken:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NjFhYjEyMzQ1NiIsImVtYWlsIjoic2FyZG9yQGdhbWluZy51eiIsInJvbGUiOiJVU0VSIiwiaWF0IjoxNzE0NjUwMDAwLCJleHAiOjE3MTQ3MzY0MDB9.abc123xyz',
        user: {
          id: '661ab123456def789',
          email: 'sardor@gaming.uz',
          fullName: 'Sardor Aliyev',
          role: 'USER',
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: '🔐 Unauthorized — Email yoki parol noto\'g\'ri',
    schema: {
      type: 'object',
      example: {
        statusCode: 401,
        message: 'Email yoki parol hato',
        error: 'Unauthorized',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: '❌ Bad Request — Email yoki parol kiritilmagan',
    schema: {
      type: 'object',
      example: {
        statusCode: 400,
        message: 'email va password majburiy',
        error: 'Bad Request',
      },
    },
  })
  login(@Body() body: any) {
    return this.authService.login(body);
  }
}
