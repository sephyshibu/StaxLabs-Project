import { IOrderRepository } from "../../../domain/repositories/IOrderrepository";
import { IOrder } from "../../../domain/model/IOrder";

export class GetAllOrders{
    constructor(private orderrepo:IOrderRepository){}

    async execute():Promise<IOrder[]>{
        return await this.orderrepo.getAllOrders()
    }
}