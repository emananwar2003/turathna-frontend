import React, { useState, useEffect } from "react";
import { Card, CardBody, Typography, Button } from "@material-tailwind/react";
import {
  TrashIcon,
  EyeIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  CalendarDaysIcon,
  ClockIcon as TimeIcon,
  UsersIcon,
  GlobeAltIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const statusConfig = {
  pending: {
    label: "قيد المراجعة",
    bg: "bg-amber-100",
    text: "text-amber-800",
    border: "border-amber-300",
    dot: "bg-amber-500",
    icon: <ClockIcon className="h-4 w-4" />,
  },
  accepted: {
    label: "مقبول",
    bg: "bg-green-100",
    text: "text-green-800",
    border: "border-green-300",
    dot: "bg-green-500",
    icon: <CheckCircleIcon className="h-4 w-4" />,
  },
  rejected: {
    label: "مرفوض",
    bg: "bg-red-100",
    text: "text-[#D84040]",
    border: "border-[#D84040]/40",
    dot: "bg-[#D84040]",
    icon: <XCircleIcon className="h-4 w-4" />,
  },
};

const WorkshopCard = ({ workshop, onDelete }) => {
  const navigate = useNavigate();
  const status =
    statusConfig[workshop.verificationStatus] || statusConfig.pending;

  const handleStatusClick = () => {
    Swal.fire({
      icon:
        workshop.verificationStatus === "accepted"
          ? "success"
          : workshop.verificationStatus === "rejected"
            ? "error"
            : "info",
      title: status.label,
      text:
        workshop.verificationStatus === "pending"
          ? "ورشتك قيد التقييم من قِبَل الإدارة، يرجى الانتظار."
          : workshop.verificationStatus === "accepted"
            ? "تهانينا! تم قبول ورشتك وهي متاحة الآن."
            : `سبب الرفض: ${workshop.rejectionMsg || "تم رفض الورشة من قِبَل الإدارة."}`,
      confirmButtonColor: "#D84040",
      confirmButtonText: "حسناً",
    });
  };

  const handleDelete = () => {
    Swal.fire({
      icon: "warning",
      title: "هل أنت متأكد؟",
      text: "سيتم حذف الورشة نهائياً ولا يمكن التراجع.",
      showCancelButton: true,
      confirmButtonColor: "#D84040",
      cancelButtonColor: "#8E1616",
      confirmButtonText: "نعم، احذف",
      cancelButtonText: "إلغاء",
    }).then(async (result) => {
      if (!result.isConfirmed) return;
      try {
        const token = localStorage.getItem("token");
        const sellerId = localStorage.getItem("id");
        const res = await fetch(
          `http://localhost:5000/api/v1/workshop/seller/${sellerId}/${workshop._id}`,
          { method: "DELETE", headers: { Authorization: token } },
        );
        if (!res.ok) throw new Error();
        Swal.fire({
          icon: "success",
          title: "تم الحذف",
          text: "تم حذف الورشة بنجاح.",
          confirmButtonColor: "#D84040",
        });
        onDelete(workshop._id);
      } catch {
        Swal.fire({
          icon: "error",
          title: "خطأ",
          text: "حدث خطأ أثناء الحذف.",
          confirmButtonColor: "#D84040",
        });
      }
    });
  };

  return (
    <Card
      className="rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-[#D84040]/10 bg-white"
      dir="rtl"
    >
      {/* Cover Image */}
      <div className="w-full h-48 overflow-hidden bg-[#EEEEEE]">
        {workshop.coverImage ? (
          <img
            src={workshop.coverImage}
            alt={workshop.title_ar}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
            لا توجد صورة
          </div>
        )}
      </div>

      <CardBody className="p-5 space-y-3">
        {/* Title */}
        <Typography
          variant="h5"
          className="font-bold text-[#1D1616] leading-snug line-clamp-2 font-[Tajawal]"
        >
          {workshop.title_ar}
        </Typography>

        {/* Price */}
        <p className="text-[#D84040] font-bold text-lg">
          {workshop.originalPrice} ج.م
        </p>

        {/* Status — clickable */}
        <button
          onClick={handleStatusClick}
          className="inline-flex items-center gap-1.5 focus:outline-none group"
        >
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition-all duration-200 group-hover:scale-105 ${status.bg} ${status.text} ${status.border}`}
          >
            {status.icon}
            {status.label}
          </span>
        </button>

        {/* Date / Time / Seats */}
        <div className="bg-[#EEEEEE] rounded-xl p-3 space-y-2">
          <div className="flex items-center gap-2 text-sm text-[#1D1616]">
            <CalendarDaysIcon className="h-4 w-4 text-[#D84040] shrink-0" />
            <span>
              {workshop.date
                ? new Date(workshop.date).toLocaleDateString("ar-EG")
                : "—"}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-[#1D1616]">
            <TimeIcon className="h-4 w-4 text-[#D84040] shrink-0" />
            <span>
              {(() => {
                if (!workshop.time) return "—";
                const [h, m] = workshop.time.split(":");
                const hour = parseInt(h, 10);
                const period = hour >= 12 ? "PM" : "AM";
                const h12 = hour % 12 === 0 ? 12 : hour % 12;
                return h12 + ":" + (m || "00") + " " + period;
              })()}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-[#1D1616]">
            <UsersIcon className="h-4 w-4 text-[#D84040] shrink-0" />
            <span>{workshop.seats} مقعد</span>
          </div>
          {workshop.workshopOnline && (
            <div className="flex items-center gap-2 text-sm text-[#1D1616]">
              <GlobeAltIcon className="h-4 w-4 text-[#D84040] shrink-0" />
              <span>إلكترونية</span>
            </div>
          )}
          {workshop.workshopOffline && (
            <div className="flex items-center gap-2 text-sm text-[#1D1616]">
              <MapPinIcon className="h-4 w-4 text-[#D84040] shrink-0" />
              <span>حضورية</span>
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex gap-2 pt-1">
          <Button
            onClick={() =>
              navigate(`/sellerdashboard/workshopdetail/${workshop._id}`)
            }
            className="flex-1 flex items-center justify-center gap-1.5 rounded-lg py-2.5 normal-case font-[Tajawal] text-sm transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            style={{ backgroundColor: "#8E1616" }}
          >
            <EyeIcon className="h-4 w-4" />
            عرض التفاصيل
          </Button>
          <Button
            onClick={handleDelete}
            className="flex-1 flex items-center justify-center gap-1.5 rounded-lg py-2.5 normal-case font-[Tajawal] text-sm transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            style={{ backgroundColor: "#D84040" }}
          >
            <TrashIcon className="h-4 w-4" />
            حذف
          </Button>
        </div>
      </CardBody>
    </Card>
  );
};

const SellerWorkshopList = () => {
  const [workshops, setWorkshops] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const token = localStorage.getItem("token");
        const sellerId = localStorage.getItem("id");
        const res = await fetch(
          `http://localhost:5000/api/v1/workshop/seller/${sellerId}`,
          {
            headers: { Authorization: token },
          },
        );
        const data = await res.json();
        setWorkshops(data?.data?.workshops || []);
      } catch {
        Swal.fire({
          icon: "error",
          title: "خطأ",
          text: "تعذّر تحميل الورش.",
          confirmButtonColor: "#D84040",
        });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleDelete = (id) =>
    setWorkshops((prev) => prev.filter((w) => w._id !== id));

  return (
    <div
      className="min-h-screen w-full"
      dir="rtl"
      style={{
        backgroundColor: "#EEEEEE",
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23D84040' fill-opacity='0.08'%3E%3Cpath d='M30 0l5 10h10l-8 6 3 10-10-7-10 7 3-10-8-6h10z'/%3E%3C/g%3E%3C/svg%3E")`,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 py-10">
        <Typography
          variant="h1"
          className="text-4xl md:text-5xl font-serif text-center mb-10 "
          style={{ color: "#1D1616" }}
        >
          ورشاتي
        </Typography>

        {loading ? (
          <div className="flex justify-center items-center h-48">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#D84040] border-t-transparent" />
          </div>
        ) : workshops.length === 0 ? (
          <div className="text-center py-20">
            <Typography className="text-gray-500 text-xl font-[Tajawal]">
              لا توجد ورش بعد
            </Typography>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {workshops.map((w) => (
              <WorkshopCard key={w._id} workshop={w} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerWorkshopList;
