const connection = require('../connection/connection')
const Authenticate = require('../services/Authenticate')


const login =  async(req, res)=>{
  let statusCode = 400

  try{

    const { email, password } = req.body
    

    if(!email || !password){
      statusCode = 401
      throw new Error('Preencha os campos')
    }


    const [client] = await connection('labebank').where({
      email
    })

    if(!client){
      statusCode = 404
      throw new Error('Cliente não encontrado')
    }

    const compare = new Authenticate().compare(password, client.password)
    const token = new Authenticate().token(client.id)

    if(!compare){
      statusCode = 404
      throw new Error('Usuário não encontrado')
    }


    res.status(200).send(token)
  }catch(error){
    res.status(statusCode).send(error.message || error.sqlMessage)
  }
}

module.exports = login
