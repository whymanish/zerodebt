import React from "react";

const Cards = () => {
  return (
    <div >
      <div className="flex justify-center mt-60">
        <div className="grid lg:grid-cols-3 p-4 gap-8">
          <div className="bg-gray-900   w-80 h-52 rounded-xl">

            <img src="chip.png" className="w-12 h-12 relative top-20  ml-8" alt="" />
          </div>
          <div className="bg-blue-100   w-80 h-52 rounded-xl">

          <img src="chip.png" className="w-12 h-12 relative top-20  ml-8" alt="" />

          </div>
          <div className="bg-[#083060]  w-80 h-52 rounded-xl">
          <img src="chip.png" className="w-12 h-12 relative top-20  ml-8" alt="" />

          </div>
          <div className="bg-[#00607c]  w-80 h-52 rounded-xl">
          <img src="chip.png" className="w-12 h-12 relative top-20  ml-8" alt="" />

          </div>
          <div className="bg-[#7c2864]  w-80 h-52 rounded-xl">
          <img src="chip.png" className="w-12 h-12 relative top-20  ml-8" alt="" />

          </div>
          <div className="bg-[#da18c6]  w-80 h-52 rounded-xl">
          <img src="chip.png" className="w-12 h-12 relative top-20  ml-8" alt="" />

          </div>

        </div>
      </div>
    </div>
  );
};

export default Cards;
