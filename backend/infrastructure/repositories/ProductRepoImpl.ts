import {ProductModel} from '../models/ProductsModel';
import { IProductRepository } from '../../domain/repositories/IProductrepository';
import { IProduct } from '../../domain/model/IProduct';

export class ProductRepositoryImpl implements IProductRepository {
  async create(product: Omit<IProduct, 'id'>): Promise<IProduct> {
    const created = await ProductModel.create(product);
    return created.toObject();
  }

  async findAll(): Promise<IProduct[]> {
    return await ProductModel.find();
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
}
