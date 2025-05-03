import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { CSSTransition, SwitchTransition } from "react-transition-group";
import { Home } from "../pages/home";
import { Portfolio } from "../pages/portfolio";
import { ContactUs } from "../pages/contact";
import { PortfolioDetails } from "../pages/portfolio-details";
import { Socialicons } from "../components/socialicons";

function AppRoutes() {
  const location = useLocation();

  return (
    <div className="s_c">
      <SwitchTransition mode="out-in">
        <CSSTransition
          key={location.key}
          timeout={400}
          classNames="page"
          unmountOnExit
        >
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/portfolio/:id" element={<PortfolioDetails />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </CSSTransition>
      </SwitchTransition>
      <Socialicons />
    </div>
  );
}

export default AppRoutes;
