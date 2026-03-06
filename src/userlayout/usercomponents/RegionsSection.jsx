import React from "react";
import { Link } from "react-router-dom";

const regions = [
  {
    id: 1,
    name: "Sinai",
    description: "Intricate Embroidery",
    image: "/sina.avif",
  },
  {
    id: 2,
    name: "Nubia",
    description: "Vibrant Beadwork & Baskets",
    image: "/nubia.avif",
  },
  {
    id: 3,
    name: "Siwa Oasis",
    description: "Heritage Silver & Salt Lamps",
    image: "/siwa.avif",
  },
  {
    id: 4,
    name: "Upper Egypt",
    description: "Handwoven Textiles & Alabaster",
    image: "/upper egypt.avif",
  },
  {
    id: 5,
    name: "Fayoum",
    description: "Authentic Pottery",
    image: "/fayoum.avif",
  },
];

const RegionsSection = () => {
  return (
    <section className="py-20 px-6 md:px-12 bg-[#F9F6F0]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-serif text-[#2B1B17] font-bold mb-4">
            Discover by Region
          </h2>

          <div className="h-1 w-24 bg-[#C43D36] mx-auto"></div>

          <p className="mt-6 text-gray-600 max-w-2xl mx-auto text-lg">
            Journey through Egypt's governorates and uncover the unique crafts
            that define local traditions.
          </p>
        </div>

        <div className="flex overflow-x-auto gap-6 pb-8 snap-x snap-mandatory hide-scroll-bar">
          {regions.map((region) => (
            <Link
              to={`/region/${region.name.toLowerCase().replace(" ", "-")}`}
              key={region.id}
              className="group cursor-pointer relative overflow-hidden rounded-lg shadow-md h-96 flex-shrink-0 w-80 md:w-96 snap-center block"
            >
              <img
                src={region.image}
                alt={region.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>

              <div className="absolute bottom-0 left-0 p-8 w-full">
                <h3 className="text-3xl font-serif text-white mb-2">
                  {region.name}
                </h3>

                <p className="text-gray-200 text-lg">{region.description}</p>

                <div className="mt-4 w-0 h-0.5 bg-[#C43D36] transition-all duration-500 ease-in-out group-hover:w-16"></div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Hide Scrollbar Style Block */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
          .hide-scroll-bar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }

          .hide-scroll-bar::-webkit-scrollbar {
            display: none;
          }
        `,
        }}
      />
    </section>
  );
};

export default RegionsSection;
