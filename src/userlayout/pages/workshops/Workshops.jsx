import React, { useState, useEffect } from "react";
import { Typography } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import {
  CalendarDaysIcon,
  ClockIcon,
  UsersIcon,
  GlobeAltIcon,
  MapPinIcon,
  ArrowRightIcon,
  MagnifyingGlassIcon,
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

const WorkshopCard = ({ workshop }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group hover:-translate-y-1">
      {/* Cover Image */}
      <div className="w-full h-52 overflow-hidden bg-[#1D1616] relative">
        {workshop.coverImage ? (
          <img
            src={workshop.coverImage}
            alt={workshop.title_en}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">
            No image
          </div>
        )}
        {/* Online badge */}
        {workshop.workshopOnline && (
          <span className="absolute top-3 left-3 bg-[#D84040] text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-md">
            <GlobeAltIcon className="h-3 w-3" />
            Online Workshop
          </span>
        )}
        {workshop.workshopOffline && !workshop.workshopOnline && (
          <span className="absolute top-3 left-3 bg-[#1D1616] text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-md">
            <MapPinIcon className="h-3 w-3" />
            In-person
          </span>
        )}
        {workshop.workshopOnline && workshop.workshopOffline && (
          <span className="absolute top-3 right-3 bg-[#8E1616] text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
            Hybrid
          </span>
        )}
      </div>

      <div className="p-5 space-y-3">
        {/* Title */}
        <h3 className="font-bold text-[#1D1616] text-lg leading-tight line-clamp-2 group-hover:text-[#D84040] transition-colors duration-200">
          {workshop.title_en}
        </h3>

        {/* Price */}
        <p className="text-[#D84040] font-bold text-xl">
          {workshop.finalPrice || workshop.originalPrice}
          <span className="text-xs font-normal text-gray-400 ml-1">EGP</span>
        </p>

        {/* Info row */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <CalendarDaysIcon className="h-4 w-4 text-[#D84040] shrink-0" />
            <span>
              {workshop.date
                ? new Date(workshop.date).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })
                : "—"}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <ClockIcon className="h-4 w-4 text-[#D84040] shrink-0" />
            <span>{formatTime(workshop.time)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <UsersIcon className="h-4 w-4 text-[#D84040] shrink-0" />
            <span>{workshop.seats} seats available</span>
          </div>
        </div>

        {/* See Details Button */}
        <button
          onClick={() => navigate(`/workshopdet/${workshop._id}`)}
          className="w-full flex items-center justify-center gap-2 bg-[#D84040] hover:bg-[#8E1616] text-white py-3 rounded-xl font-semibold text-sm transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] mt-2"
          style={{ boxShadow: "0 4px 14px -4px rgba(216,64,64,0.4)" }}
        >
          See Details
          <ArrowRightIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

const AllWorkshops = () => {
  const [workshops, setWorkshops] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/v1/workshop/");
        const data = await res.json();
        const list = data?.data?.workshopsList || data?.data?.workshops || [];
        setWorkshops(list);
        setFiltered(list);
      } catch {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to load workshops.",
          confirmButtonColor: "#D84040",
        });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(
      q
        ? workshops.filter((w) => (w.title_en || "").toLowerCase().includes(q))
        : workshops,
    );
  }, [search, workshops]);

  return (
    <div className="min-h-screen w-full" style={BG_STYLE}>
      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-[#D84040] text-xs font-bold uppercase tracking-widest mb-2">
            Learn from the masters
          </p>
          <Typography
            variant="h1"
            className="text-4xl md:text-5xl font-serif mb-3"
            style={{ color: "#1D1616" }}
          >
            Workshops
          </Typography>
          <p className="text-gray-500 text-sm max-w-md mx-auto">
            Hands-on experiences with Egypt's finest traditional craftspeople
          </p>
        </div>

        {/* Search */}
        <div className="flex justify-center mb-8">
          <div className="relative max-w-md w-full">
            <MagnifyingGlassIcon className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search workshops..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#D84040] bg-white text-sm shadow-sm"
            />
          </div>
        </div>

        {!loading && (
          <p className="text-xs text-gray-400 mb-4">
            Showing{" "}
            <span className="font-semibold text-[#1D1616]">
              {filtered.length}
            </span>{" "}
            workshops
          </p>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-48">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#D84040] border-t-transparent" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24 space-y-3">
            <div className="text-6xl">🏺</div>
            <p className="text-gray-500 text-lg font-medium">
              No workshops found
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((w) => (
              <WorkshopCard key={w._id} workshop={w} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllWorkshops;
