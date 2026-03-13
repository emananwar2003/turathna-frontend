import React from 'react'
import { Routes } from "react-router-dom";
import { Route } from "react-router-dom";
import Admindashboard from './pages/Admindashboard';
import Navbars from '../userlayout/usercomponents/Navbar';

import Newsellers from './pages/newseller/Newsellers';
import Sellerdets from './pages/sellerdets/Sellerdets';

const Adminlayout = () => {
  return (
    <div>
      <Navbars />
      <Routes>
        <Route index element={<Admindashboard />} />
        <Route path="newseller" element={<Newsellers />} />
        <Route path="seller/:id" element={<Sellerdets/>} />
      </Routes>
    </div>
  );
}

export default Adminlayout
