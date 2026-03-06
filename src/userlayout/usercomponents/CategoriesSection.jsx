import React from "react";
import { Link } from "react-router-dom";

const categories = [
  {
    id: 1,
    name: "Textiles & Embroidery",
    description: "Handwoven fabrics, kilims, and Sinai embroidery.",
    image:
      "https://images.unsplash.com/photo-1603252109303-2751441dd157?q=80&w=1200",
  },
  {
    id: 2,
    name: "Pottery & Ceramics",
    description: "Traditional handmade pottery and decorative ceramics.",
    image:
      "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?q=80&w=1200",
  },
  {
    id: 3,
    name: "Jewelry & Accessories",
    description: "Silver, copper, and heritage-inspired accessories.",
    image:
      "https://images.unsplash.com/photo-1617038220319-276d3cfab638?q=80&w=1200",
  },
  {
    id: 4,
    name: "Home Décor",
    description: "Authentic Egyptian decorative pieces.",
    image:
      "https://images.unsplash.com/photo-1616627451515-cbc80e5ece35?q=80&w=1200",
  },
  {
    id: 5,
    name: "Bags & Leather Goods",
    description: "Handcrafted leather bags and accessories.",
    image:
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=1200",
  },
  {
    id: 6,
    name: "Wood & Carved Art",
    description: "Hand-carved wooden crafts and ornaments.",
    image:
      "https://images.unsplash.com/photo-1610701596007-11502861dcfa?q=80&w=1200",
  },
  {
    id: 7,
    name: "Handmade Gifts",
    description: "Unique gift items crafted by local artisans.",
    image:
      "https://images.unsplash.com/photo-1512909006721-3d6018887383?q=80&w=1200",
  },
  {
    id: 8,
    name: "Art & Paintings",
    description: "Cultural paintings and handcrafted artwork.",
    image:
      "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=1200",
  },
];

const CategoriesSection = () => {
  return (
    <section className="py-20 px-6 md:px-12 bg-[#F9F6F0]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-serif text-[#2B1B17] font-bold mb-4">
            Discover by Craft
          </h2>
          <div className="h-1 w-24 bg-[#C43D36] mx-auto"></div>
          <p className="mt-6 text-gray-600 max-w-2xl mx-auto text-lg">
            Explore Egypt’s traditional crafts made by skilled artisans across
            the country.
          </p>
        </div>

        <div className="flex overflow-x-auto gap-6 pb-8 snap-x snap-mandatory hide-scroll-bar">
          {categories.map((category) => (
            <Link
              to={`/category/${category.name.toLowerCase().replace(/ /g, "-")}`}
              key={category.id}
              className="group cursor-pointer relative overflow-hidden rounded-lg shadow-md h-96 flex-shrink-0 w-80 md:w-96 snap-center block"
            >
              <img
                src={category.image}
                alt={category.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-8 w-full">
                <h3 className="text-3xl font-serif text-white mb-2">
                  {category.name}
                </h3>
                <p className="text-gray-200 text-lg">{category.description}</p>
                <div className="mt-4 w-0 h-0.5 bg-[#C43D36] transition-all duration-500 ease-in-out group-hover:w-16"></div>
              </div>
            </Link>
          ))}
        </div>
      </div>

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

export default CategoriesSection;
