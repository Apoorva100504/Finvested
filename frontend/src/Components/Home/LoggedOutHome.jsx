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

  const handleOpenLoginModal = () => setIsLoginModalOpen(true);
  const handleCloseLoginModal = () => setIsLoginModalOpen(false);
  const handleLoginSuccess = () => setIsLoginModalOpen(false);

  return (
    <div className="bg-white min-h-screen">
     

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
            <h2 className="text-5xl md:text-6xl font-extrabold mb-4 text-gray-900">
              Grow your wealth with confidence
            </h2>

            <p className="text-lg md:text-xl text-gray-700 mb-6">
              Invest in stocks, mutual funds, and more with our easy-to-use platform.
              Built for a growing India.
            </p>

            <button
              className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-aquaMintDark to-neonBlue 
             rounded-xl hover:shadow-lg hover:shadow-neonBlue/30 hover:from-neonBlue hover:to-aquaMintDark 
             active:scale-95 transition-all duration-200 shadow-md"
              onClick={handleOpenLoginModal}
            >
              Get started
            </button>
          </motion.div>

          {/* IMAGE */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="w-full md:w-4/5 lg:w-2/3 mx-auto"
          >
            <img
              src={cityImage}
              alt="Cityscape"
              className="w-full h-auto object-contain rounded-xl shadow-xl"
            />
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
            className="md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left mb-12 md:mb-0"
          >
            <img
              src={sideImage}
              alt="Side Tower"
              className="w-full max-w-[240px] mb-6"
            />

            <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-gray-900">
              Indian markets at your fingertips.
            </h2>

            <p className="text-lg md:text-xl text-gray-700 mb-6 max-w-md">
              Long-term or short-term, high risk or low risk. Be the kind of investor you want to be.
            </p>
          </motion.div>

          {/* RIGHT COLUMN */}
          <motion.div
            initial={{ opacity: 0, x: 80 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            viewport={{ once: true }}
            className="md:w-1/2 flex justify-center md:justify-end"
          >
            <img
              src={mobileImage}
              alt="Mobile App"
              className="w-full max-w-md object-contain"
            />
          </motion.div>
        </section>

        {/* ================= FOOTER TAGLINE ================= */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-center mb-24 flex flex-col items-center"
        >
          <img src={hat} alt="Hat" className="w-16 h-16 mb-4" />

          <div className="text-black text-4xl font-semibold leading-snug mb-1">
            Finance simplified
          </div>

          <div className="text-black text-4xl font-semibold leading-snug">
            in your language
          </div>
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
