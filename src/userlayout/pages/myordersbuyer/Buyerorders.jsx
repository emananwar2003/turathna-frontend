import React, { useState, useEffect } from "react";
import { Typography } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import {
  ShoppingBagIcon,
  CalendarDaysIcon,
  TruckIcon,
  CheckCircleIcon,
  ClockIcon,
  CurrencyDollarIcon,
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
    icon: <ClockIcon className="h-3.5 w-3.5" />,
  },
  "in progress": {
    label: "In Progress",
    bg: "bg-blue-100",
    text: "text-blue-800",
    border: "border-blue-300",
    icon: <ClockIcon className="h-3.5 w-3.5" />,
  },
  finished: {
    label: "Finished",
    bg: "bg-green-100",
    text: "text-green-800",
    border: "border-green-300",
    icon: <CheckCircleIcon className="h-3.5 w-3.5" />,
  },
  cancelled: {
    label: "Cancelled",
    bg: "bg-red-100",
    text: "text-[#D84040]",
    border: "border-[#D84040]/40",
    icon: null,
  },
};

const shippingConfig = {
  pending: {
    label: "Preparing",
    bg: "bg-gray-100",
    text: "text-gray-600",
    border: "border-gray-200",
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

const BuyerOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const buyerId = localStorage.getItem("id");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/v1/order/buyer/${buyerId}`,
          { headers: { Authorization: token } },
        );
        const data = await res.json();
        setOrders(data?.data?.ordersList || data?.data?.orders || []);
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
        {/* Page Title */}
        <div className="text-center mb-10">
          <p className="text-[#D84040] text-xs font-bold uppercase tracking-widest mb-2">
            Your purchases
          </p>
          <Typography
            variant="h1"
            className="text-4xl md:text-5xl font-serif"
            style={{ color: "#1D1616" }}
          >
            My Orders
          </Typography>
        </div>

        {/* Empty State */}
        {orders.length === 0 ? (
          <div className="text-center py-24 space-y-4">
            <ShoppingBagIcon className="h-20 w-20 text-[#D84040]/20 mx-auto" />
            <p className="text-gray-500 text-xl font-medium">No orders yet</p>
            <p className="text-gray-400 text-sm">
              Browse our handcrafted products and place your first order
            </p>
            <button
              onClick={() => navigate("/products")}
              className="mt-2 bg-[#D84040] text-white px-8 py-3 rounded-xl font-semibold hover:bg-[#8E1616] transition-colors shadow-md"
            >
              Browse Products
            </button>
          </div>
        ) : (
          <div className="space-y-5">
            {orders.map((order) => {
              const oid = order._id || order.orderId;
              const oStatus =
                orderStatusConfig[order.orderStatus] ||
                orderStatusConfig.pending;
              const sStatus =
                shippingConfig[order.shippingStatus] || shippingConfig.pending;
              const total = (order.orderItems || []).reduce(
                (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
                0,
              );

              return (
                <div
                  key={oid}
                  className="bg-white rounded-2xl shadow-md border border-[#D84040]/5 overflow-hidden hover:shadow-lg transition-all duration-200"
                >
                  {/* Top accent bar */}
                  <div className="h-1.5 w-full bg-gradient-to-r from-[#1D1616] via-[#D84040] to-[#8E1616]" />

                  {/* Order Header */}
                  <div className="p-5 flex items-start justify-between gap-3 flex-wrap border-b border-gray-100">
                    <div className="space-y-1">
                      <p className="text-base font-bold text-[#1D1616] font-mono">
                        Order #{oid?.slice(-8).toUpperCase()}
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
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${oStatus.bg} ${oStatus.text} ${oStatus.border}`}
                      >
                        {oStatus.icon}
                        {oStatus.label}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${sStatus.bg} ${sStatus.text} ${sStatus.border}`}
                      >
                        <TruckIcon className="h-3.5 w-3.5" />
                        {sStatus.label}
                      </span>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="divide-y divide-gray-50">
                    {(order.orderItems || []).map((item, i) => (
                      <div
                        key={item.name || i}
                        className="p-4 flex items-center gap-4"
                      >
                        {/* Cover Image */}
                        {item.coverImage ? (
                          <img
                            src={item.coverImage}
                            alt={item.name}
                            className="h-16 w-16 rounded-xl object-cover shrink-0 border border-gray-100 shadow-sm"
                            onError={(e) => {
                              e.target.style.display = "none";
                              e.target.nextSibling.style.display = "flex";
                            }}
                          />
                        ) : null}
                        <div
                          className="h-16 w-16 rounded-xl bg-gray-100 shrink-0 items-center justify-center"
                          style={{ display: item.coverImage ? "none" : "flex" }}
                        >
                          <ShoppingBagIcon className="h-6 w-6 text-gray-300" />
                        </div>

                        {/* Item Details */}
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-[#1D1616] text-sm truncate">
                            {item.name}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            Qty: {item.quantity}
                          </p>
                          <p className="text-xs text-gray-400">
                            {item.price} EGP each
                          </p>
                        </div>

                        {/* Item Subtotal */}
                        <p className="text-[#D84040] font-bold text-sm shrink-0">
                          {(
                            (item.price || 0) * (item.quantity || 1)
                          ).toLocaleString()}{" "}
                          EGP
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Order Footer */}
                  <div className="px-5 py-3 border-t-2 border-dashed border-gray-100 flex items-center justify-between">
                    <p className="text-xs text-gray-400">
                      {order.orderItems?.length || 0} item(s)
                    </p>
                    <div className="flex items-center gap-1.5 font-bold text-[#D84040]">
                      <CurrencyDollarIcon className="h-4 w-4" />
                      <span>{total.toLocaleString()} EGP</span>
                    </div>
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

export default BuyerOrders;
