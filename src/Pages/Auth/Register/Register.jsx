import React from 'react';
import { useForm } from 'react-hook-form';
import useAuth from '../../../hook/useAuth';
import { Link } from 'react-router';
import axios from 'axios'


const Register = () => {

    const { register, handleSubmit,
        watch,
        formState: { errors }, } = useForm();

    const { registerUser , updateUserProfile} = useAuth()

    const handleRegistration = (data) => {
        console.log('after register', data.photo[0]);
        const profileImg= data.photo[0];

        registerUser(data.email, data.password).
            then(result => {
                console.log(result.user)
                //store image and get the photo url 
                const formData =new FormData();
                formData.append('image',profileImg);
                const image_API_URL =`https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_url}`

                axios.post(image_API_URL, formData)
                .then(res => {
                    console.log('after image upload', res.data.data.url)

                    const userProfile = {
                        displayName : data.name,
                        photoURL : res.data.data.url
                    }
                    updateUserProfile(userProfile)
                    .then( () =>{
                        console.log('user profile updated ')
                    })
                    .catch(error => console.log(error))
                })

                //update user profile here 
            })
            .catch(error => {

                console.log(error)

            })
    }
    return (
        <div className="card bg-base-100 w-full mx-auto max-w-sm shrink-0 shadow-2xl">
            <h3 className='text-3xl text-center'>Welcome To Blood Donation</h3>
            <p className='text-center'>Please Register</p>
            <form className='card-body' onSubmit={handleSubmit(handleRegistration)}>
                <fieldset className="fieldset">

                    <label className="label">Name</label>
                    <input type="text" {...register('name', { required: true })} className="input" placeholder="Your Name" />                    
                    {/* email */}
                    <label className="label">Email</label>
                    <input type="email" {...register('email', { required: true })} className="input" placeholder="Email" />
                    {errors.email && <span>This field is required</span>}
                    {/* Photo*/}
                    <label className="label">Photo</label>
                    <input type="file" {...register('photo', { required: true })} className="input" placeholder="PhotoUrl" />
                    {/* passward */}
                    <label className="label">Password</label>
                    <input type="password" {...register('password', { required: true, minLength: 6, pattern: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/ })} className="input" placeholder="Password" />
                    {errors.password?.type === 'required' && <span className='text-red-500'>This field is required</span>}
                    {errors.password?.type === 'minLength' && <span className='text-red-500'>Password must be at Least 6 charecter</span>}
                    {errors.password?.type === 'pattern' && <span className='text-red-500'>Password must be at Least pattern</span>}

                    <div><a className="link link-hover">Forgot password?</a></div>
                    <button className="btn btn-neutral mt-4">Register</button>
                </fieldset>
                <p>Already have an account ? <Link className='text-blue-500' to={'/login'}>Login</Link> </p>
            </form>

        </div>
    );
};

export default Register;