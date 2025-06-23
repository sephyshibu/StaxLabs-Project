// infrastructure/repositories/OrderRepositoryImpl.ts

import { IOrderRepository } from '../../domain/repositories/IOrderrepository';
import OrderModel from '../models/OrderModel';
import { IOrder } from '../../domain/model/IOrder';

export class OrderRepositoryImpl implements IOrderRepository {
  async createOrder(data: IOrder): Promise<IOrder> {
    return await OrderModel.create(data);
  }

  async getAllOrders(): Promise<IOrder[]> {
      return await OrderModel.find()
  }

  async getOrdersByVendor(vendorId: string): Promise<IOrder[]> {
    return await OrderModel.find({ vendorId })
      .populate('customerId', 'name email')
      .populate('items.productId', 'title pricePerUnit');
  }

  async updateOrderStatus(orderId: string, vendorId: string, status: string): Promise<IOrder | null> {
    return await OrderModel.findOneAndUpdate(
      { _id: orderId, vendorId },
      { status },
      { new: true }
    );
  }
}
