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
const ConnectDatabase_1 = __importDefault(require("../data/ConnectDatabase"));
class UserModel extends ConnectDatabase_1.default {
    constructor(id, name, cpf, birth_date, balance, email, password) {
        super();
        this.id = id;
        this.name = name;
        this.cpf = cpf;
        this.birth_date = birth_date;
        this.balance = balance;
        this.email = email;
        this.password = password;
        this.USER_TABLE = 'labebank';
        this.save = () => __awaiter(this, void 0, void 0, function* () {
            try {
                yield ConnectDatabase_1.default.con(this.USER_TABLE).insert({
                    id: this.id,
                    name: this.name,
                    cpf: this.cpf,
                    birth_date: this.birth_date,
                    balance: this.balance,
                    email: this.email,
                    password: this.password
                });
            }
            catch (e) {
                throw new Error(`Erro ao criar usuário: ${e}`);
            }
        });
    }
}
exports.default = UserModel;
