import express from 'express';
import {ProductModel} from '../../infrastructure/models/ProductsModel';
import { roleGuard } from '../../infrastructure/middleware/RoleGaurd';
import { ProductController } from '../Cotnroller/product.controller';

import { CreateProductUseCase } from '../../application/usecase/Product/Addproduct';
import { DeleteProductUseCase } from '../../application/usecase/Product/DeleteProduct';
import { UpdateProductUseCase } from '../../application/usecase/Product/UpdateProduct';
import { GetAllProductProductUseCase } from '../../application/usecase/Product/GetAllProduct';
import { GetVendorProductProductUseCase } from '../../application/usecase/Product/GetVendorproduct';
import { ProductRepositoryImpl } from '../../infrastructure/repositories/ProductRepoImpl';

const productrouter = express.Router();


const productrepository=new ProductRepositoryImpl()

const createproduct=new CreateProductUseCase(productrepository)
const deletingproduct= new DeleteProductUseCase(productrepository)
const updateingproduct= new UpdateProductUseCase(productrepository)
const getallproduct= new GetAllProductProductUseCase(productrepository)
const vendorproducts= new GetVendorProductProductUseCase(productrepository)

const productcontroller= new ProductController(
    createproduct,
    deletingproduct,
    updateingproduct,
    getallproduct,
    vendorproducts
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
productrouter.put('/:id', roleGuard(['vendor']), async(req, res) =>{
  await productcontroller.updateProduct(req, res)
});

productrouter.delete('/:id', roleGuard(['vendor']), async(req, res) =>{
  await productcontroller.deleteProduct(req, res)
});

export default productrouter;
