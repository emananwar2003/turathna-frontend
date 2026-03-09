import React from "react";
import { FaBalanceScale, FaMagic, FaUsers, FaGlobe } from "react-icons/fa";

const ValuesSection = () => {
  return (
    <section className="space-y-12 pt-8 p-10">
      {/* Title */}
      <div className="text-center space-y-4">
        <h2 className="text-4xl md:text-5xl font-bold text-[#4a1818] tracking-tight">
          Our Values
        </h2>
        <p className="text-lg md:text-xl text-gray-600 font-light">
          The principles that guide everything we do at Turathna
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Card 1 */}
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-[#f0e6e0] space-y-6 hover:shadow-md transition-shadow">
          <div className="w-14 h-14 bg-[#f5e6de] text-[#4a1818] rounded-2xl flex items-center justify-center">
            <FaBalanceScale size={24} />
          </div>
          <h3 className="text-2xl font-bold text-[#4a1818]">
            Fair Trade Practices
          </h3>
          <p className="text-gray-600 leading-relaxed">
            Ensuring artisans receive fair compensation for their skill and
            time, with transparent pricing and ethical sourcing.
          </p>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-[#f0e6e0] space-y-6 hover:shadow-md transition-shadow">
          <div className="w-14 h-14 bg-[#f5e6de] text-[#4a1818] rounded-2xl flex items-center justify-center">
            <FaMagic size={24} />
          </div>
          <h3 className="text-2xl font-bold text-[#4a1818]">
            Preserving Traditional Crafts
          </h3>
          <p className="text-gray-600 leading-relaxed">
            Keeping ancient techniques alive by supporting craftspeople and
            sharing their stories with the world.
          </p>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-[#f0e6e0] space-y-6 hover:shadow-md transition-shadow">
          <div className="w-14 h-14 bg-[#f5e6de] text-[#4a1818] rounded-2xl flex items-center justify-center">
            <FaUsers size={24} />
          </div>
          <h3 className="text-2xl font-bold text-[#4a1818]">
            Empowering Artisan Communities
          </h3>
          <p className="text-gray-600 leading-relaxed">
            Building sustainable livelihoods and creating economic opportunities
            within rural and marginalized areas.
          </p>
        </div>

        {/* Card 4 */}
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-[#f0e6e0] space-y-6 hover:shadow-md transition-shadow">
          <div className="w-14 h-14 bg-[#f5e6de] text-[#4a1818] rounded-2xl flex items-center justify-center">
            <FaGlobe size={24} />
          </div>
          <h3 className="text-2xl font-bold text-[#4a1818]">
            Connecting Heritage with Modern Buyers
          </h3>
          <p className="text-gray-600 leading-relaxed">
            Bridging tradition and contemporary style to make heritage crafts
            accessible and relevant today.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ValuesSection;
