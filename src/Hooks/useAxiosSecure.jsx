import axios from "axios";
import { useEffect } from "react";
import useAuth from "../hook/useAuth";




const axiosSecure = axios.create({
    baseURL:'http://localhost:5000'
})

const useAxiosSecure = ()=>{

    const {user}= useAuth()
    useEffect(()=>{
        const reqInterceptor = axiosSecure.interceptors.request.use(config=>{
            config.headers.Authorization = `Bearer ${user?.accessToken}`
            return config
        })

        const reqInterceptor = axiosSecure.interceptors.response.use((response)=>{
            return response 
        },(error)=>{
            console.log(error);
            return Promise.reject(error)
        })

        return ()=>{
             axiosSecure.interceptors.request.eject(reqInterceptor);
             axiosSecure.interceptors.response.eject(reqInterceptor)
        }

    },[user])
}