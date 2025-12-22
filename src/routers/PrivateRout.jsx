import React from 'react';
import useAuth from '../hook/useAuth';
import { Navigate, useLocation } from 'react-router';

const PrivateRout = ({ children }) => {
  const { user, loading, roleLoading, userStatus } = useAuth();
  const location = useLocation();

  if (loading || roleLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-infinity loading-xl"></span>
      </div>
    );
  }
 
  if (!user || !userStatus == 'active') {
    return (
      <Navigate
        to="/login"
        state={{ from: location }}
        replace
      />
    );
  }

  return children;
};

export default PrivateRout;
