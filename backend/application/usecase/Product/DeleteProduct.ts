import { IProductRepository } from '../../../domain/repositories/IProductrepository';
import { IProduct } from '../../../domain/model/IProduct';

export class DeleteProductUseCase {
  constructor(private productRepo: IProductRepository) {}

 async deleteproduct(id: string, vendorId: string): Promise<void> {
    await this.productRepo.delete(id, vendorId);
  }
}
