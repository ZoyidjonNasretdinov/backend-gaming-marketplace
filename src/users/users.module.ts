import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { Order, OrderSchema } from '../orders/schemas/order.schema';
import { UsersService } from './users.service';
import { AdminUsersController } from './admin-users.controller';
import { ProfileController } from './profile.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Order.name, schema: OrderSchema },
    ]),
  ],
  providers: [UsersService],
  controllers: [AdminUsersController, ProfileController],
  exports: [
    UsersService,
    MongooseModule,
  ],
})
export class UsersModule {}
