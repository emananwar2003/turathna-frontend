import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "./Authcontext";
import Swal from "sweetalert2";
import { useEffect } from "react";
import Home from "../userlayout/pages/Home/Home";

const ProtectAdmin = ({ children }) => {
  const { status, userinfo, loading } = useAuth();
  const navigate = useNavigate();

 useEffect(() => {
   if (loading) return;

   if (!status) {
     Swal.fire({
       title: "You should log in first",
       text: "Are you a buyer or a seller?",
       icon: "warning",
       showCancelButton: true,
       confirmButtonText: "Seller",
       cancelButtonText: "Buyer",
       showCloseButton: true,
       confirmButtonColor: "#D84040",
       cancelButtonColor: "#1D1616",

       didOpen: () => {
         const text =
           "عليك تسجيل الدخول اولا هل انت بائع ام شاري انن كنت بائع اضغط علي الزرالاحمر";

         const speech = new SpeechSynthesisUtterance(text);
         speech.lang = "ar-EG";
         speech.rate = 1;

         speechSynthesis.cancel();
         speechSynthesis.speak(speech);
       },
     }).then((result) => {
       if (result.isConfirmed) {
         navigate("/registration/sellerlogin");
       } else if (result.dismiss === Swal.DismissReason.cancel) {
         navigate("/registration/userlogin");
       } else {
         
         navigate("/");
       }
     });
   }
 }, [loading, status, navigate]);

  if (loading) return null;

  if (!status) return <Home/> ;

  if (userinfo?.role !== "admin" && userinfo?.role !== "seller") {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectAdmin;
