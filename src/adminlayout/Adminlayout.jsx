import React from 'react'
import { Routes } from "react-router-dom";
import { Route } from "react-router-dom";
import Admindashboard from './pages/Admindashboard';
import Navbars from '../userlayout/usercomponents/Navbar';

const Adminlayout = () => {
  return (
    <div>
      <Navbars/>
      <Routes>
        <Route index element={<Admindashboard/>} />
      </Routes>
    </div>
  );
}

export default Adminlayout
