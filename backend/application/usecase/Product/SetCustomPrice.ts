import { IProductRepository } from '../../../domain/repositories/IProductrepository';

export class SetCustomPriceUseCase {
  constructor(private productRepo: IProductRepository) {}

  async execute(productId: string, customerId: string, price: number): Promise<void> {
    const product = await this.productRepo.findById(productId);
    if (!product) throw new Error('Product not found');

    await this.productRepo.setCustomPrice(productId, customerId, price);
  }
}
