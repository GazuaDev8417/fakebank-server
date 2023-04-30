const connection = require('../connection/connection')
const Authenticate = require('../services/Authenticate')
const auth_token = require('../services/auth_token')


const payment = async(req, res)=>{
  let statusCode = 400
  try{

    const user = await auth_token(req)
		const {password, cpf, initialDate, value, description } = req.body
    const convert = initialDate.split('/')
    const date = `${convert[2]}-${convert[1]}-${convert[0]}`
    const auth = new Authenticate()
        


    if(!password || !cpf || !initialDate || !value || !description){
      statusCode = 401
      throw new Error('Preencha os campos.')
    }
    

    if(new Date(initialDate).getTime() < Date.now()){
      statusCode = 403
      throw new Error('Data do pagagmento não pode ser inferior a data atual!')
    }
    

    if(!auth.compare(String(cpf), user.cpf)){
      statusCode = 404
      throw new Error('Cliente não encontrado!')
    }


    if(!auth.compare(password, user.password)){
      statusCode = 404
      throw new Error('Cliente não encontrado')
    }


    if(value > user.balance){
      statusCode = 403
      throw new Error('Saldo insuficiente para efetuar pagamento!')
    }

    await connection('labebank').update({
      balance: user.balance - value
    }).where({
      cpf: user.cpf
    })

    const id = new Authenticate().generateId()
    
    await connection('labebank_statement').insert({
      id,
      value,
      date,
      description,
      client_id: user.cpf
    })

    res.status(200).send(`Pagamento de ${value} efetuado`)
	}catch(error){
		res.status(statusCode).send({message: error.message})
	}
}

module.exports = payment
