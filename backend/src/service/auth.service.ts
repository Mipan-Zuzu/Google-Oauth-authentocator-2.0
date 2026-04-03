//* third party
import type { Response, Request } from "express"
import jwt from "jsonwebtoken"
import cookieParser from "cookie-parser"
import dotenv from "dotenv"

//* local
import { url } from "./auth/google.js"
import type { myCookie, tokenAuth } from "../types/main.type.js"
import { client } from "./auth/google.js"
import { verify } from "node:crypto"

//* config
dotenv.config()
const KEY_TOKEN_JWT = process.env.KEY_TOKEN_JWT!
const URL_FRONTEND = process.env.DASHBOARD_URL
const ID_CLIENT =  process.env.AUTH_GOOGLE_ID_CLIENT as string

const log = console.log
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

export const auth_google_callback = async (req: Request, res: Response): Promise<void> => {
    const token_code = req.query.code as string

    if(!token_code || typeof token_code !== "string") {
        res.status(401).json({data: "AnAuthorize token code", status: 401})
        return
    }

    if(!KEY_TOKEN_JWT) {
        res.status(401).json({data: "AnAuthorize token", status: 401})
        return
    }

    const payload: {token: string} = {
        token: token_code
    }
    const token = jwt.sign(payload, KEY_TOKEN_JWT, {
        expiresIn: 60 * 60 * 60
    })
    if(!token) {
        res.status(404).json({data: "token invalid", status: 404})
        return
    }
    
    log(token_code)
    if(!URL_FRONTEND) { 
        res.status(401).json({data: "unexpected type of url", status: 401})
        return
    }

    res.cookie("token", token, {
        sameSite: "lax",
        httpOnly: true,
        // secure: true,
        maxAge: 60 * 60
    })

    // const decode = jwt.verify(token_code, KEY_TOKEN_JWT)
    // req.user = decode
    req.user = token_code
    res.redirect(URL_FRONTEND)
}

export const checking = async (req: Request, res: Response): Promise<void> => {
    const log = console.log
    const {token} = req.cookies as myCookie
    if(!token) {
        res.status(404).json({data: "invalid cookie", status: 404})
        return
    }
    if(!KEY_TOKEN_JWT) {
        res.status(401).json({data: "Anauthorize token", status: 401})
        return
    }
    
    const decode = jwt.verify(token, KEY_TOKEN_JWT, {
        maxAge: "1h"
    }) as tokenAuth

    if(decode.token !== req.token) {
        res.status(401).json({data: "invalid Authorization token", status: 401})
        return
    }

    const verifying = await client.verifyIdToken({
        idToken: decode.token as string,
        audience: ID_CLIENT
    })

    res.json({data: verifying, status: "berhasil"})
}

export const ping = (req: Request, res: Response): void => {
    res.json("PONG")
}
