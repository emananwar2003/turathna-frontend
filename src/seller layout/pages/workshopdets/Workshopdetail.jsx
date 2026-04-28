import React, { useState, useEffect } from "react";
import { Card, CardBody, Input, Typography } from "@material-tailwind/react";
import {
  ArrowRightIcon,
  CalendarDaysIcon,
  ClockIcon,
  UsersIcon,
  GlobeAltIcon,
  MapPinIcon,
  ClockIcon as PendingIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import Swal from "sweetalert2";
import { useParams, useNavigate } from "react-router-dom";

const statusConfig = {
  pending: {
    label: "قيد المراجعة",
    bg: "bg-amber-100",
    text: "text-amber-800",
    border: "border-amber-300",
    dot: "bg-amber-500",
  },
  accepted: {
    label: "مقبول",
    bg: "bg-green-100",
    text: "text-green-800",
    border: "border-green-300",
    dot: "bg-green-500",
  },
  rejected: {
    label: "مرفوض",
    bg: "bg-red-100",
    text: "text-[#D84040]",
    border: "border-[#D84040]/40",
    dot: "bg-[#D84040]",
  },
};

// Read-only field wrapper
const ReadField = ({ label, children }) => (
  <div>
    <label className="block text-sm text-[#2B0B0B] mb-1">{label}</label>
    {children}
  </div>
);

// Read-only styled input
const ReadInput = ({ value, placeholder = "—" }) => (
  <div className="w-full border border-gray-200 bg-gray-50 p-3 rounded-md text-right text-sm text-gray-700 min-h-[44px]">
    {value || placeholder}
  </div>
);

const WorkshopDetail = () => {
  const { workshopId } = useParams();
  const navigate = useNavigate();
  const [workshop, setWorkshop] = useState(null);
  const [loading, setLoading] = useState(true);

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
        console.log("📦 Workshop Detail:", data);
        setWorkshop(data?.data?.workshop || data?.data || null);
      } catch {
        Swal.fire({
          icon: "error",
          title: "خطأ",
          text: "تعذّر تحميل بيانات الورشة.",
          confirmButtonColor: "#D84040",
        });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [workshopId]);

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "#EEEEEE" }}
      >
        <div className="animate-spin rounded-full h-14 w-14 border-4 border-[#D84040] border-t-transparent" />
      </div>
    );
  }

  if (!workshop) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "#EEEEEE" }}
      >
        <p className="text-gray-500 text-lg font-[Tajawal]">
          لم يتم العثور على الورشة
        </p>
      </div>
    );
  }

  const status =
    statusConfig[workshop.verificationStatus] || statusConfig.pending;
  const formattedDate = workshop.date
    ? new Date(workshop.date).toLocaleDateString("ar-EG", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "—";

  const formattedTime = (() => {
    if (!workshop.time) return "—";
    const [hourStr, minuteStr] = workshop.time.split(":");
    const hour = parseInt(hourStr, 10);
    const minute = minuteStr || "00";
    const period = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 === 0 ? 12 : hour % 12;
    return hour12 + ":" + minute + " " + period;
  })();

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
            {/* Back */}
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-1 text-sm text-[#8E1616] hover:text-[#D84040] mb-4 transition-colors"
            >
              <ArrowRightIcon className="h-4 w-4" />
              رجوع
            </button>

            {/* Title */}
            <Typography
              variant="h1"
              className="text-4xl font-serif mb-2 text-center "
              style={{ color: "#1D1616" }}
            >
              تفاصيل الورشة
            </Typography>

            {/* Status badge */}
            <div className="flex justify-center mb-6">
              <span
                className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold border ${status.bg} ${status.text} ${status.border}`}
              >
                <span className={`w-2 h-2 rounded-full ${status.dot}`} />
                {status.label}
              </span>
            </div>

            {/* Rejection reason */}
            {workshop.verificationStatus === "rejected" &&
              workshop.rejectionMsg && (
                <div className="mb-6 p-4 bg-red-50 border border-[#D84040]/30 rounded-xl">
                  <p className="text-xs font-bold uppercase tracking-wide text-[#D84040] mb-1">
                    سبب الرفض
                  </p>
                  <p className="text-sm text-[#1D1616]">
                    {workshop.rejectionMsg}
                  </p>
                </div>
              )}

            <div className="space-y-5">
              {/* Cover Image */}
              {workshop.coverImage && (
                <div className="w-full h-52 rounded-xl overflow-hidden">
                  <img
                    src={workshop.coverImage}
                    alt={workshop.title_ar}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Title */}
              <ReadField label="عنوان الورشة">
                <ReadInput value={workshop.title_ar} />
              </ReadField>

              {/* Description */}
              <ReadField label="وصف الورشة">
                <div className="w-full border border-gray-200 bg-gray-50 p-3 rounded-md text-right text-sm text-gray-700 min-h-[100px] leading-relaxed">
                  {workshop.description_ar || "—"}
                </div>
              </ReadField>

              {/* Price */}
              <ReadField label="السعر">
                <div className="w-full border border-gray-200 bg-gray-50 p-3 rounded-md text-right text-sm text-[#D84040] font-bold">
                  {workshop.originalPrice} ج.م
                </div>
              </ReadField>

              {/* Date + Time */}
              <div className="grid grid-cols-2 gap-4">
                <ReadField label="التاريخ">
                  <div className="w-full border border-gray-200 bg-gray-50 p-3 rounded-md text-right text-sm text-gray-700 flex items-center gap-2">
                    <CalendarDaysIcon className="h-4 w-4 text-[#D84040] shrink-0" />
                    {formattedDate}
                  </div>
                </ReadField>
                <ReadField label="الوقت">
                  <div className="w-full border border-gray-200 bg-gray-50 p-3 rounded-md text-right text-sm text-gray-700 flex items-center gap-2">
                    <ClockIcon className="h-4 w-4 text-[#D84040] shrink-0" />
                    {formattedTime}
                  </div>
                </ReadField>
              </div>

              {/* Seats */}
              <ReadField label="عدد المقاعد">
                <div className="w-full border border-gray-200 bg-gray-50 p-3 rounded-md text-right text-sm text-gray-700 flex items-center gap-2">
                  <UsersIcon className="h-4 w-4 text-[#D84040] shrink-0" />
                  {workshop.seats} مقعد
                </div>
              </ReadField>

              {/* Type */}
              <ReadField label="نوع الورشة">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-2">
                  <div
                    className={`flex items-center gap-2 text-sm ${workshop.workshopOnline ? "text-[#1D1616]" : "text-gray-400"}`}
                  >
                    <GlobeAltIcon
                      className={`h-4 w-4 ${workshop.workshopOnline ? "text-[#D84040]" : "text-gray-300"}`}
                    />
                    ورشة إلكترونية (أونلاين)
                    {workshop.workshopOnline && (
                      <CheckCircleIcon className="h-4 w-4 text-green-500 mr-auto" />
                    )}
                  </div>
                  <div
                    className={`flex items-center gap-2 text-sm ${workshop.workshopOffline ? "text-[#1D1616]" : "text-gray-400"}`}
                  >
                    <MapPinIcon
                      className={`h-4 w-4 ${workshop.workshopOffline ? "text-[#D84040]" : "text-gray-300"}`}
                    />
                    ورشة حضورية (أوفلاين)
                    {workshop.workshopOffline && (
                      <CheckCircleIcon className="h-4 w-4 text-green-500 mr-auto" />
                    )}
                  </div>
                </div>
              </ReadField>

              {/* Link */}
              {workshop.workshopOnline && workshop.workshopLink && (
                <ReadField label="رابط الورشة الإلكترونية">
                  <div className="w-full border border-gray-200 bg-gray-50 p-3 rounded-md text-right text-sm flex items-center gap-2">
                    <GlobeAltIcon className="h-4 w-4 text-[#D84040] shrink-0" />
                    <a
                      href={workshop.workshopLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#D84040] underline break-all"
                    >
                      {workshop.workshopLink}
                    </a>
                  </div>
                </ReadField>
              )}

              {/* Address */}
              {workshop.workshopOffline && workshop.workshopAddress && (
                <ReadField label="عنوان الورشة الحضورية">
                  <div className="w-full border border-gray-200 bg-gray-50 p-3 rounded-md text-right text-sm text-gray-700 flex items-center gap-2">
                    <MapPinIcon className="h-4 w-4 text-[#D84040] shrink-0" />
                    {workshop.workshopAddress}
                  </div>
                </ReadField>
              )}
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default WorkshopDetail;
