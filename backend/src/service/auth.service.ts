//* third party
import type { Response, Request } from "express"
import jwt from "jsonwebtoken"
import cookieParser from "cookie-parser"
import dotenv from "dotenv"

//* local
import { url } from "./auth/google.js"

dotenv.config()

//* config
const KEY_TOKEN_JWT = process.env.KEY_TOKEN_JWT
//* service
export const auth_google = async (req: Request, res: Response): Promise<void> => {
    try {
        if(!url) {
            res.status(404).json({data: "Cannot accses url", status: 404})
            return
        }
        res.status(201).json({data: url , status: 201})
    }catch (error) {
        if(error instanceof Error) {
            res.status(500).json({data: error.message, status: 500})
            return
        }
    }
}

export const ping = (req: Request, res: Response): void => {
    res.json("PONG")
}