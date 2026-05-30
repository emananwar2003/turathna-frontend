import { Navigate } from "react-router-dom";
import { useAuth } from "./Authcontext"; 

const ProtectedBuyerRoute = ({ children }) => {
  const { userinfo, loading } = useAuth();


  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "#EEEEEE" }}
      >
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#D84040] border-t-transparent" />
      </div>
    );
  }

  // No token / not logged in → go to login
  if (!userinfo) {
    return <Navigate to="/registration/userlogin" replace />;
  }

  // Seller or admin → go to their dashboard
  if (userinfo.role === "seller") {
    return <Navigate to="/sellerdashboard" replace />;
  }

  if (userinfo.role === "admin") {
    return <Navigate to="/admindashboard" replace />;
  }

  
  return children;
};

export default ProtectedBuyerRoute;
