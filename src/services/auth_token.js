const con = require('../connection/connection')
const Authenticate = require('../services/Authenticate')


const auth_token = async(req)=>{
    const token = req.headers.authorization
    const tokenData = new Authenticate().tokenData(token)
    const [labebankUser] = await con('labebank').where({
        id: tokenData.payload
    })

    if(!labebankUser){
        throw new Error('Token ausente, expirado ou inválido!')
    }

    return labebankUser
}

module.exports = auth_token