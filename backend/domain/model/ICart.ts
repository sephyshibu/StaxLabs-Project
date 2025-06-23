// domain/model/ICart.ts

export interface ICartItem {
  productId: string;
  quantity: number;
  vendorId: string;
}

export interface ICart {
  userId: string;
  items: ICartItem[];
  createdAt?: Date;
  updatedAt?: Date;
}
