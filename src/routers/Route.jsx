import { createBrowserRouter } from "react-router";
import RootLayout from "../layouts/RootLayout";
import Home from "../Pages/Home/Home";
import Login from "../Pages/Auth/Login/Login";
import Register from "../Pages/Auth/Register/Register";
import Search from "../Pages/Search/Search";
import DonationRequests from "../Pages/DonationRequests/DonationRequests";
import DonationRequestDetails from "../Pages/DonationRequests/DonationRequestDetails";
import DashBoardLayout from "../DashboardLayout/DashBoardLayout";
import MainDashboard from "../Pages/Dashboard/MainDashBoard/MainDashboard";
import AddRequest from "../Pages/Dashboard/AddRequest/AddRequest";
import AllUsers from "../Pages/Dashboard/Allsers/AllUsers";
import PrivateRout from "./PrivateRout";
import MyDonationRequest from "../Pages/Dashboard/DonationRequest/MyDonationRequest";
import Profile from "../Pages/Dashboard/Profile/Profile";
import Volunteer from "../Pages/Dashboard/Volunteer/Volunteer";

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
        },
        {
            path: 'search',
            Component: Search
        },
        {
            path: 'donation-requests',
            Component: DonationRequests
        },
        {
            path: 'donation-requests/:id',
            element: <PrivateRout><DonationRequestDetails /></PrivateRout>
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
            path: 'profile',
            element:<Profile></Profile>
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
            path: 'add-volunteer',
            element: <Volunteer></Volunteer>
        },
        {
            path: '/dashboard/my-donation-requests',
            element: <MyDonationRequest></MyDonationRequest>
        }
    ]
}
])