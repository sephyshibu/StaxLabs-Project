// controllers/product.controller.ts
import { Request, Response } from 'express';
import {ProductModel} from '../../infrastructure/models/ProductsModel';
import { ExtendedRequest } from '../../infrastructure/middleware/types/ExtendedRequest';
import { CreateProductUseCase } from '../../application/usecase/Product/Addproduct';
import { DeleteProductUseCase } from '../../application/usecase/Product/DeleteProduct';
import { UpdateProductUseCase } from '../../application/usecase/Product/UpdateProduct';
import { GetAllProductProductUseCase } from '../../application/usecase/Product/GetAllProduct';
import { GetVendorProductProductUseCase } from '../../application/usecase/Product/GetVendorproduct';
import { SetCustomPriceUseCase } from '../../application/usecase/Product/SetCustomPrice';
import { BlockProductUseCase } from '../../application/usecase/Product/BlockProduct';
import { UnblockProductUseCase } from '../../application/usecase/Product/UnBlock';
import { GetUnBlockProductProductUseCase } from '../../application/usecase/Product/GetUnBLockProducts';
export class ProductController{

    constructor(
        private _createproducts:CreateProductUseCase,
        private _deleteproduct:DeleteProductUseCase,
        private _updateproduct:UpdateProductUseCase,
        private _getallproduct:GetAllProductProductUseCase,
        private _getvendorproduct:GetVendorProductProductUseCase,
        private _setcustomprice:SetCustomPriceUseCase,
        private _blockproduct:BlockProductUseCase,
        private _unblockproduct:UnblockProductUseCase,
        private _getunblock:GetUnBlockProductProductUseCase
      ){}

     async createProduct(req: ExtendedRequest, res: Response) {
    if (!req.user) return res.sendStatus(403);
    const product = await this._createproducts.execute({
      ...req.body,
      vendorId: req.user.id,
    });
    res.status(201).json(product);
  }

  async updateProduct(req: ExtendedRequest, res: Response) {
    if (!req.user) return res.sendStatus(403);
   try {
      const productId = req.params.id;
      const vendorId = req.user.id;
      const updateData = req.body;

      const updated = await this._updateproduct.updateproduct(productId, vendorId, updateData);

      if (!updated) return res.status(404).json({ message: 'Product not found or not authorized' });

      res.status(200).json(updated);
    } catch (err) {
      console.error('Error updating product:', err);
      res.status(500).json({ message: 'Server error' });
    }
  }
  

  async deleteProduct(req: ExtendedRequest, res: Response) {
    if (!req.user) return res.sendStatus(403);
    await this._deleteproduct.deleteproduct(req.params.id, req.user.id);
    res.sendStatus(204);
  }

  async getAllProducts(req: Request, res: Response) {
    const products = await this._getallproduct.getAllProduct();
    res.json(products);
  }

  async getUnblockProducts(req: Request, res: Response) {
    const products = await this._getunblock.getUnBlocProduct();
    res.json(products);
  }

  async getvendorproduct(req: Request, res: Response) {
  try {
    const { vendorId } = req.params;

    const vendorProducts = await this._getvendorproduct.getVendorProduct(vendorId);

    return res.status(200).json(vendorProducts);
  } catch (error) {
    console.error('Error fetching vendor products:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
// async setCustomPriceForCustomer(req: Request, res: Response) {
//     const { productId } = req.params;
//     const { customerId, customPrice } = req.body;

//     try {
//       await this._setcustomprice.execute(productId, customerId, customPrice);
//       res.status(200).json({ message: 'Custom price set successfully' });
//     } catch (err: any) {
//       res.status(400).json({ error: err.message });
//     }
//   }

async setCustomPrice(req: ExtendedRequest, res: Response) {
  const vendorId = req.user?.id;
  const productId = req.params.id;
  const { email, price } = req.body;

  if (!email || !price) return res.status(400).json({ error: 'Missing email or price' });

  const product = await ProductModel.findOne({ _id: productId, vendorId });
  if (!product) return res.status(404).json({ error: 'Product not found' });
  const safeEmail = email.replace(/\./g, '%2E');


  product.customPricing.set(safeEmail, price);
  await product.save();

  res.json({ message: 'Custom pricing updated', product });
}
async blockProduct(req:ExtendedRequest, res:Response) {
   if (!req.user) return res.sendStatus(403);
  const product = await this._blockproduct.blockProduct(req.params.id);
  res.json(product);
}

async unblockProduct(req:ExtendedRequest, res:Response) {
   if (!req.user) return res.sendStatus(403);
  const product = await this._unblockproduct.unblockProduct(req.params.id);
  res.json(product);
}


}




