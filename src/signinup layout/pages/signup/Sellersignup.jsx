import React, { useState } from "react";
import {
  Card,
  CardBody,
  Input,
  Button,
  Typography,
  Checkbox,
} from "@material-tailwind/react";
import {
  UserIcon,
  PhoneIcon,
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
  SpeakerWaveIcon,
  PhotoIcon,
  ShoppingBagIcon,
  GlobeAltIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const Sellersignup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    password: "",
    confirmPassword: "",
    shopAddress: "",
    websiteLink: "",
    sellingOffline: false,
    sellingOnline: false,
    uploadedPhotos: [],
  });

  const [errors, setErrors] = useState({
    name: "",
    phone: "",
    password: "",
    confirmPassword: "",
    shopAddress: "", 
    websiteLink: "",
    uploadedPhotos: "",
  });

  const phoneRegex = /^01[0125][0-9]{8}$/;

  const speak = (text) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "ar-SA";
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };
const handleChange = (field, value) => {
  setForm((prev) => ({ ...prev, [field]: value }));

  let tempErrors = { ...errors };


  if (field === "name") {
    const trimmedValue = value.trim();
    const nameParts = trimmedValue.split(" ").filter((part) => part !== "");

    if (!trimmedValue) tempErrors.name = "الاسم مطلوب";
    else if (nameParts.length !== 3) tempErrors.name = "يجب إدخال اسم ثلاثي";
    else if (nameParts.some((part) => part.length < 3))
      tempErrors.name = "كل اسم يجب أن يكون 3 أحرف على الأقل";
    else tempErrors.name = "";
  }

 
  if (field === "phone") {
    if (!value.trim()) tempErrors.phone = "رقم الهاتف مطلوب";
    else if (!phoneRegex.test(value))
      tempErrors.phone =
        "رقم الهاتف يجب أن يبدأ بـ 010 أو 011 أو 012 أو 015 ويتكون من 11 رقم";
    else tempErrors.phone = "";
  }

 
  if (field === "password") {
    if (!value.trim()) tempErrors.password = "كلمة المرور مطلوبة";
    else if (value.length < 8)
      tempErrors.password = "كلمة المرور يجب أن تكون 8 أحرف على الأقل";
    else tempErrors.password = "";
  }


  if (field === "confirmPassword") {
    if (!value.trim()) tempErrors.confirmPassword = "تأكيد كلمة المرور مطلوب";
    else if (value !== form.password)
      tempErrors.confirmPassword = "كلمتا المرور غير متطابقتين";
    else tempErrors.confirmPassword = "";
  }

 
  if (field === "shopAddress" || field === "websiteLink") {
    const updatedAddress = field === "shopAddress" ? value : form.shopAddress;
    const updatedWebsite = field === "websiteLink" ? value : form.websiteLink;

    if (form.sellingOffline) tempErrors.shopAddress = "";
    if (form.sellingOnline) tempErrors.websiteLink = "";

  
    if (form.sellingOffline) {
      if (!updatedAddress.trim()) {
        tempErrors.shopAddress = "عنوان المحل مطلوب";
      } else {
        tempErrors.shopAddress = "";
      }
    }

    
    if (form.sellingOnline) {
      if (!updatedWebsite.trim()) {
        tempErrors.websiteLink = "رابط الموقع مطلوب";
      } else if (!updatedWebsite.startsWith("https://")) {
        tempErrors.websiteLink = "الرابط يجب أن يبدأ بـ https://";
      } else {
        const httpsRegex = /^https:\/\/.+\..+/;
        if (!httpsRegex.test(updatedWebsite))
          tempErrors.websiteLink = "أدخل رابط صحيح مثل https://example.com";
        else tempErrors.websiteLink = "";
      }
    }
  }

  setErrors(tempErrors);
};

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files).slice(
      0,
      5 - form.uploadedPhotos.length,
    );
    const newPhotos = [...form.uploadedPhotos, ...files];
    setForm((prev) => ({ ...prev, uploadedPhotos: newPhotos }));

    if (newPhotos.length !== 5) {
      setErrors((prev) => ({
        ...prev,
        uploadedPhotos: "يجب تحميل 5 صور بالضبط",
      }));
    } else {
      setErrors((prev) => ({ ...prev, uploadedPhotos: "" }));
    }
  };

  const removePhoto = (index) => {
    const newPhotos = form.uploadedPhotos.filter((_, i) => i !== index);
    setForm((prev) => ({ ...prev, uploadedPhotos: newPhotos }));

    if (newPhotos.length !== 5) {
      setErrors((prev) => ({
        ...prev,
        uploadedPhotos: "يجب تحميل 5 صور بالضبط",
      }));
    } else {
      setErrors((prev) => ({ ...prev, uploadedPhotos: "" }));
    }
  };

 

  const handleSubmit = (e) => {
    e.preventDefault();

    const errorMessages = [];

    
    if (Object.values(errors).some((err) => err)) {
      errorMessages.push("يرجى تصحيح الأخطاء قبل التسجيل");
    }

   
    if (!form.sellingOffline && !form.sellingOnline) {
      errorMessages.push(
        "يرجى اختيار طريقة البيع (أونلاين أو أوفلاين أو كليهما)",
      );
    }

    // Check uploaded photos
    if (form.uploadedPhotos.length !== 5) {
      errorMessages.push("يرجى تحميل 5 صور من أعمالك");
    }

    
    errorMessages.forEach((msg) => {
      speak(msg); 
      Swal.fire({
        icon: "error",
        title: "خطأ",
        text: msg,
      });
    });

   
   if (errorMessages.length === 0) {
     const successMsg = "تم التسجيل بنجاح";
     speak(successMsg);
     Swal.fire({
       icon: "success",
       title: successMsg,
       text: "تم حفظ بياناتك بنجاح",
     }).then(() => {
       navigate("/registration/sellerlogin"); 
     });

     console.log("Form submitted:", form);
     //api hna
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
        <Card className="shadow-2xl rounded-xl hover:shadow-3xl transition-all duration-300">
          <CardBody className="p-8 md:p-10">
            {/* Logo */}
            <div className="text-center mb-6">
              <Typography
                variant="h1"
                className="text-5xl font-serif mb-2"
                style={{ color: "#2B0B0B" }}
              >
                تراثنا
              </Typography>
              <Typography
                variant="small"
                className="text-xs tracking-widest uppercase"
                style={{ color: "#A10D0D" }}
              >
                بوابة البائع
              </Typography>
            </div>

            <div className="mb-6 text-center">
              <Typography
                variant="h3"
                className="mb-2"
                style={{ color: "#2B0B0B" }}
              >
                انضم إلى عائلة تراثنا
              </Typography>
              <Typography variant="small" className="text-gray-600">
                سجل كبائع واعرض منتجاتك اليدوية المميزة
              </Typography>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name */}
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <label className="text-sm text-[#2B0B0B]">الاسم الكامل</label>
                  <button
                    type="button"
                    onClick={() => speak("الاسم الكامل")}
                    className="p-1 rounded-full hover:bg-[#D63A3A]/10"
                  >
                    <SpeakerWaveIcon
                      className="h-4 w-4"
                      style={{ color: "#D63A3A" }}
                    />
                  </button>
                </div>
                <Input
                  type="text"
                  placeholder="أدخل اسمك الكامل"
                  value={form.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  icon={<UserIcon className="h-5 w-5" />}
                  className={`focus:!border-[#D63A3A] !text-right ${
                    errors.name && "border-red-500"
                  }`}
                />
                {errors.name && (
                  <div className="flex items-center gap-2 mt-1 text-red-500 text-xs">
                    <p>{errors.name}</p>
                    <button
                      type="button"
                      onClick={() => speak(errors.name)}
                      className="p-1 rounded-full hover:bg-red-200"
                    >
                      <SpeakerWaveIcon className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Phone */}
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <label className="text-sm text-[#2B0B0B]">رقم الهاتف</label>
                  <button
                    type="button"
                    onClick={() => speak("رقم الهاتف")}
                    className="p-1 rounded-full hover:bg-[#D63A3A]/10"
                  >
                    <SpeakerWaveIcon
                      className="h-4 w-4"
                      style={{ color: "#D63A3A" }}
                    />
                  </button>
                </div>
                <Input
                  type="tel"
                  placeholder="أدخل رقم هاتفك"
                  value={form.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  icon={<PhoneIcon className="h-5 w-5" />}
                  className={`focus:!border-[#D63A3A] !text-right ${
                    errors.phone && "border-red-500"
                  }`}
                />
                {errors.phone && (
                  <div className="flex items-center gap-2 mt-1 text-red-500 text-xs">
                    <p>{errors.phone}</p>
                    <button
                      type="button"
                      onClick={() => speak(errors.phone)}
                      className="p-1 rounded-full hover:bg-red-200"
                    >
                      <SpeakerWaveIcon className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Photo Upload */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <label className="text-sm text-[#2B0B0B]">
                    صور من أعمالك (5)
                  </label>
                  <button
                    type="button"
                    onClick={() => speak("صور من أعمالك. خمس صور مطلوبة")}
                    className="p-1 rounded-full hover:bg-[#D63A3A]/10"
                  >
                    <SpeakerWaveIcon
                      className="h-4 w-4"
                      style={{ color: "#D63A3A" }}
                    />
                  </button>
                </div>
                {form.uploadedPhotos.length < 5 && (
                  <label className="block w-full p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#D63A3A] transition-colors cursor-pointer text-center">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                    <PhotoIcon
                      className="h-8 w-8 mx-auto mb-2"
                      style={{ color: "#A10D0D" }}
                    />
                    <Typography variant="small" className="text-gray-600">
                      اضغط لتحميل الصور ({form.uploadedPhotos.length}/5)
                    </Typography>
                  </label>
                )}
                {errors.uploadedPhotos && (
                  <div className="flex items-center gap-2 mt-1 text-red-500 text-xs">
                    <p>{errors.uploadedPhotos}</p>
                    <button
                      type="button"
                      onClick={() => speak(errors.uploadedPhotos)}
                      className="p-1 rounded-full hover:bg-red-200"
                    >
                      <SpeakerWaveIcon className="h-4 w-4" />
                    </button>
                  </div>
                )}
                {form.uploadedPhotos.length > 0 && (
                  <div className="grid grid-cols-5 gap-2 mt-2">
                    {form.uploadedPhotos.map((photo, i) => (
                      <div key={i} className="relative group">
                        <img
                          src={URL.createObjectURL(photo)}
                          alt={`عمل ${i + 1}`}
                          className="w-full h-20 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removePhoto(i)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {/* Selling Type Checkboxes */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <label className="text-sm text-[#2B0B0B]">طريقة البيع</label>
                  <button
                    type="button"
                    onClick={() => speak("طريقة البيع")}
                    className="p-1 rounded-full hover:bg-[#D63A3A]/10"
                  >
                    <SpeakerWaveIcon
                      className="h-4 w-4"
                      style={{ color: "#D63A3A" }}
                    />
                  </button>
                </div>

                <div className="space-y-2 bg-gray-50 p-4 rounded-lg">
                  {/* Offline */}
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={form.sellingOffline}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setForm((prev) => ({
                          ...prev,
                          sellingOffline: checked,
                        }));

                        if (!checked) {
                          setErrors((prev) => ({ ...prev, shopAddress: "" }));
                        }
                      }}
                      color="red"
                      icon={<ShoppingBagIcon className="h-3 w-3" />}
                    />
                    <label
                      className="flex items-center gap-2 cursor-pointer"
                      onClick={() =>
                        setForm({
                          ...form,
                          sellingOffline: !form.sellingOffline,
                        })
                      }
                    >
                      <ShoppingBagIcon
                        className="h-5 w-5"
                        style={{ color: "#A10D0D" }}
                      />
                      <Typography variant="small" className="text-gray-700">
                        أبيع في متجر فعلي (أوفلاين)
                      </Typography>
                    </label>
                  </div>

                  {/* Online */}
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={form.sellingOnline}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setForm((prev) => ({
                          ...prev,
                          sellingOnline: checked,
                        }));

                        // Clear website link error if unchecked
                        if (!checked) {
                          setErrors((prev) => ({ ...prev, websiteLink: "" }));
                        }
                      }}
                      color="red"
                      icon={<GlobeAltIcon className="h-3 w-3" />}
                    />
                    <label
                      className="flex items-center gap-2 cursor-pointer"
                      onClick={() =>
                        setForm({ ...form, sellingOnline: !form.sellingOnline })
                      }
                    >
                      <GlobeAltIcon
                        className="h-5 w-5"
                        style={{ color: "#A10D0D" }}
                      />
                      <Typography variant="small" className="text-gray-700">
                        أبيع عبر الإنترنت (أونلاين)
                      </Typography>
                    </label>
                  </div>
                </div>
              </div>

              {/* Conditional: Shop Address */}
              {form.sellingOffline && (
                <div className="animate-[fadeIn_0.3s_ease-in]">
                  <div className="flex items-center gap-2 mb-2">
                    <label className="text-sm text-[#2B0B0B]">
                      عنوان المتجر
                    </label>
                    <button
                      type="button"
                      onClick={() => speak("عنوان المتجر")}
                      className="p-1 rounded-full hover:bg-[#D63A3A]/10"
                    >
                      <SpeakerWaveIcon
                        className="h-4 w-4"
                        style={{ color: "#D63A3A" }}
                      />
                    </button>
                  </div>
                  <Input
                    type="text"
                    placeholder="أدخل عنوان متجرك"
                    value={form.shopAddress}
                    onChange={(e) =>
                      handleChange("shopAddress", e.target.value)
                    }
                    icon={<MapPinIcon className="h-5 w-5" />}
                    className="focus:!border-[#D63A3A] !text-right"
                  />
                </div>
              )}
              {errors.shopAddress && (
                <div className="flex items-center gap-2 mt-1 text-red-500 text-sm">
                  <p>{errors.shopAddress}</p>
                  <button
                    type="button"
                    onClick={() => speak(errors.shopAddress)}
                    className="p-1 rounded-full hover:bg-red-200"
                  >
                    <SpeakerWaveIcon className="h-4 w-4" />
                  </button>
                </div>
              )}
              {/* Conditional: Website Link */}
              {form.sellingOnline && (
                <div className="animate-[fadeIn_0.3s_ease-in]">
                  <div className="flex items-center gap-2 mb-2">
                    <label className="text-sm text-[#2B0B0B]">
                      رابط الصفحة الإلكترونية
                    </label>
                    <button
                      type="button"
                      onClick={() => speak("رابط الصفحة الإلكترونية")}
                      className="p-1 rounded-full hover:bg-[#D63A3A]/10"
                    >
                      <SpeakerWaveIcon
                        className="h-4 w-4"
                        style={{ color: "#D63A3A" }}
                      />
                    </button>
                  </div>
                  <Input
                    type="url"
                    placeholder="https://example.com"
                    value={form.websiteLink}
                    onChange={(e) =>
                      handleChange("websiteLink", e.target.value)
                    }
                    icon={<GlobeAltIcon className="h-5 w-5" />}
                    className="focus:!border-[#D63A3A] !text-right"
                  />
                </div>
              )}
              {errors.websiteLink && (
                <div className="flex items-center gap-2 mt-1 text-red-500 text-sm">
                  <p>{errors.websiteLink}</p>
                  <button
                    type="button"
                    onClick={() => speak(errors.websiteLink)}
                    className="p-1 rounded-full hover:bg-red-200"
                  >
                    <SpeakerWaveIcon className="h-4 w-4" />
                  </button>
                </div>
              )}

              {/* Password */}
              <div className="relative">
                <div className="flex items-center gap-2 mb-1">
                  <label className="text-sm text-[#2B0B0B]">كلمة المرور</label>
                  <button
                    type="button"
                    onClick={() => speak("كلمة المرور")}
                    className="p-1 rounded-full hover:bg-[#D63A3A]/10"
                  >
                    <SpeakerWaveIcon
                      className="h-4 w-4"
                      style={{ color: "#D63A3A" }}
                    />
                  </button>
                </div>
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="أدخل كلمة المرور"
                  value={form.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  icon={<LockClosedIcon className="h-5 w-5" />}
                  className={`focus:!border-[#D63A3A] !text-right ${
                    errors.password && "border-red-500"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 translate-y-1 text-gray-600 hover:text-[#D63A3A] transition-colors"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
                {errors.password && (
                  <div className="flex items-center gap-2 mt-1 text-red-500 text-xs">
                    <p>{errors.password}</p>
                    <button
                      type="button"
                      onClick={() => speak(errors.password)}
                      className="p-1 rounded-full hover:bg-red-200"
                    >
                      <SpeakerWaveIcon className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div className="relative">
                <div className="flex items-center gap-2 mb-1">
                  <label className="text-sm text-[#2B0B0B]">
                    تأكيد كلمة المرور
                  </label>
                  <button
                    type="button"
                    onClick={() => speak("تأكيد كلمة المرور")}
                    className="p-1 rounded-full hover:bg-[#D63A3A]/10"
                  >
                    <SpeakerWaveIcon
                      className="h-4 w-4"
                      style={{ color: "#D63A3A" }}
                    />
                  </button>
                </div>
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="أعد إدخال كلمة المرور"
                  value={form.confirmPassword}
                  onChange={(e) =>
                    handleChange("confirmPassword", e.target.value)
                  }
                  icon={<LockClosedIcon className="h-5 w-5" />}
                  className={`focus:!border-[#D63A3A] !text-right ${
                    errors.confirmPassword && "border-red-500"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute left-3 top-1/2 translate-y-1 text-gray-600 hover:text-[#D63A3A] transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
                {errors.confirmPassword && (
                  <div className="flex items-center gap-2 mt-1 text-red-500 text-xs">
                    <p>{errors.confirmPassword}</p>
                    <button
                      type="button"
                      onClick={() => speak(errors.confirmPassword)}
                      className="p-1 rounded-full hover:bg-red-200"
                    >
                      <SpeakerWaveIcon className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                fullWidth
                className="rounded-lg py-3 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] normal-case text-base mt-6"
                style={{
                  backgroundColor: "#D63A3A",
                  boxShadow: "0 4px 6px -1px rgba(214, 58, 58, 0.3)",
                }}
              >
                إنشاء حساب
              </Button>
            </form>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default Sellersignup;
