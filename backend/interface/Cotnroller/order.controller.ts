// presentation/controllers/OrderController.ts
import { Request, Response } from 'express';
import { CreateOrder } from '../../application/usecase/Order/CreateOrder';
import { GetVendorOrders } from '../../application/usecase/Order/GetVendorOrders';
import { UpdateOrderStatus } from '../../application/usecase/Order/UpdateOrderStatus';
import { ExtendedRequest } from '../../infrastructure/middleware/types/ExtendedRequest';
import { AddToCartUseCase } from '../../application/usecase/Cart/AddCart';
import { GetCartUseCase } from '../../application/usecase/Cart/GetCart';
import { RemoveItemFromCartUseCase } from '../../application/usecase/Cart/Removeitem';
import { GetAllOrders } from '../../application/usecase/Order/GetAllOrders';
import { GetUSerOrder } from '../../application/usecase/Order/GetUserOrder';
import { formatToUserTimezone } from '../../utils/TimeFormatter';

export class OrderController {
  constructor(
    private createOrder: CreateOrder,
    private getVendorOrders: GetVendorOrders,
    private updateOrderStatus: UpdateOrderStatus,
    private addcart:AddToCartUseCase,
    private getcart:GetCartUseCase,
    private removeitemfromcart:RemoveItemFromCartUseCase,
    private getallorders:GetAllOrders,
    private getuserordder:GetUSerOrder
  ) {}

  async create(req: ExtendedRequest, res: Response) {
      if (!req.user) return res.sendStatus(403);
    const { items,timezone } = req.body;
    const customerId = req.user.id;
   
    console.log("backend time", timezone)
    const order = await this.createOrder.execute(customerId, items,timezone);
   res.status(201).json(order.map(o => ({
  ...o,
  createdAt: formatToUserTimezone(o.createdAt!, o.timezone || 'UTC'),
})));
  }


  async getallordersinadmin(req:Request,res:Response){
    const orders=await this.getallorders.execute()
    res.json(orders.map(order => {
  const tz = order.timezone || 'UTC';
  return {
    ...order,
    createdAt: formatToUserTimezone(order.createdAt!, tz),
    updatedAt: formatToUserTimezone(order.updatedAt!, tz), // ✅ add this line
  }}));

  }


  async getForVendor(req: ExtendedRequest, res: Response) {
      if (!req.user) return res.sendStatus(403);
    const vendorId = req.user.id;
    const timezone = (req.query.timezone as string) || 'UTC';
    const orders = await this.getVendorOrders.execute(vendorId,timezone);
    res.json(orders);
  }

async updateStatus(req: ExtendedRequest, res: Response) {
  if (!req.user) return res.sendStatus(403);

  const vendorId = req.user.id;
  const orderId = req.params.id;
  const action = req.params.action.toLowerCase();
  console.log("update",vendorId,orderId,action)

  if (!['accepted', 'rejected', 'shipped', 'delivered'].includes(action)) {
  return res.status(400).json({ error: 'Invalid action' });
}
const status = action.charAt(0).toUpperCase() + action.slice(1).toLowerCase();

  try {
    const updatedOrder = await this.updateOrderStatus.execute(orderId, vendorId, status);
    if (!updatedOrder) {
      return res.status(404).json({ error: 'Order not found or not yours' });
    }
    console.log("final update", updatedOrder)
    res.json(updatedOrder);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update order status' });
  }
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

  async getOrders(req:ExtendedRequest,res:Response){
    if(!req.user) return res.sendStatus(403)
    const customerId=req.user.id
  const orderbyuser=await this.getuserordder.execute(customerId)
  res.status(200).json(orderbyuser)
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
