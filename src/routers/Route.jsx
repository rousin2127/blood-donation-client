import { createBrowserRouter } from "react-router";
import RootLayout from "../layouts/RootLayout";
import Home from "../Pages/Home/Home";
import Login from "../Pages/Auth/Login/Login";
import Register from "../Pages/Auth/Register/Register";
import DashBoardLayout from "../DashboardLayout/DashBoardLayout";
import MainDashboard from "../Pages/Dashboard/MainDashBoard/MainDashboard";
import AddRequest from "../Pages/Dashboard/AddRequest/AddRequest";
import AllUsers from "../Pages/Dashboard/Allsers/AllUsers";
import PrivateRout from "./PrivateRout";
import MyDonationRequest from "../Pages/Dashboard/DonationRequest/MyDonationRequest";

export const router = createBrowserRouter([{

    path: '/',
    Component: RootLayout,
    children: [
        {
            index: true,
            Component: Home
        },
        {
            path: 'login',
            Component: Login
        },
        {
            path: 'register',
            Component: Register
        }
    ]
},
{
    path:'dashboard',
    element: <PrivateRout><DashBoardLayout></DashBoardLayout></PrivateRout>,
    children: [
        {
            path: '/dashboard',
            element:<MainDashboard></MainDashboard>
        },
        {
            path: 'add-request',
            element: <AddRequest></AddRequest>
        },
        {
            path: 'all-users',
            element: <AllUsers></AllUsers>
        },
        {
            path: '/dashboard/my-donation-requests',
            element: <MyDonationRequest></MyDonationRequest>
        }
    ]
}
])