//* third party
import type { Response, Request, NextFunction } from "express"
import jwt from "jsonwebtoken"
//* local
import { ping } from "../service/auth.service.js"
import { client } from "../service/auth/google.js"

//* config

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
        const token = req.query.code as string
        if(!token) {
            res.status(401).json({data: "Anauthorize token", status: 401})
            return
        }
        next()
    }catch (error) {
        if(error instanceof Error) {
            res.status(500).json({data: `${error.message}suki`, status: 500})
            return
        }
    }
}

export const midlewere_checking_login = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const user = req.user
        if(!user) {
            res.status(401).json({data: "emty data user", status: 401})
        }
        next()
    } catch (error) {
        if(error instanceof Error) {
            res.status(500).json({data: error.message, status: 500})
        }
    }
}