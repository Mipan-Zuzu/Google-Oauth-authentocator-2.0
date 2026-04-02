import axios from "axios"
import { useNavigate } from "react-router-dom"
import type { props } from "../types/Types.types"

const MidlewereSecurity = ({children}: props) => {
    const URL_BACKEND_TOKEN = import.meta.env.VITE_URL_BACKEND_TOKEN
    const navigation = useNavigate()
    const checking_token = async() => {
        const res = await axios.get(URL_BACKEND_TOKEN)
        const token = res.data
        if(!token) {
            navigation("/")
            return
        }

        
    }
    checking_token()
    return children
}
export default MidlewereSecurity