//* third party
import { type Response, type Request, request, response } from "express"
import jwt from "jsonwebtoken"
import cookieParser from "cookie-parser"
import dotenv from "dotenv"

//* local
import { url } from "./auth/google.js"
import type { myCookie, tokenAuth } from "../types/main.type.js"
import { OAuth2Client } from "google-auth-library"
import { client } from "./auth/google.js"
import type { GetTokenResponse } from "google-auth-library/build/src/auth/oauth2client.js"
import { NONAME } from "node:dns"
import { stringify } from "node:querystring"

//* config
dotenv.config()
const KEY_TOKEN_JWT = process.env.KEY_TOKEN_JWT!
const URL_FRONTEND = process.env.DASHBOARD_URL
const URL_FRONTEND_LOGIN = process.env.FRONTEND_URL
const ID_CLIENT =  process.env.AUTH_GOOGLE_ID_CLIENT as string

const log = console.log
//* service

export const auth_google = async (req: Request, res: Response): Promise<void> => {
        if(!url) {
            res.status(404).json({data: "Cannot accses url", status: 404})
            return
        }
        res.status(201).json({data: url , status: 201})
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
        expiresIn: 60 * 60 * 1000
    })

    log(`token_code ${token_code}`)
    log(`sign token jwt ${token}`)

    if(!token) {
        res.status(404).json({data: "token invalid", status: 404})
        return
    }
    
    if(!URL_FRONTEND) { 
        res.status(401).json({data: "unexpected type of url", status: 401})
        return
    }

    const {tokens} = await client.getToken(token_code as string)
    
    res.cookie("token", JSON.stringify(tokens), {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        domain: ".mipandev.my.id",
        maxAge: 60 * 60 * 1000
    })
    
    res.redirect(URL_FRONTEND!)
}

export const checking = async (req: Request, res: Response): Promise<void> => {
    const log = console.log
    const {token} = req.cookies as myCookie
    
    if(!KEY_TOKEN_JWT) {
        res.status(401).json({data: "AnAuthorize", status : 401})
        return
    }

    if(!token) {
        log("cannot find cookie")
        res.status(401).json({data: "Cookie token not found", status: 401})
        return
    }

    try {
        const parses_token = JSON.parse(token)
        log(`token ${token}`)
        
        const ticket = await client.verifyIdToken({
            idToken: parses_token.id_token,
            audience: ID_CLIENT
        })

        if(!ticket) {
            res.status(401).json({data: "failed to verify User", status : 401})
            return
        }

        const accses_token: string = parses_token.accses_token
        if(!accses_token) {
            res.status(401).json({data: "anAuthorize accses token", status: 401})
            return
        }

        const accses_token_sign = jwt.sign(accses_token, KEY_TOKEN_JWT, {
            expiresIn: 60 * 60 * 1000
        })

        res.cookie("token_access", accses_token_sign, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            domain: ".mipandev.my.id",
            maxAge : 60* 60 * 1000
        })

        const ticket_payload = await ticket.getPayload()
        res.status(201).json({data: "succses", status: 201})
        log({
            data: [
                {
                    token: token,
                    signJwt: accses_token_sign,
                    ticket: ticket_payload
                }
            ]
        })
    } catch (error) {
        if(error instanceof Error) {
            log(`Error in checking: ${error.message}`)
            res.status(401).json({data: error.message, status: 401})
            return
        }
        res.status(500).json({data: "Server error", status: 500})
    }
}


export const ping = (req: Request, res: Response): void => {
    res.json("PONG")
}
