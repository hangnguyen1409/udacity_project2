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
exports.deleteLocalFiles = exports.filterImageFromURL = exports.authenticateRequest = exports.generateJWT = exports.comparePasswords = exports.generatePassword = void 0;
const fs_1 = __importDefault(require("fs"));
const Jimp = require("jimp");
const jwt = __importStar(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const config_1 = require("../config/config");
const saltRounds = 10;
function generatePassword(plainTextPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        const salt = yield bcrypt_1.default.genSalt(saltRounds);
        const hash = yield bcrypt_1.default.hash(plainTextPassword, salt);
        return hash;
    });
}
exports.generatePassword = generatePassword;
function comparePasswords(plainTextPassword, hash) {
    return __awaiter(this, void 0, void 0, function* () {
        const compare = yield bcrypt_1.default.compare(plainTextPassword, hash);
        return compare;
    });
}
exports.comparePasswords = comparePasswords;
function generateJWT(user) {
    return jwt.sign(user.toJSON(), config_1.config.jwt.secret);
}
exports.generateJWT = generateJWT;
//Authenticate function:
function authenticateRequest(req, res, next) {
    //check request header
    if (!req.headers || !req.headers.authorization) {
        return res.status(401).send({ message: "Unauthenticated request" });
    }
    //Example: Bearer abcxyz
    const token = req.headers.authorization.split(" ");
    if (token.length != 2) {
        return res.status(401).send({ message: "Invalid token" });
    }
    else {
        const token_value = token[1];
        //verify token value with jwt secret
        return jwt.verify(token_value, config_1.config.jwt.secret, (err, decoded) => {
            if (err) {
                return res.status(500).send({
                    auth: false,
                    message: "Token is given not match with token was signed & " + err.message,
                });
            }
            return next();
        });
    }
}
exports.authenticateRequest = authenticateRequest;
// filterImageFromURL
// helper function to download, filter, and save the filtered image locally
// returns the absolute path to the local image
// INPUTS
//    inputURL: string - a publicly accessible url to an image file
// RETURNS
//    an absolute path to a filtered image locally saved file
function filterImageFromURL(inputURL) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                const photo = yield Jimp.read(inputURL);
                const outpath = "/tmp/filtered." + Math.floor(Math.random() * 2000) + ".jpg";
                yield photo
                    .resize(256, 256) // resize
                    .quality(60) // set JPEG quality
                    .greyscale() // set greyscale
                    .write(__dirname + outpath, () => {
                    resolve(__dirname + outpath);
                });
            }
            catch (error) {
                reject("Error while processing picture & " + error);
            }
        }));
    });
}
exports.filterImageFromURL = filterImageFromURL;
// deleteLocalFiles
// helper function to delete files on the local disk
// useful to cleanup after tasks
// INPUTS
//    files: Array<string> an array of absolute paths to files
function deleteLocalFiles(files) {
    return __awaiter(this, void 0, void 0, function* () {
        for (let file of files) {
            fs_1.default.unlinkSync(file);
        }
    });
}
exports.deleteLocalFiles = deleteLocalFiles;
//# sourceMappingURL=util.js.map