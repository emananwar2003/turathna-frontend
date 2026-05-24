import React, { useState, useEffect } from "react";
import { Typography } from "@material-tailwind/react";
import {
  UsersIcon,
  PhoneIcon,
  CalendarDaysIcon,
  ClockIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  TicketIcon,
  GlobeAltIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";
import Swal from "sweetalert2";

const BG_STYLE = {
  backgroundColor: "#EEEEEE",
  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23D84040' fill-opacity='0.06'%3E%3Cpath d='M30 0l5 10h10l-8 6 3 10-10-7-10 7 3-10-8-6h10z'/%3E%3C/g%3E%3C/svg%3E")`,
};

const formatTime = (time) => {
  if (!time) return "—";
  const [h, m] = time.split(":");
  const hour = parseInt(h, 10);
  const period = hour >= 12 ? "PM" : "AM";
  const h12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${h12}:${m || "00"} ${period}`;
};

const WorkshopAttendees = ({ workshop }) => {
  const [open, setOpen] = useState(false);
  const attendees = workshop.attendees || [];
  const reserved = workshop.totalReserved || attendees.length;
  const seats = workshop.seats || 0;
  const pct = seats > 0 ? Math.min((reserved / seats) * 100, 100) : 0;

  return (
    <div className="bg-white rounded-2xl shadow-md border border-[#D84040]/5 overflow-hidden">
      {/* Top gradient bar */}
      <div className="h-1.5 w-full bg-gradient-to-r from-[#1D1616] via-[#D84040] to-[#8E1616]" />

      {/* Workshop header */}
      <div className="p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex-1 min-w-0">
            <h3
              className="font-bold text-[#1D1616] text-xl leading-tight mb-1"
              dir="rtl"
            >
              {workshop.title_ar}
            </h3>

            {/* Seats progress */}
            <div className="mt-3 mb-1 flex items-center justify-between text-xs text-gray-500">
              <span>{reserved} reserved</span>
              <span>{seats} total seats</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
              <div
                className="h-2 rounded-full transition-all duration-500"
                style={{
                  width: `${pct}%`,
                  backgroundColor:
                    pct >= 80 ? "#D84040" : pct >= 50 ? "#f59e0b" : "#16a34a",
                }}
              />
            </div>
          </div>

          {/* Stats badges */}
          <div className="flex flex-col items-end gap-2 shrink-0">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${
                reserved >= seats
                  ? "bg-red-100 text-[#D84040] border-[#D84040]/40"
                  : "bg-green-100 text-green-800 border-green-300"
              }`}
            >
              <UsersIcon className="h-3.5 w-3.5" />
              {reserved >= seats ? "مكتمل" : `${seats - reserved} مقعد متاح`}
            </span>
            <span className="text-xs text-gray-400 font-mono">
              {reserved} / {seats} محجوز
            </span>
          </div>
        </div>

        {/* Online / Offline badges */}
        <div className="flex gap-2 mt-3 flex-wrap">
          {workshop.workshopOnline && (
            <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 border border-blue-200 text-xs font-semibold px-2.5 py-1 rounded-full">
              <GlobeAltIcon className="h-3.5 w-3.5" />
              إلكترونية
            </span>
          )}
          {workshop.workshopOffline && (
            <span className="inline-flex items-center gap-1.5 bg-[#1D1616]/5 text-[#1D1616] border border-[#1D1616]/20 text-xs font-semibold px-2.5 py-1 rounded-full">
              <MapPinIcon className="h-3.5 w-3.5" />
              حضورية
            </span>
          )}
        </div>

        {/* Toggle attendees */}
        <button
          onClick={() => setOpen((o) => !o)}
          className="mt-4 w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-[#EEEEEE] hover:bg-[#D84040]/10 transition-colors duration-200 text-sm font-semibold text-[#1D1616]"
        >
          <span className="flex items-center gap-2">
            <UsersIcon className="h-4 w-4 text-[#D84040]" />
            {open ? "إخفاء الحضور" : `عرض الحضور (${attendees.length})`}
          </span>
          {open ? (
            <ChevronUpIcon className="h-4 w-4 text-gray-400" />
          ) : (
            <ChevronDownIcon className="h-4 w-4 text-gray-400" />
          )}
        </button>
      </div>

      {/* Attendees list */}
      {open && (
        <div className="border-t border-gray-100">
          {attendees.length === 0 ? (
            <div className="py-10 text-center">
              <TicketIcon className="h-10 w-10 text-gray-200 mx-auto mb-2" />
              <p className="text-gray-400 text-sm">لا يوجد حضور بعد</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {attendees.map((a, i) => {
                const u = a.userDetails || a.buyerDetails || {};
                return (
                  <div
                    key={a._id || i}
                    className="px-6 py-4 flex items-center justify-between gap-4 hover:bg-[#EEEEEE]/50 transition-colors"
                  >
                    {/* Avatar + name */}
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#D84040] to-[#8E1616] flex items-center justify-center text-white font-bold text-sm shrink-0">
                        {u.firstname?.[0]?.toUpperCase() || "?"}
                      </div>
                      <div>
                        <p className="font-semibold text-[#1D1616] text-sm">
                          {u.firstname} {u.lastname}
                        </p>
                        <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                          <PhoneIcon className="h-3 w-3" />
                          <span dir="ltr">{u.phone || "—"}</span>
                        </div>
                      </div>
                    </div>

                    {/* Reserved date */}
                    <div className="text-right shrink-0">
                      <p className="text-xs text-gray-400">تاريخ الحجز</p>
                      <p className="text-xs font-medium text-[#1D1616]">
                        {a.createdAt
                          ? new Date(a.createdAt).toLocaleDateString("en-GB")
                          : "—"}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Footer */}
          <div className="px-6 py-3 bg-[#EEEEEE]/50 flex items-center justify-between">
            <p className="text-xs text-gray-400">{attendees.length} حاضر</p>
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              All confirmed
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const SellerReservations = () => {
  const [workshops, setWorkshops] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const token = localStorage.getItem("token");
        const sellerId = localStorage.getItem("id");
        const res = await fetch(
          `http://localhost:5000/api/v1/reservation/seller/${sellerId}`,
          {
            headers: { Authorization: token },
          },
        );
        const data = await res.json();
        setWorkshops(data?.data?.workshops || []);
      } catch {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to load reservations.",
          confirmButtonColor: "#D84040",
        });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const totalAttendees = workshops.reduce(
    (sum, w) => sum + (w.totalReserved || 0),
    0,
  );

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={BG_STYLE}
      >
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#D84040] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full" style={BG_STYLE}>
      <div className="max-w-4xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="text-center mb-4" dir="rtl">
          <p className="text-[#D84040] text-xs font-bold uppercase tracking-widest mb-2">
            من سيحضر
          </p>
          <Typography
            variant="h1"
            className="text-4xl md:text-5xl font-serif "
            style={{ color: "#1D1616" }}
          >
            حجوزات ورشاتي
          </Typography>
        </div>

        {/* Summary stats */}
        {workshops.length > 0 && (
          <div className="grid grid-cols-2 gap-4 mb-8 mt-6">
            <div className="bg-white rounded-2xl p-5 text-center shadow-sm border border-[#D84040]/5">
              <p className="text-3xl font-bold text-[#D84040]">
                {workshops.length}
              </p>
              <p className="text-xs text-gray-400 uppercase tracking-wide mt-1">
                ورشات
              </p>
            </div>
            <div className="bg-white rounded-2xl p-5 text-center shadow-sm border border-[#D84040]/5">
              <p className="text-3xl font-bold text-[#D84040]">
                {totalAttendees}
              </p>
              <p className="text-xs text-gray-400 uppercase tracking-wide mt-1">
                إجمالي الحضور
              </p>
            </div>
          </div>
        )}

        {workshops.length === 0 ? (
          <div className="text-center py-24 space-y-4">
            <UsersIcon className="h-20 w-20 text-[#D84040]/20 mx-auto" />
            <p
              className="text-gray-500 text-xl font-medium font-[Tajawal]"
              dir="rtl"
            >
              لا توجد حجوزات بعد
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {workshops.map((w) => (
              <WorkshopAttendees key={w._id} workshop={w} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerReservations;
