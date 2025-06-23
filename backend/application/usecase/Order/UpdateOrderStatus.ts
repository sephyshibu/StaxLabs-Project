// application/usecases/order/UpdateOrderStatus.ts
import { IOrderRepository } from '../../../domain/repositories/IOrderrepository';
import { IOrder } from '../../../domain/model/IOrder';

export class UpdateOrderStatus {
  constructor(private orderRepo: IOrderRepository) {}

  async execute(orderId: string, vendorId: string, status: string): Promise<IOrder | null> {
    return await this.orderRepo.updateOrderStatus(orderId, vendorId, status);
  }
}
