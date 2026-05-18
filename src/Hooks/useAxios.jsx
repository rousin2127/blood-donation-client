import axios from "axios";




const axiosInstance = axios.create({
    baseURL: 'https://blood-donation-server-tm6c.onrender.com'
})

const useAxios = () =>{
    return axiosInstance
}
export default useAxios;