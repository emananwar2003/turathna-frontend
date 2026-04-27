import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Typography } from "@material-tailwind/react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ShoppingCartIcon,
  ArrowLeftIcon,
  FilmIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import Swal from "sweetalert2";
import { useCart } from "../../../context/Cartcontext ";
const BG_STYLE = {
  backgroundColor: "#EEEEEE",
  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23D84040' fill-opacity='0.06'%3E%3Cpath d='M30 0l5 10h10l-8 6 3 10-10-7-10 7 3-10-8-6h10z'/%3E%3C/g%3E%3C/svg%3E")`,
};

// ── Image Carousel ─────────────────────────────────────────────────────────────
const Carousel = ({ coverImage, productImages }) => {
  const [current, setCurrent] = useState(0);
  const all = [coverImage, ...(productImages || [])].filter(Boolean);
  const images = [...new Set(all)];

  if (images.length === 0) return null;

  const prev = () => setCurrent((i) => (i === 0 ? images.length - 1 : i - 1));
  const next = () => setCurrent((i) => (i === images.length - 1 ? 0 : i + 1));

  return (
    <div
      className="relative w-full overflow-hidden rounded-2xl bg-[#1D1616]"
      style={{ aspectRatio: "4/3" }}
    >
      <img
        src={images[current]}
        alt="product"
        className="w-full h-full object-cover transition-all duration-500 opacity-95"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#1D1616]/50 via-transparent to-transparent pointer-events-none" />
      {images.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-[#D84040] hover:text-white text-[#1D1616] rounded-full p-2.5 transition-all duration-200 shadow-lg"
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </button>
          <button
            onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-[#D84040] hover:text-white text-[#1D1616] rounded-full p-2.5 transition-all duration-200 shadow-lg"
          >
            <ChevronRightIcon className="h-5 w-5" />
          </button>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-2 rounded-full transition-all duration-200 ${i === current ? "bg-white w-6" : "bg-white/50 w-2"}`}
              />
            ))}
          </div>
          <span className="absolute top-4 right-4 bg-[#1D1616]/70 text-white text-xs px-3 py-1 rounded-full">
            {current + 1} / {images.length}
          </span>
        </>
      )}
    </div>
  );
};

// ── Main Component ─────────────────────────────────────────────────────────────
const ProductDetail = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/v1/product/${productId}`,
        );
        const data = await res.json();
        setProduct(data?.data?.product || data?.data || null);
      } catch {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to load product.",
          confirmButtonColor: "#D84040",
        });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [productId]);

  const handleAddToCart = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      Swal.fire({
        icon: "warning",
        title: "Login Required",
        text: "You need to log in first to add items to your cart.",
        confirmButtonColor: "#D84040",
        confirmButtonText: "Log In",
        showCancelButton: true,
        cancelButtonText: "Cancel",
        cancelButtonColor: "#8E1616",
      }).then((result) => {
        if (result.isConfirmed) navigate("/registration/userlogin");
      });
      return;
    }

    try {
      setAddingToCart(true);
      await addToCart(product._id);
      setAdded(true);
      Swal.fire({
        icon: "success",
        title: "Added to Cart!",
        text: `${product.title_en} has been added to your cart.`,
        confirmButtonColor: "#D84040",
        timer: 2000,
        timerProgressBar: true,
      });
      setTimeout(() => setAdded(false), 3000);
    } catch {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to add to cart.",
        confirmButtonColor: "#D84040",
      });
    } finally {
      setAddingToCart(false);
    }
  };

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

  if (!product) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={BG_STYLE}
      >
        <p className="text-gray-500 text-lg">Product not found.</p>
      </div>
    );
  }

  const isVideo = product.heritageType === "video" && product.heritage_video;
  const isText = product.heritageType === "text" && product.heritage_text;
  const embedUrl = isVideo
    ? product.heritage_video
        .replace("watch?v=", "embed/")
        .replace("youtu.be/", "www.youtube.com/embed/")
    : null;

  return (
    <div className="min-h-screen w-full" style={BG_STYLE}>
      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-sm text-[#8E1616] hover:text-[#D84040] mb-8 transition-colors font-semibold"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* ── Left: Images ── */}
          <Carousel
            coverImage={product.coverImage}
            productImages={product.productImages}
          />

          {/* ── Right: Info ── */}
          <div className="flex flex-col gap-5">
            {/* Category badge */}
            {product.category?.slugName && (
              <span className="inline-block w-fit text-xs font-bold uppercase tracking-widest text-[#8E1616] bg-[#D84040]/10 px-3 py-1 rounded-full">
                {product.category.slugName.replace(/-/g, " ")}
              </span>
            )}

            {/* Title */}
            <Typography
              variant="h1"
              className="text-3xl md:text-4xl font-serif leading-tight"
              style={{ color: "#1D1616" }}
            >
              {product.title_en}
            </Typography>

            {/* Price */}
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-[#D84040]">
                {product.finalPrice || product.originalPrice}
              </span>
              <span className="text-gray-400 font-medium">EGP</span>
              {product.originalPrice &&
                product.finalPrice &&
                product.finalPrice !== product.originalPrice && (
                  <span className="text-gray-400 text-lg line-through ml-2">
                    {product.originalPrice} EGP
                  </span>
                )}
            </div>

            {/* Region */}
            {product.region?.slugName && (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span className="text-[#D84040]">📍</span>
                <span className="capitalize">
                  {product.region.slugName.replace(/-/g, " ")}
                </span>
              </div>
            )}

            {/* Add to Cart */}
            <button
              onClick={handleAddToCart}
              disabled={addingToCart}
              className={`w-full flex items-center justify-center gap-2 py-4 rounded-xl text-base font-bold transition-all duration-300 shadow-lg disabled:opacity-60 disabled:cursor-not-allowed ${
                added
                  ? "bg-green-600 text-white scale-[0.98]"
                  : "bg-[#D84040] hover:bg-[#8E1616] text-white hover:scale-[1.02] active:scale-[0.98]"
              }`}
              style={{ boxShadow: "0 6px 20px -4px rgba(216,64,64,0.4)" }}
            >
              {added ? (
                <>
                  <CheckCircleIcon className="h-5 w-5" /> Added to Cart!
                </>
              ) : addingToCart ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />{" "}
                  Adding...
                </>
              ) : (
                <>
                  <ShoppingCartIcon className="h-5 w-5" /> Add to Cart
                </>
              )}
            </button>

            {/* Divider */}
            <div className="h-px bg-[#D84040]/15" />

            {/* Description */}
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-[#8E1616] mb-2">
                Description
              </p>
              <p className="text-gray-600 leading-relaxed text-sm">
                {product.description_en}
              </p>
            </div>
          </div>
        </div>

        {/* ── Heritage Section ── */}
        {(isText || isVideo) && (
          <div className="mt-14">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px flex-1 bg-[#D84040]/20" />
              <div className="flex items-center gap-2 text-[#8E1616]">
                {isVideo ? (
                  <FilmIcon className="h-4 w-4" />
                ) : (
                  <DocumentTextIcon className="h-4 w-4" />
                )}
                <p className="text-xs font-bold uppercase tracking-widest">
                  Heritage Story
                </p>
              </div>
              <div className="h-px flex-1 bg-[#D84040]/20" />
            </div>

            {isVideo && (
              <div className="rounded-2xl overflow-hidden shadow-xl aspect-video bg-[#1D1616]">
                <iframe
                  src={embedUrl}
                  className="w-full h-full"
                  allowFullScreen
                  title="Heritage Video"
                />
              </div>
            )}

            {isText && (
              <div className="bg-white rounded-2xl p-8 shadow-md border border-[#D84040]/10 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-[#D84040] rounded-l-2xl" />
                <p className="text-gray-700 leading-relaxed text-sm pl-4">
                  {product.heritage_text}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
