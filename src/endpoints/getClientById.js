const connection = require('../connection/connection')


const getClientById = async(req, res)=>{
    var statusCode = 400
  try{

    const [user] = await connection('labebank').where({
      id: req.params.id
    })

    if(!user){
      statusCode = 404
      throw new Error('Usuário não encontrado')
    }
		

    res.status(200).send(user)
	}catch(error){
		res.send({message: error.message || error.sqlMessage})
	}
}

module.exports = getClientById
