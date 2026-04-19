//* third party
import type {Request, Response} from "express"
import dotenv from "dotenv"
import crypto from "crypto"

//* local
import { url } from "./auth/google.js"
import { client } from "./auth/google.js"
import {userOauth} from "../model/databse.model.js"
import { redis } from "../service/redis/redis.js"
import { handleResponse } from "../utils/asyncHandler.js"

//* config
dotenv.config()
const URL_DASHBOARD = process.env.DASHBOARD_URL
const ID_CLIENT =  process.env.AUTH_GOOGLE_ID_CLIENT as string
const URL_FRONTEND = process.env.FRONTEND_URL


//* service

export const auth_google = async (req: Request, res: Response): Promise<void> => {
        const error_message = "url is required"
        if(!url) {
            handleResponse(res, error_message, 400)
            return
        }
        res.status(201).json({data: url , status: 201})
}

//TODO: ini untuk callback dari oauth google
export const auth_google_callback = async (req: Request, res: Response): Promise<void> => {
    const token_code = req.query.code as string
    const role_default = process.env.DB_DEFAULT_USER
    
    if(!token_code || typeof token_code !== "string") {
        const error_message = "invalid token code status code 401"
        handleResponse(res, error_message, 401)
        return
    }

    const {tokens} = await client.getToken(token_code as string)

    if(!tokens || !tokens.id_token) {
        const error_message = "invalid user data status code 401"
        handleResponse(res, error_message, 404)
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

    const googleId = ticket_payload?.sub
    if(!googleId) {
        const error_message = "googleid invalid google subject status code 401"
        handleResponse(res, error_message, 401)
        return
    }
    //  Todo: find client login. data profile
    const parses_token = typeof tokens === 'string' ? JSON.parse(tokens) : tokens
    const find_sub = await userOauth.findOne({googleId: googleId})
    
    
    let user_dat
    if(!find_sub?._id || find_sub?._id == null) {
        const user_login = new userOauth({
            googleId : ticket_payload?.sub,
            name : ticket_payload?.name, 
            refreshToken : parses_token.refresh_token,
            email: ticket_payload?.email,
            avatar : ticket_payload?.picture,
            role : role_default
        })
        user_dat = user_login
    }
    

    //  Todo: set scema client login. data profile

    await user_dat?.save()
    const userId = user_dat?._id
        ? user_dat?._id.toString()
        : find_sub?._id.toString()

    const sid = crypto.randomUUID()
    
    const payload = {
        sessionId : `sid_${sid}`,
        userId :  userId,
        googleSub : ticket_payload?.sub,
        email : ticket_payload?.email
    }

    await redis.set(`session:sid_${sid}`, payload, {ex: 3600})
    
    res.cookie("sid", `session:sid_${sid}`, {
        httpOnly: true,
        sameSite: "none",
        secure: true,
        maxAge: 60 * 60 * 1000,
    })

    res.redirect(`${URL_DASHBOARD}/${ticket_payload.sub}`)
    return
} catch (error) {
    if(error instanceof Error) {
        handleResponse(res, error.message, 500)
        return
    }
}
}

//TODO: login midlewere fe
export const checking = async (req: Request, res: Response): Promise<void> => {
    const {sid} = req.cookies
    console.log(`ini ${sid} gweh dari cookie`)
    try{
        if(!sid) {
            const message = "invalid or expired session id status code 401 unauthorize"
            handleResponse(res, message, 401)
            return
        }
        const get = await redis.get(sid)
        if(!get || typeof get !== "object") {
            const message = "invalid data session in state memory status code 401"
            handleResponse(res, message, 401)
            return
        }
        const message = "succses checking session in state memory status code 200"
        handleResponse(res, message, 200)
        return
    }catch (error) {
        if(error instanceof Error) {
            handleResponse(res, error.message, 500)
            return
        }
    }
}

export const ping = (req: Request, res: Response): void => {
    res.json("PONG")
}
