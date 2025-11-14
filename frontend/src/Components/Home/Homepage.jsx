import React, { useState } from 'react';
import Navbar from './Navbar'; // Adjust path if needed
import cityImage from '../../assets/city.png'; // Import the city image
import sideImage from '../../assets/side.png'; // Import the side tower image
import mobileImage from '../../assets/mobile.png'; // Import the mobile image
import hat from '../../assets/hat.png'; // Import the mobile image
import Footer from './Footer';
import LoginModal from '../login/LoginModal'; // Import the LoginModal component

function Homepage() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const handleOpenLoginModal = () => {
    setIsLoginModalOpen(true);
  };

  const handleCloseLoginModal = () => {
    setIsLoginModalOpen(false);
  };

  const handleLoginSuccess = () => {
    // Handle successful login, e.g., redirect user or update state
    console.log('Login successful!');
    setIsLoginModalOpen(false); // Close modal after successful login
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 md:pt-32"> {/* Added top padding to clear navbar */}
        {/* Section after Get Started */}
        <section className="flex flex-col items-center justify-center py-16 space-y-12 text-center">
          
          {/* Text content */}
          <div className="md:w-3/4 lg:w-2/3">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-gray-900"> 
              Grow your wealth with confidence
            </h2>
            <p className="text-lg md:text-xl text-gray-700 mb-6">
              Invest in stocks, mutual funds, and more with our easy-to-use platform.
              Built for a growing India.
            </p>
            <button 
              className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-200"
              onClick={handleOpenLoginModal} // Open modal on click
            >
              Get started
            </button>
          </div>

 {/* Image below text */}
<div className="w-full md:w-4/5 lg:w-3/4 mx-auto">
  <div className="w-full h-64 md:h-72 lg:h-80">
    <img 
      src={cityImage} 
      alt="Cityscape" 
      className="w-full h-50 object-contain rounded-lg shadow-xl" 
    />
  </div>
</div>
        </section>

{/* New section */}
<section className="flex flex-col md:flex-row items-center justify-between py-16 px-4 md:px-8 bg-white mt-64 w-full">
  {/* Left Column: Image and Text */}
  <div className="md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left mb-8 md:mb-0 -mt-56">
    <div className="w-full max-w-[150px] md:max-w-[200px] lg:max-w-[250px] mb-6">
      <img src={sideImage} alt="Side Tower" className="w-full h-auto object-contain" />
    </div>

    <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-gray-900">
      Indian markets at your fingertips.
    </h2>
    <p className="text-lg md:text-xl text-gray-700 mb-6">
      Long-term or short-term, high risk or low risk. Be the kind of investor you want to be.
    </p>
  </div>

  {/* Right Column: Mobile Image */}
  <div className="md:w-1/2 flex justify-center md:justify-end">
    <div className="w-full max-w-xs md:max-w-sm lg:max-w-md">
      <img src={mobileImage} alt="Mobile App" className="w-full h-auto object-contain" />
    </div>
  </div>
</section>
<div className="text-center mb-10 flex flex-col items-center mt-32">
  {/* Hat image */}
  <img src={hat} alt="Hat" className="w-15 h-15 mb-2" />

  {/* Text lines */}
  <div className="text-black text-4xl font-semibold leading-snug mb-2">
    Finance simplified
  </div>
  <div className="text-black text-4xl font-semibold leading-snug">
    in your language
  </div>
</div>

      </main>
      <Footer/>

      {/* Render Login Modal */}
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={handleCloseLoginModal} 
        onLoginSuccess={handleLoginSuccess} 
      />
    </div>
  );
}

export default Homepage;
