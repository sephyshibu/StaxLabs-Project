// infrastructure/repositories/CartRepoImpl.ts
import { CartModel } from '../models/CartModel';
import { ICartRepository } from '../../domain/repositories/ICartRepository';

export class CartRepoImpl implements ICartRepository {
  async saveCart(userId: string, items: any[]) {
    return await CartModel.findOneAndUpdate(
      { userId },
      { items },
      { upsert: true, new: true }
    );
  }

  async getCart(userId: string) {
    return await CartModel.findOne({ userId }).populate('items.productId',"name pricePerUnit");
  }

  async clearCart(userId: string) {
    await CartModel.deleteOne({ userId });
  }

    async removeItemFromCart(userId: string, productId: string) {
    return await CartModel.findOneAndUpdate(
      { userId },
      { $pull: { items: { productId } } },
      { new: true }
    );
  }
}
