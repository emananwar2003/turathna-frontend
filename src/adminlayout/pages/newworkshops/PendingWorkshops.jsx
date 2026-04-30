import React, { useState, useEffect } from "react";
import { Card, CardBody, Typography, Button } from "@material-tailwind/react";
import {
  UserIcon,
  PhoneIcon,
  EyeIcon,
  CalendarDaysIcon,
  ClockIcon,
  UsersIcon,
  GlobeAltIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const statusConfig = {
  pending: {
    label: "Pending",
    bg: "bg-amber-100",
    text: "text-amber-800",
    border: "border-amber-300",
    dot: "bg-amber-500",
  },
  accepted: {
    label: "Approved",
    bg: "bg-green-100",
    text: "text-green-800",
    border: "border-green-300",
    dot: "bg-green-500",
  },
  rejected: {
    label: "Rejected",
    bg: "bg-red-100",
    text: "text-[#D84040]",
    border: "border-[#D84040]/40",
    dot: "bg-[#D84040]",
  },
};


const WorkshopCover = ({ coverImage }) => (
  <div className="w-full h-52 bg-[#EEEEEE] overflow-hidden rounded-t-xl">
    {coverImage ? (
      <img
        src={coverImage}
        alt="workshop"
        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
      />
    ) : (
      <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
        No image available
      </div>
    )}
  </div>
);

const AdminWorkshopCard = ({ workshop }) => {
  const navigate = useNavigate();
  const status =
    statusConfig[workshop.verificationStatus] || statusConfig.pending;

  return (
    <Card className="rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-[#D84040]/10 bg-white">
      <WorkshopCover coverImage={workshop.coverImage} />
      <CardBody className="p-5 space-y-3">
        {/* Title */}
        <Typography
          variant="h6"
          className="font-bold text-[#1D1616] leading-snug line-clamp-2"
        >
          {workshop.title_ar}
        </Typography>

        {/* Price */}
        <div className="flex items-center gap-3">
          <span className="text-[#D84040] font-bold text-base">
            {workshop.originalPrice} EGP
          </span>
          {workshop.finalPrice &&
            workshop.finalPrice !== workshop.originalPrice && (
              <span className="text-gray-400 text-sm">
                After: {workshop.finalPrice} EGP
              </span>
            )}
        </div>

        {/* Status */}
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${status.bg} ${status.text} ${status.border}`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
          {status.label}
        </span>

        {/* Seller Info */}
        {workshop.seller && (
          <div className="bg-[#EEEEEE] rounded-xl p-3 space-y-1.5">
            <p className="text-xs font-semibold text-[#8E1616] uppercase tracking-wide mb-2">
              Seller Info
            </p>
            <div className="flex items-center gap-2 text-sm text-[#1D1616]">
              <UserIcon className="h-4 w-4 text-[#D84040] shrink-0" />
              <span className="font-medium truncate">
                {typeof workshop.seller === "object"
                  ? workshop.seller.name
                  : workshop.seller}
              </span>
            </div>
            {workshop.seller.phone && (
              <div className="flex items-center gap-2 text-sm text-[#1D1616]">
                <PhoneIcon className="h-4 w-4 text-[#D84040] shrink-0" />
                <span dir="ltr">{workshop.seller.phone}</span>
              </div>
            )}
          </div>
        )}

        {/* View Button */}
        <Button
          onClick={() =>
            navigate(`/admindashboard/workshopreview/${workshop._id}`)
          }
          fullWidth
          className="flex items-center justify-center gap-2 rounded-lg py-2.5 normal-case text-sm transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          style={{
            backgroundColor: "#D84040",
            boxShadow: "0 4px 6px -1px rgba(216,64,64,0.3)",
          }}
        >
          <EyeIcon className="h-4 w-4" />
          View Workshop Details
        </Button>
      </CardBody>
    </Card>
  );
};

const PendingWorkshops = () => {
  const [workshops, setWorkshops] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          "http://localhost:5000/api/v1/admin/workshop/pending",
          {
            headers: { Authorization: token },
          },
        );
        const data = await res.json();
        setWorkshops(data?.data?.workshopsList || data?.data?.workshops || []);
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

  return (
    <div
      className="min-h-screen w-full"
      style={{
        backgroundColor: "#EEEEEE",
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23D84040' fill-opacity='0.08'%3E%3Cpath d='M30 0l5 10h10l-8 6 3 10-10-7-10 7 3-10-8-6h10z'/%3E%3C/g%3E%3C/svg%3E")`,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 py-10">
        <Typography
          variant="h1"
          className="text-4xl md:text-5xl font-serif text-center mb-2"
          style={{ color: "#1D1616" }}
        >
          Pending Workshops
        </Typography>
        <p className="text-center text-gray-500 text-sm mb-10">
          Review and manage submitted workshops awaiting approval
        </p>

        {loading ? (
          <div className="flex justify-center items-center h-48">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#D84040] border-t-transparent" />
          </div>
        ) : workshops.length === 0 ? (
          <div className="text-center py-20">
            <Typography className="text-gray-500 text-xl">
              No pending workshops
            </Typography>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {workshops.map((w) => (
              <AdminWorkshopCard key={w._id} workshop={w} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PendingWorkshops;
