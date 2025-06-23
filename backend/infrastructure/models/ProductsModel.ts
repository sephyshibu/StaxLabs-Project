import mongoose from 'mongoose';
import { IProduct } from '../../domain/model/IProduct';

const productSchema = new mongoose.Schema<IProduct>({
  title: String,
  description: String,
  pricePerUnit: Number,
  minOrderQty: Number,
  availableQty: Number,
  vendorId: mongoose.Types.ObjectId,
  customPricing: {
    type: Map,
    of: Number,
    default: {},
  },
});
export const ProductModel= mongoose.model<IProduct>('Product', productSchema);