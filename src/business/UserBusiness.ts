import { Request } from "express"
import UserData from "../data/UserData"
import UserModel from "../model/UserModel"
import { Statement, User } from "../model/types"
import Services from "../services/Services"
import authToken from "../services/authToken"


export default class UserBusiness{
    constructor(
        private userData:UserData,
        private services:Services
    ){}

    /* showTables = async():Promise<object>=>{
        const tables = await this.userData.showTables()

        return tables
    } */


    showClient = async():Promise<User[]>=>{
        const clients = await this.userData.showClients()
        if(clients.length === 0){
            throw{
                statusCode: 404,
                error: new Error('Nenhum cliente cadastrado')
            }
        }

        return clients
    }

    signup = async(req:Request):Promise<string>=>{
        const { name, cpf, initialDate, email, password, passwordConf } = req.body
        const [day, month, year] = initialDate.split('/')
		const birthDate = new Date(`${year}-${month}-${day}`)
		const millisecondsAge = Date.now() - birthDate.getTime()
		const age = millisecondsAge / 1000 / 60 / 60 /24 / 365
        
        if(!name || !cpf || !initialDate || !email || !password || !passwordConf){
            throw{
                statusCode: 401,
                error: new Error('Preencha os campos')
            }
        }

        if(age < 18){
            throw{
                statusCode: 403,
                error: new Error('Necessário ser maior de idade!')
            }
            
        }

        const registeredUser:User = await this.userData.findByEmail(email)  
        const clients = (await this.userData.showClients()).map(client=>{
            return this.services.compare(String(cpf), client.cpf)
        }) 
        
        if(registeredUser || clients[0]){
            throw{
                statusCode: 403,
                error: new Error('Cliente já cadastrado!')
            }
        }

        if(password.length < 6){
            throw{
                statusCode: 403,
                error: new Error('A senha deve ter o mínimo de 6 caracteres')
            }
        }

        if(password !== passwordConf){
            throw{
                statusCode: 403,
                error: new Error('As senhas não correspondem!')
            }
        }
        
        const id = this.services.idGenerator()
        const hash = this.services.hash(password)
        const hashCPF = this.services.hash(String(cpf))
        const token = this.services.token(id)
        const balance = 0

        const user = new UserModel(
            id,
            name,
            hashCPF,
            birthDate,
            balance,
            email,
            hash
        )

        await this.userData.singup(user)

        return token
    }    

    login = async(req:Request):Promise<string>=>{
        const { email, password } = req.body

        if(!email || !password){
            throw{
                statusCode: 401,
                error: new Error('Preencha os campos')
            }
        }

        const user = await this.userData.findByEmail(email)
        if(!user){            
            throw{
                statusCode: 403,
                error: new Error('Cliente não encontrado')
            }
        }

        const compare = this.services.compare(password, user.password)
        if(!compare){
            throw{
                statusCode: 403,
                error: new Error('Cliente não encontrado')
            }
        }

        const token = this.services.token(user.id)

        return token
    }

    findById = async(req:Request):Promise<User>=>{
        const user = await authToken(req)

        return user
    }

    balance = async(req:Request):Promise<number>=>{
        const user = await authToken(req)
        const { cpf, password } = req.body
        
        if(!cpf || !password){
            throw{
                statusCode: 401,
                error: new Error('Preencha os campos')
            }            
        }

        if(String(cpf).length !== 11){
            throw{
                statusCode: 403,
                error: new Error('CPF inválido!')
            }
        }

        if(
            !this.services.compare(password, user.password) ||
            !this.services.compare(String(cpf), user.cpf)
        ){
            throw{
                statusCode: 401,
                error: new Error('Cliente não encontrado')
            }
        }

        return user.balance
    }

    getStatement = async(req:Request):Promise<Statement[]>=>{
        const user = await authToken(req)
        const { cpf, password } = req.body
        if(!cpf || !password){
            throw{
                statusCode: 401,
                error: new Error('Preencha os campos')
            }            
        }

        if(
            !this.services.compare(password, user.password) ||
            !this.services.compare(String(cpf), user.cpf)
        ){
            throw{
                statusCode: 401,
                error: new Error('Cliente não encontrado')
            }
        }

        const statement = await this.userData.getStatement(user.cpf)

        return statement
    }

