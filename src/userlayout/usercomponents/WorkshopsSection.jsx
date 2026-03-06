import React from "react";
import { Link } from "react-router-dom";

const WorkshopsSection = () => {
  return (
    <section className="bg-[#F9F6F0] py-24 px-6 md:px-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Workshop Image */}
        <div className="relative h-full min-h-[300px] w-full">
          <img
            src="https://images.pexels.com/photos/4898079/pexels-photo-4898079.jpeg?auto=compress&cs=tinysrgb&h=900&w=1200"
            alt="Artisan making clay pottery in a workshop"
            className="absolute inset-0 w-full h-full object-cover shadow-xl"
          />
        </div>

        {/* Workshop Content */}
        <div className="lg:pl-8 py-8">
          <h2 className="text-5xl md:text-6xl font-serif font-bold text-[#2B1B17] leading-tight">
            Hands-On <br />
            Workshops. <br />
            <span className="text-[#C43D36] italic font-medium mt-2 inline-block">
              Experience the Craft.
            </span>
          </h2>

          <p className="text-gray-600 font-light text-lg leading-relaxed mt-8 mb-12">
            Join our artisans in their workshops and discover the skills behind
            Egypt’s timeless crafts. Learn techniques from pottery, textiles,
            and jewelry, and take home your own handcrafted piece.
          </p>

          <div className="space-y-8">
            {/* List Item 1 */}
            <div className="flex items-start">
              <div className="w-12 h-12 rounded-full bg-[#fbeae9] flex items-center justify-center text-[#C43D36] font-semibold text-lg flex-shrink-0">
                1
              </div>

              <div className="ml-6">
                <h4 className="text-xl font-bold text-[#2B1B17] mb-1">
                  Learn From Masters
                </h4>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Hands-on experience guided by skilled artisans who preserve
                  Egyptian heritage.
                </p>
              </div>
            </div>

            {/* List Item 2 */}
            <div className="flex items-start">
              <div className="w-12 h-12 rounded-full bg-[#fbeae9] flex items-center justify-center text-[#C43D36] font-semibold text-lg flex-shrink-0">
                2
              </div>

              <div className="ml-6">
                <h4 className="text-xl font-bold text-[#2B1B17] mb-1">
                  Create Your Own Art
                </h4>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Craft pottery, textiles, or jewelry and bring home a unique
                  souvenir from your experience.
                </p>
              </div>
            </div>
          </div>

          <Link
            to="/workshops"
            className="group mt-14 inline-flex items-center gap-3 bg-[#2b0b0b] text-white hover:bg-[#1A1A1A] py-4 px-8 uppercase tracking-widest text-sm font-semibold transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
          >
            Explore Workshops
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
              />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default WorkshopsSection;
