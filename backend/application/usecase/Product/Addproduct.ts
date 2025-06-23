import { IProductRepository } from '../../../domain/repositories/IProductrepository';
import { IProduct } from '../../../domain/model/IProduct';

export class CreateProductUseCase {
  constructor(private productRepo: IProductRepository) {}

  async execute(input: Omit<IProduct, 'id'>): Promise<IProduct> {
    return await this.productRepo.create(input);
  }
}
