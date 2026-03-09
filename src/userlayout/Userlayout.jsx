import React from 'react'
import { Routes } from "react-router-dom";
import { Route } from "react-router-dom";
import Productdetail from './pages/productsdetails/Productdetail';
import Cart from './pages/cart/Cart';
import Checkout from './pages/checkout/Checkout';
import About from './pages/aboutcontact/About';
import Category from './pages/category/Category';
import Home from './pages/Home/Home';
import Notfund from './pages/notfound/Notfund';
import Workshops from './pages/workshops/Workshops';
import Workdetails from './pages/workshopsdetail/Workdetails';
import Products from './pages/products/Products';
import Navbars from "./usercomponents/Navbar";
import Region from './pages/region/Region';
import Reservasion from './pages/myreservasions/Reservasion';
import Footer from "./usercomponents/Footer";
const Userlayout = () => {
    return (
      <div>
        <Navbars />

        <Routes>
          <Route index element={<Home />} />
          <Route path="products" element={<Products />} />
          <Route path="details/:id" element={<Productdetail />} />
          <Route path="category/:category" element={<Category />} />
          <Route path="about" element={<About />} />
          <Route path="cart" element={<Cart />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="workshops" element={<Workshops />} />
          <Route path="workshopdet/:id" element={<Workdetails />} />
          <Route path="region/:region" element={<Region />} />
          <Route path="reservasions" element={<Reservasion />} />
          <Route path="*" element={<Notfund />} />
        </Routes>
        <Footer/>
      </div>
    );
}

export default Userlayout
