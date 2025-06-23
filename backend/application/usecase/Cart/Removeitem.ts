// application/usecase/Cart/RemoveItemFromCartUseCase.ts
import { ICartRepository } from "../../../domain/repositories/ICartRepository";

export class RemoveItemFromCartUseCase {
  constructor(private cartRepo: ICartRepository) {}

  async execute(userId: string, productId: string) {
    return await this.cartRepo.removeItemFromCart(userId, productId);
  }
}
