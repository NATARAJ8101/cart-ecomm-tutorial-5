import React, { useState, useEffect } from "react";

const Nav = (props) => {
    let [mobileNav, setMobileNav] = useState(false);
    const toggleMobileNav = (whatSection) => {
        props.setActiveModule((activeModule) => whatSection);
        localStorage.setItem("activeModule", whatSection);

        if (mobileNav === false) {
            setMobileNav((mobileNav) => true);
        } else {
            setMobileNav((mobileNav) => false);
        }
    }

    return (<nav className="navbar navbar-expand-md navbar-dark bg-dark">
        <a className="navbar-brand" href="#">{props.userEmail}</a>
        <button className="navbar-toggler" onClick={() => toggleMobileNav()}>
            <span className="navbar-toggler-icon"></span>
        </button>
        <div className={mobileNav === false ? "collapse navbar-collapse" : "collapse navbar-collapse show animiated fadeIn"}>

            <ul className="navbar-nav mr-auto">
                <li className={props.activeModule === "cart" ? "nav-item active" : "nav-item"}>
                    <a className={props.cartLength > 0 ? "nav-link" : "hide"} href="#" onClick={() => toggleMobileNav("cart")}><i className="fas fa-shopping-cart"></i> <span className="badge bg-secondary">{props.cartLength} Items</span></a>
                </li>
                <li className={props.activeModule === "shop" ? "nav-item active" : "nav-item"}>
                    <a className="nav-link" href="#" onClick={() => toggleMobileNav("shop")}>Shop</a>
                </li>
                <li className={props.activeModule === "log" ? "nav-item active" : "nav-item"}>
                    <a className="nav-link" href="#" onClick={() => toggleMobileNav("log")}>Transaction Log</a>
                </li>
                <li className={props.activeModule === "cms" ? "nav-item active" : "nav-item"}>
                    <a className="nav-link" href="#" onClick={() => toggleMobileNav("cms")}>Inventory</a>
                </li>
                <li className={props.activeModule === "analytics" ? "nav-item active" : "nav-item"}>
                    <a className="nav-link" href="#" onClick={() => toggleMobileNav("analytics")}>Analytics</a>
                </li>

            </ul>
        </div>
    </nav>)

}

export default Nav;
