import axios from "axios"
import { useEffect } from "react"
import { useParams } from "react-router-dom"

const Dashboard = () => {
    const {id} = useParams()
    const url_user = import.meta.env.VITE_URL_BACKEND_GET_USER
    // const [data, setData] = useState<unknown>()

    console.log(id, "ini id nya bro")
    useEffect(() => {
        const handle_data = async (): Promise<void> => {
        const res = await axios.get(`${url_user}/${id}`)
        console.log(res.data)
    }
        handle_data()
    }, [id, url_user])
    return (
        <div>
            <h1>Ini Dashboard</h1>
        </div>
    )
}

export default Dashboard