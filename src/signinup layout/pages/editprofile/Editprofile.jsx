import React, { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  Input,
  Button,
  Typography,
  Checkbox,
} from "@material-tailwind/react";
import { SpeakerWaveIcon } from "@heroicons/react/24/outline";
import Swal from "sweetalert2";
import { useAuth } from "../../../context/Authcontext";
import { useNavigate } from "react-router-dom";

const EditProfile = () => {
  const { userinfo } = useAuth();
  const navigate = useNavigate();
  const role = userinfo?.role;

  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    name: "",
    sellingOffline: false,
    sellingOnline: false,
    shopAddress: "",
    websiteLink: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);

  const speak = (text) => {
    if ("speechSynthesis" in window && role === "seller") {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "ar-SA";
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/v1/user/profile/${localStorage.getItem(
            "id",
          )}`,
          {
            headers: {
              Authorization: localStorage.getItem("token"),
            },
          },
        );
        const data = await res.json();
        if (res.ok) setForm((prev) => ({ ...prev, ...data.user }));
        else {
          Swal.fire("Error", data.message || "Failed to load profile", "error");
          speak(data.message || "Failed to load profile");
        }
      } catch (err) {
        console.error(err);
        Swal.fire("Error", "Failed to load profile", "error");
        speak("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const phoneRegex = /^01[0125][0-9]{8}$/;

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    const tempErrors = { ...errors };

    // Seller validation
    if (role === "seller") {
      const arabicRegex = /^[\u0600-\u06FF\s]+$/;
      if (field === "name") {
        const parts = value.trim().split(" ").filter(Boolean);
        tempErrors.name = !value.trim()
          ? "الاسم مطلوب"
          : parts.length !== 3
            ? "يجب إدخال اسم ثلاثي"
            : parts.some((p) => p.length < 3)
              ? "كل اسم يجب أن يكون 3 أحرف على الأقل"
              : parts.some((p) => !arabicRegex.test(p))
                ? "الاسم يجب أن يكون باللغة العربية فقط"
                : "";
      }

      if (field === "phone") {
        tempErrors.phone = !value.trim()
          ? "رقم الهاتف مطلوب"
          : phoneRegex.test(value)
            ? ""
            : "رقم الهاتف يجب أن يبدأ بـ 010,011,012,015 ويتكون من 11 رقم";
      }

      if (field === "shopAddress") {
        tempErrors.shopAddress = form.sellingOffline
          ? value.trim()
            ? ""
            : "عنوان المحل مطلوب"
          : "";
      }

      if (field === "websiteLink") {
        tempErrors.websiteLink = form.sellingOnline
          ? value.trim()
            ? value.startsWith("https://")
              ? ""
              : "الرابط يجب أن يبدأ بـ https://"
            : "رابط الموقع مطلوب"
          : "";
      }

      if (field === "sellingOffline") {
        tempErrors.shopAddress = value
          ? form.shopAddress.trim()
            ? ""
            : "عنوان المحل مطلوب"
          : "";
      }

      if (field === "sellingOnline") {
        tempErrors.websiteLink = value
          ? form.websiteLink.trim()
            ? form.websiteLink.startsWith("https://")
              ? ""
              : "الرابط يجب أن يبدأ بـ https://"
            : "رابط الموقع مطلوب"
          : "";
      }
    }

    // Buyer or Admin validation
    if (role === "buyer" || role === "admin") {
      if (field === "firstname") {
        const val = value.trim();
        tempErrors.firstname = !val
          ? "First name is required"
          : val.length < 3
            ? "First name must be at least 3 letters"
            : !/^[A-Z]/.test(val)
              ? "First letter must be capital"
              : "";
      }
      if (field === "lastname") {
        const val = value.trim();
        tempErrors.lastname = !val
          ? "Last name is required"
          : val.length < 3
            ? "Last name must be at least 3 letters"
            : !/^[A-Z]/.test(val)
              ? "First letter must be capital"
              : "";
      }
      if (field === "email")
        tempErrors.email = !value.trim()
          ? "Email is required"
          : !/\S+@\S+\.\S+/.test(value)
            ? "Invalid email"
            : "";
      if (field === "phone")
        tempErrors.phone = !value.trim()
          ? "Phone is required"
          : phoneRegex.test(value)
            ? ""
            : "Phone must start with 010,011,012,015 and be 11 digits";
    }

    setErrors(tempErrors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Object.values(errors).some((err) => err)) {
      const msg =
        role === "seller"
          ? "يرجى تصحيح الأخطاء قبل الحفظ"
          : "Please fix errors before saving";
      Swal.fire("Error", msg, "error");
      speak(msg);
      return;
    }

    try {
      const payload =
        role === "seller"
          ? {
              name: form.name,
              phone: form.phone,
              sellingOffline: form.sellingOffline,
              sellingOnline: form.sellingOnline,
              shopAddress: form.shopAddress,
              websiteLink: form.websiteLink,
            }
          : {
              firstname: form.firstname,
              lastname: form.lastname,
              email: form.email,
              phone: form.phone,
            };

      const res = await fetch(
        `http://localhost:5000/api/v1/user/profile/update/${localStorage.getItem(
          "id",
        )}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("token"),
          },
          body: JSON.stringify(payload),
        },
      );

      const data = await res.json();

      if (res.ok) {
        const msg =
          role === "seller"
            ? "تم تحديث الملف الشخصي بنجاح"
            : "Profile updated successfully";
        Swal.fire("Success", msg, "success").then(() => {
          speak(msg);
          if (role === "buyer") navigate("/");
          if (role === "admin") navigate("/admindashboard/");
          if (role === "seller") navigate("/sellerdashboard/");
        });
      } else {
        const msg =
          data.message || (role === "seller" ? "فشل التحديث" : "Update failed");
        Swal.fire("Error", msg, "error");
        speak(msg);
      }
    } catch (err) {
      console.error(err);
      const msg = role === "seller" ? "فشل التحديث" : "Update failed";
      Swal.fire("Error", msg, "error");
      speak(msg);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center bg-[#E5E5E5] p-4 relative"
      dir={role === "seller" ? "rtl" : "ltr"}
    >
      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%232B0B0B' fill-opacity='1'%3E%3Cpath d='M30 0l5 10h10l-8 6 3 10-10-7-10 7 3-10-8-6h10z'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="w-full max-w-2xl my-8 z-10">
        <Card className="shadow-2xl rounded-xl">
          <CardBody className="p-8 md:p-10">
            <div className="text-center mb-6">
              <Typography
                variant="h1"
                className="text-5xl font-serif mb-2"
                style={{ color: "#2B0B0B" }}
              >
                {role === "seller" ? "تراثنا" : "Profile"}
              </Typography>
              <Typography
                variant="small"
                className="text-xs tracking-widest uppercase"
                style={{ color: "#A10D0D" }}
              >
                {role === "seller" ? "بوابة البائع" : "Edit your information"}
              </Typography>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Buyer or Admin */}
              {(role === "buyer" || role === "admin") && (
                <>
                  <Input
                    label="First Name"
                    value={form.firstname}
                    onChange={(e) => handleChange("firstname", e.target.value)}
                  />
                  {errors.firstname && (
                    <p className="text-red-500 text-xs">{errors.firstname}</p>
                  )}

                  <Input
                    label="Last Name"
                    value={form.lastname}
                    onChange={(e) => handleChange("lastname", e.target.value)}
                  />
                  {errors.lastname && (
                    <p className="text-red-500 text-xs">{errors.lastname}</p>
                  )}

                  <Input
                    label="Email"
                    type="email"
                    value={form.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs">{errors.email}</p>
                  )}

                  <Input
                    label="Phone"
                    value={form.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-xs">{errors.phone}</p>
                  )}
                </>
              )}

              {/* Seller */}
              {role === "seller" && (
                <>
                  <div className="flex items-center gap-2 mb-1">
                    <label className="text-sm text-[#2B0B0B]">
                      الاسم الكامل
                    </label>
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
                    value={form.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs flex items-center gap-1">
                      {errors.name}{" "}
                      <SpeakerWaveIcon
                        className="h-4 w-4 cursor-pointer"
                        onClick={() => speak(errors.name)}
                      />
                    </p>
                  )}

                  <Input
                    label="رقم الهاتف"
                    value={form.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-xs flex items-center gap-1">
                      {errors.phone}{" "}
                      <SpeakerWaveIcon
                        className="h-4 w-4 cursor-pointer"
                        onClick={() => speak(errors.phone)}
                      />
                    </p>
                  )}

                  <div className="space-y-2 bg-gray-50 p-4 rounded-lg">
                    <Checkbox
                      checked={form.sellingOffline}
                      onChange={(e) =>
                        handleChange("sellingOffline", e.target.checked)
                      }
                      color="red"
                      label="أبيع في متجر فعلي (أوفلاين)"
                    />
                    {form.sellingOffline && (
                      <Input
                        type="text"
                        placeholder="أدخل عنوان متجرك"
                        value={form.shopAddress}
                        onChange={(e) =>
                          handleChange("shopAddress", e.target.value)
                        }
                      />
                    )}
                    {errors.shopAddress && (
                      <p className="text-red-500 text-xs flex items-center gap-1">
                        {errors.shopAddress}{" "}
                        <SpeakerWaveIcon
                          className="h-4 w-4 cursor-pointer"
                          onClick={() => speak(errors.shopAddress)}
                        />
                      </p>
                    )}

                    <Checkbox
                      checked={form.sellingOnline}
                      onChange={(e) =>
                        handleChange("sellingOnline", e.target.checked)
                      }
                      color="red"
                      label="أبيع عبر الإنترنت (أونلاين)"
                    />
                    {form.sellingOnline && (
                      <Input
                        type="url"
                        placeholder="https://example.com"
                        value={form.websiteLink}
                        onChange={(e) =>
                          handleChange("websiteLink", e.target.value)
                        }
                      />
                    )}
                    {errors.websiteLink && (
                      <p className="text-red-500 text-xs flex items-center gap-1">
                        {errors.websiteLink}{" "}
                        <SpeakerWaveIcon
                          className="h-4 w-4 cursor-pointer"
                          onClick={() => speak(errors.websiteLink)}
                        />
                      </p>
                    )}
                  </div>
                </>
              )}

              <Button
                type="submit"
                fullWidth
                className="rounded-lg py-3 mt-6 normal-case text-base"
                style={{ backgroundColor: "#D63A3A" }}
              >
                {role === "seller" ? "تحديث الملف الشخصي" : "Update Profile"}
              </Button>
            </form>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default EditProfile;
