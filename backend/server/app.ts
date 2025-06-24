import express ,{Application} from 'express'
import cors from 'cors';
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import { authenticateJWT } from '../infrastructure/middleware/Auth';

import authrouter from '../interface/Routes/auth.route';
import userrouter from '../interface/Routes/user.routes';
import orderrouter from '../interface/Routes/order.routes';
import productrouter from '../interface/Routes/product.routes';

export class App{
    public app:Application;

    constructor(){
        dotenv.config()
        this.app=express()
        this.setMiddleware()
        this.setRoutes()
        
    }

    private setMiddleware():void{
        this.app.use(cors({
            origin: ['http://localhost:5173', 'http://localhost:5174','http://localhost:5175','https://www.home-pro.sephy.live'],
            credentials:true
        }))
        this.app.use(express.json())
        this.app.use(express.urlencoded({ extended: true }));

        this.app.use(cookieParser())
     
     
    }

    private setRoutes():void{

        this.app.use('/api/auth', authrouter);
        this.app.use('/api/users', authenticateJWT, userrouter);
        this.app.use('/api/products', authenticateJWT, productrouter);
        this.app.use('/api/orders', authenticateJWT, orderrouter);

    }
}