// import { User } from "./models/User";
import { Request, Response } from "express";
// import { createDB } from "./sequelize";
import express from "express";
import bodyParser from "body-parser";
import {
  filterImageFromURL,
  deleteLocalFiles,
  // authenticateRequest,
  // comparePasswords,
  // generateJWT,
  // generatePassword,
} from "./util/util";
import * as EmailValidator from "email-validator";

(async () => {
  // await createDB();

  const app = express();

  const port = process.env.PORT || 8082;

  app.use(bodyParser.json());

  // //register user
  // app.post("/register", async (req: Request, res: Response) => {
  //   const email = req.body.email;
  //   const plainTextPassword = req.body.password;
  //   // check email is valid
  //   if (!email || !EmailValidator.validate(email)) {
  //     return res
  //       .status(400)
  //       .send({ auth: false, message: "Email is required or malformed" });
  //   }

  //   // check email password valid
  //   if (!plainTextPassword) {
  //     return res
  //       .status(400)
  //       .send({ auth: false, message: "Password is required" });
  //   }

  //   // find the user
  //   const user = await User.findByPk(email);
  //   // check that user doesnt exists
  //   if (user) {
  //     return res
  //       .status(422)
  //       .send({ auth: false, message: "User may already exist" });
  //   }

  //   const password_hash = await generatePassword(plainTextPassword);

  //   const newUser = await new User({
  //     email: email,
  //     password: password_hash,
  //   });

  //   let savedUser;
  //   try {
  //     savedUser = await newUser.save();
  //   } catch (e) {
  //     throw e;
  //   }

  //   // Generate JWT
  //   const jwt = generateJWT(savedUser);

  //   res.status(201).send({ token: jwt, user: savedUser.short() });
  // });

  // //user login
  // app.post("/login", async (req: Request, res: Response) => {
  //   const email = req.body.email;
  //   const password = req.body.password;
  //   // check email is valid
  //   if (!email || !EmailValidator.validate(email)) {
  //     return res
  //       .status(400)
  //       .send({ auth: false, message: "Email is required or malformed" });
  //   }

  //   // check email password valid
  //   if (!password) {
  //     return res
  //       .status(400)
  //       .send({ auth: false, message: "Password is required" });
  //   }

  //   const user = await User.findByPk(email);
  //   // check that user exists
  //   if (!user) {
  //     return res.status(401).send({ auth: false, message: "Unauthorized" });
  //   }

  //   // check that the password matches
  //   const authValid = await comparePasswords(password, user.password);

  //   if (!authValid) {
  //     return res.status(401).send({ auth: false, message: "Unauthorized" });
  //   }

  //   // Generate JWT
  //   const jwt = generateJWT(user);

  //   res.status(200).send({ auth: true, token: jwt, user: user.short() });
  // });

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
  // app.get(
  //   "/filteredimage",
  //   authenticateRequest,
  //   async (req: Request, res: Response) => {
  //     let { image_url } = req.query;

  //     //validate the image_url query
  //     if (!image_url) {
  //       return res.status(400).send({ message: "Invalid image url" });
  //     } else {
  //       try {
  //         const url_filtered = await filterImageFromURL(image_url.toString());
  //         return res.status(200).sendFile(url_filtered, (error) => {
  //           if (!error) {
  //             deleteLocalFiles([url_filtered]);
  //           }
  //         });
  //       } catch (err) {
  //         return res.status(422).send({
  //           message: "Sorry the server has error while processing" + err,
  //         });
  //       }
  //     }
  //   }
  // ); //! END @TODO1

  // Root Endpoint
  // Displays a simple message to the user
  app.get("/", async (req, res) => {
    return res.status(200).send({
      message: "Welcome to Udacity. Our Website is https://www.udacity.com",
    });
  });

  // Start the Server
  app.listen(port, () => {
    console.log(`server running http://localhost:${port}`);
    console.log(`press CTRL+C to stop server`);
  });
})();
