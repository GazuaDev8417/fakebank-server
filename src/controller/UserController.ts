import { Request, Response } from "express"
import UserBusiness from "../business/UserBusiness"
import { User } from "../model/types"


export default class UserController{
    constructor(
        private userBusiness:UserBusiness
    ){}

    signup = async(req:Request, res:Response):Promise<void>=>{
        try{

            const token = await this.userBusiness.signup(req)

            res.status(201).send(token)            
        }catch(e:any){
            let statusCode = 400 || e.statusCode
            let message = e.error === undefined ? e.message : e.error.message
            res.status(statusCode).send(message || e.sqlMessage)
        }
    }

    login = async(req:Request, res:Response):Promise<void>=>{
        try{

            const token = await this.userBusiness.login(req)

            res.status(200).send(token)
        }catch(e:any){
            let statusCode = 400 || e.statusCode
            let message = e.error === undefined ? e.message : e.error.message
            res.status(statusCode).send(message || e.sqlMessage)
        }
    }

    showClients = async(req:Request, res:Response):Promise<void>=>{
        try{

            const clients:User[] = await this.userBusiness.showClient()

            res.status(200).send(clients)
        }catch(e:any){
            let statusCode = 400 || e.statusCode
            let message = e.error === undefined ? e.message : e.error.message
            res.status(statusCode).send(message || e.sqlMessage)
        }
    }

    findById = async(req:Request, res:Response):Promise<void>=>{
        try{

            const user = await this.userBusiness.findById(req)

            res.status(200).send(user)
        }catch(e:any){
            let statusCode = 400 || e.statusCode
            let message = e.error === undefined ? e.message : e.error.message
            res.status(statusCode).send(message || e.sqlMessage)
        }
    }

    balance = async(req:Request, res:Response):Promise<void>=>{
        try{

            const balanceValue = await this.userBusiness.balance(req)

            res.status(200).send(String(balanceValue))
        }catch(e:any){
            let statusCode = 400 || e.statusCode
            let message = e.error === undefined ? e.message : e.error.message
            res.status(statusCode).send(message || e.sqlMessage)
        }
    }

    getStatement = async(req:Request, res:Response):Promise<void>=>{        
        try{

            const statement = await this.userBusiness.getStatement(req)

            res.status(200).send(statement)
        }catch(e:any){
            let statusCode = 400 || e.statusCode
            let message = e.error === undefined ? e.message : e.error.message
            res.status(statusCode).send(message || e.sqlMessage)
        }
    }

    payment = async(req:Request, res:Response):Promise<void>=>{
        try{

        }catch(e:any){
            let statusCode = 400 || e.statusCode
            let message = e.error === undefined ? e.message : e.error.message
            res.status(statusCode).send(message || e.sqlMessage)
        }
    }
}