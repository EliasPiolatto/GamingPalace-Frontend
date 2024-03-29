import React, { useEffect } from "react";
import { useState } from "react";
import { TfiAlignJustify } from "react-icons/tfi";
import { FiShoppingCart } from "react-icons/fi"
import { DiRuby } from "react-icons/di"
import { IconContext } from "react-icons/lib";
import { Link, useLocation } from "react-router-dom";
import "../Navbar/Navbar.css"
import { useSelector } from "react-redux";
import { TfiHeart } from "react-icons/tfi";
import { BiLogOut } from "react-icons/bi"
// import { useAuth0 } from "@auth0/auth0-react";
import { Avatar } from "@mui/material";
import { useAuth } from "../../context/AuthContext";



const Navbar = () => {

    const [showNavbar, setShowNavbar] = useState(false)
    const shopCart = useSelector(state => state.shopCart)
    const usuario = useSelector(state => state.users)
    const favourites = useSelector(state => state.favourites);
    // const { loginWithRedirect, logout } = useAuth0()
    const { user, logout } = useAuth()

    const picture = user?.photoURL
    const location = useLocation();

    const filteredUser = usuario?.length > 0 ? usuario?.find(usr => usr.email === user?.email) : []
 

    const linkStyle = { 
        "textDecoration": "none",
        "color": "#fff"
    };

    const linkLogo = {
        "text-decoration": "none",
        "color": "#95c827",
    };


    return (
        <nav className="navbarContainer">
            {
                location.pathname !== "/" &&

                <div className="wrapper">

                    <IconContext.Provider value={{ style: { fontSize: "2em" } }}>
                        <div className="logo_containers">
                            <DiRuby />
                            <p>
                                <Link to="/home" style={linkLogo}>
                                    Gaming Palace
                                </Link>
                            </p>
                        </div>

                        <div className="mobile_icon"
                            onClick={() => setShowNavbar(!showNavbar)}
                        >
                            <TfiAlignJustify />
                        </div>

                        <div className="menu" style={showNavbar ? { left: "0" } : { left: "-100%" }}
                            onClick={() => setShowNavbar(!showNavbar)}
                        >
                            <div className="menu_item">
                                <Link to="/home" style={linkStyle}> <div className="items">Home</div></Link>
                            </div>

                            <div className="menu_item">
                                <Link to="/products" style={linkStyle}><div className="items">Products</div></Link>
                            </div>


                            {user && filteredUser?.role === "admin" ?  <div className="menu_item">

                                <Link to="/admin-dashboard" style={linkStyle}><div className="items">Admin Dashboard</div></Link>
                            </div> : <div></div>}


                            <div className="container_icons">

                                {user ? <div className="shopping_cart">
                                    <Link to="/favourites" style={linkStyle}><div className="">
                                        <TfiHeart />
                                        <span className="length_cart">{favourites.length}</span>
                                    </div></Link>
                                </div> : <div></div>}

                                {user ? <div className="shopping_cart">
                                    <Link to="/shopcart" style={linkStyle} ><FiShoppingCart /></Link>
                                    <span className="length_cart">{shopCart.length}</span>
                                </div> : <div></div>}

                                <div className="shopping_cart">

                                    {user ? // <span className="login" style={linkStyle} onClick={() => loginWithRedirect()}>Log In</span  >
                                        <Link to="/dashboard" style={linkStyle}><span style={linkStyle}> <Avatar src={picture}></Avatar></span></Link> :
                                        <Link to="/login"><span className="login" style={linkStyle}>Log In</span  ></Link>
                                    }
                                    </div>



                                {user ? <div className="shopping_cart">
                                    <span style={linkStyle} onClick={() => logout()}><BiLogOut /></span>
                                </div> : <div></div>}
                            </div>



                        </div>
                    </IconContext.Provider>
                </div>
            }
        </nav>
    )
}


export default Navbar
