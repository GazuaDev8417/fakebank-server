export type User = {
    id:string
    name:string
    cpf:string
    birth_date:string
    balance:number
    email:string
    password:string
}

export type Statement = {
    id:string
    value:number
    date:Date
    description:string
    client_id:string
}

