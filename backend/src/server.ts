//third party
import dotenv from "dotenv";
import express, { Router} from "express";
import type { Response, Request, NextFunction } from "express";
import cors from "cors"
import cookieParser from "cookie-parser";
import mongoose, { mongo } from "mongoose";
import { userOauth } from "./model/databse.model.js";

//local
import { routes } from "./routes/routes.route.js";
dotenv.config()
const log = console.log
const ACCSES_TOKEN_JWT = process.env.KEY_TOKEN_JWT;
const AUTH_GOOGLE_ID_CLIENT = process.env.AUTH_GOOGLE_ID_CLIENT;
const port =  process.env.PORT || 3000
const FRONTEND_URL = process.env.FRONTEND_URL
const db_username = process.env.DB_USERNAME
const db_password = process.env.DB_PASSWORD

console.log({
  db_username, db_password
})

if(!FRONTEND_URL) {
  throw new Error("cannot find frontend url")
}

const connected_mongodb = async () => {
  try {
    await mongoose.connect(`mongodb+srv://${db_username}:$  {db_password}@cluster0.kvl3gwe.mongodb.net/oauth`)
    log("mongoose succses connected")
  }catch (error) {
    if(error instanceof Error) {
    throw new Error(error.message)
    }
}
}

connected_mongodb()



const app = express();
app.use(express.json());
app.use(cookieParser())
app.use(cors({
  origin: "https://oauth.mipandev.my.id",
  credentials: true
}))


export const errRes = (req: Request, res: Response, next: NextFunction, status: number, error: string): void => {
  let message = "internal server Error"
  message = error
  res.status(status).json({data: message, status: status})
}

app.use((error: unknown, req: Request, res:Response, next: NextFunction) => {
  log(error)
  const status = 500
  if(error instanceof Error) errRes(req, res, next,status, error.message)
})

try {
  app.use(routes)
  app.listen(port, () => {
  log(`succses listen server in port ${port} anjayy`)
  })
} catch (error) {
  if (error instanceof Error) {
    log(error.message)
  }
}
