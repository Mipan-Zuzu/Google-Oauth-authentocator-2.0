//* third party
import type { Response, Request, NextFunction } from "express"
//* local
import { ping } from "../service/auth.service.js"
import { client } from "../service/auth/google.js"

export const midlewere_auth_google = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try{
        if(!client) {
            res.status(401).json({data: "AnAuthorize key", status : 401})
            return
        }
        res.status(200).json({data: "succses", status: 200})
        next()
    }catch (error) {
        if(error instanceof Error) {
            res.status(500).json({data: error.message, status: 500})
            return
        }
    }
}

export const midlewere_google_login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try{
        next()
    }catch (error) {
        if(error instanceof Error) {
            res.status(500).json({data: error.message, status: 500})
            return
        }
    }
}