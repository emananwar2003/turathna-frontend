import { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [status, setstatus] = useState(false);
  const [userinfo, setuserinfo] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = (token, user) => {
    setuserinfo(user);
    setToken(token);
    setstatus(true);
    localStorage.setItem("token", token);
    localStorage.setItem("id", user.userId);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("id");
    setuserinfo(null);
    setToken(null);
    setstatus(false);
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedId = localStorage.getItem("id");

    if (storedToken && storedId) {
      try {
        setToken(storedToken);
        setstatus(true);
        const decodedUser = jwtDecode(storedToken);
        setuserinfo(decodedUser);
      } catch (error) {
        console.error("Invalid token:", error);
        logout();
      }
    }
    setLoading(false);
  }, []);
  return (
    <AuthContext.Provider
      value={{
        status,
        setstatus,
        userinfo,
        setuserinfo,
        token,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
