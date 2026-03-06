import React from "react";
import { Link } from "react-router-dom";

const OurStorySection = () => {
  return (
    <section className="bg-[#F9F6F0] py-24 px-6 md:px-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Large Image */}
        <div className="relative h-full min-h-[300px] w-full">
          <img
            src="/our story.avif"
            alt="Our Story - Ancient Egyptian carving"
            className="absolute inset-0 w-full h-full object-cover shadow-xl"
          />
        </div>

        {/* Story Content */}
        <div className="lg:pl-8 py-8">
          <h2 className="text-5xl md:text-6xl font-serif font-bold text-[#2B1B17] leading-tight">
            More Than a <br />
            Product. <br />
            <span className="text-[#C43D36] italic font-medium mt-2 inline-block">
              A Story.
            </span>
          </h2>

          <p className="text-gray-600 font-light text-lg leading-relaxed mt-8 mb-12">
            Behind every piece lies a legacy. Our artisans are the guardians of
            Egypt's intangible heritage, passing down skills from pharaonic
            times through generations. When you choose Turathna, you don't just
            buy a product; you support a family, a village, and a history.
          </p>

          <div className="space-y-8">
            {/* List Item 1 */}
            <div className="flex items-start">
              <div className="w-12 h-12 rounded-full bg-[#fbeae9] flex items-center justify-center text-[#C43D36] font-semibold text-lg flex-shrink-0">
                1
              </div>

              <div className="ml-6">
                <h4 className="text-xl font-bold text-[#2B1B17] mb-1">
                  Fair Trade Practices
                </h4>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Ensuring every artisan is paid fairly for their mastery.
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
                  Cultural Preservation
                </h4>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Reviving endangered crafts like Tally embroidery and Naqada
                  weaving.
                </p>
              </div>
            </div>
          </div>

          <Link
            to="/about"
            className="group mt-14 inline-flex items-center gap-3 bg-[#2b0b0b] text-white hover:bg-[#1A1A1A] py-4 px-8 uppercase tracking-widest text-sm font-semibold transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
          >
            Learn more about us
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

export default OurStorySection;
