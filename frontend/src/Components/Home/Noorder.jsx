import React from "react";
import order from "../../assets/noorder.png";

const Noorder = () => {
  return (
    <section className="w-full flex flex-col md:flex-row items-center justify-center px-6 md:px-20 py-20 bg-white">

      {/* Image Left */}
      <div className="w-full md:w-auto flex justify-center md:justify-start md:mr-10 mb-8 md:mb-0">
        <img
          src={order}
          alt="No Orders"
          className="w-[260px] md:w-[330px] object-contain"
        />
      </div>

      {/* Text Right */}
      <div className="w-full md:w-auto text-center md:text-left">
        <p className="text-gray-700 text-2xl font-semibold leading-snug">
          You have no open <br /> orders
        </p>

        <a
          href="#"
          className="text-emerald-500 text-sm font-medium mt-3 inline-flex items-center hover:text-emerald-600 transition-colors"
        >
          All Orders
          <span className="ml-1">›</span>
        </a>
      </div>

    </section>
  );
};

export default Noorder;
