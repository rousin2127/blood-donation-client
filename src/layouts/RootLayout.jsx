import React from 'react';
import { Outlet } from 'react-router';
import Navbar from '../Pages/Navbar/Navbar';
import Footer from '../Pages/Footer/Footer';


const RootLayout = () => {
    return (
        <div className="min-h-screen">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                <Navbar />
                <Outlet />
                <Footer />
            </div>
        </div>
    );
};

export default RootLayout;