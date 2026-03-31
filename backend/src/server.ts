//third party
import dotenv from "dotenv"
import express from "express"
//local

const app = express()
app.use(express.json)
const port: number = 3000

dotenv.config()
const log = console.log
const ACCSES_TOKEN_JWT = process.env.KEY_TOKEN_JWT
const AUTH_GOOGLE_ID_CLIENT = process.env.AUTH_GOOGLE_ID_CLIENT

try{ 
    app.listen(port, () => {
    log(`succses listen server in port ${port}`)
})
}catch (error) {
    if(error instanceof Error) {
        log(error.message)
    }
}