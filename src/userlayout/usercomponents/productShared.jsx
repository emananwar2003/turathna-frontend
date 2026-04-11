
import React, { useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";

export const BG_STYLE = {
  backgroundColor: "#EEEEEE",
  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23D84040' fill-opacity='0.06'%3E%3Cpath d='M30 0l5 10h10l-8 6 3 10-10-7-10 7 3-10-8-6h10z'/%3E%3C/g%3E%3C/svg%3E")`,
};

export const REGIONS = [
  { slug: "sinai",       label: "Sinai"       },
  { slug: "nubia",       label: "Nubia"       },
  { slug: "Siwa-Oasis",  label: "Siwa Oasis"  },
  { slug: "upper-egypt", label: "Upper Egypt" },
  { slug: "fayoum",      label: "Fayoum"      },
];

export const CATEGORIES = [
  { value: "textiles-and-embroidery", label: "Textiles & Embroidery" },
  { value: "jewelry-and-accessories", label: "Jewelry & Accessories" },
  { value: "pottery-and-ceramics",    label: "Pottery & Ceramics" },
  { value: "home-decor",              label: "Home Decor" },
  { value: "bags-and-leather-goods",  label: "Bags & Leather Goods"},
  { value: "art-and-paintings",       label: "Art & Paintings" },
  { value: "handmade-gifts",          label: "Handmade Gifts"},
  { value: "wood-and-carved-art",     label: "Wood & Carved Art"},
];

export const HANDMADE_GIFTS_CATEGORIES = [
  "jewelry-and-accessories",
  "pottery-and-ceramics",
  "home-decor",
];

// ── Image Carousel ─────────────────────────────────────────────────────────────
export const ProductCarousel = ({ coverImage, productImages }) => {
  const [current, setCurrent] = useState(0);
  const all = [coverImage, ...(productImages || [])].filter(Boolean);
  const images = [...new Set(all)];

  if (images.length === 0)
    return (
      <div className="w-full h-56 bg-[#1D1616]/10 flex items-center justify-center text-gray-400 text-sm rounded-t-2xl">
        No image
      </div>
    );

  return (
    <div className="relative w-full h-56 overflow-hidden rounded-t-2xl group">
      <img
        src={images[current]}
        alt="product"
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#1D1616]/40 via-transparent to-transparent" />
      {images.length > 1 && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); setCurrent(i => (i === 0 ? images.length - 1 : i - 1)); }}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-[#D84040] hover:text-white text-[#1D1616] rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-md"
          >
            <ChevronLeftIcon className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setCurrent(i => (i === images.length - 1 ? 0 : i + 1)); }}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-[#D84040] hover:text-white text-[#1D1616] rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-md"
          >
            <ChevronRightIcon className="h-3.5 w-3.5" />
          </button>
          <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); setCurrent(i); }}
                className={`h-1.5 rounded-full transition-all duration-200 ${i === current ? "bg-white w-4" : "bg-white/50 w-1.5"}`}
              />
            ))}
          </div>
        </>
      )}
      <div className="absolute top-3 left-3">
        <span className="bg-[#D84040] text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-lg">
          Featured
        </span>
      </div>
    </div>
  );
};

// ── Product Card ───────────────────────────────────────────────────────────────
export const ProductCard = ({ product, index }) => (
  <div
    className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer group hover:-translate-y-1"
    style={{ animationDelay: `${index * 60}ms` }}
  >
    <ProductCarousel coverImage={product.coverImage} productImages={product.productImages} />
    <div className="p-4 space-y-2">
      <h3 className="font-bold text-[#1D1616] text-base leading-tight line-clamp-1 group-hover:text-[#D84040] transition-colors duration-200">
        {product.title_en || product.title_ar}
      </h3>
      <p className="text-gray-500 text-xs leading-relaxed line-clamp-2">
        {product.description_en || product.description_ar}
      </p>
      <div className="flex items-center justify-between pt-1">
        <span className="text-[#D84040] font-bold text-lg">
          {product.finalPrice || product.originalPrice}
          <span className="text-xs font-normal text-gray-400 ml-1">EGP</span>
        </span>
        <button className="text-xs bg-[#1D1616] hover:bg-[#D84040] text-white px-3 py-1.5 rounded-lg transition-colors duration-200 font-medium">
          View
        </button>
      </div>
    </div>
  </div>
);

// ── Search Bar ─────────────────────────────────────────────────────────────────
export const SearchBar = ({ value, onChange }) => (
  <div className="relative max-w-md w-full">
    <MagnifyingGlassIcon className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Search products..."
      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#D84040] bg-white text-sm shadow-sm transition-all duration-200"
    />
  </div>
);

// ── Products Grid ──────────────────────────────────────────────────────────────
export const ProductsGrid = ({ products, loading }) => {
  if (loading)
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#D84040] border-t-transparent" />
      </div>
    );
  if (products.length === 0)
    return (
      <div className="text-center py-24">
        <div className="text-6xl mb-4">🧶</div>
        <p className="text-gray-500 text-lg font-medium">No products found</p>
        <p className="text-gray-400 text-sm mt-1">Try a different search or filter</p>
      </div>
    );
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
      {products.map((p, i) => (
        <ProductCard key={p._id} product={p} index={i} />
      ))}
    </div>
  );
};