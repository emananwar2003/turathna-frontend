import React, { useState, useEffect } from "react";
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
  ArrowRightIcon,
} from "@heroicons/react/24/outline";
import Swal from "sweetalert2";
import { useParams, useNavigate } from "react-router-dom";

const regions = [
  { id: 1, name: "سيناء", slug: "sinai" },
  { id: 2, name: "النوبة", slug: "nubia" },
  { id: 3, name: "سيوة", slug: "Siwa-Oasis" },
  { id: 4, name: "شمال مصر", slug: "upper-egypt" },
  { id: 5, name: "الفيوم", slug: "fayoum" },
];

const EditProduct = () => {
  const { productId } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    newPhotos: [],
    existingImages: [],
    title: "",
    description: "",
    price: "",
    region: "",
  });

  const [errors, setErrors] = useState({
    title: "",
    description: "",
    price: "",
    region: "",
    photos: "",
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const speak = (text) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = "ar-SA";
      u.rate = 0.9;
      window.speechSynthesis.speak(u);
    }
  };

  // ── Fetch existing product ──────────────────────────────────────────────────
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `http://localhost:5000/api/v1/product/${productId}`,
          { headers: { Authorization: token } },
        );
        const data = await res.json();

        const p =
          data?.data?.product ||
          data?.data?.products?.[0] ||
          data?.product ||
          data?.data ||
          data ||
          {};

        setForm((prev) => ({
          ...prev,
          existingImages: p.productImages || [],
          title: p.title_ar || "",
          description: p.description_ar || "",
          price: String(p.originalPrice || ""),

          region: p.region?.slugName || "",
        }));
      } catch {
        Swal.fire({
          icon: "error",
          title: "خطأ",
          text: "تعذّر تحميل بيانات المنتج.",
          confirmButtonColor: "#D84040",
        });
      } finally {
        setFetching(false);
      }
    };
    fetchProduct();
  }, [productId]);

  const validate = (field, value) => {
    let msg = "";
    const arabicRegex = /^[\u0600-\u06FF\s]+$/;
    if (field === "title") {
      if (!value.trim()) msg = "العنوان مطلوب";
      else if (!arabicRegex.test(value))
        msg = "العنوان يجب أن يكون باللغة العربية فقط";
      else if (value.trim().split(/\s+/).length < 2)
        msg = "العنوان يجب أن يحتوي على كلمتين على الأقل";
    }
    if (field === "description") {
      if (!value.trim()) msg = "الوصف مطلوب";
      else if (!arabicRegex.test(value))
        msg = "الوصف يجب أن يكون باللغة العربية فقط";
      else if (value.trim().split(/\s+/).length < 10)
        msg = "الوصف يجب أن يحتوي على 10 كلمات على الأقل";
    }
    if (field === "price") {
      const num = Number(value);
      if (!value.trim()) msg = "السعر مطلوب";
      else if (isNaN(num) || num <= 0)
        msg = "السعر يجب أن يكون رقماً أكبر من صفر";
    }
    if (field === "region" && !value) msg = "اختر المنطقة";
    return msg;
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: validate(field, value) }));
  };

  const totalPhotos = form.existingImages.length + form.newPhotos.length;

  const handlePhotoUpload = (e) => {
    const slots = 5 - totalPhotos;
    if (slots <= 0) return;
    const files = Array.from(e.target.files).slice(0, slots);
    setForm((prev) => ({ ...prev, newPhotos: [...prev.newPhotos, ...files] }));
  };

  const removeExisting = (idx) => {
    const updated = form.existingImages.filter((_, i) => i !== idx);
    setForm((prev) => ({ ...prev, existingImages: updated }));
  };

  const removeNew = (idx) => {
    const updated = form.newPhotos.filter((_, i) => i !== idx);
    setForm((prev) => ({ ...prev, newPhotos: updated }));
  };

  const handleSubmit = async () => {
    const newErrors = {
      title: validate("title", form.title),
      description: validate("description", form.description),
      price: validate("price", form.price),
      region: validate("region", form.region),
      photos: totalPhotos === 0 ? "يجب رفع صورة واحدة على الأقل" : "",
    };
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

    const confirm = await Swal.fire({
      icon: "question",
      title: "هل أنت متأكد؟",
      text: "هل تريد حفظ التغييرات على هذا المنتج؟",
      showCancelButton: true,
      confirmButtonColor: "#D84040",
      cancelButtonColor: "#8E1616",
      confirmButtonText: "نعم، احفظ",
      cancelButtonText: "إلغاء",
      customClass: { popup: "font-[Tajawal]" },
    });

    if (!confirm.isConfirmed) return;

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const sellerId = localStorage.getItem("id");

      const formData = new FormData();
      formData.append("title_ar", form.title);
      formData.append("description_ar", form.description);
      formData.append("originalPrice", form.price);
      formData.append("region", form.region);
      for (const url of form.existingImages) {
        const blob = await (await fetch(url)).blob();
        formData.append("productImages", blob, url.split("/").pop());
      }

      form.newPhotos.forEach((file) => formData.append("productImages", file));

      const res = await fetch(
        `http://localhost:5000/api/v1/product/seller/${sellerId}/${productId}`,
        { method: "PATCH", headers: { Authorization: token }, body: formData },
      );

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err?.message || "حدث خطأ");
      }

      const msg = "تم حفظ التغييرات بنجاح";
      speak(msg);
      Swal.fire({
        icon: "success",
        title: "تم الحفظ",
        text: msg,
        confirmButtonColor: "#D84040",
        customClass: { popup: "font-[Tajawal]" },
      }).then(() => navigate(-1));
    } catch (err) {
      const msg = err.message || "حدث خطأ أثناء الحفظ";
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

  if (fetching) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "#EEEEEE" }}
      >
        <div className="animate-spin rounded-full h-14 w-14 border-4 border-[#D84040] border-t-transparent" />
      </div>
    );
  }

  return (
    <div
      className="min-h-screen w-full relative overflow-hidden flex items-center justify-center p-4"
      dir="rtl"
      style={{
        backgroundColor: "#EEEEEE",
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23D84040' fill-opacity='0.08'%3E%3Cpath d='M30 0l5 10h10l-8 6 3 10-10-7-10 7 3-10-8-6h10z'/%3E%3C/g%3E%3C/svg%3E")`,
      }}
    >
      <div className="relative w-full max-w-2xl my-8">
        <Card className="shadow-2xl rounded-xl hover:shadow-3xl transition-all duration-300">
          <CardBody className="p-8 md:p-10">
            {/* Back button */}
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-1 text-sm text-[#8E1616] hover:text-[#D84040] mb-4 transition-colors"
            >
              <ArrowRightIcon className="h-4 w-4" />
              رجوع
            </button>

            <Typography
              variant="h1"
              className="text-4xl font-serif mb-6 text-center "
              style={{ color: "#1D1616" }}
            >
              تعديل المنتج
            </Typography>

            <div className="space-y-5">
              {/* ── Photos ── */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <label className="text-sm text-[#1D1616] font-[Tajawal]">
                    صور المنتج (1-5)
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      speak(
                        "صور المنتج، يجب رفع صورة واحدة على الأقل وخمس كحد أقصى",
                      )
                    }
                    className="p-1 rounded-full hover:bg-[#D84040]/10"
                  >
                    <SpeakerWaveIcon
                      className="h-4 w-4"
                      style={{ color: "#D84040" }}
                    />
                  </button>
                </div>

                {/* Preview grid */}
                {(form.existingImages.length > 0 ||
                  form.newPhotos.length > 0) && (
                  <div className="grid grid-cols-5 gap-2 mb-3">
                    {form.existingImages.map((url, i) => (
                      <div key={`ex-${i}`} className="relative group">
                        <img
                          src={url}
                          alt=""
                          className="w-full h-20 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeExisting(i)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    {form.newPhotos.map((file, i) => (
                      <div key={`new-${i}`} className="relative group">
                        <img
                          src={URL.createObjectURL(file)}
                          alt=""
                          className="w-full h-20 object-cover rounded-lg opacity-80 ring-2 ring-[#D84040]"
                        />
                        <button
                          type="button"
                          onClick={() => removeNew(i)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Upload zone */}
                {totalPhotos < 5 && (
                  <label className="block w-full p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#D84040] transition-colors cursor-pointer text-center">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                    <PhotoIcon
                      className="h-8 w-8 mx-auto mb-2"
                      style={{ color: "#8E1616" }}
                    />
                    <Typography
                      variant="small"
                      className="text-gray-600 font-[Tajawal]"
                    >
                      اضغط لإضافة صور ({totalPhotos}/5)
                    </Typography>
                  </label>
                )}
                {errors.photos && (
                  <p className="text-red-500 text-xs mt-1 font-[Tajawal]">
                    {errors.photos}
                  </p>
                )}
              </div>

              {/* ── Title ── */}
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <label className="text-sm text-[#1D1616] font-[Tajawal]">
                    عنوان المنتج
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      speak(
                        "عنوان المنتج يجب أن يكون باللغة العربية وكلمتين على الأقل",
                      )
                    }
                    className="p-1 rounded-full hover:bg-[#D84040]/10"
                  >
                    <SpeakerWaveIcon
                      className="h-4 w-4"
                      style={{ color: "#D84040" }}
                    />
                  </button>
                </div>
                <Input
                  type="text"
                  placeholder="أدخل عنوان المنتج"
                  value={form.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                  className={`focus:!border-[#D84040] !text-right font-[Tajawal] ${errors.title && "border-red-500"}`}
                />
                {errors.title && (
                  <p className="text-red-500 text-xs mt-1 font-[Tajawal]">
                    {errors.title}
                  </p>
                )}
              </div>

              {/* ── Description ── */}
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <label className="text-sm text-[#1D1616] font-[Tajawal]">
                    وصف المنتج
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      speak(
                        "الوصف يجب أن يكون باللغة العربية ويحتوي على عشر كلمات على الأقل",
                      )
                    }
                    className="p-1 rounded-full hover:bg-[#D84040]/10"
                  >
                    <SpeakerWaveIcon
                      className="h-4 w-4"
                      style={{ color: "#D84040" }}
                    />
                  </button>
                </div>
                <textarea
                  placeholder="أدخل وصف المنتج"
                  value={form.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  className={`w-full border p-3 rounded-md focus:outline-none focus:border-[#D84040] text-right font-[Tajawal] ${errors.description && "border-red-500"}`}
                  rows={4}
                />
                {errors.description && (
                  <p className="text-red-500 text-xs mt-1 font-[Tajawal]">
                    {errors.description}
                  </p>
                )}
              </div>

              {/* ── Price ── */}
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <label className="text-sm text-[#1D1616] font-[Tajawal]">
                    السعر
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      speak("أدخل سعر المنتج ويجب أن يكون رقماً أكبر من صفر")
                    }
                    className="p-1 rounded-full hover:bg-[#D84040]/10"
                  >
                    <SpeakerWaveIcon
                      className="h-4 w-4"
                      style={{ color: "#D84040" }}
                    />
                  </button>
                </div>
                <Input
                  type="number"
                  placeholder="أدخل السعر"
                  value={form.price}
                  onChange={(e) => handleChange("price", e.target.value)}
                  className={`focus:!border-[#D84040] !text-right font-[Tajawal] ${errors.price && "border-red-500"}`}
                />
                {errors.price && (
                  <p className="text-red-500 text-xs mt-1 font-[Tajawal]">
                    {errors.price}
                  </p>
                )}
              </div>

              {/* ── Region ── */}
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <label className="text-sm text-[#1D1616] font-[Tajawal]">
                    المنطقة
                  </label>
                  <button
                    type="button"
                    onClick={() => speak("اختر المنطقة")}
                    className="p-1 rounded-full hover:bg-[#D84040]/10"
                  >
                    <SpeakerWaveIcon
                      className="h-4 w-4"
                      style={{ color: "#D84040" }}
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
                  className={`w-full border p-3 rounded-md focus:outline-none focus:border-[#D84040] text-right font-[Tajawal] ${errors.region && "border-red-500"}`}
                >
                  <option value="">اختر المنطقة</option>
                  {regions.map((r) => (
                    <option key={r.id} value={r.slug}>
                      {r.name}
                    </option>
                  ))}
                </select>
                {errors.region && (
                  <p className="text-red-500 text-xs mt-1 font-[Tajawal]">
                    {errors.region}
                  </p>
                )}
              </div>

              {/* ── Save Button ── */}
              <Button
                onClick={handleSubmit}
                fullWidth
                disabled={loading}
                className="rounded-lg py-3 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] normal-case text-base mt-6 disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100 font-[Tajawal]"
                style={{
                  backgroundColor: "#D84040",
                  boxShadow: "0 4px 6px -1px rgba(216, 64, 64, 0.3)",
                }}
              >
                {loading ? "جاري الحفظ..." : "حفظ التغييرات"}
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default EditProduct;
