import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import useAuth from '../../../hook/useAuth';
import { Link, useLocation, useNavigate } from 'react-router';

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { signInUser } = useAuth();
  const [authError, setAuthError] = useState('');

  const navigate = useNavigate();
  const location = useLocation();

  // where the user came from
  const from = location.state?.from?.pathname || '/';

  const handleSignIn = (data) => {
    setAuthError(''); // Clear any previous errors
    signInUser(data.email, data.password)
      .then(() => {
        navigate(from, { replace: true });
      })
      .catch(error => {
        console.log(error);
        // Handle specific authentication errors
        if (error.code === 'auth/wrong-password' || error.message.includes('password')) {
          setAuthError('Incorrect password. Please try again.');
        } else if (error.code === 'auth/user-not-found' || error.message.includes('user')) {
          setAuthError('No user found with this email.');
        } else if (error.code === 'auth/invalid-credential') {
          setAuthError('Invalid email or password.');
        } else {
          setAuthError('Login failed. Please try again.');
        }
      });
  };

  return (
    <div className="card my-15 bg-base-100 w-full mx-auto max-w-sm shrink-0 shadow-2xl">
      <h3 className="text-2xl font-bold text-gray-900 mt-3 text-center">Welcome back</h3>
      <p className="text-center">Please Login</p>

      <form className="card-body" onSubmit={handleSubmit(handleSignIn)}>
        {/* Display authentication error */}
        {authError && (
          <div className="alert alert-error mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{authError}</span>
          </div>
        )}

        <fieldset className="fieldset">
          <label className="label">Email</label>
          <input
            type="email"
            {...register('email', { 
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address'
              }
            })}
            className="input input-bordered"
            placeholder="Email"
          />
          {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}

          <label className="label">Password</label>
          <input
            type="password"
            {...register('password', { 
              required: 'Password is required',
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters'
              }
            })}
            className="input input-bordered"
            placeholder="Password"
          />
          {errors.password && <span className="text-red-500 text-sm">{errors.password.message}</span>}

          <div className="mt-2">
            <a className="link link-hover text-sm">Forgot password?</a>
          </div>

          <button className="btn btn-neutral mt-4" type="submit">Login</button>
        </fieldset>

        <p className="mt-4 text-center">
          Don't have an account?{' '}
          <Link className="text-blue-500 hover:text-blue-600 font-medium" to="/register">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;