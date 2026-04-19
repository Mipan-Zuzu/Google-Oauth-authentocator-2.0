import axios from "axios"
import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"

//TODO: icons

type Data = {
    email : string
    name : string
    avatar : string
}

const Dashboard = () => {
    const {id} = useParams()
    const url_user = import.meta.env.VITE_URL_BACKEND_GET_USER
    const navigate = useNavigate()
    const [data, setData] = useState<Data | null>(null)

    useEffect(() => {
        const handle_data = async (): Promise<void> => {
        try {
            const res = await axios.get(`${url_user}/${id}`, {
                withCredentials: true
            })

            if(!res.data){
                console.log("invalid response data")
                navigate("/")
                return
            }

            console.log(res.data)
            console.log(res.data.data)

            setData(res.data.data)
            return
        }catch (error) {
            if(error instanceof Error) {
                console.log(error.message)
            }
        }
        }
        handle_data()
    }, [id, url_user, navigate])

    
    if(!data) {
        return <div className="animate-pulse flex min-h-screen justify-center flex-col items-center gap-2">
        <div className="w-24 h-24 bg-gray-300 rounded-full"></div>
        <div className="w-32 h-4 bg-gray-300 rounded"></div>
        <div className="w-40 h-3 bg-gray-300 rounded"></div>
        </div>
    }

    console.log(data.avatar)

    return (
        <div className="min-h-screen flex justify-center flex-col items-center gap-2">
                <div>
                    <img className="rounded-full w-24 h-24 border-3 border-emerald-400" src={`${data.avatar}`} alt="" />
                    <p className="w-3 h-3 bg-emerald-400 absolute -mt-22 ml-2 rounded-full"></p>
                </div>
                <p className="text-center text-lg font-mono font-bold">@{data.name? data.name : "undefined"}</p>
                <p className="text-center text-md font-mono">{data.email}</p>
        </div>
    )
}

export default Dashboard