import React from "react";
import { FaGraduationCap, FaUsers, FaGlobe } from "react-icons/fa";

const MissionSection = () => {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center p-10  rounded-xl bg-[#FAF6F1]">
      <div className="space-y-8">
        <h2 className="text-4xl md:text-5xl font-bold text-[#4a1818] tracking-tight">
          Our Mission
        </h2>

        <div className="text-lg text-gray-700 space-y-6 leading-relaxed">
          <p>
            Turathna connects the world to Egypt's rich heritage through
            authentic handcrafted pieces. We travel across diverse governorates
            from Siwa's vibrant markets to Nubia's skilled weavers, from Sinai's
            embroidery masters to Upper Egypt's pottery artisans.
          </p>

          <p>
            Every product tells a story of culture, tradition, and artistry
            keeping these time-honored crafts alive for future generations while
            providing fair opportunities for talented craftspeople.
          </p>
        </div>

        {/* Features */}
        <div className="space-y-6 pt-6">
          {/* Item 1 */}
          <div className="flex items-start gap-5">
            <div className="p-3 bg-[#f5e6de] text-[#4a1818] rounded-xl flex-shrink-0 shadow-sm">
              <FaGraduationCap size={26} />
            </div>

            <div>
              <h3 className="text-xl font-bold text-[#4a1818]">
                Cultural Preservation
              </h3>
              <p className="text-gray-600 mt-1 md:text-lg">
                Safeguarding centuries-old techniques and traditional
                craftsmanship for future generations
              </p>
            </div>
          </div>

          {/* Item 2 */}
          <div className="flex items-start gap-5">
            <div className="p-3 bg-[#f5e6de] text-[#4a1818] rounded-xl flex-shrink-0 shadow-sm">
              <FaUsers size={26} />
            </div>

            <div>
              <h3 className="text-xl font-bold text-[#4a1818]">
                Supporting Local Artisans
              </h3>
              <p className="text-gray-600 mt-1 md:text-lg">
                Creating direct connections ensuring fair compensation and
                recognition for skilled craftspeople
              </p>
            </div>
          </div>

          {/* Item 3 */}
          <div className="flex items-start gap-5">
            <div className="p-3 bg-[#f5e6de] text-[#4a1818] rounded-xl flex-shrink-0 shadow-sm">
              <FaGlobe size={26} />
            </div>

            <div>
              <h3 className="text-xl font-bold text-[#4a1818]">
                Sustainable Craft Economy
              </h3>
              <p className="text-gray-600 mt-1 md:text-lg">
                Building ethical, long-lasting partnerships with artisan
                communities across Egypt
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Image */}
      <div className="relative h-[500px] md:h-[700px] rounded-[2rem] overflow-hidden shadow-2xl">
        <img
          src="/our mision.jpeg"
          alt="Hands working on clay pottery"
          className="absolute inset-0 w-full h-full object-cover hover:scale-105 transition-transform duration-700"
        />
      </div>
    </section>
  );
};

export default MissionSection;
