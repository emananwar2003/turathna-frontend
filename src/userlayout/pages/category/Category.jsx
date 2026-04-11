import React, { useState, useEffect } from "react";
import { Typography } from "@material-tailwind/react";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import {
  BG_STYLE,
  CATEGORIES,
  HANDMADE_GIFTS_CATEGORIES,
  SearchBar,
  ProductsGrid,
} from "../../usercomponents/productShared";

const CategoryProducts = () => {
  const { category: categoryParam } = useParams();
  const [activeCategory, setActiveCategory] = useState(
    categoryParam || CATEGORIES[0].value,
  );
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const catMeta =
    CATEGORIES.find((c) => c.value === activeCategory) || CATEGORIES[0];

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setSearch("");
      try {
        if (activeCategory === "handmade-gifts") {
        
          const results = await Promise.all(
            HANDMADE_GIFTS_CATEGORIES.map((c) =>
              fetch(
                `http://localhost:5000/api/v1/product/category?category=${c}`,
              )
                .then((r) => r.json())
                .then((d) => d?.data?.productsList || d?.data?.products || []),
            ),
          );
         
          const merged = Object.values(
            results.flat().reduce((acc, p) => {
              acc[p._id] = p;
              return acc;
            }, {}),
          );
          setProducts(merged);
        } else {
          const res = await fetch(
            `http://localhost:5000/api/v1/product/category?category=${activeCategory}`,
          );
          const data = await res.json();
          setProducts(data?.data?.productsList || data?.data?.products || []);
        }
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
  }, [activeCategory]);

  const filtered = search
    ? products.filter(
        (p) =>
          (p.title_en || "").toLowerCase().includes(search.toLowerCase()) ||
          (p.description_en || "").toLowerCase().includes(search.toLowerCase()),
      )
    : products;

  return (
    <div className="min-h-screen w-full" style={BG_STYLE}>
      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="text-center mb-8">
          <p className="text-[#D84040] text-xs font-bold uppercase tracking-widest mb-2">
            Browse by craft
          </p>
          <Typography
            variant="h1"
            className="text-4xl md:text-5xl font-serif mb-2"
            style={{ color: "#1D1616" }}
          >
            <span className="mr-2">{catMeta.emoji}</span>
            {catMeta.label}
          </Typography>
          {activeCategory === "handmade-gifts" && (
            <p className="text-xs text-[#8E1616] bg-[#D84040]/10 inline-block px-3 py-1 rounded-full mt-2 font-medium">
              Includes Jewelry, Pottery & Home Decor
            </p>
          )}
        </div>

        {/* Category Pills — scrollable on mobile */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-8 justify-start md:justify-center">
          {CATEGORIES.map((c) => (
            <button
              key={c.value}
              onClick={() => setActiveCategory(c.value)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-200 border shrink-0 ${
                activeCategory === c.value
                  ? "bg-[#1D1616] text-white border-[#1D1616] shadow-md"
                  : "bg-white text-[#1D1616] border-gray-200 hover:border-[#D84040] hover:text-[#D84040]"
              }`}
            >
              <span>{c.emoji}</span>
              {c.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="flex justify-center mb-6">
          <SearchBar value={search} onChange={setSearch} />
        </div>

        {!loading && (
          <p className="text-xs text-gray-400 mb-4">
            Showing{" "}
            <span className="font-semibold text-[#1D1616]">
              {filtered.length}
            </span>{" "}
            products
            {activeCategory === "handmade-gifts" && " across 3 categories"}
          </p>
        )}

        <ProductsGrid products={filtered} loading={loading} />
      </div>
    </div>
  );
};

export default CategoryProducts;
