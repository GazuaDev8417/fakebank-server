import knex from 'knex'
import { config } from 'dotenv'


config()



export default abstract class ConnectDatabase{
    protected static con = knex({
        client: 'pg',
        connection: 'postgresql://GazuaDev8417:oyxXs5u0rZim@ep-green-dew-a56t2dck.us-east-2.aws.neon.tech/fakebank?sslmode=require'
        
        /* connection: {
            host: 'localhost',
			user: 'root',
			password: 'alfadb',
			database: 'fakebank_db',
			multipleStatements: true
        } */
    })

    public static testConnection = async():Promise<void>=>{
        try{

            this.con('SELECT 1+1 AS result')

            console.log('Conectado ao banco de dados')
        }catch(e){
            console.log(`Erro ao conectar banco de dados: ${e}`)
        }
    }
}

(async()=>{
    await ConnectDatabase.testConnection()
})()