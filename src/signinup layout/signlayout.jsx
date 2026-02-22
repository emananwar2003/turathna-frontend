import React from 'react'
import { Routes } from "react-router-dom";
import { Route } from "react-router-dom";
import Signup from './pages/signup/signup';
import Sellerlogin from "./pages/login/Sellerlogin.jsx"
import Userlayout from '../userlayout/Userlayout.jsx';
const Signlayout = () => {
    return (
        <div>
            <Routes>
                <Route path="userlogin" element={<Userlogin />} />
                <Route path="sellerlogin" element={<Sellerlogin />} />
                <Route path="signup" element={<Signup />} />
            </Routes>
        </div>
    );
}

export default Signlayout
