import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ timestamps: true })
export class Order extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  userId: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Game', required: true })
  gameId: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ default: 'COMPLETED' })
  status: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
