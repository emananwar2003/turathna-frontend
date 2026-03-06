import React from 'react'
import { Routes } from "react-router-dom";
import { Route } from "react-router-dom";
import Admindashboard from './pages/Admindashboard';
import Navbars from '../userlayout/usercomponents/Navbar';
import Footer from '../userlayout/usercomponents/Footer';
const Adminlayout = () => {
  return (
    <div>
      <Navbars/>
      <Routes>
        <Route index element={<Admindashboard/>} />
      </Routes>
      <Footer/>
    </div>
  );
}

export default Adminlayout
