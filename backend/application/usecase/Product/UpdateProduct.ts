import { IProductRepository } from '../../../domain/repositories/IProductrepository';
import { IProduct } from '../../../domain/model/IProduct';

export class UpdateProductUseCase {
  constructor(private productRepo: IProductRepository) {}

 async updateproduct(id: string, vendorId: string, updateData: Partial<IProduct>): Promise<IProduct | null> {
    return await this.productRepo.update(id, vendorId, updateData);
  }
}
