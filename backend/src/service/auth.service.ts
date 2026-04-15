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
import { devNull } from "os"

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
    const role_default = process.env.DB_DEFAULT_USER
    
    if(!token_code || typeof token_code !== "string") {
        const error_message = "AnAuthorize token code"
        handleError(res, error_message, 401)
        return
    }

    const {tokens} = await client.getToken(token_code as string)

    if(!tokens || !tokens.id_token) {
        const error_message = "undefined user data "
        handleError(res, error_message, 404)
        return
    }


// Todod : using try Catch errror
try {

    // Todo: verify client login
    const ticket = await client.verifyIdToken({
        idToken: tokens.id_token,
        audience: ID_CLIENT
    })

    //  Todo: get paylaod client login
    const ticket_payload = await ticket.getPayload()

    const googleId = ticket_payload?.sub ? ticket_payload.sub : "failed to get data"
    //  Todo: find client login. data profile
    const find_sub = await userOauth.findOne({googleId: googleId})
        const parses_token = typeof tokens === 'string' ? JSON.parse(tokens) : tokens


        if(find_sub || find_sub !== null) {
            res.status(409).json(
                {
                    data : "user registration data has been added previously",
                    status : 409
                }
            )
        }

        //  Todo: set scema client login. data profile
        const user_login = new userOauth({
           googleId : ticket_payload?.sub,
           name : ticket_payload?.name, 
           refreshToken : parses_token.refresh_token,
           email: ticket_payload?.email,
           avatar : ticket_payload?.picture,
           role : role_default
        })
        await user_login.save()
        console.log({
            parses_token : parses_token,
            user_login : user_login,
            info: "kumpulan data parses_token dan user login"
        })

    console.log({
        find_sub : !find_sub?._id? user_login._id.toString() : find_sub._id.toString(),
        info : "data di db client id",
        binding : "69dfca20d4e4cdcc7da59b74",
        status : 200
    })

    
    const sid = crypto.randomUUID()
    
    const payload = {
        sessionId : `sid_${sid}`,
        userId :  !find_sub?._id? user_login._id.toString() : find_sub._id.toString(),
        googleSub : ticket_payload?.sub,
        email : ticket_payload?.email
    }

    await redis.set(`session:sid_${sid}`, payload, {ex: 3600})

    res.cookie("sid", `sid_${sid}`, {
        httpOnly: true,
        sameSite: "lax",
        maxAge: 60 * 60 * 1000,
    })

    res.status(200).json({
        data : "valid",
        status : 200
    })

} catch (error) {
    if(error instanceof Error) {
        res.status(500).json({
            data : error.message,
            status : 500
        })
        return
    }
}
    
    res.redirect(URL_FRONTEND!)
}

export const checking = async (req: Request, res: Response): Promise<void> => {
    // Todod: jadi simpan hasil 
    const payload = {
    "sessionId": "sess_abc123xyz",
    "userId": "123",
    "googleSub": "10987654321",
    "email": "user@gmail.com"
    }
}

export const checking_login_user = async (req: Request, res: Response): Promise<void> => {
    const {token} = req.cookies
    if(!token || typeof token !== "string"){
        const error_message = "cookie token are undefined"
        handleError(res, error_message, 404)
        return
    }
    //* verify token
    // const verify = jwt.verify(token_access, KEY_TOKEN_JWT)
    const find_user_login = await userOauth.findOne() //TODO: FIND USER LOGIN MONGO
    // console.log({
    //     data : `verify jwt data ${verify}`,
    //     status: 200
    // })

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
