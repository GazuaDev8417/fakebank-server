const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { config } = require("dotenv")
const { v4 } = require('uuid')

config()


class Authenticate {
  generateId = ()=>{
    return v4()
  }

  token = (payload)=>{
    return jwt.sign(
      { payload },
      process.env.JWT_KEY,
      { expiresIn: '1h'}
    )
  }

  tokenData = (token)=>{
    return jwt.verify(
      token,
      process.env.JWT_KEY
    )
  }

  hash = (txt)=>{
    const rounds = 12
    const salt = bcrypt.genSaltSync(rounds)
    const cypher = bcrypt.hashSync(txt, salt)

    return cypher
  }

  compare = (txt, hash)=>{
    return bcrypt.compareSync(txt, hash)
  }
}

module.exports = Authenticate
