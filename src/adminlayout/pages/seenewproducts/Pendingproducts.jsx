import React, { useState, useEffect } from "react";
import { Card, CardBody, Typography, Button } from "@material-tailwind/react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  UserIcon,
  PhoneIcon,
  EyeIcon,
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
  }
};

const ImageCarousel = ({ coverImage, productImages }) => {
  const [current, setCurrent] = useState(0);
  const all = [coverImage, ...(productImages || [])].filter(Boolean);
  const images = [...new Set(all)];
  const prev = () => setCurrent((i) => (i === 0 ? images.length - 1 : i - 1));
  const next = () => setCurrent((i) => (i === images.length - 1 ? 0 : i + 1));

  return (
    <div className="relative w-full h-52 bg-[#EEEEEE] overflow-hidden rounded-t-xl">
      {images.length > 0 ? (
        <>
          <img
            src={images[current]}
            alt="product"
            className="w-full h-full object-cover transition-all duration-500"
          />
          {images.length > 1 && (
            <>
              <button
                onClick={prev}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-[#1D1616]/60 hover:bg-[#D84040] text-white rounded-full p-1.5 transition-colors duration-200"
              >
                <ChevronLeftIcon className="h-4 w-4" />
              </button>
              <button
                onClick={next}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#1D1616]/60 hover:bg-[#D84040] text-white rounded-full p-1.5 transition-colors duration-200"
              >
                <ChevronRightIcon className="h-4 w-4" />
              </button>
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                {images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrent(i)}
                    className={`h-2 rounded-full transition-all duration-200 ${i === current ? "bg-[#D84040] w-4" : "bg-white/60 w-2"}`}
                  />
                ))}
              </div>
              <span className="absolute top-2 right-2 bg-[#1D1616]/70 text-white text-xs px-2 py-0.5 rounded-full">
                {current + 1}/{images.length}
              </span>
            </>
          )}
        </>
      ) : (
        <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
          No images available
        </div>
      )}
    </div>
  );
};

const AdminProductCard = ({ product }) => {
  const navigate = useNavigate();
  const status =
    statusConfig[product.verificationStatus] || statusConfig.pending;

  return (
    <Card className="rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-[#D84040]/10 bg-white">
      <ImageCarousel
        coverImage={product.coverImage}
        productImages={product.productImages}
      />
      <CardBody className="p-5 space-y-3">
        <Typography
          variant="h6"
          className="font-bold text-[#1D1616] leading-snug line-clamp-2"
        >
          {product.title_ar}
        </Typography>
        <div className="flex items-center gap-3">
          <span className="text-[#D84040] font-bold text-base">
            {product.originalPrice} EGP
          </span>
          <span className="text-[#D84040] font-bold text-base">
            After : {product.finalPrice} EGP
          </span>
        </div>
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${status.bg} ${status.text} ${status.border}`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
          {status.label}
        </span>
        {product.seller && (
          <div className="bg-[#EEEEEE] rounded-xl p-3 space-y-1.5">
            <p className="text-xs font-semibold text-[#8E1616] uppercase tracking-wide mb-2">
              Seller Info
            </p>
            <div className="flex items-center gap-2 text-sm text-[#1D1616]">
              <UserIcon className="h-4 w-4 text-[#D84040] shrink-0" />
              <span className="font-medium truncate">
                {product.seller.name}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-[#1D1616]">
              <PhoneIcon className="h-4 w-4 text-[#D84040] shrink-0" />
              <span dir="ltr">{product.seller.phone}</span>
            </div>
          </div>
        )}
        <Button
          onClick={() =>
            navigate(`/admindashboard/productreview/${product._id}`)
          }
          fullWidth
          className="flex items-center justify-center gap-2 rounded-lg py-2.5 normal-case text-sm transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          style={{
            backgroundColor: "#D84040",
            boxShadow: "0 4px 6px -1px rgba(216,64,64,0.3)",
          }}
        >
          <EyeIcon className="h-4 w-4" />
          View Product Details
        </Button>
      </CardBody>
    </Card>
  );
};

const AdminProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          "http://localhost:5000/api/v1/admin/product/pending",
          {
            headers: { Authorization: token },
          },
        );
        const data = await res.json();
        setProducts(data?.data?.productsList || data?.data?.products || []);
      } catch {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to load products.",
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
          Pending Products
        </Typography>
        <p className="text-center text-gray-500 text-sm mb-10">
          Review and manage submitted products awaiting approval
        </p>
        {loading ? (
          <div className="flex justify-center items-center h-48">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#D84040] border-t-transparent" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <Typography className="text-gray-500 text-xl">
              No pending products
            </Typography>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((p) => (
              <AdminProductCard key={p._id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProductList;
