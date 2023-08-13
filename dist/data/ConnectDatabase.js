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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const knex_1 = __importDefault(require("knex"));
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
class ConnectDatabase {
}
_a = ConnectDatabase;
ConnectDatabase.con = (0, knex_1.default)({
    client: 'mysql2',
    connection: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_SCHEMA,
        multipleStatements: true
    }
});
ConnectDatabase.testConnection = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        _a.con('SELECT 1+1 AS result');
        console.log('Conectado ao banco de dados');
    }
    catch (e) {
        console.log(`Erro ao conectar banco de dados: ${e}`);
    }
});
exports.default = ConnectDatabase;
(() => __awaiter(void 0, void 0, void 0, function* () {
    yield ConnectDatabase.testConnection();
}))();
