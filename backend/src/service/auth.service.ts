//* third party
import type {Request, Response} from "express"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"

//* local
import { url } from "./auth/google.js"
import type { myCookie} from "../types/main.type.js"
import { client } from "./auth/google.js"
import {userOauth} from "../model/databse.model.js"

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
        expiresIn: "5m"
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

    console.log(tokens)
    
    res.cookie("token", JSON.stringify(tokens), {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 60 * 60 * 1000,
        path: "/"
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

        const parses_token = typeof token === 'string' ? JSON.parse(token) : token
        log(`token ${token}`)
        
        const ticket = await client.verifyIdToken({
            idToken: parses_token.id_token,
            audience: ID_CLIENT
        })

        if(!ticket) {
            res.status(401).json({data: "failed to verify User", status : 401})
            return
        }

        const accses_token_parses = parses_token.access_token
        log(accses_token_parses)
        if(!accses_token_parses) {
            res.status(401).json({data: "anAuthorize accses token", status: 401})
            return
        }

        const accses_token_sign = jwt.sign({token: accses_token_parses}, KEY_TOKEN_JWT, {
            expiresIn: "5m"
        })

        res.cookie("token_access", accses_token_sign, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge : 60 * 60 * 1000,
            path: "/"
        })

        const role_default = "user"
        
        const ticket_payload = await ticket.getPayload()
        const googleId = ticket_payload?.sub

        if(!googleId) {
            res.status(401).json({data: "ksong", satatus: 401})
            return
        }

        const googleID_user =  await userOauth.findOne({googleId : googleId})

        if(googleID_user) {
            res.status(202).json({data: "data sudah ada"})  
            return
        }

        const user_login = new userOauth({
           googleId : ticket_payload?.sub,
           name : ticket_payload?.name, 
           refreshToken : parses_token.refresh_token,
           email: ticket_payload?.email,
           avatar : ticket_payload?.picture,
           role : role_default
        })

        await user_login.save()
        
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
}


export const ping = (req: Request, res: Response): void => {
    res.json("PONG")
}
