// presentation/controllers/OrderController.ts
import { Request, Response } from 'express';
import { CreateOrder } from '../../application/usecase/Order/CreateOrder';
import { GetVendorOrders } from '../../application/usecase/Order/GetVendorOrders';
import { UpdateOrderStatus } from '../../application/usecase/Order/UpdateOrderStatus';
import { ExtendedRequest } from '../../infrastructure/middleware/types/ExtendedRequest';
import { AddToCartUseCase } from '../../application/usecase/Cart/AddCart';
import { GetCartUseCase } from '../../application/usecase/Cart/GetCart';
import { RemoveItemFromCartUseCase } from '../../application/usecase/Cart/Removeitem';


export class OrderController {
  constructor(
    private createOrder: CreateOrder,
    private getVendorOrders: GetVendorOrders,
    private updateOrderStatus: UpdateOrderStatus,
    private addcart:AddToCartUseCase,
    private getcart:GetCartUseCase,
    private removeitemfromcart:RemoveItemFromCartUseCase
  ) {}

  async create(req: ExtendedRequest, res: Response) {
      if (!req.user) return res.sendStatus(403);
    const { items } = req.body;
    const customerId = req.user.id;
    const order = await this.createOrder.execute(customerId, items);
    res.status(201).json(order);
  }

  async getForVendor(req: ExtendedRequest, res: Response) {
      if (!req.user) return res.sendStatus(403);
    const vendorId = req.user.id;
    const orders = await this.getVendorOrders.execute(vendorId);
    res.json(orders);
  }

  async updateStatus(req: ExtendedRequest, res: Response) {
      if (!req.user) return res.sendStatus(403);
      console.log('update')
    const vendorId = req.user.id;
    const { status } = req.body;
    const order = await this.updateOrderStatus.execute(req.params.id, vendorId, status);
    res.json(order);
  }

    // ✅ New method for adding to cart
 async addToCart(req: ExtendedRequest, res: Response) {
  if (!req.user) return res.sendStatus(403);
  const { productId, quantity, vendorId } = req.body;

  try {
    const result = await this.addcart.execute(req.user.id, productId, quantity, vendorId);
    res.status(200).json({ message: 'Product added to cart', cart: result });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}


  async getCart(req: ExtendedRequest, res: Response) {
    if (!req.user) return res.sendStatus(403);
    const customerId = req.user.id;
    const cart = await this.getcart.execute(customerId);
    res.json(cart);
  }
  
  async removeFromCart(req: ExtendedRequest, res: Response) {
    console.log("heloo")
  if (!req.user) return res.sendStatus(403);
  const { productId } = req.params;


  try {
    const cart = await this.removeitemfromcart.execute(req.user.id, productId);
    res.status(200).json({ message: 'Product removed', cart });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}

}
