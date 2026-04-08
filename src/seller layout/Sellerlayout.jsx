import React from 'react'
import { Routes } from "react-router-dom";
import { Route } from "react-router-dom";
import Dashboard from './pages/Dashboard';
import Addproducts from './pages/Addproducts';
import Navbars from '../userlayout/usercomponents/Navbar';
import Editproducts from './pages/editproducts/Editproducts';
import Seemyproducts from './pages/seemyproducts/seemyproducts';


const Sellerlayout = () => {
  return (
    <div>
      <Navbars/>
      <Routes>
              <Route index element={<Dashboard />} />
        <Route path='addproduct' element={<Addproducts />} />
        <Route path='editproducts' element={<Editproducts />} />
        <Route path='seemyproducts' element={<Seemyproducts/>}/>
      </Routes>
      
    </div>
  );
}

export default Sellerlayout
