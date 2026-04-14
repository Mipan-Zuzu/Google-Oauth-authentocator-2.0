import type { Request, Response, NextFunction } from "express";

export const asyncHanlder = (fn: Function) => 
(req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next)
}

export const throwError = <T>(value: T, message: string) => {
    if(!value) throw new Error(message)
}

export const handleError = (
    res: Response,
    error: unknown,
    status: number = 500
    ) => {
    console.error(error)

    const message = 
    error instanceof Error ? error.message : "internal server error"
    
    return res.status(status).json({
        data : message,
        status : status
    })
}