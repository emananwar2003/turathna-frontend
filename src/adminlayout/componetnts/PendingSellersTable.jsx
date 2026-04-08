import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { EyeIcon, UserCircleIcon, PhoneIcon } from "@heroicons/react/24/solid";
import {
  Card,
  CardHeader,
  Typography,
  CardBody,
  CardFooter,
  IconButton,
  Tooltip,
} from "@material-tailwind/react";

const TABLE_HEAD = ["Name", "Phone Number", "Function", "Status", ""];

export default function PendingSellersTable() {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPendingSellers = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(
          "http://localhost:5000/api/v1/admin/seller/pending",
          {
            method: "GET",
            headers: {
              Authorization: token,
              "Content-Type": "application/json",
            },
          },
        );

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.message || "Failed to fetch sellers");
        }

        const data = await res.json();
        setSellers(data.data.sellersList);
        
      } catch (err) {
        setError(err.message || "Failed to fetch sellers");
        setSellers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPendingSellers();
  }, []);

  return (
    <>
      
      <style
        dangerouslySetInnerHTML={{
          __html: `
            .hide-scroll-bar {
              -ms-overflow-style: none;
              scrollbar-width: none;
            }
            .hide-scroll-bar::-webkit-scrollbar {
              display: none;
            }
          `,
        }}
      />

      <Card className="w-full bg-[#EEEEEE] text-[#1D1616] shadow-2xl font-serif border-[#8E1616] border">
   
        <CardHeader floated={false} shadow={false} className="bg-[#EEEEEE]">
          <Typography className="text-[#8E1616] text-center font-serif text-4xl md:text-5xl">
            Pending Sellers
          </Typography>
          <Typography className="text-[#1D1616]/60 font-light mt-1 text-center font-serif">
            Review and approve newly registered sellers
          </Typography>
        </CardHeader>

       
        <CardBody className="px-0 overflow-x-auto hide-scroll-bar">
          <table className="w-full min-w-[600px] md:min-w-full table-auto text-left">
           
            <thead>
              <tr>
                {TABLE_HEAD.map((head) => (
                  <th key={head} className="border-b border-[#8E1616] p-4">
                    <Typography className="text-[#1D1616]/80 text-sm font-normal">
                      {head}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>

          
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-4 text-center text-[#1D1616]/70">
                    Loading sellers...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={5} className="p-4 text-center text-[#D84040]">
                    {error}
                  </td>
                </tr>
              ) : sellers.length > 0 ? (
                sellers.map((seller, index) => {
                  const isLast = index === sellers.length - 1;
                  const classes = isLast
                    ? "p-4"
                    : "p-4 border-b border-[#8E1616]/40";

                  return (
                    <tr
                      key={seller._id}
                      className="hover:bg-[#8E1616]/10 transition"
                    >
                     
                      <td className={classes}>
                        <div className="flex items-center gap-2">
                          <UserCircleIcon className="h-6 w-6 text-[#1D1616]/70" />
                          <Typography className="text-sm truncate">
                            {seller.name}
                          </Typography>
                        </div>
                      </td>

                      <td className={classes}>
                        <div className="flex items-center gap-1">
                          <PhoneIcon className="h-4 w-4 text-[#1D1616]/70" />
                          <Typography className="text-sm text-[#1D1616]/80 truncate">
                            {seller.phone || "N/A"}
                          </Typography>
                        </div>
                      </td>

                     
                      <td className={classes}>
                        <Typography className="text-sm truncate">
                          Seller
                        </Typography>
                      </td>

                    
                      <td className={classes}>
                        <div className="flex items-center gap-2">
                          <span className="w-3 h-3 rounded-full bg-[#D84040] inline-block" />
                          <Typography
                            className="text-sm capitalize truncate"
                            style={{ color: "#D84040" }}
                          >
                            {seller.verificationStatus || "pending"}
                          </Typography>
                        </div>
                      </td>

                      {/* VIEW BUTTON */}
                      <td className={classes}>
                        <Tooltip content="View Seller Info">
                          <IconButton
                            variant="text"
                            onClick={() =>
                              navigate(`/admindashboard/seller/${seller._id}`)
                            }
                          >
                            <EyeIcon className="h-5 w-5 text-[#1D1616]" />
                          </IconButton>
                        </Tooltip>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="p-4 text-center text-[#1D1616]/70">
                    No pending sellers
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </CardBody>

        
        <CardFooter className="border-t border-[#8E1616] p-4">
          <Typography className="text-sm text-[#1D1616]/70">
            Sellers waiting for approval
          </Typography>
        </CardFooter>
      </Card>
    </>
  );
}
