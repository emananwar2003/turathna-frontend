import React from 'react'
import { Routes } from "react-router-dom";
import { Route } from "react-router-dom";
import Dashboard from './pages/Dashboard';
import Addproducts from './pages/Addproducts';
import Navbars from '../userlayout/usercomponents/Navbar';
import SellerProductList  from './pages/seemyproducts/SellerProductList';
import EditProduct from './pages/editproducts/Editproduct';
import AddWorkshop from './pages/addworkshop/Addworkshop';
import SellerWorkshopList from './pages/seeallworkshops/Sellerworkshoplist';
import WorkshopDetail from './pages/workshopdets/Workshopdetail';



const Sellerlayout = () => {
  return (
    <div>
      <Navbars />
      <Routes>
        <Route index element={<Dashboard />} />
        <Route path="addproduct" element={<Addproducts />} />
        <Route path="editproduct/:productId" element={<EditProduct />} />
        <Route path="seemyproducts" element={<SellerProductList />} />
        <Route path="addworkshop" element={<AddWorkshop />} />
        <Route path="seemyworkshops" element={<SellerWorkshopList />} />
        <Route path="workshopdetail/:workshopId" element={<WorkshopDetail />}/>
      </Routes>
    </div>
  );
}

export default Sellerlayout
