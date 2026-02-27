import React, { useState } from "react";
import {
  Card,
  CardBody,
  Input,
  Button,
  Typography,
} from "@material-tailwind/react";
import {
  EnvelopeIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/Authcontext";
import { jwtDecode } from "jwt-decode";
const Userlogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  let navigate = useNavigate();
  const { login } = useAuth();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validateEmail = (value) => {
    if (!emailRegex.test(value)) {
      setEmailError("Please enter a valid email address.");
    } else {
      setEmailError("");
    }
  };

  const validatePassword = (value) => {
    if (value.length < 8) {
      setPasswordError("Password must be at least 8 characters");
    } else {
      setPasswordError("");
    }
  };
const handleLogin = async (e) => {
  e.preventDefault();

  if (!email || !password) {
    Swal.fire({
      icon: "warning",
      title: "All fields are required",
      text: "Please enter both email and password",
    });
  } else {
    validateEmail(email);
    validatePassword(password);

    if (emailError || passwordError) {
      Swal.fire({
        icon: "error",
        title: "Invalid input",
        text: "Please check your email and password format",
      });
    } else {
      try {
        const response = await fetch(
          "http://localhost:5000/api/v1/user/login/buyer",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
          },
        );

        const data = await response.json();

        if (response.ok) {
          const decodedUser = jwtDecode(data.token);

          login(data.token, decodedUser);

          Swal.fire({
            icon: "success",
            title: "Login Successful",
            text: data.message,
          }).then(() => {
            if (decodedUser.role === "admin") {
              navigate("/admindashboard/");
            } else {
              navigate("/");
            }
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Login Failed",
            text: data.message,
           
          });
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Something went wrong",
          text: error.message,
        });
      }
    }
  }
};

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#E5E5E5] p-4 relative">
      <div className="absolute inset-0 bg-gradient-to-br from-[#2B0B0B]/10 via-transparent to-[#A10D0D]/5" />

      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%232B0B0B' fill-opacity='1'%3E%3Cpath d='M30 0l5 10h10l-8 6 3 10-10-7-10 7 3-10-8-6h10z'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative w-full max-w-md">
        <Card className="shadow-2xl rounded-xl hover:shadow-3xl transition-all duration-300 hover:-translate-y-1">
          <CardBody className="p-8 md:p-10">
            {/* Logo Section */}
            <div className="text-center mb-8">
              <Typography
                variant="h1"
                className="text-4xl font-serif mb-2 text-[#2B0B0B]"
              >
                Turathna
              </Typography>
              <Typography
                variant="small"
                className="text-xs tracking-widest uppercase text-[#A10D0D]"
              >
                User Portal
              </Typography>
            </div>

            {/* Welcome Section */}
            <div className="mb-8 text-center">
              <Typography variant="h3" className="mb-2 text-[#2B0B0B]">
                Welcome Back
              </Typography>
              <Typography variant="small" className="text-gray-600">
                Log in to continue exploring handmade products
              </Typography>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              {/* Email */}
              <div>
                <label className="text-sm text-[#2B0B0B]">Email Address</label>

                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    validateEmail(e.target.value);
                  }}
                  icon={<EnvelopeIcon className="h-5 w-5" />}
                  className="focus:!border-[#D63A3A]"
                  containerProps={{ className: "min-w-0" }}
                />

                {emailError && (
                  <div className="mt-2 text-red-600 text-sm">{emailError}</div>
                )}
              </div>

              <div>
                <label className="text-sm text-[#2B0B0B]">Password</label>

                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    validatePassword(e.target.value);
                  }}
                  icon={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeSlashIcon className="h-5 w-5 text-gray-600" />
                      ) : (
                        <EyeIcon className="h-5 w-5 text-gray-600" />
                      )}
                    </button>
                  }
                  className="focus:!border-[#D63A3A]"
                  containerProps={{ className: "min-w-0" }}
                />

                {passwordError && (
                  <div className="mt-2 text-red-600 text-sm">
                    {passwordError}
                  </div>
                )}
              </div>

              {/* Button */}
              <Button
                type="submit"
                fullWidth
                className="rounded-lg py-3 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] normal-case text-base"
                style={{
                  backgroundColor: "#D63A3A",
                  boxShadow: "0 4px 6px -1px rgba(214, 58, 58, 0.3)",
                }}
              >
                Login
              </Button>
              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center">
                  <Typography
                    variant="small"
                    className="bg-white px-4 text-gray-500"
                  >
                    New to Turathna?
                  </Typography>
                </div>
              </div>

              <div className="flex justify-center items-center gap-2">
                <Typography variant="small" className="text-gray-600">
                  Dont you have an Account?
                </Typography>
                <Link
                  to="/registration/usersignup"
                  className="font-medium text-[#D63A3A] hover:underline flex items-center gap-1"
                >
                  Register as a user
                  
                </Link>
              </div>
            </form>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default Userlogin;
