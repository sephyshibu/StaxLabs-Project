import { IProduct } from '../model/IProduct';

export interface IProductRepository {
  create(product: Omit<IProduct, 'id'>): Promise<IProduct>;
  findAll(): Promise<IProduct[]>;
  update(id: string, vendorId: string, updateData: Partial<IProduct>): Promise<IProduct | null>;
  delete(id: string, vendorId: string): Promise<void>;
  findvendorproduct(vendorId:string):Promise<IProduct[]>
}
