import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import "./App.css";

const App: React.FC = () => {
    return <RouterProvider router={router} />;
};

export default App;
