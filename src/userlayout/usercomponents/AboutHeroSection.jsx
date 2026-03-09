import React from "react";

const AboutHeroSection = () => {
  return (
    <section className="relative w-full h-[60vh] md:h-[70vh] flex items-center justify-center">
      {/* Background Image */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/our story.jpeg')",
        }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto flex flex-col items-center mt-16 md:mt-24">
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-wide drop-shadow-lg">
          Our Story
        </h1>

        <p className="text-xl md:text-3xl text-white font-medium leading-relaxed drop-shadow-md max-w-4xl">
          Preserving Egypt's craft heritage and empowering artisans through
          authentic handmade treasures that carry centuries of tradition
        </p>
      </div>
    </section>
  );
};

export default AboutHeroSection;
