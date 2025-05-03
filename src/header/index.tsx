import React, { useEffect, useState } from "react";
import "./style.css";
import { VscGrabber, VscClose } from "react-icons/vsc";
import { Link } from "react-router-dom";
import img from "../assets/images/logo.png";

const CloseIcon = VscClose as unknown as React.FC;
const GrabberIcon = VscGrabber as unknown as React.FC;
const Headermain: React.FC = () => {
  const [isActive, setActive] = useState<boolean>(false);
  useEffect(() => {
    // Prevent scroll when menu is open
    if (isActive) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto'; // Cleanup on unmount
    };
  }, [isActive]);

  const handleToggle = (): void => {
    setActive(!isActive);
    // Only prevent scroll when menu is open
    if (isActive) {
      document.body.style.overflow = 'auto';
    } else {
      document.body.style.overflow = 'hidden';
    }
  };

  return (
    <>
      <header className="fixed-top site__header">
        <div className="d-flex align-items-center justify-content-between">
          <Link className="navbar-brand nav_ac" to="/">
            <img width={50} height={50} src={img} alt="Sara Art Logo" />
          </Link>
          <div className="d-flex align-items-center">
            <button className="menu__button  nav_ac" onClick={handleToggle}>
              {isActive ? <CloseIcon /> : <GrabberIcon />}
            </button>
          </div>
        </div>

        <div className={`site__navigation ${isActive ? "menu__opend" : ""}`}>
          <div className="bg__menu h-100">
            <div className="menu__wrapper">
              <div className="menu__container p-3">
                <ul className="the_menu">
                  <li className="menu_item ">
                    <Link onClick={handleToggle} to="/" className="my-3">Home</Link>
                  </li>
                  <li className="menu_item">
                    <Link onClick={handleToggle} to="/portfolio" className="my-3"> Portfolio</Link>
                  </li>
                  <li className="menu_item">
                    <Link onClick={handleToggle} to="/contact" className="my-3"> Contact</Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </header>
      <div className="br-top"></div>
      <div className="br-bottom"></div>
      <div className="br-left"></div>
      <div className="br-right"></div>
    </>
  );
};

export default Headermain;