import React from "react";
import { Link } from "react-router-dom";
import {
  TiSocialFacebook,
  TiSocialInstagram,
  TiSocialTwitter,
} from "react-icons/ti";
import { MdMarkEmailUnread } from "react-icons/md";

const Footer = () => {
  return (
    <footer className="bg-[#2b0b0b] text-white pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand / About */}
          <div className="lg:col-span-2 flex flex-col sm:flex-row gap-8 items-center sm:items-start">
            <div className="w-32 md:w-40 flex-shrink-0 mb-6 sm:mb-0">
              <img
                src="/logo.jpg"
                alt="Turathna Logo"
                className="w-full h-auto object-contain mix-blend-screen"
              />
            </div>
            <div>
              <p className="text-gray-400 text-sm leading-relaxed mb-6 sm:mt-2 text-center sm:text-left">
                Connecting you with the authentic spirit of Egyptian
                craftsmanship. We empower local artisans and preserve
                centuries-old heritage.
              </p>

              {/* Social Icons */}
              <div className="flex gap-4 justify-center sm:justify-start">
                <div className="w-8 h-8 rounded-full bg-gray-700 hover:bg-[#C43D36] transition-colors cursor-pointer flex items-center justify-center">
                  <TiSocialFacebook className="text-xs" />
                </div>
                <div className="w-8 h-8 rounded-full bg-gray-700 hover:bg-[#C43D36] transition-colors cursor-pointer flex items-center justify-center">
                  <TiSocialInstagram className="text-xs" />
                </div>
                <div className="w-8 h-8 rounded-full bg-gray-700 hover:bg-[#C43D36] transition-colors cursor-pointer flex items-center justify-center">
                  <TiSocialTwitter className="text-xs" />
                </div>
                <div className="w-8 h-8 rounded-full bg-gray-700 hover:bg-[#C43D36] transition-colors cursor-pointer flex items-center justify-center">
                  <MdMarkEmailUnread className="text-xs" />
                </div>
              </div>
            </div>
          </div>

          {/* Explore Links */}
          <div>
            <h4 className="text-lg font-serif mb-6 text-gray-200">Explore</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li>
                <Link
                  to="/products"
                  className="hover:text-white transition-colors"
                >
                  All Products
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="hover:text-white transition-colors"
                >
                  Our Story
                </Link>
              </li>
              <li>
                <Link
                  to="/workshops"
                  className="hover:text-white transition-colors"
                >
                  Craft Experiences
                </Link>
              </li>
            </ul>
          </div>
          {/* Categories — right corner */}
          <div>
            <h4 className="text-lg font-serif mb-6 text-gray-200">
              Categories
            </h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li>
                <Link
                  to="/category/textiles-and-embroidery"
                  className="hover:text-white transition-colors"
                >
                  Textiles & Embroidery
                </Link>
              </li>
              <li>
                <Link
                  to="/category/pottery-and-ceramics"
                  className="hover:text-white transition-colors"
                >
                  Pottery & Ceramics
                </Link>
              </li>
              <li>
                <Link
                  to="/category/jewelry-and-accessories"
                  className="hover:text-white transition-colors"
                >
                  Jewelry & Accessories
                </Link>
              </li>
              <li>
                <Link
                  to="/category/home-decor"
                  className="hover:text-white transition-colors"
                >
                  Home Decor
                </Link>
              </li>
              <li>
                <Link
                  to="/category/bags-and-leather-goods"
                  className="hover:text-white transition-colors"
                >
                  Bags & Leather Goods
                </Link>
              </li>
              <li>
                <Link
                  to="/category/wood-and-carved-art"
                  className="hover:text-white transition-colors"
                >
                  Wood & Carved Art
                </Link>
              </li>
              <li>
                <Link
                  to="/category/art-and-paintings"
                  className="hover:text-white transition-colors"
                >
                  Art & Paintings
                </Link>
              </li>
              <li>
                <Link
                  to="/category/handmade-gifts"
                  className="hover:text-white transition-colors"
                >
                  Handmade Gifts
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
          <p>
            &copy; {new Date().getFullYear()} Turathna. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
