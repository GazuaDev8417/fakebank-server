const connection = require('../connection/connection')


const showClients = async(req, res)=>{
  try{

		const result = await connection('labebank')

		res.send(result)
	}catch(error){
		res.send({message: error.message || error.sqlMessage})
	}
}

module.exports = showClients
