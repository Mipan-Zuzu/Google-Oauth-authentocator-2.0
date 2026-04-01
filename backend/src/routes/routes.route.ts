//* third party
import expres from "express"
import type {Request, Response, Router} from "express"

//* service
import { auth_google, ping } from "../service/auth.service.js"
//* midlewere
import {
    midlewere_auth_google,
    midlewere_google_login 
} from "../security/midlewere.security.js"

//* config
export const routes: Router = expres.Router()

//* route auth
routes.get("/auth/google/login", (req: Request, res: Response): Promise<void> => auth_google(req, res))

// routes.post("/auth/google/callback", midlewere_auth_google, (req: Request, res: Response): Promise<void> => )

//* testing routes 
routes.get("/ping", (req: Request, res: Response) => ping(req, res))