import { IProductRepository } from '../../../domain/repositories/IProductrepository';
import { IProduct } from '../../../domain/model/IProduct';

export class GetAllProductProductUseCase {
  constructor(private productRepo: IProductRepository) {}

  async getAllProduct(): Promise<IProduct[]> {
    return await this.productRepo.findAll();
  }
}
