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

const Userlogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

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
      setPasswordError("Password must be at least 8 characters.");
    } else {
      setPasswordError("");
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    validateEmail(email);
    validatePassword(password);

    if (!emailError && !passwordError && email && password) {
      console.log("Login successful");
    } else {
      console.log("Login failed: Please check your inputs");
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
            </form>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default Userlogin;
