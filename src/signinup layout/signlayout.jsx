import React from 'react'
import { Routes } from "react-router-dom";
import { Route } from "react-router-dom";
import Sellerlogin from "./pages/login/Sellerlogin.jsx"
import Userlogin from './pages/login/Userlogin.jsx';
import Usersignup from './pages/signup/Usersignup.jsx';
import Sellersignup from './pages/signup/Sellersignup.jsx';
import Editprofile from './pages/editprofile/Editprofile.jsx';

const Signlayout = () => {
    return (
      <div>
        <Routes>
          <Route path="userlogin" element={<Userlogin />} />
          <Route path="sellerlogin" element={<Sellerlogin />} />
          <Route path="sellersignup" element={<Sellersignup />} />
          <Route path="usersignup" element={<Usersignup />} />
          <Route path="editprofile/:id" element={<Editprofile />} />
        </Routes>
      </div>
    );
}

export default Signlayout
