import React, { useState, useEffect } from "react";
import { Typography } from "@material-tailwind/react";
import {
  UsersIcon,
  PhoneIcon,
  TicketIcon,
  CalendarDaysIcon,
  ClockIcon,
  CurrencyDollarIcon,
  MagnifyingGlassIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  GlobeAltIcon,
  MapPinIcon,
  UserIcon,
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

const groupByWorkshop = (list) => {
  const map = {};

  list.forEach((r) => {
    const workshop = r.workshop;
    const isPopulated = workshop && typeof workshop === "object";

  
    const key = isPopulated
      ? String(workshop._id)
      : String(workshop || r.workshopDetails?.title_en || "unknown");

    if (!map[key]) {
      map[key] = {
        
        ...(r.workshopDetails || {}),
       
        ...(isPopulated ? workshop : {}),
        _id: key,
        seller: r.sellerDetails || null,
        attendees: [],
        totalReserved: 0,
      };
    }

    map[key].attendees.push(r);
    map[key].totalReserved += 1;
  });

  return Object.values(map);
};

// ── Workshop card with attendees ───────────────────────────────────────────────
const WorkshopAttendees = ({ workshop, search }) => {
  const [open, setOpen] = useState(false);

  const attendees = (workshop.attendees || []).filter((a) => {
    if (!search) return true;
    const q = search.toLowerCase();
    const u = a.buyerDetails || {};
    return (
      (u.firstname || "").toLowerCase().includes(q) ||
      (u.lastname || "").toLowerCase().includes(q) ||
      (u.phone || "").toLowerCase().includes(q)
    );
  });

  if (search && attendees.length === 0) return null;

  const reserved = workshop.totalReserved || attendees.length;
  const seats = workshop.seats || 0;
  const pct = seats > 0 ? Math.min((reserved / seats) * 100, 100) : 0;
  const w = workshop;

  return (
    <div className="bg-white rounded-2xl shadow-md border border-[#D84040]/5 overflow-hidden hover:shadow-lg transition-all duration-200">
      <div className="h-1.5 w-full bg-gradient-to-r from-[#1D1616] via-[#D84040] to-[#8E1616]" />

      <div className="p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex-1 min-w-0">
            <p className="font-bold text-[#1D1616] text-xl leading-tight mb-0.5">
              {w.title_en || "—"}
            </p>
            {w.title_ar && (
              <p className="text-sm text-gray-400 mb-2" dir="rtl">
                {w.title_ar}
              </p>
            )}

            <div className="flex flex-wrap gap-4 mt-2">
              {w.date && (
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <CalendarDaysIcon className="h-3.5 w-3.5 text-[#D84040]" />
                  {new Date(w.date).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </div>
              )}
              {w.time && (
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <ClockIcon className="h-3.5 w-3.5 text-[#D84040]" />
                  {formatTime(w.time)}
                </div>
              )}
              {w.finalPrice != null && (
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#D84040]">
                  <CurrencyDollarIcon className="h-3.5 w-3.5" />
                  {w.finalPrice} EGP
                </div>
              )}
            </div>

            <div className="flex gap-2 mt-3 flex-wrap">
              {w.workshopOnline && (
                <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 border border-blue-200 text-xs font-semibold px-2.5 py-1 rounded-full">
                  <GlobeAltIcon className="h-3.5 w-3.5" />
                  Online
                </span>
              )}
              {w.workshopOffline && (
                <span className="inline-flex items-center gap-1.5 bg-[#1D1616]/5 text-[#1D1616] border border-[#1D1616]/20 text-xs font-semibold px-2.5 py-1 rounded-full">
                  <MapPinIcon className="h-3.5 w-3.5" />
                  In-person
                </span>
              )}
            </div>

            {seats > 0 && (
              <>
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
                        pct >= 80
                          ? "#D84040"
                          : pct >= 50
                            ? "#f59e0b"
                            : "#16a34a",
                    }}
                  />
                </div>
              </>
            )}

            {workshop.seller && (
              <div className="mt-3 flex items-center gap-3 bg-[#EEEEEE] rounded-xl px-3 py-2 w-fit">
                <div className="w-7 h-7 rounded-full bg-[#D84040]/10 flex items-center justify-center shrink-0">
                  <UserIcon className="h-4 w-4 text-[#D84040]" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide leading-none">
                    Seller
                  </p>
                  <p className="text-sm font-semibold text-[#1D1616]">
                    {workshop.seller.name}
                  </p>
                </div>
                {workshop.seller.phone && (
                  <div className="flex items-center gap-1 text-xs text-gray-400 border-l border-gray-200 pl-3 ml-1">
                    <PhoneIcon className="h-3 w-3" />
                    <span dir="ltr">{workshop.seller.phone}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex flex-col items-end gap-2 shrink-0">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${
                seats > 0 && reserved >= seats
                  ? "bg-red-100 text-[#D84040] border-[#D84040]/40"
                  : "bg-green-100 text-green-800 border-green-300"
              }`}
            >
              <UsersIcon className="h-3.5 w-3.5" />
              {seats > 0 && reserved >= seats
                ? "Full"
                : seats > 0
                  ? `${seats - reserved} seats left`
                  : `${reserved} booked`}
            </span>
            {seats > 0 && (
              <span className="text-xs text-gray-400 font-mono">
                {reserved} / {seats}
              </span>
            )}
          </div>
        </div>

        <button
          onClick={() => setOpen((o) => !o)}
          className="mt-4 w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-[#EEEEEE] hover:bg-[#D84040]/10 transition-colors duration-200 text-sm font-semibold text-[#1D1616]"
        >
          <span className="flex items-center gap-2">
            <UsersIcon className="h-4 w-4 text-[#D84040]" />
            {open ? "Hide Attendees" : `View Attendees (${attendees.length})`}
          </span>
          {open ? (
            <ChevronUpIcon className="h-4 w-4 text-gray-400" />
          ) : (
            <ChevronDownIcon className="h-4 w-4 text-gray-400" />
          )}
        </button>
      </div>

      {open && (
        <div className="border-t border-gray-100">
          {attendees.length === 0 ? (
            <div className="py-10 text-center">
              <TicketIcon className="h-10 w-10 text-gray-200 mx-auto mb-2" />
              <p className="text-gray-400 text-sm">No attendees yet</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {attendees.map((a, i) => {
                const u = a.buyerDetails || {};
                return (
                  <div
                    key={a._id || i}
                    className="px-6 py-4 flex items-center justify-between gap-4 hover:bg-[#EEEEEE]/50 transition-colors"
                  >
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
                    <div className="text-right shrink-0">
                      <p className="text-xs text-gray-400">Reserved on</p>
                      <p className="text-xs font-medium text-[#1D1616]">
                        {a.createdAt
                          ? new Date(a.createdAt).toLocaleDateString("en-GB")
                          : "—"}
                      </p>
                      <p className="text-xs text-gray-300 font-mono mt-0.5">
                        #{a._id?.slice(-6).toUpperCase()}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          <div className="px-6 py-3 bg-[#EEEEEE]/50 flex items-center justify-between">
            <p className="text-xs text-gray-400">
              {attendees.length} attendee{attendees.length !== 1 ? "s" : ""}
            </p>
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

// ── Main page ──────────────────────────────────────────────────────────────────
const AdminReservations = () => {
  const [workshops, setWorkshops] = useState([]);
  const [totalRes, setTotalRes] = useState(0);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/v1/reservation", {
          headers: { Authorization: token },
        });
        const data = await res.json();

        const list =
          data?.data?.data ||
          data?.data?.reservationsList ||
          data?.data?.reservations ||
          [];

        setTotalRes(list.length);
        setWorkshops(groupByWorkshop(list));
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
        <div className="text-center mb-6">
          <p className="text-[#D84040] text-xs font-bold uppercase tracking-widest mb-2">
            Platform Overview
          </p>
          <Typography
            variant="h1"
            className="text-4xl md:text-5xl font-serif"
            style={{ color: "#1D1616" }}
          >
            All Reservations
          </Typography>
          <p className="text-gray-500 text-sm mt-2">
            Manage all workshop bookings across the platform
          </p>
        </div>

        {workshops.length > 0 && (
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-white rounded-2xl p-5 text-center shadow-sm border border-[#D84040]/5">
              <p className="text-3xl font-bold text-[#D84040]">
                {workshops.length}
              </p>
              <p className="text-xs text-gray-400 uppercase tracking-wide mt-1">
                Unique Workshops
              </p>
            </div>
            <div className="bg-white rounded-2xl p-5 text-center shadow-sm border border-[#D84040]/5">
              <p className="text-3xl font-bold text-[#D84040]">{totalRes}</p>
              <p className="text-xs text-gray-400 uppercase tracking-wide mt-1">
                Total Reservations
              </p>
            </div>
          </div>
        )}

        <div className="relative mb-6">
          <MagnifyingGlassIcon className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by attendee name or phone..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#D84040] bg-white text-sm shadow-sm"
          />
        </div>

        {workshops.length === 0 ? (
          <div className="text-center py-24 space-y-4">
            <TicketIcon className="h-20 w-20 text-[#D84040]/20 mx-auto" />
            <p className="text-gray-500 text-xl font-medium">
              No reservations found
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {workshops.map((w) => (
              <WorkshopAttendees key={w._id} workshop={w} search={search} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminReservations;
