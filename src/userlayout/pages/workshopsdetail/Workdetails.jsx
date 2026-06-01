import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Typography } from "@material-tailwind/react";
import {
  ArrowLeftIcon,
  CalendarDaysIcon,
  ClockIcon,
  UsersIcon,
  GlobeAltIcon,
  MapPinIcon,
  TicketIcon,
} from "@heroicons/react/24/outline";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
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

const InfoRow = ({ icon, label, value }) => (
  <div className="flex items-center gap-3 py-3 border-b border-gray-100 last:border-0">
    <div className="w-9 h-9 rounded-full bg-[#D84040]/10 flex items-center justify-center shrink-0">
      {icon}
    </div>
    <div>
      <p className="text-xs text-gray-400 uppercase tracking-wide">{label}</p>
      <p className="text-[#1D1616] font-semibold text-sm">{value}</p>
    </div>
  </div>
);

const Workdetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [workshop, setWorkshop] = useState(null);
  const [relatedWorkshops, setRelatedWorkshops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reserving, setReserving] = useState(false);
  const [reserved, setReserved] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`http://localhost:5000/api/v1/workshop/${id}`, {
          headers: token ? { Authorization: token } : {},
        });
        const data = await res.json();
        setWorkshop(data?.data?.workshop || data?.data || null);
        setRelatedWorkshops(data?.data?.relatedWorkshops || []);
      } catch {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to load workshop.",
          confirmButtonColor: "#D84040",
        });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleReserve = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      Swal.fire({
        icon: "warning",
        title: "Login Required",
        text: "You need to log in first to reserve a spot.",
        confirmButtonColor: "#D84040",
        confirmButtonText: "Log In",
        showCancelButton: true,
        cancelButtonText: "Cancel",
        cancelButtonColor: "#8E1616",
      }).then((result) => {
        if (result.isConfirmed) navigate("/registration/userlogin");
      });
      return;
    }

    try {
      setReserving(true);
      const res = await fetch(
        `http://localhost:5000/api/v1/reservation/${id}`,
        {
          method: "POST",
          headers: { Authorization: token, "Content-Type": "application/json" },
        },
      );

      if (!res.ok) {
        const d = await res.json();
        throw new Error(d?.message || "Failed to reserve");
      }

      setReserved(true);

      const isOffline = workshop.workshopOffline && !workshop.workshopOnline;
      const isOnline = workshop.workshopOnline && !workshop.workshopOffline;

      const text = isOffline
        ? "Your spot is reserved! Please bring cash on the day of the workshop."
        : isOnline
          ? "Your spot is reserved! Please send the payment via InstaPay to: 01155538964"
          : "Your spot is reserved! For online attendance pay via InstaPay to 01155538964. For in-person attendance bring cash.";

      await Swal.fire({
        icon: "success",
        title: "Reserved!",
        text,
        confirmButtonColor: "#D84040",
        confirmButtonText: "Got it!",
      });
      setTimeout(() => setReserved(false), 5000);
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.message || "Failed to reserve.",
        confirmButtonColor: "#D84040",
      });
    } finally {
      setReserving(false);
    }
  };

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={BG_STYLE}
      >
        <div className="animate-spin rounded-full h-14 w-14 border-4 border-[#D84040] border-t-transparent" />
      </div>
    );
  }

  if (!workshop) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={BG_STYLE}
      >
        <p className="text-gray-500 text-lg">Workshop not found.</p>
      </div>
    );
  }

  const coverImage = workshop.coverImage || workshop.workshopImages?.[0];

  return (
    <div className="min-h-screen w-full" style={BG_STYLE}>
      <div className="max-w-5xl mx-auto px-4 py-10">
        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-sm text-[#8E1616] hover:text-[#D84040] mb-8 transition-colors font-semibold"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back to Workshops
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* ── Left: Image ── */}
          <div>
            {coverImage ? (
              <div
                className="w-full overflow-hidden rounded-2xl"
                style={{ aspectRatio: "4/3" }}
              >
                <img
                  src={coverImage}
                  alt={workshop.title_en}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div
                className="w-full rounded-2xl bg-[#1D1616]/10 flex items-center justify-center"
                style={{ aspectRatio: "4/3" }}
              >
                <p className="text-gray-400 text-sm">No image available</p>
              </div>
            )}
          </div>

          {/* ── Right: Info ── */}
          <div className="flex flex-col gap-5">
            {/* Type badges */}
            <div className="flex gap-2 flex-wrap">
              {workshop.workshopOnline && (
                <span className="inline-flex items-center gap-1.5 bg-[#D84040] text-white text-xs font-bold px-3 py-1.5 rounded-full">
                  <GlobeAltIcon className="h-3.5 w-3.5" />
                  Online Workshop
                </span>
              )}
              {workshop.workshopOffline && (
                <span className="inline-flex items-center gap-1.5 bg-[#1D1616] text-white text-xs font-bold px-3 py-1.5 rounded-full">
                  <MapPinIcon className="h-3.5 w-3.5" />
                  In-person
                </span>
              )}
            </div>

            {/* Title */}
            <Typography
              variant="h1"
              className="text-3xl md:text-4xl font-serif leading-tight"
              style={{ color: "#1D1616" }}
            >
              {workshop.title_en}
            </Typography>

            {/* Price */}
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-[#D84040]">
                {workshop.finalPrice || workshop.originalPrice}
              </span>
              <span className="text-gray-400 font-medium">EGP</span>
            </div>

            {/* Info card */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#D84040]/10">
              <InfoRow
                icon={<CalendarDaysIcon className="h-5 w-5 text-[#D84040]" />}
                label="Date"
                value={
                  workshop.date
                    ? new Date(workshop.date).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })
                    : "—"
                }
              />
              <InfoRow
                icon={<ClockIcon className="h-5 w-5 text-[#D84040]" />}
                label="Time"
                value={formatTime(workshop.time)}
              />
              <InfoRow
                icon={<UsersIcon className="h-5 w-5 text-[#D84040]" />}
                label="Available Seats"
                value={`${workshop.seats} seats`}
              />
              {workshop.workshopOnline && workshop.workshopLink && (
                <InfoRow
                  icon={<GlobeAltIcon className="h-5 w-5 text-[#D84040]" />}
                  label="Platform"
                  value={
                    <a
                      href={workshop.workshopLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#D84040] underline"
                    >
                      {workshop.workshopLink}
                    </a>
                  }
                />
              )}
              {workshop.workshopOffline && workshop.workshopAddress && (
                <InfoRow
                  icon={<MapPinIcon className="h-5 w-5 text-[#D84040]" />}
                  label="Location"
                  value={workshop.workshopAddress}
                />
              )}
            </div>

            {/* Reserve Button */}
            <button
              onClick={handleReserve}
              disabled={reserving}
              className={`w-full flex items-center justify-center gap-2 py-4 rounded-xl text-base font-bold transition-all duration-300 shadow-lg disabled:opacity-60 disabled:cursor-not-allowed ${
                reserved
                  ? "bg-green-600 text-white scale-[0.98]"
                  : "bg-[#D84040] hover:bg-[#8E1616] text-white hover:scale-[1.02] active:scale-[0.98]"
              }`}
              style={{ boxShadow: "0 6px 20px -4px rgba(216,64,64,0.4)" }}
            >
              {reserved ? (
                <>
                  <CheckCircleIcon className="h-5 w-5" /> Reserved!
                </>
              ) : reserving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />{" "}
                  Reserving...
                </>
              ) : (
                <>
                  <TicketIcon className="h-5 w-5" /> Reserve a Spot
                </>
              )}
            </button>
          </div>
        </div>

        {/* ── Description ── */}
        <div className="mt-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px flex-1 bg-[#D84040]/20" />
            <p className="text-xs font-bold uppercase tracking-widest text-[#8E1616]">
              About this Workshop
            </p>
            <div className="h-px flex-1 bg-[#D84040]/20" />
          </div>
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-[#D84040]/10 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-[#D84040] rounded-l-2xl" />
            <p className="text-gray-700 leading-relaxed pl-4">
              {workshop.description_en}
            </p>
          </div>
        </div>
        {/* ── Related Workshops Section ── */}
        {relatedWorkshops && relatedWorkshops.length > 0 && (
          <div className="mt-16 border-t border-gray-200 pt-10">
            <h2 className="text-2xl font-bold text-[#1D1616] mb-6 font-serif">
              Related Workshops
            </h2>
            <WorkshopsGrid workshops={relatedWorkshops} />
          </div>
        )}
      </div>
    </div>
  );
};
// ── Workshops Grid Component ──────────────────────────────────────────────────
const WorkshopsGrid = ({ workshops }) => {
  if (workshops.length === 0) return null;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
      {workshops.map((w, i) => (
        <WorkshopCard key={w._id} workshop={w} index={i} />
      ))}
    </div>
  );
};

