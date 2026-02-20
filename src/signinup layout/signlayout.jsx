import React from 'react'
import { Routes } from "react-router-dom";
import { Route } from "react-router-dom";
import Signup from './pages/signup/signup';
import Login from './pages/login/login';
const Signlayout = () => {
    return (
        <div>
            <Routes>
                <Route path='login' element={<Login />} />
                <Route path='signup' element={<Signup />} />

            </Routes>

        </div>
    )
}

export default Signlayout
