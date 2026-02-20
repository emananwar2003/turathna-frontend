import React from 'react'
import { Routes } from "react-router-dom";
import { Route } from "react-router-dom";
import Dashboard from './pages/Dashboard';
import Addproducts from './pages/Addproducts';

const Sellerlayout = () => {
  return (
    <div>
      <Routes>
              <Route index element={<Dashboard />} />
              <Route path='addproduct' element={<Addproducts/>} />
      </Routes>
    </div>
  );
}

export default Sellerlayout
