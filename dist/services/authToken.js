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
const Services_1 = __importDefault(require("./Services"));
const UserData_1 = __importDefault(require("../data/UserData"));
const authToken = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.headers.authorization;
    const tokenData = new Services_1.default().tokenData(token);
    const user = new UserData_1.default().findById(tokenData.payload);
    if (!user) {
        throw {
            statusCode: 404,
            error: new Error('Erro ao buscar cliente')
        };
    }
    return user;
});
exports.default = authToken;
