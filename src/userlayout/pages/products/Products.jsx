
import React, { useState, useEffect } from "react";
import { Typography } from "@material-tailwind/react";
import Swal from "sweetalert2";
import { BG_STYLE, SearchBar, ProductsGrid } from "../../usercomponents/productShared";

 
const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch]     = useState("");
  const [loading, setLoading]   = useState(true);
 
  useEffect(() => {
    const load = async () => {
      try {
        const res  = await fetch("http://localhost:5000/api/v1/product/");
        const data = await res.json();
        const list = data?.data?.productsList || data?.data?.products || [];
        setProducts(list);
        setFiltered(list);
      } catch {
        Swal.fire({ icon: "error", title: "Error", text: "Failed to load products.", confirmButtonColor: "#D84040" });
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
        ? products.filter(p =>
            (p.title_en || "").toLowerCase().includes(q) ||
            (p.description_en || "").toLowerCase().includes(q)
          )
        : products
    );
  }, [search, products]);
 
  return (
    <div className="min-h-screen w-full" style={BG_STYLE}>
      <div className="max-w-7xl mx-auto px-4 py-10">
 
        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-[#D84040] text-xs font-bold uppercase tracking-widest mb-2">
            Handcrafted with love
          </p>
          <Typography variant="h1" className="text-4xl md:text-5xl font-serif mb-3" style={{ color: "#1D1616" }}>
            All Products
          </Typography>
          <p className="text-gray-500 text-sm max-w-md mx-auto">
            Discover authentic Egyptian handmade crafts, each telling a unique story
          </p>
        </div>
 
        {/* Search */}
        <div className="flex justify-center mb-8">
          <SearchBar value={search} onChange={setSearch} />
        </div>
 
        {/* Count */}
        {!loading && (
          <p className="text-xs text-gray-400 mb-4">
            Showing <span className="font-semibold text-[#1D1616]">{filtered.length}</span> products
          </p>
        )}
 
        <ProductsGrid products={filtered} loading={loading} />
      </div>
    </div>
  );
};
 
export default AllProducts;