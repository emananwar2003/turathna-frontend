import React, { useState, useEffect } from "react";
import { Typography } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import {
  CalendarDaysIcon,
  ClockIcon,
  CurrencyDollarIcon,
  TrashIcon,
  TicketIcon,
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

const MyReservations = () => {
  const navigate = useNavigate();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReservations = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/v1/reservation", {
        headers: { Authorization: token },
      });
      const data = await res.json();
      setReservations(
        data?.data?.data ||
          data?.data?.reservationsList ||
          data?.data?.reservations ||
          [],
      );
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

  useEffect(() => {
    fetchReservations();
  }, []);

  const handleDelete = async (reservationId, title) => {
    const confirm = await Swal.fire({
      icon: "warning",
      title: "Cancel Reservation?",
      text: `Are you sure you want to cancel your reservation for "${title}"?`,
      showCancelButton: true,
      confirmButtonColor: "#D84040",
      cancelButtonColor: "#8E1616",
      confirmButtonText: "Yes, Cancel",
      cancelButtonText: "Keep it",
    });
    if (!confirm.isConfirmed) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://localhost:5000/api/v1/reservation/${reservationId}`,
        {
          method: "DELETE",
          headers: { Authorization: token },
        },
      );
      if (!res.ok) throw new Error();
      Swal.fire({
        icon: "success",
        title: "Cancelled",
        text: "Your reservation has been cancelled.",
        confirmButtonColor: "#D84040",
      });
      setReservations((prev) => prev.filter((r) => r._id !== reservationId));
    } catch {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to cancel reservation.",
        confirmButtonColor: "#D84040",
      });
    }
  };

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
        <div className="text-center mb-10">
          <p className="text-[#D84040] text-xs font-bold uppercase tracking-widest mb-2">
            Your bookings
          </p>
          <Typography
            variant="h1"
            className="text-4xl md:text-5xl font-serif"
            style={{ color: "#1D1616" }}
          >
            My Reservations
          </Typography>
        </div>

        {reservations.length === 0 ? (
          <div className="text-center py-24 space-y-4">
            <TicketIcon className="h-20 w-20 text-[#D84040]/20 mx-auto" />
            <p className="text-gray-500 text-xl font-medium">
              No reservations yet
            </p>
            <p className="text-gray-400 text-sm">
              Browse our workshops and reserve your spot
            </p>
            <button
              onClick={() => navigate("/workshops")}
              className="mt-2 bg-[#D84040] text-white px-8 py-3 rounded-xl font-semibold hover:bg-[#8E1616] transition-colors shadow-md"
            >
              Browse Workshops
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {reservations.map((r) => {
              const w = r.workshopDetails || {};
              return (
                <div
                  key={r._id}
                  className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 border border-[#D84040]/5 overflow-hidden"
                >
                  {/* Ticket-style top accent */}
                  <div className="h-1.5 w-full bg-gradient-to-r from-[#1D1616] via-[#D84040] to-[#8E1616]" />

                  <div className="p-5 sm:p-6">
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      {/* Left: workshop info */}
                      <div className="flex-1 min-w-0 space-y-3">
                        {/* Ticket icon + title */}
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-[#D84040]/10 flex items-center justify-center shrink-0">
                            <TicketIcon className="h-4 w-4 text-[#D84040]" />
                          </div>
                          <h3 className="font-bold text-[#1D1616] text-lg leading-tight line-clamp-1">
                            {w.title_en || "Workshop"}
                          </h3>
                        </div>

                        {/* Description */}
                        {w.description_en && (
                          <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 pl-10">
                            {w.description_en}
                          </p>
                        )}

                        {/* Date / Time / Price */}
                        <div className="flex flex-wrap gap-4 pl-10">
                          <div className="flex items-center gap-1.5 text-sm text-gray-500">
                            <CalendarDaysIcon className="h-4 w-4 text-[#D84040] shrink-0" />
                            {w.date
                              ? new Date(w.date).toLocaleDateString("en-GB", {
                                  day: "numeric",
                                  month: "long",
                                  year: "numeric",
                                })
                              : "—"}
                          </div>
                          <div className="flex items-center gap-1.5 text-sm text-gray-500">
                            <ClockIcon className="h-4 w-4 text-[#D84040] shrink-0" />
                            {formatTime(w.time)}
                          </div>
                          <div className="flex items-center gap-1.5 text-sm font-bold text-[#D84040]">
                            <CurrencyDollarIcon className="h-4 w-4 shrink-0" />
                            {w.finalPrice} EGP
                          </div>
                        </div>
                      </div>

                      {/* Right: status + delete */}
                      <div className="flex flex-col items-end gap-3 shrink-0">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 border border-green-300">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                          Confirmed
                        </span>
                        <button
                          onClick={() => handleDelete(r._id, w.title_en)}
                          className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-[#D84040] transition-colors duration-200 font-medium"
                        >
                          <TrashIcon className="h-4 w-4" />
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Dashed divider — ticket look */}
                  <div className="mx-6 border-t-2 border-dashed border-gray-100" />
                  <div className="px-6 py-3 flex items-center justify-between">
                    <p className="text-xs text-gray-400">
                      Reserved on{" "}
                      {new Date(r.createdAt).toLocaleDateString("en-GB")}
                    </p>
                    <p className="text-xs text-gray-300 font-mono">
                      #{r._id?.slice(-8).toUpperCase()}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyReservations;
