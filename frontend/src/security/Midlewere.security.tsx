import axios from "axios"
import type { props } from "../types/Types.types"
import { useEffect, useState } from "react"

const MidlewereSecurity = ({children}: props) => {
    const URL_BACKEND_TOKEN = import.meta.env.VITE_URL_BACKEND_TOKEN
    // const URL_BACKEND_TESTING = import.meta.env.VITE_URL_BACKEND_TESTING
    const log = console.log
    const [errors, setErrors] = useState<string>()
    useEffect(() => {
        const checkingData =  async() => {
        try {
        // const test = await axios.post(URL_BACKEND_TESTING, {
        //     withCredentials: true
        // })
        // log(test)
        // log(test.headers.host)
        const res = await axios.post(URL_BACKEND_TOKEN, {}, 
            {
                withCredentials: true
            }
        )
        log(res.data)
        if(!res.data){
            alert(errors)
            console.log(res.data)
            return
        }
    }catch (error) {
        if(error instanceof Error) {
            setTimeout(() => {
                setErrors(error.message)
                return
            }, 0);
        }
    }
}
checkingData()
}, [URL_BACKEND_TOKEN, errors, log])
    return children
}

export default MidlewereSecurity
