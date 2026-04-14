//* third party
import type {Request, Response} from "express"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import crypto from "crypto"

//* local
import { url } from "./auth/google.js"
import type { myCookie} from "../types/main.type.js"
import { client } from "./auth/google.js"
import {userOauth} from "../model/databse.model.js"
import { redis } from "../service/redis/redis.js"
import { handleError } from "../utils/asyncHandler.js"

//* config
dotenv.config()
const KEY_TOKEN_JWT = process.env.KEY_TOKEN_JWT!
const URL_FRONTEND = process.env.DASHBOARD_URL
const URL_FRONTEND_LOGIN = process.env.FRONTEND_URL
const ID_CLIENT =  process.env.AUTH_GOOGLE_ID_CLIENT as string
const DOMAIN = process.env.DOMAIN


const log = console.log
//* service

export const auth_google = async (req: Request, res: Response): Promise<void> => {
        const error_message = "url is required"
        if(!url) {
            handleError(res, error_message, 400)
            return
        }
        res.status(201).json({data: url , status: 201})
}

export const auth_google_callback = async (req: Request, res: Response): Promise<void> => {
    const token_code = req.query.code as string
    
    if(!token_code || typeof token_code !== "string") {
        const error_message = "AnAuthorize token code"
        handleError(res, error_message, 401)
        return
    }
    
    const payload: {token: string} = {
        token: token_code
    }
    const token = jwt.sign(payload, KEY_TOKEN_JWT, {
        expiresIn: "5m"
    })

    if(!token || typeof token !== "string" || token.trim() === "") {
        const error_message = "token code is undefined type string"
        handleError(res, error_message, 404)
        return
    }

    const {tokens} = await client.getToken(token_code as string)

    if(!tokens || typeof token !== "string") {
        const error_message = "undefined user data"
        handleError(res, error_message, 404)
        return
    }

    res.cookie("token", tokens, {
        httpOnly: true,
        sameSite: "lax",
        maxAge: 60 * 60 * 1000,
    })
    
    res.redirect(URL_FRONTEND!)
}

export const checking = async (req: Request, res: Response): Promise<void> => {
    const {token} = req.cookies as myCookie
    
    if(!token) {
        res.status(401).json({data: "Cookie token not found", status: 401})
        return
    }
    if(!KEY_TOKEN_JWT) {
        res.status(401).json({data: "AnAuthorize", status : 401})
        return
    }
    
    try {
        const parses_token = typeof token === 'string' ? JSON.parse(token) : token
        
    //TODO: TAMPILKAN USER DATA YANG LOGIN
    const ticket = await client.verifyIdToken({
        idToken: parses_token.id_token,
        audience: ID_CLIENT
    })
    
    console.log({ticket: ticket, data: "ini ticket"}) //TODO: CHECK CONSOLE BAKCNED

    if(!ticket) {
        res.status(401).json({data: "failed to verify User", status : 401})
        return
    }
    
    const role_default = "user"
    const ticket_payload = await ticket.getPayload()
    const googleId = ticket_payload?.sub ? ticket_payload.sub : "failed to get data"
    const find_sub = await userOauth.findOne({googleId: googleId})

    
    
    console.log({ticket_payload: ticket_payload, data: "ini ticket_payload"}) //TODO: CHECK CONSOLE BAKCNED

        if(!URL_FRONTEND) {
            res.status(404).json({data: "url frontend undefined"})
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

        res.status(200).json({
            data: true,
            user: user_login,
            status: 200
        })

    }catch (error) {
        if(error instanceof Error) {
            res.status(500).json({
                data: error.message,
                info : "server error coba cek service auth",
                status: 500
            })
        }
    }
}

export const checking_login_user = async (req: Request, res: Response): Promise<void> => {
    const {token, token_access} = req.cookies
    if(!token || !token_access){
        res.status(401).json({data: "cookie token are undefined", status: 401})
        return
    }
    if(!KEY_TOKEN_JWT){
        res.status(404).json({data: "invalid secret key jwt", status: 404})
        return
    }

    //* verify token
    const verify = jwt.verify(token_access, KEY_TOKEN_JWT)
    // const find_user_login = await userOauth.findOne() //TODO: FIND USER LOGIN MONGO
    
    console.log({
        data: verify,
        info: "data dari verify jwt"
    })

    try {
        const refresh_token = crypto.randomBytes(32).toString("hex")
        await redis.set("token", token, {ex: 3600})
        await redis.set("refresh_token", refresh_token, {ex: 3600})
        res.status(201).json({data: "succses send redis key try SET", status: 201})
        return
    }catch (error) {
        if(error instanceof Error) {
            res.status(401).json({data: error.message, status: 401})
            return
        }
    }

    res.status(200).json({data: "mantap"})
}

export const ping = (req: Request, res: Response): void => {
    res.json("PONG")
}
