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
exports.User = exports.createDB = exports.sequelize = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const config_1 = require("./config/config");
const User_1 = require("./models/User");
Object.defineProperty(exports, "User", { enumerable: true, get: function () { return User_1.User; } });
const c = config_1.config.dev;
exports.sequelize = new sequelize_typescript_1.Sequelize({
    username: c.username,
    password: c.password,
    database: c.database,
    host: c.host,
    dialect: "postgres",
    storage: ":memory:",
});
exports.sequelize.addModels([User_1.User]);
const createDB = () => __awaiter(void 0, void 0, void 0, function* () {
    yield exports.sequelize.authenticate();
    yield exports.sequelize.sync({ alter: true });
});
exports.createDB = createDB;
//# sourceMappingURL=sequelize.js.map