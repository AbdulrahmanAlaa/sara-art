import { createBrowserRouter } from "react-router-dom";
import { Home } from "../pages/home";
import { Portfolio } from "../pages/portfolio";
import { ContactUs } from "../pages/contact";
import { PortfolioDetails } from "../pages/portfolio-details";
import Layout from "./Layout";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
            {
                index: true,
                element: <Home />,
            },
            {
                path: "portfolio",
                element: <Portfolio />,
            },
            {
                path: "portfolio/:id",
                element: <PortfolioDetails />,
            },
            {
                path: "contact",
                element: <ContactUs />,
            },
            {
                path: "*",
                element: <Home />,
            },
        ],
    },
], {
    basename: process.env.PUBLIC_URL,
});
