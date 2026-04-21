import React from "react";
import { Link } from "react-router-dom";

const categories = [
  {
    id: 1,
    name: "textiles and embroidery",
    description: "Handwoven fabrics, kilims, and Sinai embroidery.",
    image: "/firstcat.jpeg",
  },
  {
    id: 2,
    name: "pottery and ceramics",
    description: "Traditional handmade pottery and decorative ceramics.",
    image: "/seccat.jpeg",
  },
  {
    id: 3,
    name: "jewelry and accessories",
    description: "Silver, copper, and heritage-inspired accessories.",
    image: "/thirdcat.jpeg",
  },
  {
    id: 4,
    name: "Home Décor",
    description: "Authentic Egyptian decorative pieces.",
    image: "/forthcat.jpeg",
  },
  {
    id: 5,
    name: "bags and leather goods",
    description: "Handcrafted leather bags and accessories.",
    image: "/leather.jpeg",
  },
  {
    id: 6,
    name: "Wood & Carved Art",
    description: "Hand-carved wooden crafts and ornaments.",
    image: "/sixcat.jpeg",
  },
  {
    id: 7,
    name: "Handmade Gifts",
    description: "Unique gift items crafted by local artisans.",
    image: "/sevencat.jpeg",
  },
  {
    id: 8,
    name: "art and paintings",
    description: "Cultural paintings and handcrafted artwork.",
    image: "/lastcat.jpeg",
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
