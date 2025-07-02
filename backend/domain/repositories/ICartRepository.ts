
export interface ICartRepository {
  saveCart(userId: string, items: any[]): Promise<any>;
  getCart(userId: string): Promise<any>;
  clearCart(userId: string): Promise<void>;
  removeItemFromCart(userId: string, productId: string): Promise<any>;
}
