const connection = require('../connection/connection')
const Authenticate = require('../services/Authenticate')
const auth_token = require('../services/auth_token')



const transfer = async(req, res)=>{
  let statusCode = 400

  try{

    const client = await auth_token(req)
    const { password, cpf, recipientName, recipientCpf, value } = req.body
    const auth = new Authenticate()
    const id = auth.generateId()
    const anotherId = auth.generateId()


    if(!password || !cpf || !recipientName || !recipientCpf || !value){
      statusCode = 401
      throw new Error('Preencha os campos!')
    }

    if(recipientCpf === cpf){
      statusCode = 401
      throw new Error('Os CPFs do depositante e destinatário são os mesmos')
    }


    if(!auth.compare(String(cpf), client.cpf)){
      statusCode = 404
      throw new Error('Cliente não encontrado')
    }


    const recipient = await connection('labebank')

    const [cpfFound] = recipient.filter(rcpt=>{
      return auth.compare(String(recipientCpf), rcpt.cpf)
    })

    if(!cpfFound){
      statusCode = 404
      throw new Error('Destinatário do despósito não encontrado!')
    }

    if(cpfFound.name !== recipientName){
      statusCode = 404
      throw new Error('Destinatário do despósito não encontrado!')
    }


    if(!auth.compare(password, client.password)){
      statusCode = 404
      throw new Error('Senha inválida')
    }    
    
    
    await connection('labebank').update({
      balance: client.balance - value
    }).where({
      cpf: client.cpf
    })

    await connection('labebank').update({
      balance: cpfFound.balance + value
    }).where({
      cpf: cpfFound.cpf
    })

    
    await connection('labebank_statement').insert({
      id,
      value,
      date: new Date(),
      description: `Transferência de R$ ${value.toFixed(2)} para conta de ${recipientName}`,
      client_id: client.cpf
    })

    await connection('labebank_statement').insert({
      id: anotherId,
      value,
      date: new Date(),
      description: `Valor de R$ ${value.toFixed(2)} recebido por transferência da conta de ${client.name}`,
      client_id: cpfFound.cpf
    })


    res.status(200).send('Transferência realizada com sucesso.')
  }catch(error){
    res.status(statusCode).send(error.message || error.sqlMessage)
  }
}

module.exports = transfer