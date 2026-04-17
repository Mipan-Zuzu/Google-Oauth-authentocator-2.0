import axios from "axios"
import { useEffect } from "react"

const Test = () => {

    const handle_api = async (): Promise<void> => {
        try {
            const res = await axios.get("http://localhost:3000/auth/checking/session", {
            withCredentials: true
            })
            console.log({
                data : res.data,
                status : res.status
            })
        } catch (err) {
            if(err instanceof Error) {
                console.log({
                    data : err.message,
                    status : err.name
                })
            }
        }
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