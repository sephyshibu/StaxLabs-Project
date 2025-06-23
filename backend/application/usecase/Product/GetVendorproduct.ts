import { IProductRepository } from '../../../domain/repositories/IProductrepository';
import { IProduct } from '../../../domain/model/IProduct';

export class GetVendorProductProductUseCase {
  constructor(private productRepo: IProductRepository) {}

  async getVendorProduct( vendorId: string): Promise<IProduct[]> {
    return await this.productRepo.findvendorproduct(vendorId);
  }
}
