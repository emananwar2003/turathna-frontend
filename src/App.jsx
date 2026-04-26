import React from 'react'
import { Route, Routes } from "react-router-dom";
import Signlayout from './signinup layout/signlayout';
import Userlayout from './userlayout/Userlayout';
import Sellerlayout from './seller layout/Sellerlayout';
import Adminlayout from './adminlayout/Adminlayout';
import ProtectAdmin from "./context/ProtectAdmin";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/registration/*" element={<Signlayout />} />
        <Route path="/*" element={<Userlayout />} />

        <Route
          path="/sellerdashboard/*"
          element={
            <ProtectAdmin>
              <Sellerlayout />
            </ProtectAdmin>
          }
        />
        <Route
          path="/admindashboard/*"
          element={
            <ProtectAdmin>
              <Adminlayout />
            </ProtectAdmin>
          }
        />
      </Routes>
    </div>
  );
}

export default App
