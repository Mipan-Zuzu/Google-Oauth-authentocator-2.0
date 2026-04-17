//* third party
import type {Request, Response} from "express"
import dotenv from "dotenv"
import crypto from "crypto"

//* local
import { url } from "./auth/google.js"
import { client } from "./auth/google.js"
import {userOauth} from "../model/databse.model.js"
import { redis } from "../service/redis/redis.js"
import { handleError } from "../utils/asyncHandler.js"

//* config
dotenv.config()
const URL_DASHBOARD = process.env.DASHBOARD_URL
const ID_CLIENT =  process.env.AUTH_GOOGLE_ID_CLIENT as string
const URL_FRONTEND = process.env.FRONTEND_URL


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

    const googleId = ticket_payload?.sub
    if(!googleId || googleId.length <= 1) {
        res.status(404).json({
            data : "googleid undefined null data cannnot find",
            status : 404
        })
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
        sameSite: "lax",
        maxAge: 60 * 60 * 1000,
    })

    await redis.expire(`session:sid_${sid}`, 3600)
    res.redirect(URL_DASHBOARD!)

} catch (error) {
    if(error instanceof Error) {
        res.redirect(URL_FRONTEND!)
        return
    }
}
}

export const checking = async (req: Request, res: Response): Promise<void> => {
    const {sid} = req.cookies
    try{

        if(!sid) {
            res.status(401).json({
                data : "name token expired"
            })
            return
        }

        const get = await redis.get(sid)

    }catch (error) {
        if(error instanceof Error) {
            res.status(500).json({
                data : error.message,
                status : 500
            })
        }
    }
}


//TODO: ini untuk midlewre
export const checking_login_user = async (req: Request, res: Response): Promise<void> => {
    const {sid} = req.cookies

    if(!sid || typeof sid !== "string"){
        const error_message = "cookie token are undefined"
        handleError(res, error_message, 404)
        return
    }

    
    //TODO: tinggal buat setiap req valid, buat refresh token supaya nambah masa berlaku nya 
    //TODO: lakukan validasi supaya login benar benar orang itu dengan redis nya cek bener atau borogan
    //TODO: selesai tambahkan sedikit err handle dan rapikan code selesai sudah capter ini

    try {
        const refresh_token = crypto.randomBytes(32).toString("hex")
        await redis.set("refresh_token", refresh_token, {ex: 3600})
        res.status(201).json({data: "succses send redis key try SET", status: 201})
        return
    }catch (error) {
        if(error instanceof Error) {
            res.status(401).json({data: error.message, status: 401})
            return
        }
    }

    const get = await redis.get(sid.toString())
    res.status(200).json({
        data : get,
        info : sid,
        status : 200
    })
}

export const ping = (req: Request, res: Response): void => {
    res.json("PONG")
}