    payment = async(req:Request):Promise<void>=>{
        const user = await authToken(req)
        const {password, cpf, initialDate, value, description } = req.body
        const convert = initialDate.split('/')
        const date = new Date(`${convert[2]}-${convert[1]}-${convert[0]}`)

        if(!password || !cpf || !initialDate || !value || !description){
            throw{
                statusCode: 401,
                error: new Error('Preencha os campos')
            }
        }

        if(date.getTime() < Date.now()){
            throw{
                statusCode: 403,
                error: new Error('Data do pagagmento não pode ser inferior a atual!')
            }
        }

        if(
            !this.services.compare(password, user.password) ||
            !this.services.compare(String(cpf), user.cpf)
        ){
            throw{
                statusCode: 401,
                error: new Error('Cliente não encontrado')
            }
        }

        if(value > user.balance){
            throw{
                statusCode: 403,
                error: new Error('Saldo insuficiente para efetuar pagamento!')
            }
        }

        const id = this.services.idGenerator()
        const client_id = user.cpf

        const input:Statement = {
            id,
            value,
            date,
            description,
            client_id
        }

        await this.userData.payment(input, user)
    }

    deposit = async(req:Request):Promise<User>=>{
        const user = await authToken(req)
        const {password, cpf, value } = req.body

        if(!password || !cpf || !value){
            throw{
                statusCode: 401,
                error: new Error('Preencha os campos')
            }
        }

        if(
            !this.services.compare(password, user.password) ||
            !this.services.compare(String(cpf), user.cpf)
        ){
            throw{
                statusCode: 401,
                error: new Error('Cliente não encontrado')
            }
        }

        const id = this.services.idGenerator()
        const client_id = user.cpf
        const date = new Date()
        const description = `Deposito no valor de R$ ${value.toFixed(2)}`

        const input:Statement = {
            id,
            value,
            date,
            description,
            client_id
        }

        await this.userData.deposit(input, user)

        return user
    }

    transfer = async(req:Request):Promise<void>=>{
        const user = await authToken(req)
        const { password, cpf, recipientName, recipientCpf, value } = req.body

        if(!password || !cpf || !recipientName || !recipientCpf || !value){
            throw{
                statusCdde: 401,
                error: new Error('Preencha os campos')
            }
        }

        if(recipientCpf === cpf){
            throw{
                statusCode: 403,
                error: new Error('Os CPFs do depositante e destinatário são os mesmos')
            }
        }

        if(
            !this.services.compare(password, user.password) ||
            !this.services.compare(String(cpf), user.cpf)
        ){
            throw{
                statusCode: 401,
                error: new Error('Cliente não encontrado')
            }
        }

        const [recipients]:User[] = (await this.userData.showClients())
            .filter(recipient=>{
                return this.services.compare(String(recipientCpf), recipient.cpf)
            })
        
        if(!recipients){
            throw{
                statusCode: 404,
                error: new Error('Destinatário para transferência não localizado. Certifique-se de que essa pessoa possui a respectiva conta')
            }
        }else if(recipients.name !== recipientName){
            throw{
                statusCode: 404,
                error: new Error('Nome e CPF do destinatário não correspondem')
            }
        }
        
        if(user.balance < value){
            throw{
                statusCode: 403,
                error: new Error('Saldo insuficiente')
            }
        }

        const input:Statement[] =[
            {
               id: this.services.idGenerator(),
               value,
               date: new Date(),
               description: `Transferência no valor ${value.toFixed(2)} para a conta de ${recipientName}`,
               client_id: user.cpf
           },
           {
               id: this.services.idGenerator(),
               value,
               date: new Date(),
               description: `Transferência no valor ${value.toFixed(2)} enviada por ${user.name}`,
               client_id: recipients.cpf
           }
        ]
        
        for(let inputItem of input){
            await this.userData.transfer(inputItem, user, recipients)
        }
    }
}