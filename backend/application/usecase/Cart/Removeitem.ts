// application/usecase/Cart/RemoveItemFromCartUseCase.ts
import { ICartRepository } from "../../../domain/repositories/ICartRepository";

export class RemoveItemFromCartUseCase {
  constructor(private cartRepo: ICartRepository) {}

  // async execute(userId: string, productId: string) {
  //   return await this.cartRepo.removeItemFromCart(userId, productId);
  // }
  
  async execute(userId: string, productId: string) {
    const cart = await this.cartRepo.getCart(userId);
    if (!cart) throw new Error('Cart not found');

    const updatedItems = cart.items.filter(
      (item: any) => item.productId.toString() !== productId
    );

    if (updatedItems.length === 0) {
      // Delete entire cart
      await this.cartRepo.clearCart(userId);
      return { message: 'Cart deleted' };
    }

    return await this.cartRepo.saveCart(userId, updatedItems);
  }
}
