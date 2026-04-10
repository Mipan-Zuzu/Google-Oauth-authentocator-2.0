//* third party
import expres, { request, response } from "express"
import type {NextFunction, Request, Response, Router} from "express"

//* service
import { asyncHanlder } from "../utils/asyncHandler.js"
import { auth_google, auth_google_callback, checking, ping } from "../service/auth.service.js"
//* midlewere
import {
    midlewere_auth_google,
    midlewere_google_login 
} from "../security/midlewere.security.js"
import { cookie_testing } from "../test/cookie/cookie.js"

//* config
export const routes: Router = expres.Router()

//* route auth
routes.get("/auth/google/login", asyncHanlder(async(req: Request, res: Response): Promise<void> => auth_google(req, res)))

routes.get("/auth/google/callback", 
    midlewere_google_login,
    asyncHanlder(async(req: Request, res: Response): Promise<void> => auth_google_callback(req, res)))

routes.get("/auth/checking/token", 
   async (req: Request, res: Response): Promise<void> => checking(req, res))

routes.get("/auth/checking/token", async (req: Request, res: Response): Promise<void> => checking(req, res))

routes.get("/auth/testing", async (req: Request, res: Response): Promise<void> => cookie_testing(req, res))


//* testing routes 
routes.get("/ping", (req: Request, res: Response) => ping(req, res))