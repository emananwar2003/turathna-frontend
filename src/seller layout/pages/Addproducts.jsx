import React, { useState } from "react";
import {
  Card,
  CardBody,
  Input,
  Button,
  Typography,
} from "@material-tailwind/react";
import { PhotoIcon, SpeakerWaveIcon } from "@heroicons/react/24/outline";
import Swal from "sweetalert2";

const regions = [
  { id: 1, name: "سيناء", slug: "sinai" },
  { id: 2, name: "النوبة", slug: "nubia" },
  { id: 3, name: "سيوة", slug: "siwa-oasis" },
  { id: 4, name: "شمال مصر", slug: "upper-egypt" },
  { id: 5, name: "الفيوم", slug: "fayoum" },
];

const Addproducts = () => {
  const [form, setForm] = useState({
    photos: [],
    title: "",
    description: "",
    price: "",
    region: "",
  });

  const [errors, setErrors] = useState({
    photos: "",
    title: "",
    description: "",
    price: "",
    region: "",
  });

  const [loading, setLoading] = useState(false);

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

    if (field === "title") {
      const arabicRegex = /^[\u0600-\u06FF0-9\s]+$/;
      const words = value.trim().split(/\s+/);
      if (!value.trim()) tempErrors.title = "العنوان مطلوب";
      else if (!arabicRegex.test(value))
        tempErrors.title = "العنوان يجب أن يكون باللغة العربية فقط";
      else if (words.length < 2)
        tempErrors.title = "العنوان يجب أن يحتوي على كلمتين على الأقل";
      else tempErrors.title = "";
    }

    if (field === "description") {
      const arabicRegex = /^[\u0600-\u06FF0-9\s]+$/;
      const words = value.trim().split(/\s+/);
      if (!value.trim()) tempErrors.description = "الوصف مطلوب";
      else if (!arabicRegex.test(value))
        tempErrors.description = "الوصف يجب أن يكون باللغة العربية فقط";
      else if (words.length < 10)
        tempErrors.description = "الوصف يجب أن يحتوي على 10 كلمات على الأقل";
      else tempErrors.description = "";
    }

    if (field === "price") {
      const num = Number(value);
      if (!value.trim()) tempErrors.price = "السعر مطلوب";
      else if (isNaN(num) || num <= 0)
        tempErrors.price = "السعر يجب أن يكون رقماً أكبر من صفر";
      else tempErrors.price = "";
    }

    if (field === "region") {
      if (!value) tempErrors.region = "اختر المنطقة";
      else tempErrors.region = "";
    }

    setErrors(tempErrors);
  };

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files).slice(0, 5 - form.photos.length);
    const newPhotos = [...form.photos, ...files];
    setForm((prev) => ({ ...prev, photos: newPhotos }));

    setErrors((prev) => ({
      ...prev,
      photos:
        newPhotos.length === 0
          ? "يجب رفع صورة واحدة على الأقل"
          : newPhotos.length > 5
            ? "لا يمكن رفع أكثر من 5 صور"
            : "",
    }));
  };

  const removePhoto = (index) => {
    const newPhotos = form.photos.filter((_, i) => i !== index);
    setForm((prev) => ({ ...prev, photos: newPhotos }));

    setErrors((prev) => ({
      ...prev,
      photos: newPhotos.length === 0 ? "يجب رفع صورة واحدة على الأقل" : "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let hasError = false;
    const newErrors = { ...errors };

    ["title", "description", "price", "region"].forEach((field) => {
      if (!form[field].trim()) {
        newErrors[field] = "هذا الحقل مطلوب";
        hasError = true;
      }
    });

    if (form.photos.length === 0) {
      newErrors.photos = "يجب رفع صورة واحدة على الأقل";
      hasError = true;
    }

    setErrors(newErrors);

    if (hasError) {
      const errorMsg = "جميع الحقول مطلوبة، يرجى ملء جميع البيانات بشكل صحيح";
      speak(errorMsg);
      Swal.fire({
        icon: "error",
        title: "خطأ",
        text: errorMsg,
      });
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("token");
      const sellerId =localStorage.getItem("id")
       

      const formData = new FormData();
      formData.append("title_ar", form.title);
      formData.append("description_ar", form.description);
      formData.append("originalPrice", form.price);
      formData.append("region", form.region);
      form.photos.forEach((photo) => formData.append("productImages", photo));

      const response = await fetch(
        `http://localhost:5000/api/v1/product/seller/${sellerId}`,
        {
          method: "POST",
          headers: {
            Authorization: token,
          },
          body: formData,
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.message || "حدث خطأ أثناء الإضافة");
      }

      const successMsg = "تم الإضافة. منتجك قيد التقييم";
      speak(successMsg);
      Swal.fire({
        icon: "success",
        title: "تم الإضافة",
        text: successMsg,
        confirmButtonColor: "#D63A3A",
      });

      setForm({
        photos: [],
        title: "",
        description: "",
        price: "",
        region: "",
      });
      setErrors({
        photos: "",
        title: "",
        description: "",
        price: "",
        region: "",
      });
    } catch (error) {
      const errorMsg =
        error.message || "حدث خطأ أثناء الإضافة، يرجى المحاولة مجدداً";
      speak(errorMsg);
      Swal.fire({
        icon: "error",
        title: "خطأ",
        text: errorMsg,
      });
    } finally {
      setLoading(false);
    }
  };

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
              className="text-5xl font-serif mb-4 text-center"
              style={{ color: "#2B0B0B" }}
            >
              إضافة منتج
            </Typography>
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Photo Upload */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <label className="text-sm text-[#2B0B0B]">
                    صور المنتج (1-5)
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      speak(
                        "صور المنتج، يجب رفع صورة واحدة على الأقل وخمس كحد أقصى",
                      )
                    }
                    className="p-1 rounded-full hover:bg-[#D63A3A]/10"
                  >
                    <SpeakerWaveIcon
                      className="h-4 w-4"
                      style={{ color: "#D63A3A" }}
                    />
                  </button>
                </div>
                {form.photos.length < 5 && (
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
                      اضغط لتحميل الصور ({form.photos.length}/5)
                    </Typography>
                  </label>
                )}
                {errors.photos && (
                  <p className="text-red-500 text-xs mt-1">{errors.photos}</p>
                )}
                {form.photos.length > 0 && (
                  <div className="grid grid-cols-5 gap-2 mt-2">
                    {form.photos.map((photo, i) => (
                      <div key={i} className="relative group">
                        <img
                          src={URL.createObjectURL(photo)}
                          alt={`صورة ${i + 1}`}
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

              {/* Title */}
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <label className="text-sm text-[#2B0B0B]">عنوان المنتج</label>
                  <button
                    type="button"
                    onClick={() =>
                      speak(
                        "عنوان المنتج يجب أن يكون باللغة العربية وكلمتين على الأقل",
                      )
                    }
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
                  placeholder="أدخل عنوان المنتج"
                  value={form.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                  className={`focus:!border-[#D63A3A] !text-right ${errors.title && "border-red-500"}`}
                />
                {errors.title && (
                  <p className="text-red-500 text-xs mt-1">{errors.title}</p>
                )}
              </div>

              {/* Description */}
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <label className="text-sm text-[#2B0B0B]">وصف المنتج</label>
                  <button
                    type="button"
                    onClick={() =>
                      speak(
                        "الوصف يجب أن يكون باللغة العربية ويحتوي على عشر كلمات على الأقل",
                      )
                    }
                    className="p-1 rounded-full hover:bg-[#D63A3A]/10"
                  >
                    <SpeakerWaveIcon
                      className="h-4 w-4"
                      style={{ color: "#D63A3A" }}
                    />
                  </button>
                </div>
                <textarea
                  placeholder="أدخل وصف المنتج"
                  value={form.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  className={`w-full border p-3 rounded-md focus:outline-none focus:border-[#D63A3A] text-right ${errors.description && "border-red-500"}`}
                  rows={4}
                />
                {errors.description && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.description}
                  </p>
                )}
              </div>

              {/* Price */}
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <label className="text-sm text-[#2B0B0B]">السعر</label>
                  <button
                    type="button"
                    onClick={() =>
                      speak("أدخل سعر المنتج ويجب أن يكون رقماً أكبر من صفر")
                    }
                    className="p-1 rounded-full hover:bg-[#D63A3A]/10"
                  >
                    <SpeakerWaveIcon
                      className="h-4 w-4"
                      style={{ color: "#D63A3A" }}
                    />
                  </button>
                </div>
                <Input
                  type="number"
                  placeholder="أدخل السعر"
                  value={form.price}
                  onChange={(e) => handleChange("price", e.target.value)}
                  className={`focus:!border-[#D63A3A] !text-right ${errors.price && "border-red-500"}`}
                />
                {errors.price && (
                  <p className="text-red-500 text-xs mt-1">{errors.price}</p>
                )}
              </div>

              {/* Region */}
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <label className="text-sm text-[#2B0B0B]">المنطقة</label>
                  <button
                    type="button"
                    onClick={() => speak("اختر المنطقة")}
                    className="p-1 rounded-full hover:bg-[#D63A3A]/10"
                  >
                    <SpeakerWaveIcon
                      className="h-4 w-4"
                      style={{ color: "#D63A3A" }}
                    />
                  </button>
                </div>
                <select
                  value={form.region}
                  onChange={(e) => {
                    handleChange("region", e.target.value);
                    if (e.target.value)
                      speak(`تم اختيار المنطقة: ${e.target.value}`);
                  }}
                  className={`w-full border p-3 rounded-md focus:outline-none focus:border-[#D63A3A] text-right ${errors.region && "border-red-500"}`}
                >
                  <option value="">اختر المنطقة</option>
                  {regions.map((r) => (
                    <option key={r.id} value={r.slug}>
                      {r.name}
                    </option>
                  ))}
                </select>
                {errors.region && (
                  <p className="text-red-500 text-xs mt-1">{errors.region}</p>
                )}
              </div>

              {/* Submit */}
              <Button
                type="submit"
                fullWidth
                disabled={loading}
                className="rounded-lg py-3 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] normal-case text-base mt-6 disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100"
                style={{
                  backgroundColor: "#D63A3A",
                  boxShadow: "0 4px 6px -1px rgba(214, 58, 58, 0.3)",
                }}
              >
                {loading ? "جاري الإضافة..." : "إضافة المنتج"}
              </Button>
            </form>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default Addproducts;
