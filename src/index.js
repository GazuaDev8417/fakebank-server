const express = require('express')
const cors = require('cors')

const showClients = require('./endpoints/showClients')
const createClient = require('./endpoints/createClient')
const getClientById = require('./endpoints/getClientById')
const getStatement = require('./endpoints/getStatement')
const getBalance = require('./endpoints/getBalance')
const payment = require('./endpoints/payment')
const deposit = require('./endpoints/deposit')
const login = require('./endpoints/login')
const transfer = require('./endpoints/transfer')



const app = express()

app.use(express.json())
app.use(cors())



app.get('/accounts', showClients)
app.get('/accounts/:id', getClientById)
app.post('/accounts/statement', getStatement)
app.post('/accounts/create', createClient)
app.post('/accounts/balance', getBalance)
app.post('/accounts/payment', payment)
app.post('/accounts/deposit', deposit)
app.post('/accounts/login', login)
app.post('/accounts/transfer', transfer)








//======================================Server listening===========================
app.listen(process.env.PORT || 3003, ()=>{
	console.log('Server running at http://localhost:3003')
})
