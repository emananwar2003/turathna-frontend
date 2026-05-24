import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "./Authcontext";
import Swal from "sweetalert2";
import { useEffect } from "react";

const ProtectRoute = ({ children, allowedRoles }) => {
  const { status, userinfo, loading } = useAuth();
  const navigate = useNavigate();

  // 🔐 Handle NOT logged in
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
        confirmButtonColor: "#D84040",
        cancelButtonColor: "#1D1616",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/registration/sellerlogin");
        } else {
          navigate("/registration/userlogin");
        }
      });
    }
  }, [loading, status, navigate]);

 
  useEffect(() => {
    if (loading || !status) return;

    if (!allowedRoles.includes(userinfo?.role)) {
      Swal.fire({
        icon: "error",
        title: "Not Allowed",
        text: "You don't have permission to access this page",
      });
    }
  }, [loading, status, userinfo, allowedRoles]);


  if (loading) return null;


  if (!status) return null;

 
  if (!allowedRoles.includes(userinfo?.role)) {
    return <Navigate to="/" replace />;
  }


  return children;
};

export default ProtectRoute;
