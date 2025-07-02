import { IOrderRepository } from '../../../domain/repositories/IOrderrepository';
import { ProductModel } from '../../../infrastructure/models/ProductsModel';
import { IOrder } from '../../../domain/model/IOrder';
import { ICartRepository } from '../../../domain/repositories/ICartRepository';
import { IUserRepository } from '../../../domain/repositories/IUserrepository';

type CartItem = {
  productId: string;
  quantity: number;
  vendorId: string;
};

export class CreateOrder {
  constructor(
    private orderRepo: IOrderRepository,
    private cartRepo: ICartRepository,
    private userRepo:IUserRepository
  ) {}

  async execute(customerId: string, items: CartItem[], timezone:string) {
    const grouped = new Map<string, CartItem[]>();
   
    const customeremail=await this.userRepo.findEmailById(customerId)
    if (!customeremail) {
  throw new Error('Customer email not found'); // or return an error response
}

    // Group items by vendor
    for (const item of items) {
      if (!grouped.has(item.vendorId)) grouped.set(item.vendorId, []);
      grouped.get(item.vendorId)!.push(item);
    }

    const createdOrders: IOrder[] = [];

    for (const [vendorId, vendorItems] of grouped) {
      const totalCost = await this.calculateTotal(vendorItems, customeremail);

      const orderData: IOrder = {
        customerId,
        vendorId,
        items: vendorItems.map(({ productId, quantity }) => ({ productId, quantity })),
        totalCost,
        status: 'Pending',
        createdAt: new Date(),
         timezone, 
      };

      const order = await this.orderRepo.createOrder(orderData);
      createdOrders.push(order);
    }

    await this.cartRepo.clearCart(customerId);
    return createdOrders;
  }

  private async calculateTotal(items: CartItem[],customeremail:string): Promise<number> {
    let total = 0;
     const encodedEmail = customeremail.replace(/\./g, '%2E');  // match your frontend encoding
    for (const item of items) {
      const product = await ProductModel.findById(item.productId);
      if (product) {
       const customPrice = product.customPricing?.get(encodedEmail);
      const unitPrice = customPrice ?? product.pricePerUnit;
      total += unitPrice * item.quantity;
      }
    }
    return total;
  }
}
