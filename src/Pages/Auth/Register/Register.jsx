import React, { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import useAuth from '../../../hook/useAuth';
import { Link, useNavigate } from 'react-router';
import axios from 'axios'


const Register = () => {

    const { register, handleSubmit, setValue, formState: { errors } } = useForm();

    const { registerUser, updateUserProfile } = useAuth()

    const [allUpazilas, setAllUpazilas] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [districtId, setDistrictId] = useState('');
    const navigate = useNavigate()

    const upazilaOptions = useMemo(() => {
        if (!districtId) return [];
        return allUpazilas.filter(
            (u) => String(u.district_id) === String(districtId)
        );
    }, [allUpazilas, districtId]);

    useEffect(() => {
        axios.get('/upazila.json')
            .then(res => {
                setAllUpazilas(res.data.upazilas || [])
            })

        axios.get('/district.json')
            .then(res => {
                setDistricts(res.data.districts || [])
            })
    }, [])



    const handleRegistration = (data) => {
        const email = (data?.email || '').trim();
        if (!email) {
            alert('Please enter a valid email.');
            return;
        }

        if (data?.password !== data?.confirm_password) {
            alert('Password and Confirm Password must match.');
            return;
        }

        // console.log('after register', data.photo[0]);
        const profileImg = data.photo[0];

        registerUser(email, data.password).
            then(result => {


                // console.log(result.user)
                //store image and get the photo url 
                const formData = new FormData();
                formData.append('image', profileImg);
                const image_API_URL = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_url}`

                axios.post(image_API_URL, formData)
                    .then(res => {
                        const photoURL = res.data.data.url

                        //create user in the database
                        const userInfo = {
                            email,
                            displayName: data.name,
                            photoURL: photoURL,
                            blood: data.blood,
                            district: data.district,
                            upazila: data.upazila,
                        }
                        axios.post('http://localhost:5000/users', userInfo)
                            .then(res => {
                                console.log(res.data)
                            })
                            .catch(error => {
                                alert('please try again')
                            })

                        const userProfile = {
                            displayName: data.name,
                            photoURL: photoURL
                        }
                        updateUserProfile(userProfile)
                            .then(() => {
                                console.log('user profile updated ')
                                alert("Register successfully! please Login")
                                navigate('/login');
                            })
                            .catch(error => {
                                alert('please try again')
                            })
                    })

                //update user profile here 
            })
            .catch(error => {
                if (error.code === 'auth/email-already-in-use') {
                    alert('This email already exists. Please login.');
                } else if (error.code === 'auth/invalid-email') {
                    alert('Invalid email. Please check and try again.');
                } else {
                    alert(error.message);
                }
            })

    }
    return (
            <div className="card bg-base-100 w-full mx-auto max-w-sm shrink-0 shadow-2xl my-15">
                <h3 className='text-2xl font-bold text-gray-900 mt-3 text-center'>Welcome to <span className='text-red-500 font-bold'>Blood</span> <span className='text-gray-900 font-bold'>Donation</span></h3>
                <p className='text-center'>Please Register</p>
                <form className='card-body' onSubmit={handleSubmit(handleRegistration)}>
                    <fieldset className="fieldset">
                        {/* email */}
                        <label className="label">Email</label>
                        <input
                            type="email"
                            {...register('email', { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ })}
                            className="input"
                            placeholder="Email"
                        />
                        {errors.email && <span className='text-red-500'>Valid email is required</span>}
                        {/* name */}
                        <label className="label">Name</label>
                        <input type="text" {...register('name', { required: true })} className="input" placeholder="Your Name" />

                        {/* Photo*/}
                        <label className="label">Photo</label>
                        <input type="file" {...register('photo', { required: true })} className="input" placeholder="PhotoUrl" />

                        {/* Blood Group */}
                        <label className="label">Blood Group</label>
                        <select {...register('blood', { required: true })} className="select">
                            <option value="">Choose Blood Group</option>
                            {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(b => (
                                <option key={b} value={b}>{b}</option>
                            ))}
                        </select>

                        {/* District first — then upazila filtered by district_id */}
                        <label className="label">District</label>
                        <select
                            {...register('district', {
                                required: true,
                                onChange: (e) => {
                                    const name = e.target.value;
                                    const d = districts.find((x) => x.name === name);
                                    setDistrictId(d?.id ? String(d.id) : '');
                                    setValue('upazila', '');
                                },
                            })}
                            className="select"
                        >
                            <option value="">Select Your District</option>
                            {districts.map(d => (
                                <option key={d.id} value={d.name}>
                                    {d.name}
                                </option>
                            ))}
                        </select>

                        <label className="label">Upazila</label>
                        <select
                            {...register('upazila', { required: true })}
                            className="select"
                            disabled={!districtId}
                        >
                            <option value="">
                                {districtId ? 'Select Your Upazila' : 'Select district first'}
                            </option>
                            {upazilaOptions.map(u => (
                                <option key={u.id} value={u.name}>
                                    {u.name}
                                </option>
                            ))}
                        </select>

                        {/* password */}
                        <label className="label">Password</label>
                        <input type="password" {...register('password', { required: true, minLength: 6, pattern: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/ })} className="input" placeholder="Password" />
                        {errors.password?.type === 'required' && <span className='text-red-500'>This field is required</span>}
                        {errors.password?.type === 'minLength' && <span className='text-red-500'>Password must be at least 6 characters</span>}
                        {errors.password?.type === 'pattern' && <span className='text-red-500'>Password must include upper, lower, number and special character</span>}

                        <label className="label">Confirm Password</label>
                        <input
                            type="password"
                            {...register('confirm_password', { required: true })}
                            className="input"
                            placeholder="Confirm Password"
                        />
                        {errors.confirm_password && <span className='text-red-500'>Confirm password is required</span>}

                        <div><a className="link link-hover">Forgot password?</a></div>
                        <button className="btn btn-neutral mt-4">Register</button>
                    </fieldset>
                    <p>Already have an account ? <Link className='text-blue-500' to={'/login'}>Login</Link> </p>
                </form>

            </div>
        );
    };

    export default Register;