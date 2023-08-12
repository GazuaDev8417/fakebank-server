import { app } from "./app"
import UserBusiness from "./business/UserBusiness"
import UserController from "./controller/UserController"
import UserData from "./data/UserData"
import Services from "./services/Services"


const userController = new UserController(
    new UserBusiness(
        new UserData,
        new Services
    )
)


app.post('/accounts/create', userController.signup)
app.post('/accounts/login', userController.login)
app.post('/accounts/balance', userController.balance)
app.post('/accounts/statement', userController.getStatement)

app.get('/accounts', userController.showClients)
app.get('/accounts/client', userController.findById)
