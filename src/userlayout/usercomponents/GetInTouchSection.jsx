import React from "react";
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";

const GetInTouchSection = () => {
  return (
    <section className="space-y-12 py-16 p-10">
      {/* Title */}
      <div className="text-center space-y-4">
        <h2 className="text-4xl md:text-5xl font-bold text-[#4a1818] tracking-tight">
          Get In Touch
        </h2>
        <p className="text-lg md:text-xl text-gray-600 font-light">
          We'd love to hear from you
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-[#4a1818]">
        {/* Email */}
        <div className="bg-[#fdf8f5] p-10 rounded-[3rem] shadow-sm border border-[#f5e6de] text-center space-y-6 hover:shadow-md transition-shadow flex flex-col items-center justify-center">
          <div className="w-16 h-16 bg-[#4a1818] text-white rounded-full flex items-center justify-center shadow-lg">
            <FaEnvelope size={26} />
          </div>

          <h3 className="text-2xl font-bold">Email Us</h3>

          <div className="text-gray-600 space-y-2 font-medium">
            <p>info@turathna.com</p>
           
          </div>
        </div>

        {/* Phone */}
        <div className="bg-[#fdf8f5] p-10 rounded-[3rem] shadow-sm border border-[#f5e6de] text-center space-y-6 hover:shadow-md transition-shadow flex flex-col items-center justify-center">
          <div className="w-16 h-16 bg-[#4a1818] text-white rounded-full flex items-center justify-center shadow-lg">
            <FaPhone size={26} />
          </div>

          <h3 className="text-2xl font-bold">Call Us</h3>

          <div className="text-gray-600 space-y-2 font-medium">
            <p>+20 1155538964</p>
            <p>Sun - Thu: 9AM - 6PM</p>
          </div>
        </div>

        {/* Location */}
        <div className="bg-[#fdf8f5] p-10 rounded-[3rem] shadow-sm border border-[#f5e6de] text-center space-y-6 hover:shadow-md transition-shadow flex flex-col items-center justify-center">
          <div className="w-16 h-16 bg-[#4a1818] text-white rounded-full flex items-center justify-center shadow-lg">
            <FaMapMarkerAlt size={26} />
          </div>

          <h3 className="text-2xl font-bold">Visit Us</h3>

          <div className="text-gray-600 space-y-2 font-medium">
            <p>Cairo, Egypt</p>
            <p>Serving all governorates</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GetInTouchSection;
