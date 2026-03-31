//third party
import type { Response, request } from "express"
import jwt from "jsonwebtoken"
import cookieParser from "cookie-parser"
import dotenv from "dotenv"

dotenv.config()

//config
const AUTH_GOOGLE_ID_CLIENT = process.env.AUTH_GOOGLE_ID_CLIENT
const KEY_TOKEN_JWT = process.env.KEY_TOKEN_JWT
//service
export const auth_google = async (req: Request, res: Response): Promise<void> => {
    
}
