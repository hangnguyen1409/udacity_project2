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
const User_1 = require("./models/User");
const sequelize_1 = require("./sequelize");
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const util_1 = require("./util/util");
const EmailValidator = __importStar(require("email-validator"));
(() => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, sequelize_1.createDB)();
    const app = (0, express_1.default)();
    const port = process.env.PORT || 8082;
    app.use(body_parser_1.default.json());
    //register user
    app.post("/register", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const email = req.body.email;
        const plainTextPassword = req.body.password;
        // check email is valid
        if (!email || !EmailValidator.validate(email)) {
            return res
                .status(400)
                .send({ auth: false, message: "Email is required or malformed" });
        }
        // check email password valid
        if (!plainTextPassword) {
            return res
                .status(400)
                .send({ auth: false, message: "Password is required" });
        }
        // find the user
        const user = yield User_1.User.findByPk(email);
        // check that user doesnt exists
        if (user) {
            return res
                .status(422)
                .send({ auth: false, message: "User may already exist" });
        }
        const password_hash = yield (0, util_1.generatePassword)(plainTextPassword);
        const newUser = yield new User_1.User({
            email: email,
            password: password_hash,
        });
        let savedUser;
        try {
            savedUser = yield newUser.save();
        }
        catch (e) {
            throw e;
        }
        // Generate JWT
        const jwt = (0, util_1.generateJWT)(savedUser);
        res.status(201).send({ token: jwt, user: savedUser.short() });
    }));
    //user login
    app.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const email = req.body.email;
        const password = req.body.password;
        // check email is valid
        if (!email || !EmailValidator.validate(email)) {
            return res
                .status(400)
                .send({ auth: false, message: "Email is required or malformed" });
        }
        // check email password valid
        if (!password) {
            return res
                .status(400)
                .send({ auth: false, message: "Password is required" });
        }
        const user = yield User_1.User.findByPk(email);
        // check that user exists
        if (!user) {
            return res.status(401).send({ auth: false, message: "Unauthorized" });
        }
        // check that the password matches
        const authValid = yield (0, util_1.comparePasswords)(password, user.password);
        if (!authValid) {
            return res.status(401).send({ auth: false, message: "Unauthorized" });
        }
        // Generate JWT
        const jwt = (0, util_1.generateJWT)(user);
        res.status(200).send({ auth: true, token: jwt, user: user.short() });
    }));
    // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
    // GET /filteredimage?image_url={{URL}}
    // endpoint to filter an image from a public url.
    // IT SHOULD
    //    1. validate the image_url query
    //    2. call filterImageFromURL(image_url) to filter the image
    //    3. send the resulting file in the response
    //    4. deletes any files on the server on finish of the response
    // QUERY PARAMATERS
    //    image_url: URL of a publicly accessible image
    // RETURNS
    //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]
    /**************************************************************************** */
    app.get("/filteredimage", util_1.authenticateRequest, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        let { image_url } = req.query;
        //validate the image_url query
        if (!image_url) {
            return res.status(400).send({ message: "Invalid image url" });
        }
        else {
            try {
                const url_filtered = yield (0, util_1.filterImageFromURL)(image_url.toString());
                return res.status(200).sendFile(url_filtered, (error) => {
                    if (!error) {
                        (0, util_1.deleteLocalFiles)([url_filtered]);
                    }
                });
            }
            catch (err) {
                return res.status(422).send({
                    message: "Sorry the server has error while processing" + err,
                });
            }
        }
    })); //! END @TODO1
    // Root Endpoint
    // Displays a simple message to the user
    app.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        return res.status(200).send({
            message: "Welcome to Udacity. Our Website is https://www.udacity.com",
        });
    }));
    // Start the Server
    app.listen(port, () => {
        console.log(`server running http://localhost:${port}`);
        console.log(`press CTRL+C to stop server`);
    });
}))();
//# sourceMappingURL=server.js.map