import axios from "axios"
import { useNavigate } from "react-router-dom"
import type { props } from "../types/Types.types"
import { useEffect, useState } from "react"

const MidlewereSecurity = ({children}: props) => {
    const URL_BACKEND_TOKEN = import.meta.env.VITE_URL_BACKEND_TOKEN
    const navigate = useNavigate()
    const log = console.log
    const [errors, setErrors] = useState<string>()
    useEffect(() => {
         const checkingData =  async() => {
         try {
        const res = await axios.get(URL_BACKEND_TOKEN, {
            withCredentials: true
        })
        log(res.data)
        if(!res.data){
            alert(errors)
            return
            console.log(res.data)
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
}, [URL_BACKEND_TOKEN, log, errors, navigate, children])


return children

}
export default MidlewereSecurity
