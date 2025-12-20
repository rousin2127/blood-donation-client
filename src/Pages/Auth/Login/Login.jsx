import React from 'react';
import { useForm } from 'react-hook-form';
import { register } from 'swiper/element';
import useAuth from '../../../hook/useAuth';
import { Link } from 'react-router';


const Login = () => {


    const {register, handleSubmit, watch,formState: { errors },}= useForm();
    const {signInUser}= useAuth()

    const handleSignIn = (data)=>{
        console.log ('login form ', data)
        signInUser(data.email, data.password).
        then(result =>{
            console.log(result.user)
        })
        .catch(error =>{
            console.log(error)
        })
    }
    return (
        <div  className="card bg-base-100 w-full mx-auto max-w-sm shrink-0 shadow-2xl">
            <h3 className='text-3xl text-center'>Welcome back </h3>
            <p className='text-center'>Please Login</p>
            <form  className='card-body' onSubmit={handleSubmit(handleSignIn)}>
                <fieldset className="fieldset">
                    <label className="label">Email</label>
                    <input type="email" {...register('email', { required: true })} className="input" placeholder="Email" />
                    {errors.email && <span>This field is required</span>}
                    {/* password */}
                    <label className="label">Password</label>
                    <input type="password" {...register('password', { required: true ,minLength: 6, pattern:/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/})} className="input" placeholder="Password" />
                    {errors.password?.type==='required' && <span className='text-red-500'>This field is required</span>}
                    <div><a className="link link-hover">Forgot password?</a></div>
                    <button className="btn btn-neutral mt-4">Login</button>
                </fieldset>
                <p>Have an account ? <Link className='text-blue-500' to={'/register'} >Register</Link> </p>
            </form>
        </div>
    );
};

export default Login;