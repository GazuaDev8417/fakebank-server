import ConnectDatabase from "../data/ConnectDatabase"

export default class UserModel extends ConnectDatabase{
    protected USER_TABLE = 'labebank'

    constructor(
        private id:string,
        private name:string,
        private cpf:string,
        private birth_date:Date,
        private balance:number,
        private email:string,
        private password:string
    ){ super() }

    public save = async():Promise<void>=>{
        try{

            await ConnectDatabase.con(this.USER_TABLE).insert({
                id: this.id,
                name: this.name,
                cpf: this.cpf,
                birth_date: this.birth_date,
                balance: this.balance,
                email: this.email,
                password: this.password            
            })

        }catch(e){
            throw new Error(`Erro ao criar usuário: ${e}`)
        }
    }
}