export interface IProduct {
  id?: Object;
  title: string;
  description: string;
  pricePerUnit: number;
  minOrderQty: number;
  availableQty: number;
  vendorId: Object;
  customPricing: Map<string, number>; 
  isBlocked?: boolean; 
}
