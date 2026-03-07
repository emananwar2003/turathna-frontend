import React from 'react'
import { Routes } from "react-router-dom";
import { Route } from "react-router-dom";
import Admindashboard from './pages/Admindashboard';
import Navbars from '../userlayout/usercomponents/Navbar';

import Newsellers from './pages/newseller/Newsellers';

const Adminlayout = () => {
  return (
    <div>
      <Navbars />
      <Routes>
        <Route index element={<Admindashboard />} />
        <Route path='newseller' element={<Newsellers/>}/>
      </Routes>
      
    </div>
  );
}

export default Adminlayout
