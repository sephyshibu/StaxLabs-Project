// presentation/routes/order.routes.ts
import express from 'express';
import { roleGuard } from '../../infrastructure/middleware/RoleGaurd';
import { OrderRepositoryImpl } from '../../infrastructure/repositories/OrderRepoImpl';
import { CartRepoImpl } from '../../infrastructure/repositories/CartRepoImpl';
import { UserRepositoryImpl } from '../../infrastructure/repositories/UserRepoImpl';

import { CreateOrder } from '../../application/usecase/Order/CreateOrder';
import { GetVendorOrders } from '../../application/usecase/Order/GetVendorOrders';
import { UpdateOrderStatus } from '../../application/usecase/Order/UpdateOrderStatus';
import { AddToCartUseCase } from '../../application/usecase/Cart/AddCart';
import { GetCartUseCase } from '../../application/usecase/Cart/GetCart';
import { RemoveItemFromCartUseCase } from '../../application/usecase/Cart/Removeitem';
import { GetAllOrders } from '../../application/usecase/Order/GetAllOrders';
import { GetUSerOrder } from '../../application/usecase/Order/GetUserOrder';
import { OrderController } from '../Cotnroller/order.controller';

const orderrouter = express.Router();

const orderRepo = new OrderRepositoryImpl();
const cartRepo= new CartRepoImpl()
const userRepo=new UserRepositoryImpl()

const orderController = new OrderController(
  new CreateOrder(orderRepo,cartRepo,userRepo),
  new GetVendorOrders(orderRepo),
  new UpdateOrderStatus(orderRepo),
  new AddToCartUseCase(cartRepo),
  new GetCartUseCase(cartRepo),
  new RemoveItemFromCartUseCase(cartRepo),
  new GetAllOrders(orderRepo),
  new GetUSerOrder(orderRepo)
);

orderrouter.post('/', roleGuard(['customer']), async (req, res) => {
    await orderController.create(req, res)
});


orderrouter.get('/incoming', roleGuard(['vendor']), async(req, res) => {
    await orderController.getForVendor(req, res)
});

orderrouter.get('/', roleGuard(['admin']),async(req,res)=>{
    await orderController.getallordersinadmin(req,res)
})


orderrouter.patch('/:id/:action', roleGuard(['vendor']), async(req, res) => {
  await orderController.updateStatus(req, res);
});

orderrouter.get('/user/:id',roleGuard(['customer']),async(req,res)=>{
  await orderController.getOrders(req,res)
})

orderrouter.patch('/cart', roleGuard(['customer']), async(req, res) => {
    await orderController.addToCart(req, res)
});
orderrouter.get('/cart/:id', roleGuard(['customer']), async(req, res) => {
    await orderController.getCart(req, res)
});
orderrouter.delete('/cart/:productId', roleGuard(['customer']), async(req, res) =>{
  await orderController.removeFromCart(req, res)
}
);







export default orderrouter;
