// import axios from "axios"

const Dashboard = () => {

    const testing = async () => {
        // const res = await axios.post("http://localhost:3000/auth/checking/token", {} , {
        //     withCredentials: true
        // })

        // console.log(res.data)
    }

    return (
        <div>
            <h1>Ini Dashboard</h1>
            <button onClick={() => testing()}>klik</button>
        </div>
    )
}

export default Dashboard