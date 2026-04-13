import { Redis } from "@upstash/redis";
import dotenv from "dotenv"


dotenv.config()
const UPSTASH_REDIS_REST_URL = process.env.UPSTASH_REDIS_REST_URL
const UPSTASH_REDIS_REST_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN

if(!UPSTASH_REDIS_REST_URL) {
    console.log({
        data : "undefined read redis_rest_url",
        status : 401
    })
}

if(!UPSTASH_REDIS_REST_TOKEN) {
    console.log({
        data : "undefined read TOKEN",
        status : 401
    })
}

 export const redis = new Redis({
            url : UPSTASH_REDIS_REST_URL,
            token : UPSTASH_REDIS_REST_TOKEN
        })

