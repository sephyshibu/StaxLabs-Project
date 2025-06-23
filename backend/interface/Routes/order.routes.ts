// presentation/routes/order.routes.ts
import express from 'express';
import { roleGuard } from '../../infrastructure/middleware/RoleGaurd';
import { OrderRepositoryImpl } from '../../infrastructure/repositories/OrderRepoImpl';
import { CartRepoImpl } from '../../infrastructure/repositories/CartRepoImpl';


import { CreateOrder } from '../../application/usecase/Order/CreateOrder';
import { GetVendorOrders } from '../../application/usecase/Order/GetVendorOrders';
import { UpdateOrderStatus } from '../../application/usecase/Order/UpdateOrderStatus';
import { AddToCartUseCase } from '../../application/usecase/Cart/AddCart';
import { GetCartUseCase } from '../../application/usecase/Cart/GetCart';
import { RemoveItemFromCartUseCase } from '../../application/usecase/Cart/Removeitem';
import { OrderController } from '../Cotnroller/order.controller';

const orderrouter = express.Router();

const orderRepo = new OrderRepositoryImpl();
const cartRepo= new CartRepoImpl()

const orderController = new OrderController(
  new CreateOrder(orderRepo,cartRepo),
  new GetVendorOrders(orderRepo),
  new UpdateOrderStatus(orderRepo),
  new AddToCartUseCase(cartRepo),
  new GetCartUseCase(cartRepo),
  new RemoveItemFromCartUseCase(cartRepo)
);

orderrouter.post('/', roleGuard(['customer']), async (req, res) => {
    await orderController.create(req, res)
});


orderrouter.get('/incoming', roleGuard(['vendor']), async(req, res) => {
    await orderController.getForVendor(req, res)
});


orderrouter.patch('/:id/:action', roleGuard(['vendor']), async(req, res) => {
  await orderController.updateStatus(req, res);
});

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
