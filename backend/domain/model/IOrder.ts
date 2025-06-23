// domain/model/IOrder.ts

export interface IOrderItem {
  productId: string;
  quantity: number;
}

export interface IOrder {
  customerId: Object;
  vendorId: Object;
  items: IOrderItem[];
  totalCost: number;
  status: 'Pending' | 'Accepted' | 'Rejected' | 'Shipped' | 'Delivered';
  createdAt?: Date;
    timezone?:string
}