// ── Workshop Card Component ───────────────────────────────────────────────────
const WorkshopCard = ({ workshop, index }) => {
  const navigate = useNavigate();
  const coverImage = workshop.coverImage || workshop.workshopImages?.[0];

  return (
    <div
      className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer group hover:-translate-y-1 flex flex-col justify-between"
      style={{ animationDelay: `${index * 60}ms` }}
      onClick={() => navigate(`/workshopdet/${workshop._id}`)}
    >
      <div
        className="relative w-full overflow-hidden rounded-t-2xl"
        style={{ aspectRatio: "4/3" }}
      >
        {coverImage ? (
          <img
            src={coverImage}
            alt={workshop.title_en}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-[#1D1616]/10 flex items-center justify-center text-gray-400 text-sm">
            No image
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1D1616]/40 via-transparent to-transparent" />
        <div className="absolute top-3 left-3 flex gap-1">
          {workshop.workshopOnline && (
            <span className="bg-[#D84040] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md">
              Online
            </span>
          )}
          {workshop.workshopOffline && (
            <span className="bg-[#1D1616] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md">
              In-person
            </span>
          )}
        </div>
      </div>

      <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
        <div className="space-y-1">
          <h3 className="font-bold text-[#1D1616] text-base leading-tight line-clamp-1 group-hover:text-[#D84040] transition-colors duration-200">
            {workshop.title_en || workshop.title_ar}
          </h3>
          <p className="text-gray-500 text-xs leading-relaxed line-clamp-2">
            {workshop.description_en || workshop.description_ar}
          </p>
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-gray-50 mt-auto">
          <span className="text-[#D84040] font-bold text-lg">
            {workshop.finalPrice || workshop.originalPrice}{" "}
            <span className="text-xs font-normal text-gray-400 ml-1">EGP</span>
          </span>
          <button className="text-xs bg-[#1D1616] hover:bg-[#D84040] text-white px-3 py-1.5 rounded-lg transition-colors duration-200 font-medium">
            View
          </button>
        </div>
      </div>
    </div>
  );
};

export default Workdetails;
