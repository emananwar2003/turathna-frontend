import React from 'react'
import { Routes } from "react-router-dom";
import { Route } from "react-router-dom";
import Admindashboard from './pages/Admindashboard';


const Adminlayout = () => {
  return (
    <div>
      <Routes>
        <Route index element={<Admindashboard/>} />
      </Routes>
    </div>
  );
}

export default Adminlayout
