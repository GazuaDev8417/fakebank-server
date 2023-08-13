"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
class UserController {
    constructor(userBusiness) {
        this.userBusiness = userBusiness;
        this.signup = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const token = yield this.userBusiness.signup(req);
                res.status(201).send(token);
            }
            catch (e) {
                let statusCode = 400 || e.statusCode;
                let message = e.error === undefined ? e.message : e.error.message;
                res.status(statusCode).send(message || e.sqlMessage);
            }
        });
        this.login = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const token = yield this.userBusiness.login(req);
                res.status(200).send(token);
            }
            catch (e) {
                let statusCode = 400 || e.statusCode;
                let message = e.error === undefined ? e.message : e.error.message;
                res.status(statusCode).send(message || e.sqlMessage);
            }
        });
        this.showClients = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const clients = yield this.userBusiness.showClient();
                res.status(200).send(clients);
            }
            catch (e) {
                let statusCode = 400 || e.statusCode;
                let message = e.error === undefined ? e.message : e.error.message;
                res.status(statusCode).send(message || e.sqlMessage);
            }
        });
        this.findById = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.userBusiness.findById(req);
                res.status(200).send(user);
            }
            catch (e) {
                let statusCode = 400 || e.statusCode;
                let message = e.error === undefined ? e.message : e.error.message;
                res.status(statusCode).send(message || e.sqlMessage);
            }
        });
        this.balance = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const balanceValue = yield this.userBusiness.balance(req);
                res.status(200).send(String(balanceValue));
            }
            catch (e) {
                let statusCode = 400 || e.statusCode;
                let message = e.error === undefined ? e.message : e.error.message;
                res.status(statusCode).send(message || e.sqlMessage);
            }
        });
        this.getStatement = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const statement = yield this.userBusiness.getStatement(req);
                res.status(200).send(statement);
            }
            catch (e) {
                let statusCode = 400 || e.statusCode;
                let message = e.error === undefined ? e.message : e.error.message;
                res.status(statusCode).send(message || e.sqlMessage);
            }
        });
        this.payment = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.userBusiness.payment(req);
                res.status(200).send('Pagamento efetuado');
            }
            catch (e) {
                let statusCode = 400 || e.statusCode;
                let message = e.error === undefined ? e.message : e.error.message;
                res.status(statusCode).send(message || e.sqlMessage);
            }
        });
        this.deposit = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { value } = req.body;
            try {
                const user = yield this.userBusiness.deposit(req);
                res.status(200).send(`Deposito realizado com sucesso. Saldo atual: R$ ${(user.balance + value).toFixed(2)}`);
            }
            catch (e) {
                let statusCode = 400 || e.statusCode;
                let message = e.error === undefined ? e.message : e.error.message;
                res.status(statusCode).send(message || e.sqlMessage);
            }
        });
        this.transfer = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { value, recipientName } = req.body;
            try {
                yield this.userBusiness.transfer(req);
                res.status(200).send(`Vocẽ tranferênciu R$ ${value.toFixed(2)} para a conta de ${recipientName}`);
            }
            catch (e) {
                let statusCode = 400 || e.statusCode;
                let message = e.error === undefined ? e.message : e.error.message;
                res.status(statusCode).send(message || e.sqlMessage);
            }
        });
    }
}
exports.default = UserController;
