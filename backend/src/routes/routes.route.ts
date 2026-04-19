//* third party
import expres, { request, response } from "express"
import type {NextFunction, Request, Response, Router} from "express"
import { redis } from "../service/redis/redis.js"

//* service
import { asyncHanlder } from "../utils/asyncHandler.js"
import { auth_google, auth_google_callback, checking, ping} from "../service/auth.service.js"
import { userOauth } from "../model/databse.model.js"
//* midlewere
import {
    midlewere_auth_google,
    midlewere_google_login 
} from "../security/midlewere.security.js"

//* type module
import {handleResponse} from "../utils/asyncHandler.js"

//* config
export const routes: Router = expres.Router()

//* route auth
routes.get("/auth/google/login", asyncHanlder(async(req: Request, res: Response): Promise<void> => auth_google(req, res)))

routes.get("/auth/google/callback", 
    midlewere_google_login,
    asyncHanlder(async(req: Request, res: Response): Promise<void> => auth_google_callback(req, res)))

routes.get("/auth/checking/token", 
   async (req: Request, res: Response): Promise<void> => checking(req, res))
   
routes.get("/auth/user/:id", async(req: Request, res: Response): Promise<void> => {
    const {sid} = req.cookies
    const {id} = req.params

    if(!sid) {
        const message = "invalid session id anauthorize with status 401"
        handleResponse(res, message, 401)
        return
    }

    type data = {
        googleSub: string
    }

    const {googleSub} = await redis.get(sid) as data

    if(!googleSub) {
        const message = "invalid data session payload anauthorize with status 401"
        handleResponse(res, message, 401)
        return
    }

    try {
        const find_user = await userOauth.findOne({googleId : googleSub}) 

        if(!find_user) {
            const message = "invalid data , database cannot find spesific data status code 404"
            handleResponse(res, message, 404)
            return
        }

        const user_find_dat = find_user.googleId

        if(user_find_dat !== id) {
            const message = "invalid google id user status 401"
            handleResponse(res, message, 401)
            return
        }

        handleResponse(res, find_user, 200)
        return
    }catch (error) {
        if(error instanceof Error) {
            handleResponse(res, error.message, 500)
        }
    }
})

routes.get("/auth/sub", async (req: Request, res: Response): Promise<void> => {
    const {sid} = req.cookies
        if(!sid) {
            const message = "invalid session id cookie unauthorize with status 401"
            handleResponse(res, message, 401)
            return
        }

        type data = {
            googleSub : string
        }

        const data = await redis.get(sid) as data

        if(!data) {
            const message = "invalid data res redis status code 401"
            handleResponse(res, message, 401)
            return
        }

    try {
        const googleSub = data.googleSub
        handleResponse(res, googleSub, 200)
        return

    } catch (error) {
        if(error instanceof Error) {
            handleResponse(res, error.message, 500)
            return
        }
    }
})

//* testing routes 
routes.get("/ping", (req: Request, res: Response) => ping(req, res))