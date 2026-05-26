import React, { useState, useEffect } from "react";
import { Typography } from "@material-tailwind/react";
import {
  ShoppingBagIcon,
  CalendarDaysIcon,
  CheckCircleIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import Swal from "sweetalert2";

const BG_STYLE = {
  backgroundColor: "#EEEEEE",
  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23D84040' fill-opacity='0.08'%3E%3Cpath d='M30 0l5 10h10l-8 6 3 10-10-7-10 7 3-10-8-6h10z'/%3E%3C/g%3E%3C/svg%3E")`,
};

const statusLabel = {
  pending: {
    ar: "قيد الانتظار",
    bg: "bg-amber-100",
    text: "text-amber-800",
    border: "border-amber-300",
  },
  finished: {
    ar: "منتهي",
    bg: "bg-green-100",
    text: "text-green-800",
    border: "border-green-300",
  },
};

const orderStatusLabel = {
  pending: {
    ar: "قيد الانتظار",
    bg: "bg-amber-100",
    text: "text-amber-800",
    border: "border-amber-300",
  },
  finished: {
    ar: "منتهي",
    bg: "bg-green-100",
    text: "text-green-800",
    border: "border-green-300",
  }
};

const SellerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null); // productId being updated

  const token = localStorage.getItem("token");
  const sellerId = localStorage.getItem("id");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/v1/order/seller/${sellerId}`,
          {
            headers: { Authorization: token },
          },
        );
        const data = await res.json();
        setOrders(data?.data?.orders || []);
      } catch {
        Swal.fire({
          icon: "error",
          title: "خطأ",
          text: "تعذّر تحميل الطلبات.",
          confirmButtonColor: "#D84040",
        });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleStatusChange = async (orderId, productId, newStatus) => {
    if (newStatus !== "finished") return;
    const confirm = await Swal.fire({
      icon: "question",
      title: "تأكيد",
      text: "هل أنت متأكد أنك تريد تحديد هذا المنتج كـ 'منتهي'؟",
      showCancelButton: true,
      confirmButtonColor: "#D84040",
      cancelButtonColor: "#8E1616",
      confirmButtonText: "نعم",
      cancelButtonText: "إلغاء",
    });
    if (!confirm.isConfirmed) return;

    try {
      setUpdating(productId);
      const res = await fetch(
        `http://localhost:5000/api/v1/order/${orderId}/product/${productId}`,
        {
          method: "PATCH",
          headers: { Authorization: token },
        },
      );
      if (!res.ok) throw new Error();

      // Update locally
      setOrders((prev) =>
        prev.map((o) => {
          if (o.orderId !== orderId) return o;
          return {
            ...o,
            orderItems: o.orderItems.map((item) =>
              item.product?._id === productId
                ? { ...item, itemStatus: "finished" }
                : item,
            ),
          };
        }),
      );

      Swal.fire({
        icon: "success",
        title: "تم التحديث",
        text: "تم تحديث حالة المنتج بنجاح.",
        confirmButtonColor: "#D84040",
        timer: 1500,
        timerProgressBar: true,
      });
    } catch {
      Swal.fire({
        icon: "error",
        title: "خطأ",
        text: "فشل تحديث الحالة.",
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
    <div className="min-h-screen w-full" style={BG_STYLE} dir="rtl">
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="text-center mb-10">
          <p className="text-[#D84040] text-lg font-bold uppercase tracking-widest mb-2">
            إدارة المبيعات
          </p>
          <Typography
            variant="h1"
            className="text-6xl md:text-6xl font-serif"
            style={{ color: "#1D1616" }}
          >
            طلباتي
          </Typography>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-24 space-y-4">
            <ShoppingBagIcon className="h-20 w-20 text-[#D84040]/20 mx-auto" />
            <p className="text-gray-500 text-xl font-medium">
              لا توجد طلبات بعد
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {orders.map((order) => {
              const oStatus =
                orderStatusLabel[order.orderStatus] || orderStatusLabel.pending;
              return (
                <div
                  key={order.orderId}
                  className="bg-white rounded-2xl shadow-md border border-[#D84040]/5 overflow-hidden"
                >
                  <div className="h-1.5 w-full bg-gradient-to-r from-[#1D1616] via-[#D84040] to-[#8E1616]" />

                  {/* Order header */}
                  <div className="p-5 flex items-center justify-between gap-3 flex-wrap">
                    <div className="space-y-1">
                      <p className="text-xs text-gray-400 font-mono">
                        #{order.orderId?.slice(-8).toUpperCase()}
                      </p>
                      <div className="flex items-center gap-2 text-lg text-black">
                        <CalendarDaysIcon className="h-3.5 w-3.5 text-[#D84040]" />
                        {order.orderDate
                          ? new Date(order.orderDate).toLocaleDateString(
                              "ar-EG",
                            )
                          : "—"}
                      </div>
                    </div>
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${oStatus.bg} ${oStatus.text} ${oStatus.border}`}
                    >
                      {order.orderStatus === "finished" ? (
                        <CheckCircleIcon className="h-3.5 w-3.5" />
                      ) : (
                        <ClockIcon className="h-3.5 w-3.5" />
                      )}
                      {oStatus.ar}
                    </span>
                  </div>

                  {/* Items */}
                  <div className="divide-y divide-gray-50 border-t border-gray-100">
                    {(order.orderItems || []).map((item, i) => {
                      const p = item.product || {};
                      const iStatus =
                        statusLabel[item.itemStatus] || statusLabel.pending;
                      const isDone = item.itemStatus === "finished";

                      return (
                        <div
                          key={p._id || i}
                          className="p-4 flex items-center gap-4"
                        >
                          {/* Image */}
                          <div className="w-32 h-32 rounded-xl overflow-hidden bg-[#EEEEEE] shrink-0">
                            {p.coverImage ? (
                              <img
                                src={p.coverImage}
                                alt={p.title_ar}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-100" />
                            )}
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-[#1D1616] text-sm truncate">
                              {p.title_ar}
                            </p>
                            <p className="text-sm text-black mt-0.5">
                              الكمية: {item.quantity}
                            </p>
                            <p className="text-[#D84040] font-bold text-sm mt-0.5">
                              {p.originalPrice} ج.م
                            </p>
                          </div>

                          {/* Status dropdown */}
                          <div className="shrink-0">
                            {isDone ? (
                              <span
                                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border ${iStatus.bg} ${iStatus.text} ${iStatus.border}`}
                              >
                                <CheckCircleIcon className="h-3.5 w-3.5" />
                                {iStatus.ar}
                              </span>
                            ) : (
                              <select
                                value={item.itemStatus || "pending"}
                                onChange={(e) =>
                                  handleStatusChange(
                                    order.orderId,
                                    p._id,
                                    e.target.value,
                                  )
                                }
                                disabled={updating === p._id}
                                className="border border-gray-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-[#1D1616] bg-white focus:outline-none focus:border-[#D84040] disabled:opacity-50 cursor-pointer"
                              >
                                <option value="pending">قيد الانتظار</option>
                                <option value="finished">منتهي</option>
                              </select>
                            )}
                          </div>
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

export default SellerOrders;
