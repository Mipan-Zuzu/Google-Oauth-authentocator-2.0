//third party
import expres from "express"
import type {Request, Response} from "express"

//

//config
const route = expres.Router()

//route pages
route.post("/api/auth/login", (req: Request, res: Response) => auth_google_connect(req, res))