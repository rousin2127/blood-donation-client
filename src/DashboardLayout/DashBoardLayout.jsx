import React from 'react';
import { Outlet } from 'react-router';
import Aside from '../Pages/Dashboard/Aside/Aside';

const DashBoardLayout = () => {
    return (
        <div className="flex min-h-screen bg-base-200 -mx-4 sm:-mx-6 px-4 sm:px-6 py-4 gap-0 sm:gap-4">
            <Aside />
            <div className="flex-1 min-w-0 rounded-xl bg-base-100 border border-base-300 shadow-sm p-4 sm:p-6">
                <Outlet />
            </div>
        </div>
    );
};

export default DashBoardLayout;