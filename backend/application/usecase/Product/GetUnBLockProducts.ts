import { IProductRepository } from '../../../domain/repositories/IProductrepository';
import { IProduct } from '../../../domain/model/IProduct';

export class GetUnBlockProductProductUseCase {
  constructor(private productRepo: IProductRepository) {}

  async getUnBlocProduct(): Promise<IProduct[]> {
    return await this.productRepo.findUnblockProducts();
  }
}
