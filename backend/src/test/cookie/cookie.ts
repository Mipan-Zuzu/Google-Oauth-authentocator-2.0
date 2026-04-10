import type {Request, Response} from "express"
import jwt from "jsonwebtoken"

export const cookie_testing = async (req: Request, res: Response): Promise<void> => {

    interface Payload  {
        name: string 
        id: number
    }

    const payload: Payload = {
        name: "mipan",
        id: 293781293
    }
    
    const jwt_payload = jwt.sign(payload, "dadasdasd", {
        expiresIn: 60 * 60 * 60
    })

    

    res.cookie("suki", jwt_payload, 
        {
            maxAge: 60 * 60 * 60,
            httpOnly: true,
            secure: true,
            sameSite: "none"
        })
    
    res.json("succses")
}