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
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Meet the Artisans
                </a>
              </li>
              
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-lg font-serif mb-6 text-gray-200">
              Newsletter
            </h4>
            <p className="text-gray-400 text-sm mb-4">
              Subscribe to discover new collections, artisan stories, and
              exclusive offers.
            </p>
            <form className="flex">
              <input
                type="email"
                placeholder="Email address"
                className="bg-gray-800 text-white px-4 py-2 w-full focus:outline-none focus:ring-1 focus:ring-[#C43D36]"
              />
              <button
                type="submit"
                className="bg-[#C43D36] hover:bg-[#a6312a] px-4 py-2 transition-colors duration-300 font-semibold uppercase text-xs tracking-wider"
              >
                Join
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
          <p>
            &copy; {new Date().getFullYear()} Turathna. All rights reserved.
          </p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <a href="#" className="hover:text-gray-300">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-gray-300">
              Terms of Service
            </a>
            <a href="#" className="hover:text-gray-300">
              Shipping & Returns
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
