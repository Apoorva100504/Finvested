import React, { useState } from 'react';
import { motion } from "framer-motion";

import Navbar from './Navbar';
import cityImage from '../../assets/city.png';
import sideImage from '../../assets/side.png';
import mobileImage from '../../assets/mobile.png';
import hat from '../../assets/hat.png';
import Footer from './Footer';
import LoginModal from '../login/LoginModal';

function LoggedOutHome() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [hoveredButton, setHoveredButton] = useState(false);

  const handleOpenLoginModal = () => setIsLoginModalOpen(true);
  const handleCloseLoginModal = () => setIsLoginModalOpen(false);
  const handleLoginSuccess = () => setIsLoginModalOpen(false);

  return (
    <div className="bg-white min-h-screen">
      <Navbar />

      <main className="container mx-auto px-4 pt-4 md:pt-6">
        
        {/* ================= HERO ================= */}
        <section className="flex flex-col items-center justify-center py-16 space-y-14 text-center">
          {/* TEXT */}
          <motion.div
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="md:w-3/4 lg:w-2/3"
          >
            <motion.h2 
              className="text-5xl md:text-6xl font-extrabold mb-6 text-gray-900"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              Grow your wealth with confidence
            </motion.h2>

            <motion.p 
              className="text-lg md:text-xl text-gray-700 mb-8 max-w-2xl mx-auto"
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.3 }}
            >
              Invest in stocks, mutual funds, and more with our easy-to-use platform.
              Built for a growing India.
            </motion.p>

            <motion.button
              initial={{ scale: 1 }}
              animate={{ scale: hoveredButton ? 1.05 : 1 }}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              onMouseEnter={() => setHoveredButton(true)}
              onMouseLeave={() => setHoveredButton(false)}
              className="relative px-8 py-4 text-lg font-semibold text-white rounded-xl shadow-2xl overflow-hidden group"
              onClick={handleOpenLoginModal}
              style={{
                background: 'linear-gradient(135deg, #48E1C4 0%, #5064FF 100%)',
              }}
            >
              {/* Animated gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              
              {/* Glow effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute -inset-2 bg-gradient-to-r from-[#48E1C4]/30 via-[#5064FF]/30 to-[#48E1C4]/30 blur-lg rounded-xl"></div>
              </div>
              
              {/* Text */}
              <span className="relative flex items-center justify-center gap-3">
                Get started
                <motion.svg 
                  className="w-5 h-5" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  animate={{ x: hoveredButton ? 5 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </motion.svg>
              </span>
            </motion.button>
          </motion.div>

          {/* IMAGE */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="w-full md:w-4/5 lg:w-2/3 mx-auto group"
            whileHover={{ scale: 1.01 }}
          >
            <div className="relative overflow-hidden rounded-2xl shadow-xl">
              <img
                src={cityImage}
                alt="Cityscape"
                className="w-full h-auto object-contain transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
          </motion.div>
        </section>

        {/* ================= MARKETS SECTION ================= */}
        <section className="flex flex-col md:flex-row items-center justify-between py-28 px-4 md:px-8 bg-white w-full">
          {/* LEFT COLUMN */}
          <motion.div
            initial={{ opacity: 0, x: -80 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            viewport={{ once: true }}
            className="md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left mb-12 md:mb-0 space-y-6"
          >
            <motion.div 
              className="relative group"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <img
                src={sideImage}
                alt="Side Tower"
                className="w-full max-w-[240px] transition-all duration-500 group-hover:brightness-110 group-hover:drop-shadow-lg"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-[#48E1C4]/10 to-[#5064FF]/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </motion.div>

            <motion.h2 
              className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              Indian markets at your fingertips.
            </motion.h2>

            <motion.p 
              className="text-lg md:text-xl text-gray-700 max-w-md leading-relaxed"
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.3 }}
            >
              Long-term or short-term, high risk or low risk. Be the kind of investor you want to be.
            </motion.p>
          </motion.div>

          {/* RIGHT COLUMN */}
          <motion.div
            initial={{ opacity: 0, x: 80 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            viewport={{ once: true }}
            className="md:w-1/2 flex justify-center md:justify-end group"
          >
            <div className="relative">
              <img
                src={mobileImage}
                alt="Mobile App"
                className="w-full max-w-md object-contain transition-all duration-500 group-hover:scale-105 group-hover:drop-shadow-2xl"
              />
              {/* Floating shadow effect */}
              <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-3/4 h-4 bg-gradient-to-r from-[#48E1C4]/20 via-[#5064FF]/20 to-[#48E1C4]/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
          </motion.div>
        </section>

        {/* ================= FOOTER TAGLINE ================= */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-center mb-24 flex flex-col items-center space-y-6"
        >
          <motion.div
            whileHover={{ scale: 1.2, rotate: 5 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
            className="relative group"
          >
            <img 
              src={hat} 
              alt="Hat" 
              className="w-20 h-20 transition-all duration-500 group-hover:drop-shadow-lg"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-[#48E1C4]/20 to-[#5064FF]/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </motion.div>

          <motion.div
            className="space-y-2"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-black text-4xl font-semibold leading-snug bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent transition-all duration-500 hover:from-[#5064FF] hover:to-[#48E1C4]">
              Finance simplified
            </div>
            <div className="text-black text-4xl font-semibold leading-snug bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent transition-all duration-500 hover:from-[#48E1C4] hover:to-[#5064FF]">
              in your language
            </div>
          </motion.div>

          {/* CTA Button */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-8 px-6 py-3 text-sm font-medium text-gray-700 bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg border border-gray-300 hover:border-[#5064FF] hover:text-[#5064FF] hover:from-blue-50 hover:to-cyan-50 hover:shadow-md transition-all duration-300"
            onClick={handleOpenLoginModal}
          >
            Start your investment journey today →
          </motion.button>
        </motion.div>
      </main>

      <Footer />

      {/* MODAL */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={handleCloseLoginModal}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
}

export default LoggedOutHome;