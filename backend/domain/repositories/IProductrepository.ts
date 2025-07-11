import { IProduct } from '../model/IProduct';

export interface IProductRepository {
  create(product: Omit<IProduct, 'id'>): Promise<IProduct>;
  findAll(): Promise<IProduct[]>;
  findUnblockProducts():Promise<IProduct[]>
  update(id: string, vendorId: string, updateData: Partial<IProduct>): Promise<IProduct | null>;
  delete(id: string, vendorId: string): Promise<void>;
  findvendorproduct(vendorId:string):Promise<IProduct[]>
  findById(productId: string): Promise<any>;
  setCustomPrice(productId: string, customerId: string, price: number): Promise<void>;
  unblockProduct(productId: string): Promise<IProduct | null>
  blockProduct(productId: string): Promise<IProduct | null>
}
