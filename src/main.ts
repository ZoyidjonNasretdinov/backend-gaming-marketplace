import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ╔══════════════════════════════════════════════════════════════╗
  // ║           🎮 GAMING PLATFORM - SWAGGER SOZLAMALARI           ║
  // ╚══════════════════════════════════════════════════════════════╝
  const config = new DocumentBuilder()
    .setTitle('🎮 Gaming Platform API')
    .setDescription(
      `
## 🎮 Gaming Platform — Kengaytirilgan API Qo'llanma

Bu **Gaming Website** loyihasining backend API dokumentatsiyasi.
Barcha rollar uchun statistika va shaxsiy kabinet apilari qo'shildi.

---

### 🗺️ API bo'limlari:

| Bo'lim | Maqsad | Kimlar uchun? |
|--------|--------|---------------|
| 🔓 **Auth** | Ro'yxatdan o'tish va tizimga kirish | Hammasi |
| 🛡️ **Admin: Users** | Foydalanuvchilarni boshqarish | Faqat Admin |
| 🎮 **Games** | O'yinlarni ko'rish va boshqarish | Hammasi / Seller |
| 📊 **Dashboard & Stats** | Admin va Seller uchun statistika | Admin / Seller |
| 👤 **User Cabinet** | Shaxsiy profil va sotib olingan o'yinlar | Hammasi |

---

### 🔑 Qanday ishlatiladi?

1. **Auth** orqali token oling.
2. **Authorize 🔒** tugmasiga tokenni kiriting.
3. **Dashboard** bo'limida o'z rolingizga mos statistikani ko'ring.
4. **User Cabinet** bo'limida profilingizni boshqaring.

---

### 👥 Rollar va ruxsatlar:

- 🛡️ **ADMIN** — Umumiy statistika va foydalanuvchilarni boshqarish.
- 🏪 **SELLER** — O'z o'yinlari statistikasi va o'yinlarni boshqarish.
- 👤 **USER** — Shaxsiy kabinet, sotib olingan o'yinlar ro'yxati.
      `,
    )
    .setVersion('3.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: "Tokenni kiriting",
        in: 'header',
      },
      'access-token',
    )
    .addTag('🔓 Auth', "Ro'yxatdan o'tish")
    .addTag('🛡️ Admin: Foydalanuvchilar boshqaruvi', 'Admin CRUD')
    .addTag('🎮 O\'yinlar (Games)', 'O\'yinlar ro\'yxati')
    .addTag('📊 Dashboard & Statistika', 'Admin va Seller statistikasi')
    .addTag('👤 User Cabinet: Shaxsiy profil', 'Foydalanuvchi sozlamalari va o\'yinlari')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: '🎮 Gaming API Docs - Ultimate',
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
  });

  app.enableCors();

  await app.listen(3000);
  console.log('🚀 Dastur ishga tushdi: http://localhost:3000');
}
bootstrap();
