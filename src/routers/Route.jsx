import { createBrowserRouter } from "react-router";
import RootLayout from "../layouts/RootLayout";
import Home from "../Pages/Home/Home";
import Login from "../Pages/Auth/Login/Login";
import Register from "../Pages/Auth/Register/Register";
import DashBoardLayout from "../DashboardLayout/DashBoardLayout";
import MainDashboard from "../Pages/Dashboard/MainDashBoard/MainDashboard";
import AddRequest from "../Pages/Dashboard/AddRequest/AddRequest";
import ManageRequest from "../Pages/Dashboard/ManageRequest/ManageRequest";

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
    element: <DashBoardLayout></DashBoardLayout>,
    children: [
        {
            path: '/dashboard',
            element:<MainDashboard></MainDashboard>
        },
        {
            path: '/dashboard/add-request',
            element: <AddRequest></AddRequest>
        },
        {
            path: '/dashboard/manage-request',
            element: <ManageRequest></ManageRequest>
        }
    ]
}
])