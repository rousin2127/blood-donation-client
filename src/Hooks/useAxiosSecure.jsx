import axios from "axios";
import { useEffect } from "react";
import useAuth from "../hook/useAuth";




const axiosSecure = axios.create({
    baseURL:'https://blood-donation-server-tm6c.onrender.com'
})

const useAxiosSecure = ()=>{

    const {user}= useAuth()
    
    useEffect(() => {
        const reqInterceptor = axiosSecure.interceptors.request.use(async (config) => {
            // Firebase v9+ User — use ID token (accessToken on user is often undefined after reload)
            if (user) {
                const token = await user.getIdToken();
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        })

        const resInterceptor = axiosSecure.interceptors.response.use((response)=>{
            return response 
        },(error)=>{
            console.log(error);
            return Promise.reject(error)
        })

        return ()=>{
             axiosSecure.interceptors.request.eject(reqInterceptor);
             axiosSecure.interceptors.response.eject(resInterceptor)
        }

    },[user])

    return axiosSecure
}

export default useAxiosSecure