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
export class ProductController{

    constructor(
        private _createproducts:CreateProductUseCase,
        private _deleteproduct:DeleteProductUseCase,
        private _updateproduct:UpdateProductUseCase,
        private _getallproduct:GetAllProductProductUseCase,
        private _getvendorproduct:GetVendorProductProductUseCase,
        private _setcustomprice:SetCustomPriceUseCase
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
    const updated = await this._updateproduct.updateproduct(
      req.params.id,
      req.user.id,
      req.body
    );
    res.status(updated ? 200 : 404).json(updated);
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


}




