// application/usecase/Cart/AddToCartUseCase.ts
import { ICartRepository } from '../../../domain/repositories/ICartRepository';

export class AddToCartUseCase {
  constructor(private cartRepo: ICartRepository) {}

  async execute(customerId: string, productId: string, quantity: number, vendorId: string) {
    const existingCart = await this.cartRepo.getCart(customerId);

    let updatedItems;

    if (!existingCart) {
      // No cart, create with initial item
      updatedItems = [{ productId, quantity, vendorId }];
    } else {
      const alreadyExists = existingCart.items.some(
        (item: any) => item.productId.toString() === productId
      );

      if (alreadyExists) {
        throw new Error('Product already in cart');
      }

      // Add new item to existing items
      updatedItems = [...existingCart.items, { productId, quantity, vendorId }];
    }

    return await this.cartRepo.saveCart(customerId, updatedItems);
  }
}
