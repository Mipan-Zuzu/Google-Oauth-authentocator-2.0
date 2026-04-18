import axios from "axios"
import type { props } from "../types/Types.types"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

const MidlewereLogin = ({children}: props) => {
    const URL_BACKEND_TOKEN = import.meta.env.VITE_URL_BACKEND_TOKEN
    const URL_BACKEND_GOOGLE_ID = import.meta.env.VITE_URL_BACKEND_GET_GOOGLE_ID
    const navigate = useNavigate()


//TODO: useEffect fetch data
useEffect(() => {
    const func_fetch = async () => {
        if(!URL_BACKEND_TOKEN) {
            console.log("invalid url backend token")
            return
        }

        if(!URL_BACKEND_GOOGLE_ID) {
            console.log("invalid url backend get user sub")
            return
        }

    try {
        const res = await axios.get(URL_BACKEND_TOKEN, {
            withCredentials: true
        })
        const res_sub = await axios.get(URL_BACKEND_GOOGLE_ID, {
            withCredentials: true
        })

        if(!res_sub) {
            console.log("invalid data subject id user")
            navigate("/")
            return
        }

        const {data} = res_sub.data
        console.log(res_sub.data, "Dari res_sub.data")
        console.log(data, "dari descruturing data")
        const res_wraping = res.status? res.status : null
        if(res_wraping === 401 || res_wraping === 404 || res_wraping == null || res_wraping === 500 || !res.data) {
            console.log(res.status, "ini status code nya")
            navigate("/")
            return
        }else {
            console.log(res.status, "ini status code nya")
            navigate("/error")
        }

        navigate(`/dashboard/user/${res_sub.data.data}`)
        return
    }catch (error: unknown) {
        if(error) {
            console.log({data : error, status : 500})
            navigate("/")
        }
    }
    }
        func_fetch()
}, [URL_BACKEND_TOKEN, navigate, URL_BACKEND_GOOGLE_ID])

    return children
}

export default MidlewereLogin