//third party
import dotenv from "dotenv";
dotenv.config()
import express, { Router} from "express";
import type { Response, Request, NextFunction } from "express";
import cors from "cors"
import cookieParser from "cookie-parser";

//local
import { routes } from "./routes/routes.route.js";
const log = console.log

const ACCSES_TOKEN_JWT = process.env.KEY_TOKEN_JWT;
const AUTH_GOOGLE_ID_CLIENT = process.env.AUTH_GOOGLE_ID_CLIENT;
const port =  process.env.PORT || 3000
const FRONTEND_URL = process.env.FRONTEND_URL

if(!FRONTEND_URL) {
  throw new Error("cannot find frontend url")
}

console.log(FRONTEND_URL)

const app = express();
app.use(express.json());
app.use(cookieParser())
app.use(cors({
  origin: process.env.FRONTEND_URL || "https://oauth.mipandev.my.id",
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
