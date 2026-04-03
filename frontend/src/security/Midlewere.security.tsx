import axios from "axios"
// import { useNavigate } from "react-router-dom"
// import type { props } from "../types/Types.types"
import { useState } from "react"

// {children}: props
const MidlewereSecurity = () => {
    const URL_BACKEND_TOKEN = import.meta.env.VITE_URL_BACKEND_TOKEN
    const log = console.log
    const [errors, setErrors] = useState<string>()
       const checkingData =  async() => {
         try {
        const res = await axios.get(URL_BACKEND_TOKEN, {
            withCredentials: true
        })
        const token = res.data
        console.log(!token? "suki" : token)
        log(URL_BACKEND_TOKEN)
    }catch (error) {
        if(error instanceof Error) {
            setTimeout(() => {
                setErrors(error.message)
            }, 0);
        }
    }
       }
       checkingData()
    

    
    return <h1>{ !errors? "succses" : errors }</h1>
}
export default MidlewereSecurity
