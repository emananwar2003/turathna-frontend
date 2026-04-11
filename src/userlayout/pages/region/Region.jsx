
import React, { useState, useEffect } from "react";
import { Typography } from "@material-tailwind/react";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { BG_STYLE, REGIONS, SearchBar, ProductsGrid } from "../../usercomponents/productShared";
const Region = () => {
     const { region: regionParam } = useParams();
     const [activeRegion, setActiveRegion] = useState(
       regionParam || REGIONS[0].slug,
     );
     const [products, setProducts] = useState([]);
     const [search, setSearch] = useState("");
     const [loading, setLoading] = useState(true);

     const regionLabel =
       REGIONS.find((r) => r.slug === activeRegion)?.label || activeRegion;

     useEffect(() => {
       const load = async () => {
         setLoading(true);
         try {
           const res = await fetch(
             `http://localhost:5000/api/v1/product/region?region=${activeRegion}`,
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
     }, [activeRegion]);

     const filtered = search
       ? products.filter(
           (p) =>
             (p.title_en || "").toLowerCase().includes(search.toLowerCase()) ||
             (p.description_en || "")
               .toLowerCase()
               .includes(search.toLowerCase()),
         )
       : products;
 

  return (
    <div className="min-h-screen w-full" style={BG_STYLE}>
      <div className="max-w-7xl mx-auto px-4 py-10">
 
        {/* Header */}
        <div className="text-center mb-8">
          <p className="text-[#D84040] text-xs font-bold uppercase tracking-widest mb-2">
            Explore by origin
          </p>
          <Typography variant="h1" className="text-4xl md:text-5xl font-serif mb-3" style={{ color: "#1D1616" }}>
            {regionLabel}
          </Typography>
          <p className="text-gray-500 text-sm">
            Traditional crafts from the heart of {regionLabel}
          </p>
        </div>
 
        {/* Region Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {REGIONS.map((r) => (
            <button
              key={r.slug}
              onClick={() => { setActiveRegion(r.slug); setSearch(""); }}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 border ${
                activeRegion === r.slug
                  ? "bg-[#D84040] text-white border-[#D84040] shadow-md"
                  : "bg-white text-[#1D1616] border-gray-200 hover:border-[#D84040] hover:text-[#D84040]"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
 
        {/* Search */}
        <div className="flex justify-center mb-6">
          <SearchBar value={search} onChange={setSearch} />
        </div>
 
        {!loading && (
          <p className="text-xs text-gray-400 mb-4">
            Showing <span className="font-semibold text-[#1D1616]">{filtered.length}</span> products from {regionLabel}
          </p>
        )}
 
        <ProductsGrid products={filtered} loading={loading} />
      </div>
    </div>
  )
}

export default Region
