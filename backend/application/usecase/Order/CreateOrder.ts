// application/usecase/Order/CreateOrder.ts

import { IOrderRepository } from '../../../domain/repositories/IOrderrepository';
import { ProductModel } from '../../../infrastructure/models/ProductsModel';
import { IOrder } from '../../../domain/model/IOrder';
import { ICartRepository } from '../../../domain/repositories/ICartRepository';

type CartItem = {
  productId: string;
  quantity: number;
  vendorId: string;
};

export class CreateOrder {
  constructor(
    private orderRepo: IOrderRepository,
    private cartRepo: ICartRepository
  ) {}

  async execute(customerId: string, items: CartItem[]) {
    const grouped = new Map<string, CartItem[]>();

    // 🔁 Group items by vendor
    for (const item of items) {
      if (!grouped.has(item.vendorId)) grouped.set(item.vendorId, []);
      grouped.get(item.vendorId)!.push(item);
    }

    const createdOrders: IOrder[] = [];

    for (const [vendorId, vendorItems] of grouped) {
      const totalCost = await this.calculateTotal(vendorItems);

      const orderData: IOrder = {
        customerId,
        vendorId,
        items: vendorItems.map(({ productId, quantity }) => ({ productId, quantity })),
        totalCost,
        status: 'Pending',
        createdAt: new Date(),
      };

      const order = await this.orderRepo.createOrder(orderData);
      createdOrders.push(order);
    }

    await this.cartRepo.clearCart(customerId);
    return createdOrders;
  }

  private async calculateTotal(items: CartItem[]): Promise<number> {
    let total = 0;
    for (const item of items) {
      const product = await ProductModel.findById(item.productId);
      if (product) {
        total += product.pricePerUnit * item.quantity;
      }
    }
    return total;
  }
}
