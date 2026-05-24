import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Typography } from "@material-tailwind/react";
import {
  ArrowLeftIcon,
  ShoppingBagIcon,
  CreditCardIcon,
  BanknotesIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import Swal from "sweetalert2";
import { useAuth } from "../../../context/Authcontext";
import { useCart } from "../../../context/Cartcontext ";

const BG_STYLE = {
  backgroundColor: "#EEEEEE",
  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23D84040' fill-opacity='0.06'%3E%3Cpath d='M30 0l5 10h10l-8 6 3 10-10-7-10 7 3-10-8-6h10z'/%3E%3C/g%3E%3C/svg%3E")`,
};

const REGIONS = [
  "Cairo",
  "Alexandria",
  "Giza",
  "Luxor",
  "Aswan",
  "Sinai",
  "Nubia",
  "Siwa Oasis",
  "Upper Egypt",
  "Fayoum",
];


const SHIPPING_FEES = { cairo: 70, giza: 100 };
const getDeliveryFee = (region) => SHIPPING_FEES[region?.toLowerCase()] ?? 120;

const ReadField = ({ label, value }) => (
  <div>
    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
      {label}
    </label>
    <div className="w-full border border-gray-200 bg-gray-50 p-3 rounded-xl text-sm text-[#1D1616] font-medium">
      {value || "—"}
    </div>
  </div>
);

const InputField = ({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  error,
}) => (
  <div>
    <label className="block text-sm font-semibold text-[#1D1616] mb-1.5">
      {label}
    </label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`w-full border p-3 rounded-xl focus:outline-none focus:border-[#D84040] text-sm transition-colors ${
        error ? "border-red-400" : "border-gray-200"
      }`}
    />
    {error && <p className="text-[#D84040] text-xs mt-1">{error}</p>}
  </div>
);

const SectionTitle = ({ icon, children }) => (
  <div className="flex items-center gap-3 my-6">
    <div className="h-px flex-1 bg-[#D84040]/20" />
    <div className="flex items-center gap-2 text-[#8E1616]">
      {icon}
      <p className="text-xs font-bold uppercase tracking-widest whitespace-nowrap">
        {children}
      </p>
    </div>
    <div className="h-px flex-1 bg-[#D84040]/20" />
  </div>
);

