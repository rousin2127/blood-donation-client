import React from 'react';
import useAuth from '../hook/useAuth';
import { Link, Navigate, useLocation } from 'react-router';

const PrivateRout = ({ children }) => {
  const { user, loading, roleLoading, userStatus, logOut } = useAuth();
  const location = useLocation();

  if (loading || roleLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-infinity loading-xl"></span>
      </div>
    );
  }

  if (!user) {
    return (
      <Navigate
        to="/login"
        state={{ from: location }}
        replace
      />
    );
  }

  // Blocked accounts cannot access private routes (spec)
  if (userStatus === 'blocked') {
    return (
      <Navigate
        to="/login"
        state={{ from: location }}
        replace
      />
    );
  }

  // Active users only — do NOT send to login when profile fetch failed / DB row missing (reload bug)
  if (userStatus === 'active') {
    return children;
  }

  const handleLogout = () => {
    logOut?.().catch(() => {});
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-base-200">
      <div className="max-w-md w-full rounded-2xl bg-base-100 shadow p-6 space-y-4 text-center">
        <h2 className="text-xl font-semibold">Account profile issue</h2>
        <p className="text-gray-600 text-sm">
          {userStatus === 'missing'
            ? 'Your login works, but no profile was found in the database. Finish registration or contact support.'
            : 'Could not load your profile from the server. Check your connection and try again.'}
        </p>
        <div className="flex flex-col sm:flex-row gap-2 justify-center">
          <button type="button" className="btn btn-primary" onClick={() => window.location.reload()}>
            Retry
          </button>
          <button type="button" className="btn btn-outline" onClick={handleLogout}>
            Log out
          </button>
          <Link className="btn btn-ghost" to="/">
            Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PrivateRout;
