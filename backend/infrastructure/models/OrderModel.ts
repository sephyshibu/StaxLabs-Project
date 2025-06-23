// infrastructure/models/OrderModel.ts

import mongoose, { Schema } from 'mongoose';
import { IOrder } from '../../domain/model/IOrder';

const OrderItemSchema = new Schema({
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true },
});

const OrderSchema = new Schema<IOrder>(
  {
    customerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    vendorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    items: [OrderItemSchema],
    totalCost: { type: Number, required: true },
    status: {
      type: String,
      enum: ['Pending', 'Accepted', 'Rejected', 'Shipped', 'Delivered'],
      default: 'Pending',
    },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model<IOrder>('Order', OrderSchema);
