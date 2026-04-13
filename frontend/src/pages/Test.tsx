import axios from "axios"
import { useEffect } from "react"

const Test = () => {

    const handle_api = async (): Promise<void> => {
        const res = await axios.get("http://localhost:3000/auth/checking/session", {
            withCredentials: true
        })
        console.log(res.data)
    }

    useEffect(() => {
        handle_api()
    }, [])

    return (
        <div>
            <h1>welcome to test api</h1>
        </div>
    )
}

export default Test