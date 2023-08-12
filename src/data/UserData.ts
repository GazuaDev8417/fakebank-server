import UserModel from "../model/UserModel"
import { Statement, User } from "../model/types"
import ConnectDatabase from "./ConnectDatabase"



export default class UserData extends ConnectDatabase{
    protected USER_TABLE = 'labebank'
    protected STATEMENT_TABLE = 'labebank_statement'


    findByEmail = async(email:string):Promise<User>=>{
        try{

            const [user]:User[] = await ConnectDatabase.con(this.USER_TABLE).where({ email })

            return user
        }catch(e){
            throw new Error(`Erro ao buscar cliente: ${e}`)
        }
    }

    findById = async(id:string):Promise<User>=>{
        try{

            const [user] = await ConnectDatabase.con(this.USER_TABLE).where({ id })

            return user
        }catch(e){
            throw new Error(`Erro ao buscar cliente: ${e}`)
        }
    }

    singup = async(user:UserModel):Promise<void>=>{
        try{

            await user.save()

        }catch(e){
            throw new Error(`Error ao criar cliente: ${e}`)
        }
    }

    showClients = async():Promise<User[]>=>{
        try{

            const clients = await ConnectDatabase.con(this.USER_TABLE)

            return clients
        }catch(e){
            throw new Error(`Erro ao buscar clientes: ${e}`)
        }
    }

    getStatement = async(cpf:string):Promise<Statement[]>=>{
        try{

            const statement = await ConnectDatabase.con(this.STATEMENT_TABLE).where({
                client_id: cpf
            }) 

            return statement
        }catch(e){
            throw new Error(`Erro ao imprimir extrato: ${e}`)
        }
    }

    payment = async(input:Statement, user:User):Promise<void>=>{
        try{

            await ConnectDatabase.con(this.USER_TABLE).update({
                balance: user.balance - input.value
            })

            await ConnectDatabase.con(this.STATEMENT_TABLE).insert(input)

        }catch(e){
            throw new Error(`Erro ao realizar pagamento: ${e}`)
        }
    }
}