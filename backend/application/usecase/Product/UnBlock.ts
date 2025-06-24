import { IProductRepository } from '../../../domain/repositories/IProductrepository';
import { IProduct } from '../../../domain/model/IProduct';

export class UnblockProductUseCase {
  constructor(private productRepo: IProductRepository) {}

  
   async unblockProduct(productId: string): Promise<void> {
    const updated = await this.productRepo.unblockProduct(productId);
    if (!updated) throw new Error('Product not found or unauthorized');
  }
}
