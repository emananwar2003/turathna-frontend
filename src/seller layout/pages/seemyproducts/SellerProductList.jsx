import React, { useState, useEffect, useRef } from "react";
import {
  Card,
  CardBody,
  Typography,
  Button,
  Chip,
} from "@material-tailwind/react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  TrashIcon,
  PencilSquareIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";



const ProductCard = ({ product, onDelete }) => {
  const navigate = useNavigate();
  const [currentImg, setCurrentImg] = useState(0);
  const images = product.productImages || [];

  const prev = () =>
    setCurrentImg((i) => (i === 0 ? images.length - 1 : i - 1));
  const next = () =>
    setCurrentImg((i) => (i === images.length - 1 ? 0 : i + 1));

  
  const statusConfig = {
    pending: {
      label: "قيد المراجعة",
      color: "amber",
      icon: <ClockIcon className="h-4 w-4" />,
      message: "منتجك قيد التقييم من قِبَل الإدارة، يرجى الانتظار.",
    },
    accepted: {
      label: "مقبول",
      color: "green",
      icon: <CheckCircleIcon className="h-4 w-4" />,
      message: "تهانينا! تم قبول منتجك وهو متاح الآن في المتجر.",
    },
    rejected: {
      label: "مرفوض",
      color: "red",
      icon: <XCircleIcon className="h-4 w-4" />,
      message: product.rejectionMsg
        ? `سبب الرفض: ${product.rejectionMsg}`
        : "تم رفض المنتج من قِبَل الإدارة.",
    },
  };

  const status =
    statusConfig[product.verificationStatus] || statusConfig.pending;

  const handleStatusClick = () => {
    Swal.fire({
      icon:
        product.verificationStatus === "accepted"
          ? "success"
          : product.verificationStatus === "rejected"
            ? "error"
            : "info",
      title: status.label,
      text: status.message,
      confirmButtonColor: "#D84040",
      confirmButtonText: "حسناً",
      customClass: { popup: "font-[Tajawal]" },
    });
  };

  const handleDelete = () => {
    Swal.fire({
      icon: "warning",
      title: "هل أنت متأكد؟",
      text: "سيتم حذف المنتج نهائياً ولا يمكن التراجع عن هذا الإجراء.",
      showCancelButton: true,
      confirmButtonColor: "#D84040",
      cancelButtonColor: "#8E1616",
      confirmButtonText: "نعم، احذف",
      cancelButtonText: "إلغاء",
      customClass: { popup: "font-[Tajawal]" },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = localStorage.getItem("token");
          const sellerId = localStorage.getItem("id");
          const res = await fetch(
            `http://localhost:5000/api/v1/product/seller/${sellerId}/${product._id}`,
            { method: "DELETE", headers: { Authorization: token } },
          );
          if (!res.ok) throw new Error();
          Swal.fire({
            icon: "success",
            title: "تم الحذف",
            text: "تم حذف المنتج بنجاح.",
            confirmButtonColor: "#D84040",
            customClass: { popup: "font-[Tajawal]" },
          });
          onDelete(product._id);
        } catch {
          Swal.fire({
            icon: "error",
            title: "خطأ",
            text: "حدث خطأ أثناء الحذف، يرجى المحاولة مجدداً.",
            confirmButtonColor: "#D84040",
            customClass: { popup: "font-[Tajawal]" },
          });
        }
      }
    });
  };

  return (
    <Card
      className="rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-[#D84040]/10"
      style={{ backgroundColor: "#fff" }}
    >
      {/* ── Image Carousel ── */}
      <div className="relative w-full h-52 bg-[#EEEEEE] overflow-hidden">
        {images.length > 0 ? (
          <>
            <img
              src={images[currentImg]}
              alt={product.title_ar}
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
                {/* Dots */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {images.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentImg(i)}
                      className={`w-2 h-2 rounded-full transition-all duration-200 ${
                        i === currentImg ? "bg-[#D84040] w-4" : "bg-white/60"
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <span className="text-sm">لا توجد صور</span>
          </div>
        )}
      </div>

      <CardBody className="p-5 space-y-3" dir="rtl">
        {/* Title */}
        <Typography
          variant="h5"
          className="font-bold text-[#1D1616] leading-snug line-clamp-2 font-[Tajawal]"
        >
          {product.title_ar}
        </Typography>

        {/* Price */}
        <Typography className="text-[#D84040] font-bold text-lg font-[Tajawal]">
          {product.originalPrice} ج.م
        </Typography>

        {/* Status Badge – clickable */}
        <button
          onClick={handleStatusClick}
          className="inline-flex items-center gap-1.5 focus:outline-none group"
        >
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold font-[Tajawal] transition-all duration-200 group-hover:scale-105 ${
              product.verificationStatus === "accepted"
                ? "bg-green-100 text-green-800 border border-green-300"
                : product.verificationStatus === "rejected"
                  ? "bg-red-100 text-[#D84040] border border-[#D84040]/40"
                  : "bg-amber-100 text-amber-800 border border-amber-300"
            }`}
          >
            {status.icon}
            {status.label}
          </span>
        </button>

        {/* Description */}
        <Typography
          variant="small"
          className="text-gray-600 leading-relaxed line-clamp-3 font-[Tajawal] text-right"
        >
          {product.description_ar}
        </Typography>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button
            onClick={() =>
              navigate(`/sellerdashboard/editproduct/${product._id}`)
            }
            className="flex-1 flex items-center justify-center gap-1.5 rounded-lg py-2.5 normal-case font-[Tajawal] text-sm transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            style={{ backgroundColor: "#8E1616" }}
          >
            <PencilSquareIcon className="h-4 w-4" />
            تعديل
          </Button>
          <Button
            onClick={handleDelete}
            className="flex-1 flex items-center justify-center gap-1.5 rounded-lg py-2.5 normal-case font-[Tajawal] text-sm transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            style={{ backgroundColor: "#D84040" }}
          >
            <TrashIcon className="h-4 w-4" />
            حذف
          </Button>
        </div>
      </CardBody>
    </Card>
  );
};



const SellerProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem("token");
        const sellerId = localStorage.getItem("id");
        const res = await fetch(
          `http://localhost:5000/api/v1/product/seller/${sellerId}`,
          { headers: { Authorization: token } },
        );
        const data = await res.json();
        setProducts(data?.data?.products || []);
      } catch {
        Swal.fire({
          icon: "error",
          title: "خطأ",
          text: "تعذّر تحميل المنتجات.",
          confirmButtonColor: "#D84040",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleDelete = (id) =>
    setProducts((prev) => prev.filter((p) => p._id !== id));

  return (
    <div
      className="min-h-screen w-full"
      dir="rtl"
      style={{
        backgroundColor: "#EEEEEE",
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23D84040' fill-opacity='0.08'%3E%3Cpath d='M30 0l5 10h10l-8 6 3 10-10-7-10 7 3-10-8-6h10z'/%3E%3C/g%3E%3C/svg%3E")`,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Header */}
        <Typography
          variant="h1"
          className="text-4xl md:text-5xl font-serif text-center mb-10 "
          style={{ color: "#1D1616" }}
        >
          منتجاتي
        </Typography>

        {loading ? (
          <div className="flex justify-center items-center h-48">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#D84040] border-t-transparent" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <Typography className="text-gray-500 text-xl font-[Tajawal]">
              لا توجد منتجات بعد
            </Typography>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerProductList;
