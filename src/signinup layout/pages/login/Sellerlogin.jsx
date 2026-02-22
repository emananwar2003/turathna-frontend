import React, { useState } from "react";
import {
  Card,
  CardBody,
  Input,
  Button,
  Typography,
} from "@material-tailwind/react";
import {
  PhoneIcon,
  EyeIcon,
  EyeSlashIcon,
  SpeakerWaveIcon,
} from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
const Sellerlogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const speakText = (text) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "ar-SA";
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };
  const phoneRegex = /^(010|011|012|015)\d{8}$/;

  const validatePhone = (value) => {
    if (!phoneRegex.test(value)) {
      setPhoneError(
        "رقم الهاتف يجب أن يبدأ بـ 010 أو 011 أو 012 أو 015 ويتكون من 11 رقم",
      );
    } else {
      setPhoneError("");
    }
  };

  const validatePassword = (value) => {
    if (value.length < 8) {
      setPasswordError("كلمة المرور يجب أن تكون 8 أحرف على الأقل");
    } else {
      setPasswordError("");
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (!phoneError && !passwordError && phoneNumber && password) {
      console.log("Login successful");
    } else {
      console.log("Login failed: Please check your inputs");
    }
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center bg-[#E5E5E5] p-4 relative"
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

      <div className="relative w-full max-w-md">
        <Card className="shadow-2xl rounded-xl hover:shadow-3xl transition-all duration-300 hover:-translate-y-1">
          <CardBody className="p-8 md:p-10">
            <div className="text-center mb-8">
              <Typography
                variant="h1"
                className="text-6xl font-serif mb-2 text-[#2B0B0B] "
              >
                تراثنا
              </Typography>
              <Typography
                variant="small"
                className="text-base tracking-widest uppercase text-[#A10D0D]"
              >
                بوابة البائع
              </Typography>
            </div>

            <div className="mb-8 text-center">
              <Typography variant="h3" className="mb-2 text-[#2B0B0B] ">
                مرحباً بعودتك، أيها الفنان
              </Typography>
              <Typography variant="small" className="text-gray-600">
                سجل الدخول لإدارة منتجاتك اليدوية وطلباتك
              </Typography>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <label className="text-lg text-[#2B0B0B]">رقم الهاتف</label>
                  <button
                    type="button"
                    onClick={() => speakText("رقم الهاتف")}
                    className="p-1 rounded-full hover:bg-[#D63A3A]/10 transition-colors"
                  >
                    <SpeakerWaveIcon className="h-4 w-4 text-[#D63A3A]" />
                  </button>
                </div>
                <Input
                  type="tel"
                  placeholder="أدخل رقم هاتفك"
                  value={phoneNumber}
                  onChange={(e) => {
                    setPhoneNumber(e.target.value);
                    validatePhone(e.target.value);
                  }}
                  icon={<PhoneIcon className="h-5 w-5" />}
                  className="focus:!border-[#D63A3A] !text-right"
                  containerProps={{ className: "min-w-0" }}
                />
                {phoneError && (
                  <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
                    <span>{phoneError}</span>
                    <button type="button" onClick={() => speakText(phoneError)}>
                      <SpeakerWaveIcon className="h-4 w-4 text-red-600" />
                    </button>
                  </div>
                )}
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <label className="text-lg text-[#2B0B0B]">كلمة المرور</label>
                  <button
                    type="button"
                    onClick={() => speakText("كلمة المرور")}
                    className="p-1 rounded-full hover:bg-[#D63A3A]/10 transition-colors"
                  >
                    <SpeakerWaveIcon className="h-4 w-4 text-[#D63A3A]" />
                  </button>
                </div>
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="أدخل كلمة المرور"
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
                  className="focus:!border-[#D63A3A] !text-right"
                  containerProps={{ className: "min-w-0" }}
                />
                {passwordError && (
                  <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
                    <span>{passwordError}</span>
                    <button
                      type="button"
                      onClick={() => speakText(passwordError)}
                    >
                      <SpeakerWaveIcon className="h-4 w-4 text-red-600" />
                    </button>
                  </div>
                )}
              </div>

              <Button
                type="submit"
                fullWidth
                className="rounded-lg py-3 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] normal-case text-base"
                style={{
                  backgroundColor: "#D63A3A",
                  boxShadow: "0 4px 6px -1px rgba(214, 58, 58, 0.3)",
                }}
              >
                تسجيل الدخول
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
                    جديد على تراثنا؟
                  </Typography>
                </div>
              </div>

              <div className="flex justify-center items-center gap-2">
                <Typography variant="small" className="text-gray-600">
                  ليس لديك حساب؟
                </Typography>
                <Link
                  to="/registration/sellersignup"
                  className="font-medium text-[#D63A3A] hover:underline flex items-center gap-1"
                >
                  سجل كبائع
                  <button
                    type="button"
                    onClick={() => speakText("سجل كبائع")}
                    className="p-1 rounded-full hover:bg-[#D63A3A]/10 transition-colors"
                  >
                    <SpeakerWaveIcon className="h-4 w-4 text-[#D63A3A]" />
                  </button>
                </Link>
              </div>
            </form>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default Sellerlogin;
