//* third party
import expres, { request, response } from "express"
import type {NextFunction, Request, Response, Router} from "express"

//* service
import { asyncHanlder } from "../utils/asyncHandler.js"
import { auth_google, auth_google_callback, checking, ping, checking_login_user } from "../service/auth.service.js"
import { userOauth } from "../model/databse.model.js"
//* midlewere
import {
    midlewere_auth_google,
    midlewere_google_login 
} from "../security/midlewere.security.js"

//* config
export const routes: Router = expres.Router()

//* route auth
routes.get("/auth/google/login", asyncHanlder(async(req: Request, res: Response): Promise<void> => auth_google(req, res)))

routes.get("/auth/google/callback", 
    midlewere_google_login,
    asyncHanlder(async(req: Request, res: Response): Promise<void> => auth_google_callback(req, res)))

routes.post("/auth/checking/token", 
   async (req: Request, res: Response): Promise<void> => checking(req, res))

routes.get("/auth/checking/session", async (req: Request, res: Response): Promise<void> => checking_login_user(req, res))

routes.get("/auth/user", async(req: Request, res: Response): Promise<void> => {
    const user_find = await userOauth.find()
    if(!user_find || user_find.length < 1) {
        res.status(400).json({
            status: 404,
            data: "cannot find user"
        })
    }
    res.status(200).json({
        status: 200,
        data: user_find
    })
})

//* testing routes 
routes.get("/ping", (req: Request, res: Response) => ping(req, res))