import React, { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  Input,
  Button,
  Typography,
} from "@material-tailwind/react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
  XCircleIcon,
  PhotoIcon,
  FilmIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";
import Swal from "sweetalert2";
import { useParams, useNavigate } from "react-router-dom";


const regions = [
  { id: 1, name: "Sinai", slug: "sinai" },
  { id: 2, name: "Nubia", slug: "nubia" },
  { id: 3, name: "Siwa Oasis", slug: "Siwa-Oasis" },
  { id: 4, name: "Upper Egypt", slug: "upper-egypt" },
  { id: 5, name: "Fayoum", slug: "fayoum" },
];

const categories = [
  { value: "textiles-and-embroidery", label: "Textiles & Embroidery" },
  { value: "jewelry-and-accessories", label: "Jewelry & Accessories" },
  { value: "pottery-and-ceramics", label: "Pottery & Ceramics" },
  { value: "home-decor", label: "Home Decor" },
  { value: "bags-and-leather-goods", label: "Bags & Leather Goods" },
  { value: "art-and-paintings", label: "Art & Paintings" },
  { value: "handmade-gifts", label: "Handmade Gifts" },
  { value: "wood-and-carved-art", label: "Wood & Carved Art" },
];

const arabicRe = /^[\u0600-\u06FF\s\d.,!?'"()\-&]+$/;

const noArabicRe = /^[^\u0600-\u06FF]+$/;

const fieldValidators = {
  title_ar: (v) => {
    if (!v.trim()) return "Arabic title is required";
    if (!arabicRe.test(v)) return "Must be Arabic only";
    if (v.trim().split(/\s+/).length < 2) return "At least 2 words required";
    return "";
  },
  title_en: (v) => {
    if (!v.trim()) return "English title is required";
    if (!noArabicRe.test(v)) return "Must be in English (no Arabic characters)";
    if (v.trim().split(/\s+/).length < 2) return "At least 2 words required";
    return "";
  },
  description_ar: (v) => {
    if (!v.trim()) return "Arabic description is required";
    if (!arabicRe.test(v)) return "Must be Arabic only";
    if (v.trim().split(/\s+/).length < 10) return "At least 10 words required";
    return "";
  },
  description_en: (v) => {
    if (!v.trim()) return "English description is required";
    if (!noArabicRe.test(v)) return "Must be in English (no Arabic characters)";
    if (v.trim().split(/\s+/).length < 10) return "At least 10 words required";
    return "";
  },
  originalPrice: (v) => {
    const n = Number(v);
    if (!v || isNaN(n) || n <= 0) return "Enter a valid price greater than 0";
    return "";
  },
  region: (v) => (!v ? "Please select a region" : ""),
  category: (v) => (!v ? "Please select a category" : ""),
  heritageType: (v) =>
    !v ? "Heritage info is required (choose video or text)" : "",
  heritage_video: (v, form) =>
    form.heritageType === "video" && !v && !form.heritage_video_existing
      ? "Please upload an MP4 video file"
      : "",
  heritage_text: (v, form) =>
    form.heritageType === "text" && !v.trim()
      ? "Heritage text is required"
      : "",
};


const urlToFile = async (url) => {
  const res = await fetch(url);
  const blob = await res.blob();
  const filename = url.split("/").pop().split("?")[0] || "image.jpg";
  const mimeType = blob.type || "image/jpeg";
  return new File([blob], filename, { type: mimeType });
};


const SectionTitle = ({ children }) => (
  <div className="flex items-center gap-3 my-6">
    <div className="h-px flex-1 bg-[#D84040]/20" />
    <p className="text-xs font-bold uppercase tracking-widest text-[#8E1616] whitespace-nowrap">
      {children}
    </p>
    <div className="h-px flex-1 bg-[#D84040]/20" />
  </div>
);

const Field = ({ label, error, touched, children }) => (
  <div>
    <label className="block text-sm font-semibold text-[#1D1616] mb-1.5">
      {label}
    </label>
    {children}
    {touched && error && (
      <p className="text-[#D84040] text-xs mt-1 animate-[fadeIn_0.2s_ease]">
        {error}
      </p>
    )}
  </div>
);


const ImageCarousel = ({ images }) => {
  const [current, setCurrent] = useState(0);
  const imgs = [...new Set(images.filter(Boolean))];
  if (imgs.length === 0) return null;

  return (
    <div className="relative w-full h-72 bg-[#1D1616] overflow-hidden rounded-2xl mb-4">
      <img
        src={imgs[current]}
        alt="product"
        className="w-full h-full object-cover opacity-90 transition-all duration-500"
      />
      {imgs.length > 1 && (
        <>
          <button
            onClick={() =>
              setCurrent((i) => (i === 0 ? imgs.length - 1 : i - 1))
            }
            className="absolute left-3 top-1/2 -translate-y-1/2 bg-[#1D1616]/70 hover:bg-[#D84040] text-white rounded-full p-2 transition-colors"
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </button>
          <button
            onClick={() =>
              setCurrent((i) => (i === imgs.length - 1 ? 0 : i + 1))
            }
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-[#1D1616]/70 hover:bg-[#D84040] text-white rounded-full p-2 transition-colors"
          >
            <ChevronRightIcon className="h-5 w-5" />
          </button>
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
            {imgs.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-2 rounded-full transition-all duration-200 ${i === current ? "bg-[#D84040] w-5" : "bg-white/50 w-2"}`}
              />
            ))}
          </div>
          <span className="absolute top-3 right-3 bg-[#1D1616]/70 text-white text-xs px-2.5 py-1 rounded-full">
            {current + 1} / {imgs.length}
          </span>
        </>
      )}
    </div>
  );
};


const AdminProductDetail = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [fetching, setFetching] = useState(true);
  const [actioning, setActioning] = useState(false);

  const [form, setForm] = useState({
    title_ar: "",
    description_ar: "",
    title_en: "",
    description_en: "",
    originalPrice: "",
    region: "",
    category: "",
    heritageType: "",
    heritage_video: null,
    heritage_video_existing: "",
    heritage_text: "",
    existingImages: [],
    newPhotos: [],
    verificationStatus: "pending",
    rejectionMsg: "",
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});


  useEffect(() => {
    const load = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `http://localhost:5000/api/v1/product/${productId}`,
          { headers: { Authorization: token } },
        );
        const data = await res.json();
        const p = data?.data?.product || data?.data || {};

        const regionSlug = (() => {
          const r = p.region;
          if (!r) return "";
          if (typeof r === "object") return r.slugName || r.slug || "";
          return regions.find((x) => x.slug === r)?.slug || r;
        })();

        const categoryVal = (() => {
          const c = p.category;
          if (!c) return "";
          if (typeof c === "object") return c.slug || c.value || "";
          return categories.find((x) => x.value === c)?.value || c;
        })();

        setForm({
          title_ar: p.title_ar || "",
          description_ar: p.description_ar || "",
          title_en: p.title_en || "",
          description_en: p.description_en || "",
          originalPrice: String(p.originalPrice || ""),
          region: regionSlug,
          category: categoryVal,
          heritageType: p.heritage_video
            ? "video"
            : p.heritage_text
              ? "text"
              : "",
          heritage_video: null,
          heritage_video_existing: p.heritage_video || "",
          heritage_text: p.heritage_text || "",
          existingImages: p.productImages || [],
          newPhotos: [],
          verificationStatus: p.verificationStatus || "pending",
          rejectionMsg: p.rejectionMsg || "",
        });
      } catch {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to load product.",
          confirmButtonColor: "#D84040",
        });
      } finally {
        setFetching(false);
      }
    };
    load();
  }, [productId]);

  
  const handleChange = (field, value) => {
    const updatedForm = { ...form, [field]: value };
    setForm(updatedForm);
    setTouched((t) => ({ ...t, [field]: true }));
    if (fieldValidators[field]) {
      setErrors((e) => ({
        ...e,
        [field]: fieldValidators[field](value, updatedForm),
      }));
    }
  };


  const validate = (currentForm = form) => {
    const e = {};
    Object.entries(fieldValidators).forEach(([field, fn]) => {
      const val =
        field === "heritage_video"
          ? currentForm.heritage_video
          : (currentForm[field] ?? "");
      const msg = fn(val, currentForm);
      if (msg) e[field] = msg;
    });
    const total =
      (currentForm.existingImages?.length ?? 0) +
      (currentForm.newPhotos?.length ?? 0);
    if (total === 0) e.photos = "At least one image is required";
    return e;
  };

  const handlePhotoUpload = (e) => {
    const currentTotal = form.existingImages.length + form.newPhotos.length;
    const slots = 5 - currentTotal;
    if (slots <= 0) return;
    const files = Array.from(e.target.files).slice(0, slots);
    const updatedNewPhotos = [...form.newPhotos, ...files];
    setForm((prev) => ({ ...prev, newPhotos: updatedNewPhotos }));
    const newTotal = form.existingImages.length + updatedNewPhotos.length;
    if (newTotal > 0) setErrors((err) => ({ ...err, photos: "" }));
  };

  const totalPhotos = form.existingImages.length + form.newPhotos.length;


  const handleApprove = async () => {
    const allTouched = Object.fromEntries(
      Object.keys(fieldValidators).map((k) => [k, true]),
    );
    setTouched({ ...allTouched, photos: true });

    const e = validate();
    if (Object.keys(e).length > 0) {
      setErrors(e);
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Please fix the highlighted fields before approving.",
        confirmButtonColor: "#D84040",
      });
      return;
    }

    const confirm = await Swal.fire({
      icon: "question",
      title: "Approve Product?",
      text: "Changes will be saved and the product will be published and visible to buyers.",
      showCancelButton: true,
      confirmButtonColor: "#16a34a",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, Approve",
      cancelButtonText: "Cancel",
    });
    if (!confirm.isConfirmed) return;

    try {
      setActioning(true);
      const token = localStorage.getItem("token");

      const fd = new FormData();
      fd.append("title_ar", form.title_ar);
      fd.append("title_en", form.title_en);
      fd.append("description_ar", form.description_ar);
      fd.append("description_en", form.description_en);
      fd.append("originalPrice", form.originalPrice);
      fd.append("region", form.region);
      fd.append("category", form.category);

      if (form.heritageType === "video" && form.heritage_video) {
        fd.append("heritage_video", form.heritage_video);
      }
      if (form.heritageType === "text") {
        fd.append("heritage_text", form.heritage_text);
      }

  
      for (const url of form.existingImages) {
        try {
          const file = await urlToFile(url);
          fd.append("productImages", file);
        } catch {
          console.warn("Could not fetch existing image, skipping:", url);
        }
      }

      form.newPhotos.forEach((file) => fd.append("productImages", file));

      const approveRes = await fetch(
        `http://localhost:5000/api/v1/admin/product/${productId}/approve`,
        {
          method: "PATCH",
          headers: { Authorization: token },
          body: fd,
        },
      );

      const text = await approveRes.text();
      console.log("STATUS:", approveRes.status, "| BODY:", text);

      if (!approveRes.ok) throw new Error(text);

      Swal.fire({
        icon: "success",
        title: "Approved!",
        text: "Product has been saved and is now live.",
        confirmButtonColor: "#16a34a",
      }).then(() => navigate(-1));
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Something went wrong.",
        confirmButtonColor: "#D84040",
      });
    } finally {
      setActioning(false);
    }
  };

  const handleReject = async () => {
    const { value: reason, isConfirmed } = await Swal.fire({
      icon: "warning",
      title: "Reject Product",
      html: `
        <p class="text-gray-500 text-sm mb-4">Please provide a clear rejection reason. The seller will see this message.</p>
        <textarea id="swal-reason" placeholder="Enter rejection reason..." rows="4"
          style="width:100%;border:1px solid #D84040;border-radius:8px;padding:10px;font-size:14px;resize:none;outline:none;"></textarea>
      `,
      showCancelButton: true,
      confirmButtonColor: "#D84040",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Reject Product",
      cancelButtonText: "Cancel",
      preConfirm: () => {
        const val = document.getElementById("swal-reason").value.trim();
        if (!val) {
          Swal.showValidationMessage("Rejection reason cannot be empty");
          return false;
        }
        return val;
      },
    });
    if (!isConfirmed || !reason) return;
    try {
      setActioning(true);
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://localhost:5000/api/v1/admin/product/${productId}/reject`,
        {
          method: "PATCH",
          headers: { Authorization: token, "Content-Type": "application/json" },
          body: JSON.stringify({ rejectionMsg: reason }),
        },
      );
      if (!res.ok) throw new Error();
      Swal.fire({
        icon: "info",
        title: "Rejected",
        text: "Product has been rejected and the seller has been notified.",
        confirmButtonColor: "#D84040",
      }).then(() => navigate(-1));
    } catch {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to reject product.",
        confirmButtonColor: "#D84040",
      });
    } finally {
      setActioning(false);
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

  const statusBadge =
    {
      pending: "bg-amber-100 text-amber-800 border-amber-300",
      accepted: "bg-green-100 text-green-800 border-green-300",
      rejected: "bg-red-100 text-[#D84040] border-[#D84040]/40",
    }[form.verificationStatus] ||
    "bg-amber-100 text-amber-800 border-amber-300";

  const statusLabel =
    { pending: "Pending", accepted: "Approved", rejected: "Rejected" }[
      form.verificationStatus
    ] || "Pending";

  const statusDot =
    {
      pending: "bg-amber-500",
      accepted: "bg-green-500",
      rejected: "bg-[#D84040]",
    }[form.verificationStatus] || "bg-amber-500";

  return (
    <div
      className="min-h-screen w-full"
      style={{
        backgroundColor: "#EEEEEE",
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23D84040' fill-opacity='0.08'%3E%3Cpath d='M30 0l5 10h10l-8 6 3 10-10-7-10 7 3-10-8-6h10z'/%3E%3C/g%3E%3C/svg%3E")`,
      }}
    >
      <div className="max-w-3xl mx-auto px-4 py-10">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-sm text-[#8E1616] hover:text-[#D84040] mb-6 transition-colors font-semibold"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back to Products
        </button>

        <Card className="shadow-2xl rounded-2xl overflow-hidden">
          <CardBody className="p-8 md:p-10">
            {/* ── Page Header ── */}
            <div className="flex items-start justify-between mb-6 gap-4 flex-wrap">
              <div>
                <Typography
                  variant="h2"
                  className="text-3xl font-serif"
                  style={{ color: "#1D1616" }}
                >
                  Product Review
                </Typography>
                <p className="text-gray-500 text-sm mt-1">
                  Review, edit, then approve or reject this product
                </p>
              </div>
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${statusBadge}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${statusDot}`} />
                {statusLabel}
              </span>
            </div>

            {/* ── Images carousel ── */}
            <ImageCarousel images={form.existingImages} />

            {/* ── Photo manager ── */}
            <div className="mb-2">
              <label className="block text-sm font-semibold text-[#1D1616] mb-2">
                Product Images (1–5)
              </label>

              {(form.existingImages.length > 0 ||
                form.newPhotos.length > 0) && (
                <div className="grid grid-cols-5 gap-2 mb-3">
                  {form.existingImages.map((url, i) => (
                    <div key={`ex-${i}`} className="relative group">
                      <img
                        src={url}
                        alt=""
                        className="w-full h-16 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const updated = form.existingImages.filter(
                            (_, j) => j !== i,
                          );
                          setForm((p) => ({ ...p, existingImages: updated }));
                          const total = updated.length + form.newPhotos.length;
                          setErrors((err) => ({
                            ...err,
                            photos:
                              total === 0
                                ? "At least one image is required"
                                : "",
                          }));
                        }}
                        className="absolute -top-1.5 -right-1.5 bg-[#D84040] text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs"
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
                        className="w-full h-16 object-cover rounded-lg ring-2 ring-[#D84040]"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const updated = form.newPhotos.filter(
                            (_, j) => j !== i,
                          );
                          setForm((p) => ({ ...p, newPhotos: updated }));
                          const total =
                            form.existingImages.length + updated.length;
                          setErrors((err) => ({
                            ...err,
                            photos:
                              total === 0
                                ? "At least one image is required"
                                : "",
                          }));
                        }}
                        className="absolute -top-1.5 -right-1.5 bg-[#D84040] text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {totalPhotos < 5 && (
                <label className="block w-full p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#D84040] transition-colors cursor-pointer text-center">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                  <PhotoIcon
                    className="h-6 w-6 mx-auto mb-1"
                    style={{ color: "#8E1616" }}
                  />
                  <span className="text-xs text-gray-500">
                    Click to add images ({totalPhotos}/5)
                  </span>
                </label>
              )}

              {touched.photos && errors.photos && (
                <p className="text-[#D84040] text-xs mt-1 animate-[fadeIn_0.2s_ease]">
                  {errors.photos}
                </p>
              )}
            </div>

            {/* ── Arabic Content ── */}
            <SectionTitle>Arabic Content</SectionTitle>
            <div className="space-y-4" dir="rtl">
              <Field
                label="العنوان بالعربية"
                error={errors.title_ar}
                touched={touched.title_ar}
              >
                <Input
                  value={form.title_ar}
                  onChange={(e) => handleChange("title_ar", e.target.value)}
                  placeholder="أدخل العنوان بالعربية"
                  className={`focus:!border-[#D84040] !text-right ${touched.title_ar && errors.title_ar ? "border-red-500" : ""}`}
                />
              </Field>
              <Field
                label="الوصف بالعربية"
                error={errors.description_ar}
                touched={touched.description_ar}
              >
                <textarea
                  value={form.description_ar}
                  onChange={(e) =>
                    handleChange("description_ar", e.target.value)
                  }
                  placeholder="أدخل الوصف بالعربية"
                  rows={4}
                  className={`w-full border p-3 rounded-md focus:outline-none focus:border-[#D84040] text-right text-sm ${touched.description_ar && errors.description_ar ? "border-red-500" : "border-gray-300"}`}
                />
              </Field>
            </div>

            {/* ── English Content ── */}
            <SectionTitle>English Content</SectionTitle>
            <div className="space-y-4">
              <Field
                label="Title (English)"
                error={errors.title_en}
                touched={touched.title_en}
              >
                <Input
                  value={form.title_en}
                  onChange={(e) => handleChange("title_en", e.target.value)}
                  placeholder="Enter title in English"
                  className={`focus:!border-[#D84040] ${touched.title_en && errors.title_en ? "border-red-500" : ""}`}
                />
              </Field>
              <Field
                label="Description (English)"
                error={errors.description_en}
                touched={touched.description_en}
              >
                <textarea
                  value={form.description_en}
                  onChange={(e) =>
                    handleChange("description_en", e.target.value)
                  }
                  placeholder="Enter description in English"
                  rows={4}
                  className={`w-full border p-3 rounded-md focus:outline-none focus:border-[#D84040] text-sm ${touched.description_en && errors.description_en ? "border-red-500" : "border-gray-300"}`}
                />
              </Field>
            </div>

            {/* ── Product Details ── */}
            <SectionTitle>Product Details</SectionTitle>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Field
                label="Price (EGP)"
                error={errors.originalPrice}
                touched={touched.originalPrice}
              >
                <Input
                  type="number"
                  value={form.originalPrice}
                  onChange={(e) =>
                    handleChange("originalPrice", e.target.value)
                  }
                  placeholder="0.00"
                  className={`focus:!border-[#D84040] ${touched.originalPrice && errors.originalPrice ? "border-red-500" : ""}`}
                />
              </Field>
              <Field
                label="Region"
                error={errors.region}
                touched={touched.region}
              >
                <select
                  value={form.region}
                  onChange={(e) => handleChange("region", e.target.value)}
                  className={`w-full border p-3 rounded-md focus:outline-none focus:border-[#D84040] text-sm bg-white ${touched.region && errors.region ? "border-red-500" : "border-gray-300"}`}
                >
                  <option value="">Select region</option>
                  {regions.map((r) => (
                    <option key={r.id} value={r.slug}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </Field>
              <Field
                label="Category"
                error={errors.category}
                touched={touched.category}
              >
                <select
                  value={form.category}
                  onChange={(e) => handleChange("category", e.target.value)}
                  className={`w-full border p-3 rounded-md focus:outline-none focus:border-[#D84040] text-sm bg-white ${touched.category && errors.category ? "border-red-500" : "border-gray-300"}`}
                >
                  <option value="">Select category</option>
                  {categories.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            {/* ── Heritage ── */}
            <SectionTitle>Heritage Information</SectionTitle>
            <div className="space-y-4">
              <div className="bg-[#EEEEEE] rounded-xl p-4">
                <p className="text-sm font-semibold text-[#1D1616] mb-3">
                  Heritage Type <span className="text-[#D84040]">*</span>
                </p>
                <div className="flex gap-6 flex-wrap">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="radio"
                      name="heritageType"
                      value="video"
                      checked={form.heritageType === "video"}
                      onChange={() => {
                        handleChange("heritageType", "video");
                        setForm((p) => ({
                          ...p,
                          heritageType: "video",
                          heritage_text: "",
                        }));
                        setErrors((e) => ({ ...e, heritage_text: "" }));
                      }}
                      className="accent-[#D84040] w-4 h-4"
                    />
                    <div className="flex items-center gap-1.5">
                      <FilmIcon className="h-4 w-4 text-[#D84040]" />
                      <span className="text-sm text-[#1D1616] font-medium">
                        Heritage Video
                      </span>
                    </div>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="radio"
                      name="heritageType"
                      value="text"
                      checked={form.heritageType === "text"}
                      onChange={() => {
                        handleChange("heritageType", "text");
                        setForm((p) => ({
                          ...p,
                          heritageType: "text",
                          heritage_video: null,
                          heritage_video_existing: "",
                        }));
                        setErrors((e) => ({ ...e, heritage_video: "" }));
                      }}
                      className="accent-[#D84040] w-4 h-4"
                    />
                    <div className="flex items-center gap-1.5">
                      <DocumentTextIcon className="h-4 w-4 text-[#D84040]" />
                      <span className="text-sm text-[#1D1616] font-medium">
                        Heritage Text
                      </span>
                    </div>
                  </label>
                </div>
                {touched.heritageType && errors.heritageType && (
                  <p className="text-[#D84040] text-xs mt-2 animate-[fadeIn_0.2s_ease]">
                    {errors.heritageType}
                  </p>
                )}
              </div>

              {form.heritageType === "video" && (
                <Field
                  label="Heritage Video (MP4)"
                  error={errors.heritage_video}
                  touched={touched.heritage_video}
                >
                  {form.heritage_video_existing && !form.heritage_video && (
                    <div className="mb-3">
                      <p className="text-xs text-gray-500 mb-1">
                        Current video:
                      </p>
                      <video
                        src={form.heritage_video_existing}
                        controls
                        className="w-full rounded-xl max-h-52 bg-black"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setForm((p) => ({
                            ...p,
                            heritage_video_existing: "",
                          }))
                        }
                        className="mt-1.5 text-xs text-[#D84040] hover:underline"
                      >
                        Remove &amp; upload a new video
                      </button>
                    </div>
                  )}
                  {form.heritage_video && (
                    <div className="mb-3">
                      <p className="text-xs text-gray-500 mb-1">
                        New video selected:
                      </p>
                      <video
                        src={URL.createObjectURL(form.heritage_video)}
                        controls
                        className="w-full rounded-xl max-h-52 bg-black"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setForm((p) => ({ ...p, heritage_video: null }))
                        }
                        className="mt-1.5 text-xs text-[#D84040] hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                  {!form.heritage_video_existing && !form.heritage_video && (
                    <label className="block w-full p-5 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#D84040] transition-colors cursor-pointer text-center">
                      <input
                        type="file"
                        accept="video/mp4,video/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleChange("heritage_video", file);
                        }}
                        className="hidden"
                      />
                      <FilmIcon className="h-7 w-7 mx-auto mb-1.5 text-[#8E1616]" />
                      <span className="text-xs text-gray-500">
                        Click to upload an MP4 video file
                      </span>
                    </label>
                  )}
                </Field>
              )}

              {form.heritageType === "text" && (
                <Field
                  label="Heritage Text"
                  error={errors.heritage_text}
                  touched={touched.heritage_text}
                >
                  <div className="relative">
                    <DocumentTextIcon className="h-4 w-4 text-[#D84040] absolute top-3 left-3 pointer-events-none" />
                    <textarea
                      value={form.heritage_text}
                      onChange={(e) =>
                        handleChange("heritage_text", e.target.value)
                      }
                      placeholder="Describe the heritage and cultural significance of this product..."
                      rows={5}
                      className={`w-full border p-3 pl-9 rounded-md focus:outline-none focus:border-[#D84040] text-sm ${touched.heritage_text && errors.heritage_text ? "border-red-500" : "border-gray-300"}`}
                    />
                  </div>
                </Field>
              )}
            </div>

            {/* ── Previous rejection reason ── */}
            {form.verificationStatus === "rejected" && form.rejectionMsg && (
              <div className="mt-4 p-4 bg-red-50 border border-[#D84040]/30 rounded-xl">
                <p className="text-xs font-bold uppercase tracking-wide text-[#D84040] mb-1">
                  Previous Rejection Reason
                </p>
                <p className="text-sm text-[#1D1616]">{form.rejectionMsg}</p>
              </div>
            )}

            {/* ── Action Buttons ── */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Button
                onClick={handleApprove}
                disabled={actioning}
                className="flex items-center justify-center gap-2 rounded-xl py-3 normal-case text-sm font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 bg-green-600"
              >
                <CheckCircleIcon className="h-4 w-4" />
                {actioning ? "Processing..." : "Approve"}
              </Button>
              <Button
                onClick={handleReject}
                disabled={actioning}
                className="flex items-center justify-center gap-2 rounded-xl py-3 normal-case text-sm font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                style={{ backgroundColor: "#D84040" }}
              >
                <XCircleIcon className="h-4 w-4" />
                {actioning ? "Processing..." : "Reject"}
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default AdminProductDetail;
