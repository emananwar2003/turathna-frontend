import React from 'react'
import { Routes } from "react-router-dom";
import { Route } from "react-router-dom";
import Admindashboard from './pages/Admindashboard';
import Navbars from '../userlayout/usercomponents/Navbar';
import Newsellers from './pages/newseller/Newsellers';
import Sellerdets from './pages/sellerdets/Sellerdets';
import AdminProductList from './pages/seenewproducts/Pendingproducts';
import AdminProductDetail from './pages/productdets/AdminProductDetail';
import PendingWorkshops from './pages/newworkshops/PendingWorkshops';
import Workshopdets from './pages/workshopdets/Workshopdets';



const Adminlayout = () => {
  return (
    <div>
      <Navbars />
      <Routes>
        <Route index element={<Admindashboard />} />
        <Route path="newseller" element={<Newsellers />} />
        <Route path="seller/:id" element={<Sellerdets />} />
        <Route path="newproducts" element={<AdminProductList />} />
        <Route
          path="productreview/:productId"
          element={<AdminProductDetail />}
        />
        <Route path="newworkshops" element={<PendingWorkshops />} />
        <Route
          path="workshopreview/:workshopId"
          element={<Workshopdets />}
        />
      </Routes>
    </div>
  );
}

export default Adminlayout
