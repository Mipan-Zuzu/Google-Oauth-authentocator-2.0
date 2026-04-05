//third party
import dotenv from "dotenv";
import express, { Router} from "express";
import type { Response, Request, NextFunction } from "express";
import cors from "cors"
import cookieParser from "cookie-parser";
//local
import { routes } from "./routes/routes.route.js";
const log = console.log

const app = express();
app.use(express.json());
app.use(cookieParser())
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}))
const port: number = 3000;
app.use((error: unknown, req: Request, res:Response, next: NextFunction) => {
  log(error)
  let message = "internal server error"
  if(error instanceof Error) message = error.message
  res.status(500).json({data: message, status: 500})
})


dotenv.config();
const ACCSES_TOKEN_JWT = process.env.KEY_TOKEN_JWT;
const AUTH_GOOGLE_ID_CLIENT = process.env.AUTH_GOOGLE_ID_CLIENT;

try {
  app.use(routes)
  app.listen(port, () => {
  log(`succses listen server in port ${port}`)
  })
} catch (error) {
  if (error instanceof Error) {
    log(error.message)
  }
}
