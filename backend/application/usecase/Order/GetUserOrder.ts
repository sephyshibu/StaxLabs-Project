import { IOrderRepository } from "../../../domain/repositories/IOrderrepository";

export class GetUSerOrder{
    constructor(private orderrepo:IOrderRepository){}

    async execute(customerId:string){
        const orderslist=await this.orderrepo.getUSerOrders(customerId)
        return orderslist || null
    }
}