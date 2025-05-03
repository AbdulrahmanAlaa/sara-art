import React from "react";
import { Outlet } from "react-router-dom";
import Headermain from "../header";
import { Socialicons } from "../components/socialicons";
import AnimatedCursor from "../hooks/AnimatedCursor";

export default function Layout() {
    return (
        <>
            <div className="cursor__dot">
                <AnimatedCursor
                    innerSize={15}
                    outerSize={15}
                    color="255, 255 ,255"
                    outerAlpha={0.4}
                    innerScale={0.7}
                    outerScale={5}
                />
            </div>
            <Headermain />
            <div className="s_c">
                <Outlet />
                <Socialicons />
            </div>
        </>
    );
}
