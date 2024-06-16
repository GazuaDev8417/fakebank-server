import { Request, Response } from "express"
import UserBusiness from "../business/UserBusiness"
import { User } from "../model/types"


export default class UserController{
    constructor(
        private userBusiness:UserBusiness
    ){}

    /* showTables = async(req:Request, res:Response):Promise<void>=>{
        try{

            const tables = await this.userBusiness.showTables()

            res.status(200).send(tables)
        }catch(e:any){
            let statusCode = 400 || e.statusCode
            let message = e.error === undefined ? e.message : e.error.message
            res.status(statusCode).send(message || e.sqlMessage)

        }
    } */

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

            await this.userBusiness.payment(req)

            res.status(200).send('Pagamento efetuado')
        }catch(e:any){
            let statusCode = 400 || e.statusCode
            let message = e.error === undefined ? e.message : e.error.message
            res.status(statusCode).send(message || e.sqlMessage)
        }
    }

    deposit = async(req:Request, res:Response):Promise<void>=>{
        const { value } = req.body
        try{

            const user = await this.userBusiness.deposit(req)
            
            res.status(200).send(`Deposito realizado com sucesso. Saldo atual: R$ ${(user.balance + value).toFixed(2)}`)
        }catch(e:any){
            let statusCode = 400 || e.statusCode
            let message = e.error === undefined ? e.message : e.error.message
            res.status(statusCode).send(message || e.sqlMessage)
        }
    }

    transfer = async(req:Request, res:Response):Promise<void>=>{
        const { value, recipientName } = req.body
        try{
            
            await this.userBusiness.transfer(req)

            res.status(200).send(`Vocẽ tranferênciu R$ ${value.toFixed(2)} para a conta de ${recipientName}`)
        }catch(e:any){
            let statusCode = 400 || e.statusCode
            let message = e.error === undefined ? e.message : e.error.message
            res.status(statusCode).send(message || e.sqlMessage)
        }
    }
}