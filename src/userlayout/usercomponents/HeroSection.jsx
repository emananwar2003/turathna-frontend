import React from "react";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <div className="relative h-screen bg-black">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-60"
        style={{
          backgroundImage: "url('/hero.avif')",
        }}
      ></div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
        <h1 className="text-5xl md:text-7xl font-serif text-white font-bold mb-6 tracking-wide drop-shadow-lg m-5 text-center p-10">
          Preserving Egypt’s Heritage. Empowering Its Artisans.
        </h1>

        <p className="text-xl md:text-2xl text-white mb-10 max-w-2xl font-light drop-shadow-md text-center m-4">
          Discover authentic handmade crafts from every Egyptian governorate.
          From the embroidery of Sinai to the pottery of Tunis Village.
        </p>

        <Link
          to="/products"
          className="bg-[#C43D36] hover:bg-[#a6312a] text-white font-semibold py-4 px-10 rounded-md tracking-widest uppercase transition duration-300 ease-in-out shadow-lg"
        >
          Explore Crafts
        </Link>
      </div>
    </div>
  );
};

export default HeroSection;
