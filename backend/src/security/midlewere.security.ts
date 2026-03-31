//third party
import express from "express"
import type { Response, Request, NextFunction } from "express"

export const midlewere_auth = (req: Request, res: Response, next: NextFunction) => {
    try{

    }catch (error) {
        if(error instanceof Error) {
            res.status(500).json({data: error.message, status: 500})
            return
        }
    }
}