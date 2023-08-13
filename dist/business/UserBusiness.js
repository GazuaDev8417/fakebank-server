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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const UserModel_1 = __importDefault(require("../model/UserModel"));
const authToken_1 = __importDefault(require("../services/authToken"));
class UserBusiness {
    constructor(userData, services) {
        this.userData = userData;
        this.services = services;
        this.showClient = () => __awaiter(this, void 0, void 0, function* () {
            const clients = yield this.userData.showClients();
            if (clients.length === 0) {
                throw {
                    statusCode: 404,
                    error: new Error('Nenhum cliente cadastrado')
                };
            }
            return clients;
        });
        this.signup = (req) => __awaiter(this, void 0, void 0, function* () {
            const { name, cpf, initialDate, email, password, passwordConf } = req.body;
            const [day, month, year] = initialDate.split('/');
            const birthDate = new Date(`${year}-${month}-${day}`);
            const millisecondsAge = Date.now() - birthDate.getTime();
            const age = millisecondsAge / 1000 / 60 / 60 / 24 / 365;
            if (!name || !cpf || !initialDate || !email || !password || !passwordConf) {
                throw {
                    statusCode: 401,
                    error: new Error('Preencha os campos')
                };
            }
            if (age < 18) {
                throw {
                    statusCode: 403,
                    error: new Error('Necessário ser maior de idade!')
                };
            }
            let arrCpf = String(cpf).split('');
            if (arrCpf.length !== 11) {
                throw {
                    statusCode: 403,
                    error: new Error('CPF inválido!')
                };
            }
            const registeredUser = yield this.userData.findByEmail(email);
            const clients = (yield this.userData.showClients()).map(client => {
                return this.services.compare(cpf, client.cpf);
            });
            if (registeredUser || clients[0]) {
                throw {
                    statusCode: 403,
                    error: new Error('Cliente já cadastrado!')
                };
            }
            if (password.length < 6) {
                throw {
                    statusCode: 403,
                    error: new Error('A senha deve ter o mínimo de 6 caracteres')
                };
            }
            if (password !== passwordConf) {
                throw {
                    statusCode: 403,
                    error: new Error('As senhas não correspondem!')
                };
            }
            const id = this.services.idGenerator();
            const hash = this.services.hash(password);
            const hashCPF = this.services.hash(cpf.toString());
            const token = this.services.token(id);
            const balance = 0;
            const user = new UserModel_1.default(id, name, hashCPF, birthDate, balance, email, hash);
            yield this.userData.singup(user);
            return token;
        });
        this.login = (req) => __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            if (!email || !password) {
                throw {
                    statusCode: 401,
                    error: new Error('Preencha os campos')
                };
            }
            const user = yield this.userData.findByEmail(email);
            if (!user) {
                throw {
                    statusCode: 403,
                    error: new Error('Cliente não encontrado')
                };
            }
            const compare = this.services.compare(password, user.password);
            if (!compare) {
                throw {
                    statusCode: 403,
                    error: new Error('Cliente não encontrado (senha incorreta)')
                };
            }
            const token = this.services.token(user.id);
            return token;
        });
        this.findById = (req) => __awaiter(this, void 0, void 0, function* () {
            const user = yield (0, authToken_1.default)(req);
            return user;
        });
        this.balance = (req) => __awaiter(this, void 0, void 0, function* () {
            const user = yield (0, authToken_1.default)(req);
            const { cpf, password } = req.body;
            if (!cpf || !password) {
                throw {
                    statusCode: 401,
                    error: new Error('Preencha os campos')
                };
            }
            if (String(cpf).length !== 11) {
                throw {
                    statusCode: 403,
                    error: new Error('CPF inválido!')
                };
            }
            if (!this.services.compare(password, user.password) ||
                !this.services.compare(String(cpf), user.cpf)) {
                throw {
                    statusCode: 401,
                    error: new Error('Cliente não encontrado')
                };
            }
            return user.balance;
        });
        this.getStatement = (req) => __awaiter(this, void 0, void 0, function* () {
            const user = yield (0, authToken_1.default)(req);
            const { cpf, password } = req.body;
            if (!cpf || !password) {
                throw {
                    statusCode: 401,
                    error: new Error('Preencha os campos')
                };
            }
            if (!this.services.compare(password, user.password) ||
                !this.services.compare(String(cpf), user.cpf)) {
                throw {
                    statusCode: 401,
                    error: new Error('Cliente não encontrado')
                };
            }
            const statement = yield this.userData.getStatement(user.cpf);
            return statement;
        });
        this.payment = (req) => __awaiter(this, void 0, void 0, function* () {
            const user = yield (0, authToken_1.default)(req);
            const { password, cpf, initialDate, value, description } = req.body;
            const convert = initialDate.split('/');
            const date = new Date(`${convert[2]}-${convert[1]}-${convert[0]}`);
            if (!password || !cpf || !initialDate || !value || !description) {
                throw {
                    statusCode: 401,
                    error: new Error('Preencha os campos')
                };
            }
            if (new Date(initialDate).getTime() < Date.now()) {
                throw {
                    statusCode: 403,
                    error: new Error('Data do pagagmento não pode ser inferior a atual!')
                };
            }
            if (!this.services.compare(password, user.password) ||
                !this.services.compare(String(cpf), user.cpf)) {
                throw {
                    statusCode: 401,
                    error: new Error('Cliente não encontrado')
                };
            }
            if (value > user.balance) {
                throw {
                    statusCode: 403,
                    error: new Error('Saldo insuficiente para efetuar pagamento!')
                };
            }
            const id = this.services.idGenerator();
            const client_id = user.cpf;
            const input = {
                id,
                value,
                date,
                description,
                client_id
            };
            yield this.userData.payment(input, user);
        });
        this.deposit = (req) => __awaiter(this, void 0, void 0, function* () {
            const user = yield (0, authToken_1.default)(req);
            const { password, cpf, value } = req.body;
            if (!password || !cpf || !value) {
                throw {
                    statusCode: 401,
                    error: new Error('Preencha os campos')
                };
            }
            if (!this.services.compare(password, user.password) ||
                !this.services.compare(String(cpf), user.cpf)) {
                throw {
                    statusCode: 401,
                    error: new Error('Cliente não encontrado')
                };
            }
            const id = this.services.idGenerator();
            const client_id = user.cpf;
            const date = new Date();
            const description = `Deposito no valor de R$ ${value.toFixed(2)}`;
            const input = {
                id,
                value,
                date,
                description,
                client_id
            };
            yield this.userData.deposit(input, user);
            return user;
        });
        this.transfer = (req) => __awaiter(this, void 0, void 0, function* () {
            const user = yield (0, authToken_1.default)(req);
            const { password, cpf, recipientName, recipientCpf, value } = req.body;
            if (!password || !cpf || !recipientName || !recipientCpf || !value) {
                throw {
                    statusCdde: 401,
                    error: new Error('Preencha os campos')
                };
            }
            if (recipientCpf === cpf) {
                throw {
                    statusCode: 403,
                    error: new Error('Os CPFs do depositante e destinatário são os mesmos')
                };
            }
            if (!this.services.compare(password, user.password) ||
                !this.services.compare(String(cpf), user.cpf)) {
                throw {
                    statusCode: 401,
                    error: new Error('Cliente não encontrado')
                };
            }
            const [recipients] = (yield this.userData.showClients())
                .filter(recipient => {
                return this.services.compare(String(recipientCpf), recipient.cpf);
            });
            if (!recipients) {
                throw {
                    statusCode: 404,
                    error: new Error('Destinatário para transferência não localizado. Certifique-se de que essa pessoa possui a respectiva conta')
                };
            }
            else if (recipients.name !== recipientName) {
                throw {
                    statusCode: 404,
                    error: new Error('Nome e CPF do destinatário não correspondem')
                };
            }
            if (user.balance < value) {
                throw {
                    statusCode: 403,
                    error: new Error('Saldo insuficiente')
                };
            }
            const input = [
                {
                    id: this.services.idGenerator(),
                    value,
                    date: new Date(),
                    description: `Transferência no valor ${value.toFixed(2)} para a conta de ${recipientName}`,
                    client_id: user.id
                },
                {
                    id: this.services.idGenerator(),
                    value,
                    date: new Date(),
                    description: `Transferência no valor ${value.toFixed(2)} enviada por ${user.name}`,
                    client_id: recipients.cpf
                }
            ];
            for (let inputItem of input) {
                yield this.userData.transfer(inputItem, user, recipients);
            }
        });
    }
}
exports.default = UserBusiness;
