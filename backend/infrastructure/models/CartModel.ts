// infrastructure/models/CartModel.ts
import mongoose, { Schema } from 'mongoose';

const CartItemSchema = new Schema({
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true },
  vendorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
});

const CartSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    items: [CartItemSchema],
  },
  { timestamps: true }
);

export const CartModel = mongoose.model('Cart', CartSchema);
