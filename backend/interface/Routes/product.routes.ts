import express from 'express';
import {ProductModel} from '../../infrastructure/models/ProductsModel';
import { roleGuard } from '../../infrastructure/middleware/RoleGaurd';
import { ProductController } from '../Cotnroller/product.controller';

import { CreateProductUseCase } from '../../application/usecase/Product/Addproduct';
import { DeleteProductUseCase } from '../../application/usecase/Product/DeleteProduct';
import { UpdateProductUseCase } from '../../application/usecase/Product/UpdateProduct';
import { GetAllProductProductUseCase } from '../../application/usecase/Product/GetAllProduct';
import { GetVendorProductProductUseCase } from '../../application/usecase/Product/GetVendorproduct';
import { SetCustomPriceUseCase } from '../../application/usecase/Product/SetCustomPrice';
import { BlockProductUseCase } from '../../application/usecase/Product/BlockProduct';
import { UnblockProductUseCase } from '../../application/usecase/Product/UnBlock';


import { ProductRepositoryImpl } from '../../infrastructure/repositories/ProductRepoImpl';

const productrouter = express.Router();


const productrepository=new ProductRepositoryImpl()

const createproduct=new CreateProductUseCase(productrepository)
const deletingproduct= new DeleteProductUseCase(productrepository)
const updateingproduct= new UpdateProductUseCase(productrepository)
const getallproduct= new GetAllProductProductUseCase(productrepository)
const vendorproducts= new GetVendorProductProductUseCase(productrepository)
const setcustomprice=new SetCustomPriceUseCase(productrepository)
const blockproduct=new BlockProductUseCase(productrepository)
const unblockproduct= new UnblockProductUseCase(productrepository)




const productcontroller= new ProductController(
    createproduct,
    deletingproduct,
    updateingproduct,
    getallproduct,
    vendorproducts,
    setcustomprice,
    blockproduct,
    unblockproduct
)

productrouter.post('/', roleGuard(['vendor']), async (req, res) => {
  await productcontroller.createProduct(req, res);
});


productrouter.get('/', async (req, res) =>{
  await productcontroller.getAllProducts(req, res)
});

productrouter.get('/:vendorId', async (req, res) =>{
  await productcontroller.getvendorproduct(req, res)
});
productrouter.patch('/:id', roleGuard(['vendor']), async(req, res) =>{
  await productcontroller.updateProduct(req, res)
});

productrouter.delete('/:id', roleGuard(['vendor']), async(req, res) =>{
  await productcontroller.deleteProduct(req, res)
});


productrouter.patch('/:id/custom-pricing', roleGuard(['vendor']), async (req, res) => {
  await productcontroller.setCustomPrice(req, res);
});

productrouter.patch('/:id/block', roleGuard(['admin']),async(req,res)=>{
  await productcontroller.blockProduct(req,res);
});


productrouter.patch('/:id/unblock', roleGuard(['admin']), async(req,res)=>{
  await productcontroller.unblockProduct(req,res);
});



export default productrouter;
