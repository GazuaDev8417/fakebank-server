"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jwt = __importStar(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const uuid_1 = require("uuid");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
class Services {
    constructor() {
        this.idGenerator = () => {
            return (0, uuid_1.v4)();
        };
        this.token = (payload) => {
            return jwt.sign({ payload }, process.env.JWT_KEY, { expiresIn: '30m' });
        };
        this.tokenData = (token) => {
            return jwt.verify(token, process.env.JWT_KEY);
        };
        this.hash = (txt) => {
            const rounds = 12;
            const salt = bcryptjs_1.default.genSaltSync(rounds);
            const cypher = bcryptjs_1.default.hashSync(txt, salt);
            return cypher;
        };
        this.compare = (txt, hash) => {
            return bcryptjs_1.default.compareSync(txt, hash);
        };
    }
}
exports.default = Services;
