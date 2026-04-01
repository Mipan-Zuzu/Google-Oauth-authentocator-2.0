//* Third party
import { OAuth2Client, type GenerateAuthUrlOpts } from "google-auth-library";
import { auth_google } from "../auth.service.js";
import dotenv from "dotenv"

//* config 
dotenv.config()

const log = console.log
export const client: OAuth2Client = new OAuth2Client(
    process.env.AUTH_GOOGLE_ID_CLIENT,
    process.env.AUTH_GOOGLE_CLIENT_SECRET,
    process.env.AUTH_GOOGLE_REDIRECT
)

export const url: string = client.generateAuthUrl({
    access_type: "offline",
    scope: ["profile", "email"]
})

