import React, { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  Input,
  Button,
  Typography,
} from "@material-tailwind/react";
import {
  ArrowLeftIcon,
  CheckCircleIcon,
  XCircleIcon,
  GlobeAltIcon,
  MapPinIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import Swal from "sweetalert2";
import { useParams, useNavigate } from "react-router-dom";

const SectionTitle = ({ children }) => (
  <div className="flex items-center gap-3 my-6">
    <div className="h-px flex-1 bg-[#D84040]/20" />
    <p className="text-xs font-bold uppercase tracking-widest text-[#8E1616] whitespace-nowrap">
      {children}
    </p>
    <div className="h-px flex-1 bg-[#D84040]/20" />
  </div>
);

const Field = ({ label, error, children }) => (
  <div>
    <label className="block text-sm font-semibold text-[#1D1616] mb-1.5">
      {label}
    </label>
    {children}
    {error && <p className="text-[#D84040] text-xs mt-1">{error}</p>}
  </div>
);

const formatTime = (time) => {
  if (!time) return "—";
  const [h, m] = time.split(":");
  const hour = parseInt(h, 10);
  const period = hour >= 12 ? "PM" : "AM";
  const h12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${h12}:${m || "00"} ${period}`;
};

const arabicRe = /^[\u0600-\u06FF0-9\s.,!?()]+$/;
const noArabicRe = /^[^\u0600-\u06FF]+$/;

const Workshopdets = () => {
  const { workshopId } = useParams();
  const navigate = useNavigate();
  const [fetching, setFetching] = useState(true);
  const [actioning, setActioning] = useState(false);

  const [form, setForm] = useState({
    title_ar: "",
    title_en: "",
    description_ar: "",
    description_en: "",
    originalPrice: "",
    date: "",
    time: "",
    seats: "",
    isOnline: false,
    isOffline: false,
    link: "",
    address: "",
    coverImage: "",
    verificationStatus: "pending",
    rejectionMsg: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const load = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `http://localhost:5000/api/v1/workshop/${workshopId}`,
          {
            headers: { Authorization: token },
          },
        );
        const data = await res.json();
        const w = data?.data?.workshop || data?.data || {};

        setForm({
          title_ar: w.title_ar || "",
          title_en: w.title_en || "",
          description_ar: w.description_ar || "",
          description_en: w.description_en || "",
          originalPrice: String(w.originalPrice || ""),
          date: w.date ? w.date.split("T")[0] : "",
          time: w.time || "",
          seats: String(w.seats || ""),
          isOnline: w.workshopOnline || false,
          isOffline: w.workshopOffline || false,
          link: w.workshopLink || "",
          address: w.workshopAddress || "",
          coverImage: w.coverImage || w.workshopImages?.[0] || "",
          verificationStatus: w.verificationStatus || "pending",
          rejectionMsg: w.rejectionMsg || "",
        });
      } catch {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to load workshop.",
          confirmButtonColor: "#D84040",
        });
      } finally {
        setFetching(false);
      }
    };
    load();
  }, [workshopId]);

  const validate = () => {
    const e = {};
    if (!form.title_ar.trim()) e.title_ar = "Arabic title is required";
    else if (!arabicRe.test(form.title_ar)) e.title_ar = "Must be Arabic only";
    else if (form.title_ar.trim().split(/\s+/).length < 2)
      e.title_ar = "At least 2 words";

    if (!form.title_en.trim()) e.title_en = "English title is required";
    else if (!noArabicRe.test(form.title_en))
      e.title_en = "Must be English only";
    else if (form.title_en.trim().split(/\s+/).length < 2)
      e.title_en = "At least 2 words";

    if (!form.description_ar.trim())
      e.description_ar = "Arabic description is required";
    else if (!arabicRe.test(form.description_ar))
      e.description_ar = "Must be Arabic only";
    else if (form.description_ar.trim().split(/\s+/).length < 10)
      e.description_ar = "At least 10 words";

    if (!form.description_en.trim())
      e.description_en = "English description is required";
    else if (!noArabicRe.test(form.description_en))
      e.description_en = "Must be English only";
    else if (form.description_en.trim().split(/\s+/).length < 10)
      e.description_en = "At least 10 words";

    const price = Number(form.originalPrice);
    if (!form.originalPrice || isNaN(price) || price <= 0)
      e.originalPrice = "Enter a valid price greater than 0";
    if (!form.date) e.date = "Date is required";
    const seats = Number(form.seats);
    if (!form.seats || isNaN(seats) || seats <= 0)
      e.seats = "Enter a valid number of seats";
    if (!form.isOnline && !form.isOffline)
      e.type = "Select at least one workshop type";
    if (form.isOnline && !form.link.trim()) e.link = "Online link is required";
    if (form.isOffline && !form.address.trim())
      e.address = "Address is required";
    return e;
  };

  const handleChange = (field, value) => {
    setForm((p) => ({ ...p, [field]: value }));
    setErrors((p) => ({ ...p, [field]: "" }));
  };

  const handleApprove = async () => {
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
      title: "Approve Workshop?",
      text: "This workshop will be published and visible to buyers.",
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
      fd.append("date", form.date);
      fd.append("time", form.time);
      fd.append("seats", form.seats);
      fd.append("workshopOnline", form.isOnline);
      fd.append("workshopOffline", form.isOffline);
      if (form.isOnline) fd.append("workshopLink", form.link);
      if (form.isOffline) fd.append("workshopAddress", form.address);

      const res = await fetch(
        `http://localhost:5000/api/v1/admin/workshop/${workshopId}/approve`,
        {
          method: "PATCH",
          headers: { Authorization: token },
          body: fd,
        },
      );
      if (!res.ok) throw new Error();
      Swal.fire({
        icon: "success",
        title: "Approved!",
        text: "Workshop is now live.",
        confirmButtonColor: "#16a34a",
      }).then(() => navigate(-1));
    } catch {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to approve workshop.",
        confirmButtonColor: "#D84040",
      });
    } finally {
      setActioning(false);
    }
  };

  const handleReject = async () => {
    const { value: reason, isConfirmed } = await Swal.fire({
      icon: "warning",
      title: "Reject Workshop",
      html: `
        <p class="text-gray-500 text-sm mb-4">Please provide a clear rejection reason. The seller will see this message.</p>
        <textarea id="swal-reason" placeholder="Enter rejection reason..." rows="4"
          style="width:100%;border:1px solid #D84040;border-radius:8px;padding:10px;font-size:14px;resize:none;outline:none;"></textarea>
      `,
      showCancelButton: true,
      confirmButtonColor: "#D84040",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Reject Workshop",
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
        `http://localhost:5000/api/v1/admin/workshop/${workshopId}/reject`,
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
        text: "Workshop has been rejected and the seller has been notified.",
        confirmButtonColor: "#D84040",
      }).then(() => navigate(-1));
    } catch {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to reject workshop.",
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
  const today = new Date().toISOString().split("T")[0];

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
          Back to Workshops
        </button>

        <Card className="shadow-2xl rounded-2xl overflow-hidden">
          <CardBody className="p-8 md:p-10">
            {/* Header */}
            <div className="flex items-start justify-between mb-6 gap-4 flex-wrap">
              <div>
                <Typography
                  variant="h2"
                  className="text-3xl font-serif"
                  style={{ color: "#1D1616" }}
                >
                  Workshop Review
                </Typography>
                <p className="text-gray-500 text-sm mt-1">
                  Review, edit, then approve or reject this workshop
                </p>
              </div>
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${statusBadge}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${statusDot}`} />
                {statusLabel}
              </span>
            </div>

            {/* Cover Image — display only */}
            {form.coverImage && (
              <div className="w-full h-64 overflow-hidden rounded-2xl mb-6">
                <img
                  src={form.coverImage}
                  alt="workshop cover"
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Arabic Content */}
            <SectionTitle>Arabic Content</SectionTitle>
            <div className="space-y-4" dir="rtl">
              <Field label="العنوان بالعربية" error={errors.title_ar}>
                <Input
                  value={form.title_ar}
                  onChange={(e) => handleChange("title_ar", e.target.value)}
                  placeholder="أدخل العنوان بالعربية"
                  className={`focus:!border-[#D84040] !text-right ${errors.title_ar ? "border-red-500" : ""}`}
                />
              </Field>
              <Field label="الوصف بالعربية" error={errors.description_ar}>
                <textarea
                  value={form.description_ar}
                  onChange={(e) =>
                    handleChange("description_ar", e.target.value)
                  }
                  placeholder="أدخل الوصف بالعربية"
                  rows={4}
                  className={`w-full border p-3 rounded-md focus:outline-none focus:border-[#D84040] text-right text-sm ${errors.description_ar ? "border-red-500" : "border-gray-300"}`}
                />
              </Field>
            </div>

            {/* English Content */}
            <SectionTitle>English Content</SectionTitle>
            <div className="space-y-4">
              <Field label="Title (English)" error={errors.title_en}>
                <Input
                  value={form.title_en}
                  onChange={(e) => handleChange("title_en", e.target.value)}
                  placeholder="Enter title in English"
                  className={`focus:!border-[#D84040] ${errors.title_en ? "border-red-500" : ""}`}
                />
              </Field>
              <Field
                label="Description (English)"
                error={errors.description_en}
              >
                <textarea
                  value={form.description_en}
                  onChange={(e) =>
                    handleChange("description_en", e.target.value)
                  }
                  placeholder="Enter description in English"
                  rows={4}
                  className={`w-full border p-3 rounded-md focus:outline-none focus:border-[#D84040] text-sm ${errors.description_en ? "border-red-500" : "border-gray-300"}`}
                />
              </Field>
            </div>

            {/* Workshop Details */}
            <SectionTitle>Workshop Details</SectionTitle>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Price (EGP)" error={errors.originalPrice}>
                <Input
                  type="number"
                  value={form.originalPrice}
                  onChange={(e) =>
                    handleChange("originalPrice", e.target.value)
                  }
                  placeholder="0.00"
                  className={`focus:!border-[#D84040] ${errors.originalPrice ? "border-red-500" : ""}`}
                />
              </Field>
              <Field label="Seats" error={errors.seats}>
                <Input
                  type="number"
                  value={form.seats}
                  onChange={(e) => handleChange("seats", e.target.value)}
                  placeholder="Number of seats"
                  className={`focus:!border-[#D84040] ${errors.seats ? "border-red-500" : ""}`}
                />
              </Field>
              <Field label="Date" error={errors.date}>
                <input
                  type="date"
                  min={today}
                  value={form.date}
                  onChange={(e) => handleChange("date", e.target.value)}
                  className={`w-full border p-3 rounded-md focus:outline-none focus:border-[#D84040] text-sm ${errors.date ? "border-red-500" : "border-gray-300"}`}
                />
              </Field>
              <Field label="Time">
                <div className="w-full border border-gray-200 bg-gray-50 p-3 rounded-md text-sm text-gray-700 flex items-center gap-2">
                  <ClockIcon className="h-4 w-4 text-[#D84040] shrink-0" />
                  {formatTime(form.time)}
                </div>
              </Field>
            </div>

            {/* Workshop Type */}
            <SectionTitle>Workshop Type</SectionTitle>
            <div className="bg-[#EEEEEE] rounded-xl p-4 space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isOnline}
                  onChange={(e) => {
                    handleChange("isOnline", e.target.checked);
                    if (!e.target.checked) handleChange("link", "");
                  }}
                  className="w-4 h-4 accent-[#D84040]"
                />
                <GlobeAltIcon className="h-4 w-4 text-[#D84040]" />
                <span className="text-sm text-[#1D1616] font-medium">
                  Online Workshop
                </span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isOffline}
                  onChange={(e) => {
                    handleChange("isOffline", e.target.checked);
                    if (!e.target.checked) handleChange("address", "");
                  }}
                  className="w-4 h-4 accent-[#D84040]"
                />
                <MapPinIcon className="h-4 w-4 text-[#D84040]" />
                <span className="text-sm text-[#1D1616] font-medium">
                  In-person Workshop
                </span>
              </label>
              {errors.type && (
                <p className="text-[#D84040] text-xs">{errors.type}</p>
              )}
            </div>

            {form.isOnline && (
              <div className="mt-4">
                <Field label="Online Workshop Link" error={errors.link}>
                  <Input
                    type="url"
                    value={form.link}
                    onChange={(e) => handleChange("link", e.target.value)}
                    placeholder="https://zoom.com/..."
                    className={`focus:!border-[#D84040] ${errors.link ? "border-red-500" : ""}`}
                  />
                </Field>
              </div>
            )}

            {form.isOffline && (
              <div className="mt-4">
                <Field label="Workshop Address" error={errors.address}>
                  <Input
                    type="text"
                    value={form.address}
                    onChange={(e) => handleChange("address", e.target.value)}
                    placeholder="Enter venue address"
                    className={`focus:!border-[#D84040] ${errors.address ? "border-red-500" : ""}`}
                  />
                </Field>
              </div>
            )}

            {/* Previous rejection reason */}
            {form.verificationStatus === "rejected" && form.rejectionMsg && (
              <div className="mt-6 p-4 bg-red-50 border border-[#D84040]/30 rounded-xl">
                <p className="text-xs font-bold uppercase tracking-wide text-[#D84040] mb-1">
                  Previous Rejection Reason
                </p>
                <p className="text-sm text-[#1D1616]">{form.rejectionMsg}</p>
              </div>
            )}

            {/* Action Buttons */}
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

export default Workshopdets;
