export interface IProduct {
  id?: Object;
  title: string;
  description: string;
  pricePerUnit: number;
  minOrderQty: number;
  availableQty: number;
  vendorId: string;
  customPricing: Map<string, number>; // customerId -> price
}
