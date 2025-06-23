// application/usecases/order/GetVendorOrders.ts
import { IOrderRepository } from '../../../domain/repositories/IOrderrepository';
import { IOrder } from '../../../domain/model/IOrder';

export class GetVendorOrders {
  constructor(private orderRepo: IOrderRepository) {}

  async execute(vendorId: string): Promise<IOrder[]> {
    return await this.orderRepo.getOrdersByVendor(vendorId);
  }
}
