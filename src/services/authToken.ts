import { Request } from "express"
import { User } from "../model/types"
import Services from "./Services"
import UserData from "../data/UserData"


const authToken = async(req:Request):Promise<User>=>{
    const token = req.headers.authorization
    const tokenData = new Services().tokenData(token as string)
    const user = new UserData().findById(tokenData.payload)

    if(!user){
        throw{
            statusCode: 404,
            error: new Error('Erro ao buscar cliente')
        }
    }

    return user
}

export default authToken