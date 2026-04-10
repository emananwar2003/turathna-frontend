import React from 'react'
import { Routes } from "react-router-dom";
import { Route } from "react-router-dom";
import Admindashboard from './pages/Admindashboard';
import Navbars from '../userlayout/usercomponents/Navbar';

import Newsellers from './pages/newseller/Newsellers';
import Sellerdets from './pages/sellerdets/Sellerdets';
import AdminProductList from './pages/seenewproducts/Pendingproducts';
import AdminProductDetail from './pages/productdets/AdminProductDetail';


const Adminlayout = () => {
  return (
    <div>
      <Navbars />
      <Routes>
        <Route index element={<Admindashboard />} />
        <Route path="newseller" element={<Newsellers />} />
        <Route path="seller/:id" element={<Sellerdets />} />
        <Route path="newproducts" element={<AdminProductList />} />
        <Route path="productreview/:productId" element={<AdminProductDetail />} />
      </Routes>
    </div>
  );
}

export default Adminlayout
