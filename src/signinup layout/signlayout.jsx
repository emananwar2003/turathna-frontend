import React from 'react'
import { Routes } from "react-router-dom";
import { Route } from "react-router-dom";
import Sellerlogin from "./pages/login/Sellerlogin.jsx"
import Userlogin from './pages/login/userlogin.jsx';
import Usersignup from './pages/signup/Usersignup.jsx';
import Sellersignup from './pages/signup/Sellersignup.jsx';

const Signlayout = () => {
    return (
      <div>
        <Routes>
          <Route path="userlogin" element={<Userlogin />} />
          <Route path="sellerlogin" element={<Sellerlogin />} />
          <Route path="sellersignup" element={<Sellersignup />} />
          <Route path="usersignup" element={<Usersignup/>} />
        </Routes>
      </div>
    );
}

export default Signlayout
