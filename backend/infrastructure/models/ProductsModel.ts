import mongoose ,{Schema}from 'mongoose';
import { IProduct } from '../../domain/model/IProduct';



const productSchema = new mongoose.Schema<IProduct>({
  title: String,
  description: String,
  pricePerUnit: Number,
  minOrderQty: Number,
  availableQty: Number,
  vendorId:  { type: Schema.Types.ObjectId, ref: 'User', required: true },
  customPricing: {
    type: Map,
    of: Number,
    default: {},
  },
});
export const ProductModel= mongoose.model<IProduct>('Product', productSchema);