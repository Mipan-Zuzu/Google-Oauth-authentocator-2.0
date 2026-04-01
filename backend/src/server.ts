//third party
import dotenv from "dotenv";
import express, { Router } from "express";
import cors from "cors"
//local
import { routes } from "./routes/routes.route.js";

const app = express();
app.use(express.json());
app.use(cors())
const port: number = 3000;

dotenv.config();
const log = console.log;
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
