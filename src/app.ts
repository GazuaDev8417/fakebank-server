import express from 'express'
import cors from 'cors'




export const app = express()
app.use(express.json())
app.use(cors())


app.listen(3003, ()=>{
    console.log('Servidor rodando em http://localhost:3003')
})
