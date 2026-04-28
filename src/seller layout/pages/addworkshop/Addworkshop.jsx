import React, { useState } from "react";
import {
  Card,
  CardBody,
  Input,
  Button,
  Typography,
} from "@material-tailwind/react";
import {
  PhotoIcon,
  SpeakerWaveIcon,
  ShoppingBagIcon,
  GlobeAltIcon,
} from "@heroicons/react/24/outline";
import Swal from "sweetalert2";

const AddWorkshop = () => {
  const [form, setForm] = useState({
    photo: null,
    title: "",
    description: "",
    price: "",
    date: "",
    time: "",
    seats: "",
    isOnline: false,
    isOffline: false,
    link: "",
    address: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const speak = (hint, errorText) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const text = errorText ? errorText : hint;
      const u = new SpeechSynthesisUtterance(text);
      u.lang = "ar-SA";
      u.rate = 0.9;
      window.speechSynthesis.speak(u);
    }
  };

  const today = new Date().toISOString().split("T")[0];

 
  const textRegex = /^[\u0600-\u06FF\s]+$/;

  const validateField = (field, value, currentForm) => {
    const f = currentForm || form;

    switch (field) {
      case "title": {
        if (!value.trim()) return "العنوان مطلوب";
        if (!textRegex.test(value))
          return "العنوان يحتوي على رموز غير مسموح بها";
        if (value.trim().split(/\s+/).length < 2)
          return "العنوان يجب أن يحتوي على كلمتين على الأقل";
        return "";
      }
      case "description": {
        if (!value.trim()) return "الوصف مطلوب";
        if (!textRegex.test(value)) return "الوصف يحتوي على رموز غير مسموح بها";
        if (value.trim().split(/\s+/).length < 10)
          return "الوصف يجب أن يحتوي على 10 كلمات على الأقل";
        return "";
      }
      case "price": {
        const num = Number(value);
        if (!value) return "السعر مطلوب";
        if (isNaN(num) || num <= 0)
          return "السعر يجب أن يكون رقماً أكبر من صفر";
        return "";
      }
      case "date": {
        if (!value) return "التاريخ مطلوب";
        if (value < today) return "لا يمكن اختيار تاريخ في الماضي";
        return "";
      }
      case "time": {
        if (!value) return "الوقت مطلوب";
        return "";
      }
      case "seats": {
        const num = Number(value);
        if (!value) return "عدد المقاعد مطلوب";
        if (isNaN(num) || num <= 0 || !Number.isInteger(num))
          return "عدد المقاعد يجب أن يكون عدداً صحيحاً أكبر من صفر";
        return "";
      }
      case "link": {
        if (f.isOnline && !value.trim())
          return "رابط الورشة مطلوب للورش الإلكترونية";
        return "";
      }
      case "address": {
        if (f.isOffline && !value.trim())
          return "عنوان الورشة مطلوب للورش الحضورية";
        return "";
      }
      case "photo": {
        if (!value) return "يجب رفع صورة واحدة";
        return "";
      }
      default:
        return "";
    }
  };

  const handleChange = (field, value) => {
    const updated = { ...form, [field]: value };
    setForm(updated);
    setErrors((prev) => ({
      ...prev,
      [field]: validateField(field, value, updated),
    }));
  };

  const handleCheckbox = (type) => {
    const updated = {
      ...form,
      isOnline: type === "online" ? !form.isOnline : form.isOnline,
      isOffline: type === "offline" ? !form.isOffline : form.isOffline,
    };
    setForm(updated);
    setErrors((prev) => ({
      ...prev,
      isOnline:
        !updated.isOnline && !updated.isOffline ? "يجب اختيار نوع الورشة" : "",
      link:
        updated.isOnline && !updated.link
          ? "رابط الورشة مطلوب للورش الإلكترونية"
          : "",
      address:
        updated.isOffline && !updated.address
          ? "عنوان الورشة مطلوب للورش الحضورية"
          : "",
    }));
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setForm((prev) => ({ ...prev, photo: file }));
    setErrors((prev) => ({ ...prev, photo: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    ["title", "description", "price", "date", "time", "seats", "photo"].forEach(
      (f) => {
        const err = validateField(f, form[f], form);
        if (err) newErrors[f] = err;
      },
    );

    if (!form.isOnline && !form.isOffline)
      newErrors.isOnline =
        "يجب اختيار نوع الورشة على الأقل (إلكترونية أو حضورية)";
    if (form.isOnline && !form.link.trim())
      newErrors.link = "رابط الورشة مطلوب";
    if (form.isOffline && !form.address.trim())
      newErrors.address = "عنوان الورشة مطلوب";

    setErrors(newErrors);
    if (Object.values(newErrors).some(Boolean)) {
      const msg = "جميع الحقول مطلوبة، يرجى ملء جميع البيانات بشكل صحيح";
      speak(msg);
      Swal.fire({
        icon: "error",
        title: "خطأ",
        text: msg,
        confirmButtonColor: "#D84040",
      });
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const sellerId = localStorage.getItem("id");

      const formData = new FormData();
      formData.append("title_ar", form.title);
      formData.append("description_ar", form.description);
      formData.append("originalPrice", form.price);
      formData.append("date", form.date);
      formData.append("time", form.time);
      formData.append("seats", form.seats);
      formData.append("workshopOnline", form.isOnline);
      formData.append("workshopOffline", form.isOffline);
      if (form.isOnline) formData.append("workshopLink", form.link);
      if (form.isOffline) formData.append("workshopAddress", form.address);
      formData.append("workshopImages", form.photo);

      const res = await fetch(
        `http://localhost:5000/api/v1/workshop/seller/${sellerId}`,
        {
          method: "POST",
          headers: { Authorization: token },
          body: formData,
        },
      );

      const result = await res.json();
      if (!res.ok) throw new Error(result?.message || "حدث خطأ أثناء الإضافة");

      const msg = "تم الإضافة. ورشتك قيد التقييم";
      speak(msg);
      Swal.fire({
        icon: "success",
        title: "تم الإضافة",
        text: msg,
        confirmButtonColor: "#D84040",
      });

      setForm({
        photo: null,
        title: "",
        description: "",
        price: "",
        date: "",
        time: "",
        seats: "",
        isOnline: false,
        isOffline: false,
        link: "",
        address: "",
      });
      setErrors({});
    } catch (err) {
      const msg = err.message || "حدث خطأ أثناء الإضافة";
      speak(msg);
      Swal.fire({
        icon: "error",
        title: "خطأ",
        text: msg,
        confirmButtonColor: "#D84040",
      });
    } finally {
      setLoading(false);
    }
  };

  const LabelRow = ({ label, hint, errorKey }) => (
    <div className="flex items-center gap-2 mb-1">
      <label className="text-sm text-[#2B0B0B]">{label}</label>
      <button
        type="button"
        onClick={() => speak(hint, errors[errorKey])}
        className="p-1 rounded-full hover:bg-[#D84040]/10"
      >
        <SpeakerWaveIcon className="h-4 w-4" style={{ color: "#D84040" }} />
      </button>
    </div>
  );

  return (
    <div
      className="min-h-screen w-full relative overflow-hidden bg-[#EEEEEE] flex items-center justify-center p-4"
      dir="rtl"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23D84040' fill-opacity='0.08'%3E%3Cpath d='M30 0l5 10h10l-8 6 3 10-10-7-10 7 3-10-8-6h10z'/%3E%3C/g%3E%3C/svg%3E")`,
      }}
    >
      <div className="relative w-full max-w-2xl my-8">
        <Card className="shadow-2xl rounded-xl hover:shadow-3xl transition-all duration-300">
          <CardBody className="p-8 md:p-10">
            <Typography
              variant="h1"
              className="text-5xl font-serif mb-6 text-center"
              style={{ color: "#2B0B0B" }}
            >
              إضافة ورشة
            </Typography>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* ── Photo ── */}
              <div>
                <LabelRow
                  label="صورة الورشة"
                  hint="صورة الورشة، يجب رفع صورة واحدة"
                  errorKey="photo"
                />
                {!form.photo ? (
                  <label className="block w-full p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#D84040] transition-colors cursor-pointer text-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                    <PhotoIcon
                      className="h-8 w-8 mx-auto mb-2"
                      style={{ color: "#8E1616" }}
                    />
                    <Typography variant="small" className="text-gray-600">
                      اضغط لتحميل صورة الورشة
                    </Typography>
                  </label>
                ) : (
                  <div className="relative group w-full h-48">
                    <img
                      src={URL.createObjectURL(form.photo)}
                      alt="workshop"
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setForm((p) => ({ ...p, photo: null }));
                        setErrors((p) => ({
                          ...p,
                          photo: "يجب رفع صورة واحدة",
                        }));
                      }}
                      className="absolute top-2 left-2 bg-[#D84040] text-white rounded-full w-7 h-7 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-sm font-bold"
                    >
                      ×
                    </button>
                  </div>
                )}
                {errors.photo && (
                  <p className="text-red-500 text-xs mt-1">{errors.photo}</p>
                )}
              </div>

              {/* ── Title ── */}
              <div>
                <LabelRow
                  label="عنوان الورشة"
                  hint="عنوان الورشة يجب أن يحتوي على كلمتين على الأقل"
                  errorKey="title"
                />
                <Input
                  type="text"
                  placeholder="أدخل عنوان الورشة"
                  value={form.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                  className={`focus:!border-[#D84040] !text-right ${errors.title ? "border-red-500" : ""}`}
                />
                {errors.title && (
                  <p className="text-red-500 text-xs mt-1">{errors.title}</p>
                )}
              </div>

              {/* ── Description ── */}
              <div>
                <LabelRow
                  label="وصف الورشة"
                  hint="الوصف يجب أن يحتوي على عشر كلمات على الأقل"
                  errorKey="description"
                />
                <textarea
                  placeholder="أدخل وصف الورشة"
                  value={form.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  rows={4}
                  className={`w-full border p-3 rounded-md focus:outline-none focus:border-[#D84040] text-right text-sm ${errors.description ? "border-red-500" : "border-gray-300"}`}
                />
                {errors.description && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.description}
                  </p>
                )}
              </div>

              {/* ── Price ── */}
              <div>
                <LabelRow
                  label="السعر"
                  hint="أدخل سعر الورشة"
                  errorKey="price"
                />
                <Input
                  type="number"
                  placeholder="أدخل السعر"
                  value={form.price}
                  onChange={(e) => handleChange("price", e.target.value)}
                  className={`focus:!border-[#D84040] !text-right ${errors.price ? "border-red-500" : ""}`}
                />
                {errors.price && (
                  <p className="text-red-500 text-xs mt-1">{errors.price}</p>
                )}
              </div>

              {/* ── Date + Time ── */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <LabelRow
                    label="التاريخ"
                    hint="اختر تاريخ الورشة"
                    errorKey="date"
                  />
                  <input
                    type="date"
                    min={today}
                    value={form.date}
                    onChange={(e) => handleChange("date", e.target.value)}
                    className={`w-full border p-3 rounded-md focus:outline-none focus:border-[#D84040] text-right text-sm ${errors.date ? "border-red-500" : "border-gray-300"}`}
                  />
                  {errors.date && (
                    <p className="text-red-500 text-xs mt-1">{errors.date}</p>
                  )}
                </div>
                <div>
                  <LabelRow
                    label="الوقت"
                    hint="اختر وقت الورشة"
                    errorKey="time"
                  />
                  <input
                    type="time"
                    value={form.time}
                    onChange={(e) => handleChange("time", e.target.value)}
                    className={`w-full border p-3 rounded-md focus:outline-none focus:border-[#D84040] text-right text-sm ${errors.time ? "border-red-500" : "border-gray-300"}`}
                  />
                  {errors.time && (
                    <p className="text-red-500 text-xs mt-1">{errors.time}</p>
                  )}
                </div>
              </div>

              {/* ── Seats ── */}
              <div>
                <LabelRow
                  label="عدد المقاعد"
                  hint="أدخل عدد المقاعد المتاحة"
                  errorKey="seats"
                />
                <Input
                  type="number"
                  placeholder="عدد المقاعد"
                  value={form.seats}
                  onChange={(e) => handleChange("seats", e.target.value)}
                  className={`focus:!border-[#D84040] !text-right ${errors.seats ? "border-red-500" : ""}`}
                />
                {errors.seats && (
                  <p className="text-red-500 text-xs mt-1">{errors.seats}</p>
                )}
              </div>

              {/* ── Type checkboxes — styled like screenshot ── */}
              <div>
                <LabelRow
                  label="نوع الورشة"
                  hint="اختر نوع الورشة إلكترونية أو حضورية أو كليهما"
                  errorKey="isOnline"
                />
                <div className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
                  {/* Offline row */}
                  <label
                    className={`flex items-center justify-between px-4 py-3 cursor-pointer border-b border-gray-200 transition-colors ${form.isOffline ? "bg-[#D84040]/5" : "hover:bg-gray-100"}`}
                  >
                    <input
                      type="checkbox"
                      checked={form.isOffline}
                      onChange={() => handleCheckbox("offline")}
                      className="w-4 h-4 accent-[#D84040] order-last"
                    />
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: "#D84040" }}
                      >
                        <ShoppingBagIcon className="h-4 w-4 text-white" />
                      </div>
                      <span className="text-sm text-gray-700">
                        (أوفلاين)الورشة في ورشةالعمل  
                      </span>
                    </div>
                  </label>
                  {/* Online row */}
                  <label
                    className={`flex items-center justify-between px-4 py-3 cursor-pointer transition-colors ${form.isOnline ? "bg-[#D84040]/5" : "hover:bg-gray-100"}`}
                  >
                    <input
                      type="checkbox"
                      checked={form.isOnline}
                      onChange={() => handleCheckbox("online")}
                      className="w-4 h-4 accent-[#D84040] order-last"
                    />
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: "#D84040" }}
                      >
                        <GlobeAltIcon className="h-4 w-4 text-white" />
                      </div>
                      <span className="text-sm text-gray-700">
                         عبر الإنترنت (أونلاين)
                      </span>
                    </div>
                  </label>
                </div>
                {errors.isOnline && (
                  <p className="text-red-500 text-xs mt-1">{errors.isOnline}</p>
                )}
              </div>

              {/* ── Link (conditional) ── */}
              {form.isOnline && (
                <div>
                  <LabelRow
                    label="رابط الورشة الإلكترونية"
                    hint="أدخل رابط الورشة"
                    errorKey="link"
                  />
                  <Input
                    type="url"
                    placeholder="https://zoom.com/..."
                    value={form.link}
                    onChange={(e) => handleChange("link", e.target.value)}
                    className={`focus:!border-[#D84040] !text-right ${errors.link ? "border-red-500" : ""}`}
                  />
                  {errors.link && (
                    <p className="text-red-500 text-xs mt-1">{errors.link}</p>
                  )}
                </div>
              )}

              {/* ── Address (conditional) ── */}
              {form.isOffline && (
                <div>
                  <LabelRow
                    label="عنوان الورشة الحضورية"
                    hint="أدخل عنوان مكان الورشة"
                    errorKey="address"
                  />
                  <Input
                    type="text"
                    placeholder="أدخل عنوان المكان"
                    value={form.address}
                    onChange={(e) => handleChange("address", e.target.value)}
                    className={`focus:!border-[#D84040] !text-right ${errors.address ? "border-red-500" : ""}`}
                  />
                  {errors.address && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.address}
                    </p>
                  )}
                </div>
              )}

              {/* ── Submit ── */}
              <Button
                type="submit"
                fullWidth
                disabled={loading}
                className="rounded-lg py-3 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] normal-case text-base mt-6 disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100"
                style={{
                  backgroundColor: "#D84040",
                  boxShadow: "0 4px 6px -1px rgba(216,64,64,0.3)",
                }}
              >
                {loading ? "جاري الإضافة..." : "إضافة الورشة"}
              </Button>
            </form>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default AddWorkshop;
