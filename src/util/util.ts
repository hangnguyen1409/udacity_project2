import { Request, Response } from "express";
import fs from "fs";
import Jimp = require("jimp");
import * as jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { NextFunction } from "connect";
import { User } from "../models/User";
import { config } from "../config/config";

const saltRounds = 10;
export async function generatePassword(
  plainTextPassword: string
): Promise<string> {
  const salt = await bcrypt.genSalt(saltRounds);
  const hash = await bcrypt.hash(plainTextPassword, salt);
  return hash;
}

export async function comparePasswords(
  plainTextPassword: string,
  hash: string
): Promise<boolean> {
  const compare = await bcrypt.compare(plainTextPassword, hash);
  return compare;
}

export function generateJWT(user: User): string {
  return jwt.sign(user.toJSON(), config.jwt.secret);
}

//Authenticate function:
export function authenticateRequest(
  req: Request,
  res: Response,
  next: NextFunction
) {
  //check request header
  if (!req.headers || !req.headers.authorization) {
    return res.status(401).send({ message: "Unauthenticated request" });
  }

  //Example: Bearer abcxyz
  const token: string[] = req.headers.authorization.split(" ");

  if (token.length != 2) {
    return res.status(401).send({ message: "Invalid token" });
  } else {
    const token_value: string = token[1];
    //verify token value with jwt secret
    return jwt.verify(token_value, config.jwt.secret, (err, decoded) => {
      if (err) {
        return res.status(500).send({
          auth: false,
          message:
            "Token is given not match with token was signed & " + err.message,
        });
      }
      return next();
    });
  }
}

// filterImageFromURL
// helper function to download, filter, and save the filtered image locally
// returns the absolute path to the local image
// INPUTS
//    inputURL: string - a publicly accessible url to an image file
// RETURNS
//    an absolute path to a filtered image locally saved file
export async function filterImageFromURL(inputURL: string): Promise<string> {
  return new Promise(async (resolve, reject) => {
    try {
      const photo = await Jimp.read(inputURL);
      const outpath =
        "/tmp/filtered." + Math.floor(Math.random() * 2000) + ".jpg";
      await photo
        .resize(256, 256) // resize
        .quality(60) // set JPEG quality
        .greyscale() // set greyscale
        .write(__dirname + outpath, () => {
          resolve(__dirname + outpath);
        });
    } catch (error) {
      reject("Error while processing picture & " + error);
    }
  });
}

// deleteLocalFiles
// helper function to delete files on the local disk
// useful to cleanup after tasks
// INPUTS
//    files: Array<string> an array of absolute paths to files
export async function deleteLocalFiles(files: Array<string>) {
  for (let file of files) {
    fs.unlinkSync(file);
  }
}