const Checkout = () => {
  const navigate = useNavigate();
  const { userinfo } = useAuth();
  const { cartItems, total, clearCart } = useCart();
  const [profile, setProfile] = useState(null);
  const [address, setAddress] = useState("");
  const [region, setRegion] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  const deliveryFee = region ? getDeliveryFee(region) : null;
  const grandTotal = deliveryFee !== null ? total + deliveryFee : null;

  useEffect(() => {
    const fetchProfile = async () => {
      const id = localStorage.getItem("id");
      if (!token || !id) return;
      try {
        const res = await fetch(
          `http://localhost:5000/api/v1/user/profile/${id}`,
          {
            headers: { Authorization: token },
          },
        );
        const data = await res.json();
        const u = data?.user || data?.data?.user || data?.data || {};
        setProfile(u);
      } catch {
        console.error("Failed to fetch profile");
      }
    };
    fetchProfile();
  }, []);

  const validate = () => {
    const e = {};
    if (!address.trim()) e.address = "Delivery address is required";
    if (!region) e.region = "Please select a region";
    if (!paymentMethod) e.paymentMethod = "Please select a payment method";
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length > 0) {
      setErrors(e);
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/v1/order/checkout", {
        method: "POST",
        headers: { Authorization: token, "Content-Type": "application/json" },
        body: JSON.stringify({ address, region, paymentMethod }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to place order");

      if (paymentMethod === "online") {
        
        if (!data?.url) throw new Error("Payment URL not received from server");
        window.location.replace(data.url);
        return;
      }
      clearCart();
      Swal.fire({
        icon: "success",
        title: "Order Placed!",
        text: "Your order has been placed successfully. We'll be in touch soon.",
        confirmButtonColor: "#D84040",
        confirmButtonText: "Back to Shopping",
      }).then(() => navigate("/"));
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.message || "Failed to place order.",
        confirmButtonColor: "#D84040",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={BG_STYLE}
      >
        <div className="text-center space-y-4">
          <ShoppingBagIcon className="h-16 w-16 text-[#D84040]/30 mx-auto" />
          <p className="text-[#1D1616] font-semibold text-lg">
            Please log in to checkout
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

  if (cartItems.length === 0) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={BG_STYLE}
      >
        <div className="text-center space-y-4">
          <ShoppingBagIcon className="h-16 w-16 text-[#D84040]/30 mx-auto" />
          <p className="text-[#1D1616] font-semibold text-lg">
            Your cart is empty
          </p>
          <button
            onClick={() => navigate("/products")}
            className="bg-[#D84040] text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-[#8E1616] transition-colors"
          >
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full" style={BG_STYLE}>
      <div className="max-w-4xl mx-auto px-4 py-10">
        <button
          onClick={() => navigate("/cart")}
          className="flex items-center gap-1.5 text-sm text-[#8E1616] hover:text-[#D84040] mb-8 transition-colors font-semibold"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back to Cart
        </button>

        <Typography
          variant="h1"
          className="text-4xl font-serif mb-8"
          style={{ color: "#1D1616" }}
        >
          Checkout
        </Typography>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ── Left: Form ── */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-md p-6 md:p-8 border border-[#D84040]/5">
            <SectionTitle icon={<ShoppingBagIcon className="h-4 w-4" />}>
              Order Summary
            </SectionTitle>
            <div className="space-y-3">
              {cartItems.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center gap-4 p-3 bg-[#EEEEEE] rounded-xl"
                >
                  <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0">
                    {item.product?.coverImage ? (
                      <img
                        src={item.product.coverImage}
                        alt={item.product.title_en}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[#1D1616] text-sm truncate">
                      {item.product?.title_en}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <p className="text-[#D84040] font-bold text-sm shrink-0">
                    {(
                      (item.product?.finalPrice || 0) * item.quantity
                    ).toLocaleString()}{" "}
                    EGP
                  </p>
                </div>
              ))}
            </div>

            <SectionTitle icon={<CheckCircleIcon className="h-4 w-4" />}>
              Your Information
            </SectionTitle>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <ReadField label="First Name" value={profile?.firstname} />
              <ReadField label="Last Name" value={profile?.lastname} />
              <ReadField label="Email" value={profile?.email} />
              <ReadField label="Phone" value={profile?.phone} />
            </div>

            <SectionTitle icon={<MapPinIcon className="h-4 w-4" />}>
              Delivery Information
            </SectionTitle>
            <div className="space-y-4">
              <InputField
                label="Delivery Address"
                value={address}
                onChange={(v) => {
                  setAddress(v);
                  setErrors((p) => ({ ...p, address: "" }));
                }}
                placeholder="Enter your full delivery address"
                error={errors.address}
              />
              <div>
                <label className="block text-sm font-semibold text-[#1D1616] mb-1.5">
                  Region
                </label>
                <select
                  value={region}
                  onChange={(e) => {
                    setRegion(e.target.value);
                    setErrors((p) => ({ ...p, region: "" }));
                  }}
                  className={`w-full border p-3 rounded-xl focus:outline-none focus:border-[#D84040] text-sm bg-white transition-colors ${
                    errors.region ? "border-red-400" : "border-gray-200"
                  }`}
                >
                  <option value="">Select your region</option>
                  {REGIONS.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
                {errors.region && (
                  <p className="text-[#D84040] text-xs mt-1">{errors.region}</p>
                )}
              </div>
            </div>

            <SectionTitle icon={<CreditCardIcon className="h-4 w-4" />}>
              Payment Method
            </SectionTitle>
            <div className="space-y-3">
              <label
                className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                  paymentMethod === "cash"
                    ? "border-[#D84040] bg-[#D84040]/5"
                    : "border-gray-200 hover:border-[#D84040]/50"
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="cash"
                  checked={paymentMethod === "cash"}
                  onChange={() => {
                    setPaymentMethod("cash");
                    setErrors((p) => ({ ...p, paymentMethod: "" }));
                  }}
                  className="accent-[#D84040] w-4 h-4"
                />
                <BanknotesIcon className="h-5 w-5 text-[#D84040] shrink-0" />
                <div>
                  <p className="font-semibold text-[#1D1616] text-sm">
                    Cash on Arrival
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Pay when your order is delivered
                  </p>
                </div>
                {paymentMethod === "cash" && (
                  <CheckCircleIcon className="h-5 w-5 text-[#D84040] ml-auto" />
                )}
              </label>

              <label
                className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                  paymentMethod === "online"
                    ? "border-[#D84040] bg-[#D84040]/5"
                    : "border-gray-200 hover:border-[#D84040]/50"
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="online"
                  checked={paymentMethod === "online"}
                  onChange={() => {
                    setPaymentMethod("online");
                    setErrors((p) => ({ ...p, paymentMethod: "" }));
                  }}
                  className="accent-[#D84040] w-4 h-4"
                />
                <CreditCardIcon className="h-5 w-5 text-[#D84040] shrink-0" />
                <div>
                  <p className="font-semibold text-[#1D1616] text-sm">
                    Online Payment
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    You'll be redirected to the payment gateway
                  </p>
                </div>
                {paymentMethod === "online" && (
                  <CheckCircleIcon className="h-5 w-5 text-[#D84040] ml-auto" />
                )}
              </label>

              {errors.paymentMethod && (
                <p className="text-[#D84040] text-xs">{errors.paymentMethod}</p>
              )}
            </div>
          </div>

          {/* ── Right: Order Total ── */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-md p-6 border border-[#D84040]/5 sticky top-6">
              <p className="font-bold text-[#1D1616] text-base mb-4">
                Order Total
              </p>

              <div className="space-y-2 text-sm mb-4">
                {cartItems.map((item) => (
                  <div
                    key={item._id}
                    className="flex justify-between text-gray-500"
                  >
                    <span className="truncate max-w-[130px]">
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

              <div className="h-px bg-[#D84040]/15 my-3" />

              <div className="flex justify-between text-sm text-gray-500 mb-2">
                <span>Subtotal</span>
                <span className="font-medium text-[#1D1616]">
                  {total.toLocaleString()} EGP
                </span>
              </div>

              <div className="flex justify-between text-sm text-gray-500 mb-2">
                <span>Delivery Fee</span>
                <span className="font-medium text-[#1D1616]">
                  {deliveryFee !== null
                    ? `${deliveryFee.toLocaleString()} EGP`
                    : "—"}
                </span>
              </div>

              <div className="h-px bg-[#D84040]/15 my-3" />

              <div className="flex justify-between items-center font-bold text-[#1D1616] mb-6">
                <span>Total</span>
                <span className="text-[#D84040] text-xl">
                  {grandTotal !== null
                    ? `${grandTotal.toLocaleString()} EGP`
                    : `${total.toLocaleString()} EGP`}
                </span>
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-[#D84040] hover:bg-[#8E1616] text-white py-4 rounded-xl font-bold text-sm transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100"
                style={{ boxShadow: "0 6px 20px -4px rgba(216,64,64,0.4)" }}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </>
                ) : paymentMethod === "online" ? (
                  <>
                    <CreditCardIcon className="h-4 w-4" /> Pay Now
                  </>
                ) : (
                  <>
                    <CheckCircleIcon className="h-4 w-4" /> Place Order
                  </>
                )}
              </button>

              <p className="text-xs text-gray-400 text-center mt-3">
                {paymentMethod === "online"
                  ? "You'll be redirected to complete payment securely."
                  : "You'll pay on delivery."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
