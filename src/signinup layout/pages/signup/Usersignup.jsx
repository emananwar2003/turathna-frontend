import React, { useState } from "react";
import {
  Card,
  CardBody,
  Input,
  Button,
  Typography,
} from "@material-tailwind/react";
import {
  UserIcon,
  PhoneIcon,
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/outline";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const Usersignup = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const phoneRegex = /^01[0125][0-9]{8}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    let tempErrors = { ...errors };
if (field === "firstName") {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    tempErrors.firstName = "First name is required";
  } else if (trimmedValue.length < 3) {
    tempErrors.firstName = "First name must be at least 3 letters";
  } else if (!/^[A-Z]/.test(trimmedValue)) {
    tempErrors.firstName = "First letter must be capital";
  } else {
    tempErrors.firstName = "";
  }
}

if (field === "lastName") {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    tempErrors.lastName = "Last name is required";
  } else if (trimmedValue.length < 3) {
    tempErrors.lastName = "Last name must be at least 3 letters";
  } else if (!/^[A-Z]/.test(trimmedValue)) {
    tempErrors.lastName = "First letter must be capital";
  } else {
    tempErrors.lastName = "";
  }
}

    if (field === "email") {
      if (!value.trim()) tempErrors.email = "Email is required";
      else if (!emailRegex.test(value))
        tempErrors.email = "Please enter a valid email address";
      else tempErrors.email = "";
    }

    if (field === "phone") {
      if (!value.trim()) tempErrors.phone = "Phone number is required";
      else if (!phoneRegex.test(value))
        tempErrors.phone =
          "Phone must start with 010, 011, 012 or 015 and be 11 digits";
      else tempErrors.phone = "";
    }

    if (field === "password") {
      if (!value.trim()) tempErrors.password = "Password is required";
      else if (value.length < 8)
        tempErrors.password = "Password must be at least 8 characters";
      else tempErrors.password = "";
    }

    if (field === "confirmPassword") {
      if (!value.trim())
        tempErrors.confirmPassword = "Confirm password is required";
      else if (value !== form.password)
        tempErrors.confirmPassword = "Passwords do not match";
      else tempErrors.confirmPassword = "";
    }

    setErrors(tempErrors);
  };



const handleSubmit = async (e) => {
  e.preventDefault();

  let canSubmit = true;


  if (Object.values(errors).some((err) => err)) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Please fix the errors before submitting",
    });
    canSubmit = false;
  }

  if (Object.values(form).some((value) => !value)) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "All fields are required",
    });
    canSubmit = false;
  }

  if (canSubmit) {
    try {
      // Map frontend keys to backend schema
      const backendForm = {
        firstname: form.firstName,
        lastname: form.lastName,
        email: form.email,
        password: form.password,
        phone: form.phone,
      };

      const response = await fetch(
        "http://localhost:5000/api/v1/user/register/buyer",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(backendForm),
        },
      );

      const data = await response.json();

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Registration Successful",
          text: "You have registered successfully!",
        }).then(() => {
          navigate("/registration/userlogin");
        });
      } else {
        
        Swal.fire({
          icon: "error",
          title: "Registration Failed",
          text:  "Something went wrong. Please try again.",
        });
        console.error("Registration Error:", data);
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text: "Something went wrong. Please try again.",
      });
      console.error("Registration Error:", error);
    }
  }
};
  return (
    <div
      className="min-h-screen w-full relative overflow-hidden bg-[#E5E5E5] flex items-center justify-center p-4"
      dir="rtl"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#2B0B0B]/10 via-transparent to-[#A10D0D]/5" />
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%232B0B0B' fill-opacity='1'%3E%3Cpath d='M30 0l5 10h10l-8 6 3 10-10-7-10 7 3-10-8-6h10z'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative w-full max-w-2xl my-8">
        <Card className="shadow-2xl rounded-xl transition-all duration-300">
          <CardBody className="p-8 md:p-10">
            <div className="text-center mb-6">
              <Typography
                variant="h1"
                className="text-5xl font-serif mb-2"
                style={{ color: "#2B0B0B" }}
              >
                Turathna
              </Typography>
              <Typography
                variant="small"
                className="text-xs tracking-widest uppercase"
                style={{ color: "#A10D0D" }}
              >
                Buyer Portal
              </Typography>
            </div>

            <div className="mb-6 text-center">
              <Typography
                variant="h3"
                className="mb-2"
                style={{ color: "#2B0B0B" }}
              >
                Create Your Account
              </Typography>
              <Typography variant="small" className="text-gray-600">
                Join Turathna and discover unique handmade products
              </Typography>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* First Name */}
              <div>
                <label className="text-sm text-gray-700 mb-1 block">
                  First Name
                </label>
                <Input
                  type="text"
                  value={form.firstName}
                  onChange={(e) => handleChange("firstName", e.target.value)}
                  icon={<UserIcon className="h-5 w-5" />}
                  error={!!errors.firstName}
                  className="!pr-12"
                />
                {errors.firstName && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.firstName}
                  </p>
                )}
              </div>

              {/* Last Name */}
              <div>
                <label className="text-sm text-gray-700 mb-1 block">
                  Last Name
                </label>
                <Input
                  type="text"
                  value={form.lastName}
                  onChange={(e) => handleChange("lastName", e.target.value)}
                  icon={<UserIcon className="h-5 w-5" />}
                  error={!!errors.lastName}
                  className="!pr-12"
                />
                {errors.lastName && (
                  <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="text-sm text-gray-700 mb-1 block">
                  Email
                </label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  icon={<EnvelopeIcon className="h-5 w-5" />}
                  error={!!errors.email}
                  className="!pr-12"
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="text-sm text-gray-700 mb-1 block">
                  Phone
                </label>
                <Input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  icon={<PhoneIcon className="h-5 w-5" />}
                  error={!!errors.phone}
                  className="!pr-12"
                />
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                )}
              </div>

              {/* Password */}
              <div className="relative">
                <label className="text-sm text-gray-700 mb-1 block">
                  Password
                </label>
                <Input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  icon={<LockClosedIcon className="h-5 w-5" />}
                  error={!!errors.password}
                  className="!pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="relative">
                <label className="text-sm text-gray-700 mb-1 block">
                  Confirm Password
                </label>
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  value={form.confirmPassword}
                  onChange={(e) =>
                    handleChange("confirmPassword", e.target.value)
                  }
                  icon={<LockClosedIcon className="h-5 w-5" />}
                  error={!!errors.confirmPassword}
                  className="!pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600"
                >
                  {showConfirmPassword ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                fullWidth
                className="rounded-lg py-3 mt-6 normal-case text-base"
                style={{ backgroundColor: "#D63A3A" }}
              >
                Create Account
              </Button>
            </form>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default Usersignup;
