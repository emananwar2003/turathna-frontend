import React, { useState, useEffect } from "react";
import { Typography } from "@material-tailwind/react";
import {
  ShoppingBagIcon,
  CalendarDaysIcon,
  UserIcon,
  PhoneIcon,
  TruckIcon,
  CheckCircleIcon,
  ClockIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import Swal from "sweetalert2";

const BG_STYLE = {
  backgroundColor: "#EEEEEE",
  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23D84040' fill-opacity='0.06'%3E%3Cpath d='M30 0l5 10h10l-8 6 3 10-10-7-10 7 3-10-8-6h10z'/%3E%3C/g%3E%3C/svg%3E")`,
};

const orderStatusConfig = {
  pending: {
    label: "Pending",
    bg: "bg-amber-100",
    text: "text-amber-800",
    border: "border-amber-300",
  },
  finished: {
    label: "Finished",
    bg: "bg-green-100",
    text: "text-green-800",
    border: "border-green-300",
  },
  cancelled: {
    label: "Cancelled",
    bg: "bg-red-100",
    text: "text-[#D84040]",
    border: "border-[#D84040]/40",
  },
};

const shippingConfig = {
  pending: {
    label: "Pending",
    bg: "bg-amber-100",
    text: "text-amber-800",
    border: "border-amber-300",
  },
  "out for delivery": {
    label: "Out for Delivery",
    bg: "bg-blue-100",
    text: "text-blue-800",
    border: "border-blue-300",
  },
  delivered: {
    label: "Delivered",
    bg: "bg-green-100",
    text: "text-green-800",
    border: "border-green-300",
  },
};

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/v1/admin/orders", {
          headers: { Authorization: token },
        });
        const data = await res.json();
        const list = data?.data?.ordersList || data?.data?.orders || [];
        setOrders(list);
        setFiltered(list);
      } catch {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to load orders.",
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
        ? orders.filter((o) => {
            // FIX 3: prioritise _id over orderId to match API shape
            const buyer = o.addressDetails || o.buyerDetails || {};
            return (
              (buyer.first_name || "").toLowerCase().includes(q) ||
              (buyer.last_name || "").toLowerCase().includes(q) ||
              (buyer.phone_number || "").includes(q) ||
              (o._id || o.orderId || "").toLowerCase().includes(q)
            );
          })
        : orders,
    );
  }, [search, orders]);

  const handleShippingChange = async (orderId, newStatus) => {
    const confirm = await Swal.fire({
      icon: "question",
      title: "Update Shipping Status?",
      text: `Change shipping status to "${newStatus}"?`,
      showCancelButton: true,
      confirmButtonColor: "#D84040",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, Update",
      cancelButtonText: "Cancel",
    });
    if (!confirm.isConfirmed) return;

    try {
      setUpdating(orderId);
      const res = await fetch(
        `http://localhost:5000/api/v1/admin/orders/${orderId}`,
        {
          method: "PATCH",
          headers: { Authorization: token, "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        },
      );
      if (!res.ok) throw new Error();

      // FIX 4: consistent _id-first comparison in the map
      setOrders((prev) =>
        prev.map((o) =>
          (o._id || o.orderId) === orderId
            ? { ...o, shippingStatus: newStatus }
            : o,
        ),
      );
      Swal.fire({
        icon: "success",
        title: "Updated!",
        text: "Shipping status updated successfully.",
        confirmButtonColor: "#D84040",
        timer: 1500,
        timerProgressBar: true,
      });
    } catch {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to update shipping status.",
        confirmButtonColor: "#D84040",
      });
    } finally {
      setUpdating(null);
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
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="text-center mb-6">
          <p className="text-[#D84040] text-xs font-bold uppercase tracking-widest mb-2">
            Platform Overview
          </p>
          <Typography
            variant="h1"
            className="text-4xl md:text-5xl font-serif"
            style={{ color: "#1D1616" }}
          >
            All Orders
          </Typography>
          <p className="text-gray-500 text-sm mt-2">
            Manage shipping status for completed orders
          </p>
        </div>

        {/* Stats */}
        {orders.length > 0 && (
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-white rounded-2xl p-4 text-center shadow-sm border border-[#D84040]/5">
              <p className="text-2xl font-bold text-[#D84040]">
                {orders.length}
              </p>
              <p className="text-xs text-gray-400 uppercase tracking-wide mt-1">
                Total Orders
              </p>
            </div>
            <div className="bg-white rounded-2xl p-4 text-center shadow-sm border border-[#D84040]/5">
              <p className="text-2xl font-bold text-green-600">
                {orders.filter((o) => o.orderStatus === "finished").length}
              </p>
              <p className="text-xs text-gray-400 uppercase tracking-wide mt-1">
                Finished
              </p>
            </div>
          </div>
        )}

        {/* Search */}
        <div className="relative mb-6">
          <MagnifyingGlassIcon className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by buyer name, phone or order ID..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#D84040] bg-white text-sm shadow-sm"
          />
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-24 space-y-4">
            <ShoppingBagIcon className="h-20 w-20 text-[#D84040]/20 mx-auto" />
            <p className="text-gray-500 text-xl font-medium">No orders found</p>
          </div>
        ) : (
          <div className="space-y-5">
            {filtered.map((order) => {
              // FIX 1 & 2: _id first for oid, addressDetails first for buyer
              const oid = order._id || order.orderId;
              const oStatus =
                orderStatusConfig[order.orderStatus] ||
                orderStatusConfig.pending;
              const sStatus =
                shippingConfig[order.shippingStatus] || shippingConfig.pending;
              const isFinished = order.orderStatus === "finished";

              // FIX 1 (root cause): addressDetails takes priority — that's what the API returns
              const buyer = order.addressDetails || order.buyerDetails || {};

              const isUpdating = updating === oid;

              return (
                <div
                  key={oid}
                  className="bg-white rounded-2xl shadow-md border border-[#D84040]/5 overflow-hidden"
                >
                  <div className="h-1.5 w-full bg-gradient-to-r from-[#1D1616] via-[#D84040] to-[#8E1616]" />

                  {/* Order header */}
                  <div className="p-5 border-b border-gray-100">
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div className="space-y-1">
                        <p className="text-xs text-gray-400 font-mono">
                          #{oid?.slice(-8).toUpperCase()}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <CalendarDaysIcon className="h-3.5 w-3.5 text-[#D84040]" />
                          {order.orderDate
                            ? new Date(order.orderDate).toLocaleDateString(
                                "en-GB",
                                {
                                  day: "numeric",
                                  month: "long",
                                  year: "numeric",
                                },
                              )
                            : "—"}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        {/* Order status badge */}
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${oStatus.bg} ${oStatus.text} ${oStatus.border}`}
                        >
                          {isFinished ? (
                            <CheckCircleIcon className="h-3.5 w-3.5" />
                          ) : (
                            <ClockIcon className="h-3.5 w-3.5" />
                          )}
                          {oStatus.label}
                        </span>

                        {/* Shipping: static badge for non-finished, dropdown for finished */}
                        {!isFinished ? (
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${sStatus.bg} ${sStatus.text} ${sStatus.border}`}
                          >
                            <TruckIcon className="h-3.5 w-3.5" />
                            {sStatus.label}
                          </span>
                        ) : (
                          <select
                            value={order.shippingStatus || "pending"}
                            onChange={(e) =>
                              handleShippingChange(oid, e.target.value)
                            }
                            disabled={isUpdating}
                            className="border border-gray-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-[#1D1616] bg-white focus:outline-none focus:border-[#D84040] disabled:opacity-50 cursor-pointer"
                          >
                            <option value="pending">Pending</option>
                            <option value="out for delivery">
                              Out for Delivery
                            </option>
                            <option value="delivered">Delivered</option>
                          </select>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Buyer info — renders as long as first_name exists anywhere in buyer */}
                  {(buyer.first_name || buyer.firstname) && (
                    <div className="px-5 py-3 bg-[#EEEEEE]/50 flex items-center gap-3 flex-wrap border-b border-gray-100">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-[#D84040]/10 flex items-center justify-center shrink-0">
                          <UserIcon className="h-4 w-4 text-[#D84040]" />
                        </div>
                        <p className="font-semibold text-[#1D1616] text-sm">
                          {buyer.first_name || buyer.firstname}{" "}
                          {buyer.last_name || buyer.lastname}
                        </p>
                      </div>
                      {(buyer.phone_number || buyer.phone) && (
                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                          <PhoneIcon className="h-3.5 w-3.5 text-[#D84040]" />
                          <span dir="ltr">
                            {buyer.phone_number || buyer.phone}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Order items */}
                  <div className="divide-y divide-gray-50">
                    {(order.orderItems || []).map((item, i) => {
                      const p = item.product || {};
                      return (
                        <div
                          key={p._id || i}
                          className="p-4 flex items-center gap-4"
                        >
                          <div className="w-14 h-14 rounded-xl overflow-hidden bg-[#EEEEEE] shrink-0">
                            {p.coverImage ? (
                              <img
                                src={p.coverImage}
                                alt={p.title_ar || p.title_en}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-100" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-[#1D1616] text-sm truncate">
                              {p.title_ar || p.title_en}
                            </p>
                            <p className="text-xs text-gray-400 mt-0.5">
                              Qty: {item.quantity}
                            </p>
                            <p className="text-[#D84040] font-bold text-sm mt-0.5">
                              {p.originalPrice || p.finalPrice} EGP
                            </p>
                          </div>
                          {/* Per-item seller full info */}
                          {p.seller && (
                            <div className="shrink-0 flex items-center gap-2 bg-[#EEEEEE]/60 rounded-xl px-3 py-2 border border-[#D84040]/10">
                              <div className="w-7 h-7 rounded-full bg-[#D84040]/10 flex items-center justify-center shrink-0">
                                <UserIcon className="h-3.5 w-3.5 text-[#D84040]" />
                              </div>
                              <div className="min-w-0">
                                <p className="text-xs font-semibold text-[#1D1616] truncate max-w-[120px]">
                                  {p.seller?.name || "Unknown Seller"}
                                </p>
                                {p.seller?.phone && (
                                  <div className="flex items-center gap-1 mt-0.5">
                                    <PhoneIcon className="h-3 w-3 text-[#D84040] shrink-0" />
                                    <p
                                      className="text-xs text-gray-400"
                                      dir="ltr"
                                    >
                                      {p.seller.phone}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
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

export default AdminOrders;
