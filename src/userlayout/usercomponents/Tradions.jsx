import React from "react";

const Tradions = () => {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-5xl font-bold text-[var(--color-burgundy)] mb-6">
            Craft Traditions of Egypt
          </h2>

          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Journey through the diverse regions of Egypt and discover the unique
            artistry that defines each heritage craft
          </p>
        </div>

        <div className="space-y-8">
          {[
            {
              title: "Pottery from Upper Egypt",
              description:
                "Ancient clay traditions meet contemporary design in the skilled hands of Upper Egyptian potters. Each vessel carries the essence of Nile valley craftsmanship, shaped by techniques passed through countless generations.",
              image: "/pottery.jpeg",
            },
            {
              title: "Sinai Embroidery",
              description:
                "Vibrant threads tell stories of Bedouin heritage through intricate cross-stitch patterns. The geometric designs and bold colors reflect the spirit of Sinai's desert landscapes and nomadic traditions.",
              image:
                "/sgada.jpeg",
            },
            {
              title: "Nubian Jewelry",
              description:
                "Gold and silver crafted into stunning pieces that celebrate Nubian identity. From delicate filigree to bold statement pieces, each creation honors the rich artistic legacy of Nubian culture.",
              image:
                "/sna3a7oly.jpeg",
            },
            {
              title: "Handwoven Textiles",
              description:
                "Traditional looms create patterns that echo Egypt's diverse heritage. From Siwa's distinctive weaves to Delta cotton textiles, each piece reflects regional identity and masterful technique.",
              image:
                "/handwoven.jpeg",
            },
          ].map((craft, index) => (
            <div
              key={index}
              className={`group bg-[#FAF6F1] rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 ${
                index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
              } flex flex-col md:flex`}
            >
              <div className="md:w-1/2 relative overflow-hidden h-80 md:h-auto">
                <img
                  src={craft.image}
                  alt={craft.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>

              <div className="md:w-1/2 p-12 flex flex-col justify-center">
                <h3 className="text-3xl font-bold text-[#2B0B0B] mb-6">
                  {craft.title}
                </h3>

                <p className="text-lg text-gray-700 leading-relaxed">
                  {craft.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Tradions;
