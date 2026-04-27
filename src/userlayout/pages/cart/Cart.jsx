import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Typography } from "@material-tailwind/react";
import {
  TrashIcon,
  ShoppingBagIcon,
  ArrowLeftIcon,
  PlusIcon,
  MinusIcon,
} from "@heroicons/react/24/outline";
import Swal from "sweetalert2";
import { useCart } from "../../../context/Cartcontext "; 

const BG_STYLE = {
  backgroundColor: "#EEEEEE",
  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23D84040' fill-opacity='0.06'%3E%3Cpath d='M30 0l5 10h10l-8 6 3 10-10-7-10 7 3-10-8-6h10z'/%3E%3C/g%3E%3C/svg%3E")`,
};

const Cart = () => {
  const navigate = useNavigate();
  const {
    cartItems,
    loading,
    total,
    addToCart,
    decreaseQty,
    removeItem,
    clearCart,
  } = useCart();
  const [actionLoading, setActionLoading] = useState(null);

  const token = localStorage.getItem("token");

  const withLoading = async (productId, fn) => {
    setActionLoading(productId);
    await fn();
    setActionLoading(null);
  };

  const handleRemove = async (productId) => {
    const confirm = await Swal.fire({
      icon: "warning",
      title: "Remove Item?",
      text: "Are you sure you want to remove this item?",
      showCancelButton: true,
      confirmButtonColor: "#D84040",
      cancelButtonColor: "#8E1616",
      confirmButtonText: "Yes, Remove",
      cancelButtonText: "Cancel",
    });
    if (!confirm.isConfirmed) return;
    withLoading(productId, () => removeItem(productId));
  };

  const handleClear = async () => {
    const confirm = await Swal.fire({
      icon: "warning",
      title: "Clear Cart?",
      text: "This will remove all items from your cart.",
      showCancelButton: true,
      confirmButtonColor: "#D84040",
      cancelButtonColor: "#8E1616",
      confirmButtonText: "Yes, Clear All",
      cancelButtonText: "Cancel",
    });
    if (!confirm.isConfirmed) return;
    clearCart();
  };

  // ── Not logged in ─────────────────────────────────────────────────────────────
  if (!token) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={BG_STYLE}
      >
        <div className="text-center space-y-4">
          <ShoppingBagIcon className="h-16 w-16 text-[#D84040]/40 mx-auto" />
          <p className="text-[#1D1616] font-semibold text-lg">
            You need to log in to view your cart
          </p>
          <button
            onClick={() => navigate("/registration/userlogin")}
            className="bg-[#D84040] text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-[#8E1616] transition-colors"
          >
            Log In
          </button>
        </div>
      </div>
    );
  }

  // ── Loading ───────────────────────────────────────────────────────────────────
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

  return (
    <div className="min-h-screen w-full" style={BG_STYLE}>
      <div className="max-w-4xl mx-auto px-4 py-10">
        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-sm text-[#8E1616] hover:text-[#D84040] mb-8 transition-colors font-semibold"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Continue Shopping
        </button>

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Typography
            variant="h1"
            className="text-4xl font-serif"
            style={{ color: "#1D1616" }}
          >
            Your Cart
          </Typography>
          {cartItems.length > 0 && (
            <span className="bg-[#D84040] text-white text-xs font-bold px-3 py-1 rounded-full">
              {cartItems.length} {cartItems.length === 1 ? "item" : "items"}
            </span>
          )}
        </div>

        { !loading && cartItems.length === 0 ?(
          /* ── Empty State ── */
          <div className="text-center py-24 space-y-4">
            <ShoppingBagIcon className="h-20 w-20 text-[#D84040]/20 mx-auto" />
            <p className="text-[#1D1616] font-semibold text-xl">
              Your cart is empty
            </p>
            <p className="text-gray-400 text-sm">
              Discover our handcrafted products and add your favorites
            </p>
            <button
              onClick={() => navigate("/products")}
              className="mt-4 bg-[#D84040] text-white px-8 py-3 rounded-xl font-semibold hover:bg-[#8E1616] transition-colors shadow-md"
            >
              Browse Products
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* ── Cart Items ── */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => {
                const p = item.product;
                const pid = p?._id;
                const isActioning = actionLoading === pid;

                return (
                  <div
                    key={item._id}
                    className="bg-white rounded-2xl shadow-md p-4 border border-[#D84040]/5 transition-all duration-200 hover:shadow-lg"
                  >
                    {/* Top row: image + title + price */}
                    <div className="flex items-center gap-4 mb-4">
                      {/* Image */}
                      <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-[#EEEEEE]">
                        {p?.coverImage ? (
                          <img
                            src={p.coverImage}
                            alt={p.title_en}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">
                            No img
                          </div>
                        )}
                      </div>

                      {/* Title + price */}
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-[#1D1616] text-base leading-tight truncate">
                          {p?.title_en}
                        </p>
                        <p className="text-[#D84040] font-bold text-lg mt-1">
                          {p?.finalPrice}{" "}
                          <span className="text-xs text-gray-400 font-normal">
                            EGP
                          </span>
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          Subtotal:{" "}
                          <span className="font-semibold text-[#1D1616]">
                            {(
                              (p?.finalPrice || 0) * item.quantity
                            ).toLocaleString()}{" "}
                            EGP
                          </span>
                        </p>
                      </div>
                    </div>

                    {/* Bottom row: quantity controls + remove — stacked friendly */}
                    <div className="flex items-center justify-between gap-3 pt-3 border-t border-gray-100">
                      {/* Quantity */}
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() =>
                            withLoading(pid, () => decreaseQty(pid))
                          }
                          disabled={isActioning}
                          className="w-9 h-9 rounded-full bg-[#EEEEEE] hover:bg-[#D84040] hover:text-white text-[#1D1616] flex items-center justify-center transition-all duration-200 disabled:opacity-40 font-bold"
                        >
                          <MinusIcon className="h-4 w-4" />
                        </button>
                        <span className="font-bold text-[#1D1616] text-lg w-6 text-center">
                          {isActioning ? (
                            <span className="block w-4 h-4 border-2 border-[#D84040] border-t-transparent rounded-full animate-spin mx-auto" />
                          ) : (
                            item.quantity
                          )}
                        </span>
                        <button
                          onClick={() => withLoading(pid, () => addToCart(pid))}
                          disabled={isActioning}
                          className="w-9 h-9 rounded-full bg-[#EEEEEE] hover:bg-[#D84040] hover:text-white text-[#1D1616] flex items-center justify-center transition-all duration-200 disabled:opacity-40 font-bold"
                        >
                          <PlusIcon className="h-4 w-4" />
                        </button>
                      </div>

                      {/* Remove button */}
                      <button
                        onClick={() => handleRemove(pid)}
                        disabled={isActioning}
                        className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-[#D84040] transition-colors duration-200 disabled:opacity-40 font-medium"
                      >
                        <TrashIcon className="h-4 w-4" />
                        Remove
                      </button>
                    </div>
                  </div>
                );
              })}

              {/* ── Clear Cart — big button ── */}
              <button
                onClick={handleClear}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl border-2 border-[#D84040] text-[#D84040] hover:bg-[#D84040] hover:text-white transition-all duration-200 font-bold text-sm mt-2"
              >
                <TrashIcon className="h-5 w-5" />
                Clear Entire Cart
              </button>
            </div>

            {/* ── Order Summary ── */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-md p-6 border border-[#D84040]/5 sticky top-6">
                <p className="font-bold text-[#1D1616] text-base mb-4">
                  Order Summary
                </p>

                <div className="space-y-3 text-sm">
                  {cartItems.map((item) => (
                    <div
                      key={item._id}
                      className="flex justify-between text-gray-500"
                    >
                      <span className="truncate max-w-[140px]">
                        {item.product?.title_en} × {item.quantity}
                      </span>
                      <span className="font-medium text-[#1D1616] shrink-0 ml-2">
                        {(
                          (item.product?.finalPrice || 0) * item.quantity
                        ).toLocaleString()}{" "}
                        EGP
                      </span>
                    </div>
                  ))}
                </div>

                <div className="h-px bg-[#D84040]/15 my-4" />

                <div className="flex justify-between items-center font-bold text-[#1D1616]">
                  <span>Total</span>
                  <span className="text-[#D84040] text-xl">
                    {total.toLocaleString()} EGP
                  </span>
                </div>

                <Link
                  to="/checkout"
                  className="block mt-6 w-full text-center bg-[#D84040] hover:bg-[#8E1616] text-white py-3.5 rounded-xl font-bold text-sm transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg"
                  style={{ boxShadow: "0 6px 20px -4px rgba(216,64,64,0.4)" }}
                >
                  Proceed to Checkout
                </Link>

                <button
                  onClick={() => navigate("/products")}
                  className="block w-full text-center text-[#8E1616] hover:text-[#D84040] py-2.5 text-sm font-medium transition-colors mt-2"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
