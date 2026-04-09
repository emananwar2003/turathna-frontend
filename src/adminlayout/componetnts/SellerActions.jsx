import React, { useState } from "react";
import { Button } from "@material-tailwind/react";
import Swal from "sweetalert2";
import { useParams, useNavigate } from "react-router-dom";

const SellerActions = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const updateStatus = async (newStatus) => {
 
    const statusMap = { accepted: "approved", rejected: "rejected" };
    const verificationStatus = statusMap[newStatus];

    if (!verificationStatus) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Invalid status value",
      });
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      Swal.fire({
        icon: "warning",
        title: "Login Required",
        text: "Please log in first",
      });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:5000/api/v1/admin/update/seller/${id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: token, 
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ verificationStatus }),
        },
      );

      const data = await res.json();
      if (!res.ok)
        throw new Error(data.message || "Error updating seller status");

     
      Swal.fire({
        icon: "success",
        title: "Success",
        text: `Seller has been ${newStatus}`,
        confirmButtonColor: "#D63A3A",
      }).then(() => {
        navigate("/admindashboard/newseller"); 
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-wrap md:flex-nowrap justify-between gap-4 mt-6">
    
      <div className="flex-1 min-w-[140px] order-1 md:order-1">
        <Button
          color="red"
          disabled={loading}
          onClick={() => updateStatus("rejected")}
          className="w-full py-3 text-lg normal-case hover:scale-[1.05] active:scale-[0.97] transition-transform"
        >
          Reject
        </Button>
      </div>

     
      <div className="flex-1 min-w-[140px] order-2 md:order-2">
        <Button
          color="green"
          disabled={loading}
          onClick={() => updateStatus("accepted")}
          className="w-full py-3 text-lg normal-case hover:scale-[1.05] active:scale-[0.97] transition-transform"
        >
          Accept
        </Button>
      </div>
    </div>
  );
};

export default SellerActions;
