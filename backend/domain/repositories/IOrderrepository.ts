

import { IOrder } from '../model/IOrder';

export interface IOrderRepository {
  createOrder(order: IOrder): Promise<IOrder>;
  getAllOrders():Promise<IOrder[]>
  getOrdersByVendor(vendorId: string): Promise<IOrder[]>;
  updateOrderStatus(orderId: string, vendorId: string, status: string): Promise<IOrder | null>;
  getUSerOrders(customerId:string):Promise<IOrder[]|null>
}
