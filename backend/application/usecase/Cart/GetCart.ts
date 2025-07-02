// application/usecase/Cart/GetCart.ts
import { ICartRepository } from '../../../domain/repositories/ICartRepository';

export class GetCartUseCase {
  constructor(private cartRepo: ICartRepository) {}

  async execute(customerId: string) {
    const cart = await this.cartRepo.getCart(customerId);
    return cart || { items: [] };
  }
}
