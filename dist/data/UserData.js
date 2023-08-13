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
const ConnectDatabase_1 = __importDefault(require("./ConnectDatabase"));
class UserData extends ConnectDatabase_1.default {
    constructor() {
        super(...arguments);
        this.USER_TABLE = 'labebank';
        this.STATEMENT_TABLE = 'labebank_statement';
        this.findByEmail = (email) => __awaiter(this, void 0, void 0, function* () {
            try {
                const [user] = yield ConnectDatabase_1.default.con(this.USER_TABLE).where({ email });
                return user;
            }
            catch (e) {
                throw new Error(`Erro ao buscar cliente: ${e}`);
            }
        });
        this.findById = (id) => __awaiter(this, void 0, void 0, function* () {
            try {
                const [user] = yield ConnectDatabase_1.default.con(this.USER_TABLE).where({ id });
                return user;
            }
            catch (e) {
                throw new Error(`Erro ao buscar cliente: ${e}`);
            }
        });
        this.singup = (user) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield user.save();
            }
            catch (e) {
                throw new Error(`Error ao criar cliente: ${e}`);
            }
        });
        this.showClients = () => __awaiter(this, void 0, void 0, function* () {
            try {
                const clients = yield ConnectDatabase_1.default.con(this.USER_TABLE);
                return clients;
            }
            catch (e) {
                throw new Error(`Erro ao buscar clientes: ${e}`);
            }
        });
        this.getStatement = (cpf) => __awaiter(this, void 0, void 0, function* () {
            try {
                const statement = yield ConnectDatabase_1.default.con(this.STATEMENT_TABLE).where({
                    client_id: cpf
                });
                return statement;
            }
            catch (e) {
                throw new Error(`Erro ao imprimir extrato: ${e}`);
            }
        });
        this.payment = (input, user) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield ConnectDatabase_1.default.con(this.USER_TABLE).update({
                    balance: user.balance - input.value
                }).where({ cpf: user.cpf });
                yield ConnectDatabase_1.default.con(this.STATEMENT_TABLE).insert(input);
            }
            catch (e) {
                throw new Error(`Erro ao realizar pagamento: ${e}`);
            }
        });
        this.deposit = (input, user) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield ConnectDatabase_1.default.con(this.USER_TABLE).update({
                    balance: user.balance + input.value
                }).where({ cpf: user.cpf });
                yield ConnectDatabase_1.default.con(this.STATEMENT_TABLE).insert(input);
            }
            catch (e) {
                throw new Error(`Erro ao realizar deposito: ${e}`);
            }
        });
        this.transfer = (input, user, recipient) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield ConnectDatabase_1.default.con(this.USER_TABLE).update({
                    balance: user.balance - input.value
                }).where({ cpf: user.cpf });
                yield ConnectDatabase_1.default.con(this.USER_TABLE).update({
                    balance: recipient.balance + input.value
                }).where({ cpf: recipient.cpf });
                yield ConnectDatabase_1.default.con(this.STATEMENT_TABLE).insert(input);
            }
            catch (e) {
                throw new Error(`Erro ao realizar deposito: ${e}`);
            }
        });
    }
}
exports.default = UserData;
