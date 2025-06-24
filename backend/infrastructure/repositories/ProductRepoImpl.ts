import {ProductModel} from '../models/ProductsModel';
import { IProductRepository } from '../../domain/repositories/IProductrepository';
import { IProduct } from '../../domain/model/IProduct';

export class ProductRepositoryImpl implements IProductRepository {
  async create(product: Omit<IProduct, 'id'>): Promise<IProduct> {
    const created = await ProductModel.create(product);
    return created.toObject();
  }

  async findAll(): Promise<IProduct[]> {
    return await ProductModel.find().populate('vendorId', 'name');
  }

  async update(id: string, vendorId: string, updateData: Partial<IProduct>): Promise<IProduct | null> {
    const updated = await ProductModel.findOneAndUpdate(
      { _id: id, vendorId },
      updateData,
      { new: true }
    );
    return updated?.toObject() || null;
  }

  async delete(id: string, vendorId: string): Promise<void> {
    await ProductModel.deleteOne({ _id: id, vendorId });
  }

  async findvendorproduct(vendorId: string): Promise<IProduct[]> {
      const result=await ProductModel.find({vendorId:vendorId})
      return result

  }
    async findById(productId: string) {
    return await ProductModel.findById(productId);
  }

  async setCustomPrice(productId: string, customerId: string, price: number): Promise<void> {
    const product = await ProductModel.findById(productId);
    if (!product) throw new Error('Product not found');
    product.customPricing.set(customerId, price);
    await product.save();
  }

   async findByIdAndVendor(productId: string, vendorId: string) {
    return ProductModel.findOne({ _id: productId, vendorId });
  }

  async updateProduct(productId: string, updatedFields: any) {
    return ProductModel.findByIdAndUpdate(productId, updatedFields, { new: true });
  }

  async blockProduct(productId: string): Promise<IProduct | null> {
  return await ProductModel.findOneAndUpdate(
    { _id: productId },
    { isBlocked: true },
    { new: true }
  );
}

async unblockProduct(productId: string): Promise<IProduct | null> {
  return await ProductModel.findOneAndUpdate(
    { _id: productId },
    { isBlocked: false },
    { new: true }
  );
}

}
