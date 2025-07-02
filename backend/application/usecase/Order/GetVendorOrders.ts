// application/usecases/order/GetVendorOrders.ts
import { IOrderRepository } from '../../../domain/repositories/IOrderrepository';
import { IOrder } from '../../../domain/model/IOrder';
import moment from 'moment-timezone';
export class GetVendorOrders {
  constructor(private orderRepo: IOrderRepository) {}

  async execute(vendorId: string,timezone:string): Promise<IOrder[]> {
    const orders= await this.orderRepo.getOrdersByVendor(vendorId);
     return   orders.map(order => ({
    ...order,
    formattedCreatedAt: moment(order.createdAt).tz(timezone).format('YYYY-MM-DD HH:mm:ss'),
  }))
  }
}
