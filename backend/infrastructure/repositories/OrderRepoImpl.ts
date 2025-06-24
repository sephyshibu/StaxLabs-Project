// infrastructure/repositories/OrderRepositoryImpl.ts

import { IOrderRepository } from '../../domain/repositories/IOrderrepository';
import OrderModel from '../models/OrderModel';
import { IOrder } from '../../domain/model/IOrder';
import { IProduct } from '../../domain/model/IProduct';
import { ProductModel } from '../models/ProductsModel';

export class OrderRepositoryImpl implements IOrderRepository {
  async createOrder(data: IOrder): Promise<IOrder> {
    const timezone=data?.timezone||'UTC'
    return await OrderModel.create(data);
  }

async getAllOrders(): Promise<IOrder[]> {
  const orders= await OrderModel.find()
    .populate('vendorId', 'name') // fetch vendor name only
    .populate('customerId', 'name') // fetch customer name only
    .populate('items.productId', 'title pricePerUnit'); // fetch product name & price
    return orders.map(order => order.toObject()); // ✅ convert to plain object
  }
  
async getUSerOrders(customerId: string): Promise<IOrder[] | null> {
    const orders=await OrderModel.find({customerId})
    if(!orders) return null
    return orders
}

async getOrdersByVendor(vendorId: string): Promise<IOrder[]> {
    return await OrderModel.find({ vendorId })
      .populate('customerId', 'name email')
      .populate('items.productId', 'title pricePerUnit');
  }

  async updateOrderStatus(orderId: string, vendorId: string, status: string): Promise<IOrder | null> {
  const order = await OrderModel.findOne({ _id: orderId, vendorId })
    .populate('items.productId');
  

  console.log("updated order",order)
  if (!order) return null;


  if (status === 'Accepted') {
    for (const item of order.items) {
      const product = item.productId as unknown as IProduct & { save: () => Promise<void> };
      const qty = item.quantity;

      if (product.availableQty < qty) {
        throw new Error(`Not enough stock for ${product.title}`);
      }

      product.availableQty -= qty;
      await product.save(); // Mongoose document has .save()
    }
  }

  order.status = status as IOrder['status'];

  const response=await order.save();
    console.log("order inte status", response)
  return order;
}
}
