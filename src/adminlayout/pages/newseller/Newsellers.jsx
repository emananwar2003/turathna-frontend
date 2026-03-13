import React from "react";
import PendingSellersTable from "../../componetnts/PendingSellersTable";

const Newsellers = () => {
  return (
    <>
    
      <div
        className="flex justify-center items-center min-h-screen bg-[#EEEEEE] px-4 py-6"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23D84040' fill-opacity='0.08'%3E%3Cpath d='M30 0l5 10h10l-8 6 3 10-10-7-10 7 3-10-8-6h10z'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "60px 60px",
        }}
      >
      
        <div className="w-full max-w-7xl overflow-x-auto hide-scroll-bar">
          <PendingSellersTable />
        </div>
      </div>
    </>
  );
};

export default Newsellers;
