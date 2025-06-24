import { IProductRepository } from '../../../domain/repositories/IProductrepository';
import { IProduct } from '../../../domain/model/IProduct';

export class BlockProductUseCase {
  constructor(private productRepo: IProductRepository) {}

  
  async blockProduct(productId: string): Promise<void> {
    const updated = await this.productRepo.blockProduct(productId);
    if (!updated) throw new Error('Product not found or unauthorized');
  }
}
