import React from 'react';
import { Outlet } from 'react-router';
import Navbar from '../Pages/Navbar/Navbar';
import Footer from '../Pages/Footer/Footer';


const RootLayout = () => {
    return (
        <div className=''>
        <div className='max-w-6xl mx-auto'>
            <Navbar></Navbar>
            <Outlet></Outlet>
            <Footer></Footer>
        </div>
        </div>
    );
};

export default RootLayout;