import React from "react";
import holdingsImg from "../../assets/holdings.png";

const Noholdings = () => {
  return (
    <section className="w-full flex flex-col-reverse md:flex-row items-center justify-between px-6 md:px-20 py-16 bg-white">
      
      {/* Left Image */}
      <div className="w-full md:w-1/2 flex justify-center md:justify-start">
        <img
          src={holdingsImg}
          alt="Stocks Holdings"
          className="w-[300px] md:w-[420px] object-contain"
        />
      </div>

      {/* Right Text */}
      <div className="w-full md:w-1/2 mb-10 md:mb-0">
        <p className="text-sm text-gray-500 mb-2 font-medium">
          Introducing
        </p>

        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight mb-4">
          Stocks
        </h1>

        <p className="text-gray-500 text-base md:text-lg max-w-md">
          Investing in stocks will never be the same again
        </p>

        {/* Button Placeholder */}
        {/* <button className="mt-8 px-6 py-3 bg-emerald-500 text-white rounded-md text-sm font-semibold shadow">
          TRY IT OUT
        </button> */}
      </div>
    </section>
  );
};

export default Noholdings;