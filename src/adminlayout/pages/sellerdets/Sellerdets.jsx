import React, { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  Input,
  Typography,
  Checkbox,
} from "@material-tailwind/react";
import {
  UserIcon,
  PhoneIcon,
  PhotoIcon,
  ShoppingBagIcon,
  GlobeAltIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import SellerActions from "../../componetnts/SellerActions";


const Sellerdets = () => {
  const { id } = useParams();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    shopAddress: "",
    websiteLink: "",
    sellingOffline: false,
    sellingOnline: false,
    uploadedPhotos: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSeller = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        Swal.fire({
          icon: "warning",
          title: "Login Required",
          text: "Please log in first",
        });
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(
          `http://localhost:5000/api/v1/admin/seller/${id}`,
          {
            headers: {
              Authorization: token, 
              "Content-Type": "application/json",
            },
          },
        );
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Error fetching seller");

        const seller = data.seller;
        setForm({
          name: seller.name || "",
          phone: seller.phone || "",
          shopAddress: seller.shopAddress || "",
          websiteLink: seller.websiteLink || "",
          sellingOffline: seller.sellingOffline || false,
          sellingOnline: seller.sellingOnline || false,
          uploadedPhotos: seller.uploadedPhotos || [],
        });
      } catch (error) {
        Swal.fire({ icon: "error", title: "Error", text: error.message });
      } finally {
        setLoading(false);
      }
    };

    fetchSeller();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading...
      </div>
    );
  }

  return (
    <div
      className="min-h-screen w-full relative overflow-hidden bg-[#E5E5E5] flex items-center justify-center p-4"
      dir="ltr"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#2B0B0B]/10 via-transparent to-[#A10D0D]/5" />
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%232B0B0B' fill-opacity='1'%3E%3Cpath d='M30 0l5 10h10l-8 6 3 10-10-7-10 7 3-10-8-6h10z'/%3E%3C/g%3E%3C/svg%3E\")",
          backgroundSize: "60px 60px",
        }}
      />
      <div className="relative w-full max-w-2xl my-8">
        <Card className="shadow-2xl rounded-xl hover:shadow-3xl transition-all duration-300">
          <CardBody className="p-8 md:p-10">
            {/* Logo */}
            <div className="text-center mb-6">
              <Typography
                variant="h1"
                className="text-5xl font-serif mb-2"
                style={{ color: "#2B0B0B" }}
              >
                Turathna
              </Typography>
              <Typography
                variant="small"
                className="text-xs tracking-widest uppercase"
                style={{ color: "#A10D0D" }}
              >
                Seller Portal
              </Typography>
            </div>

            <div className="mb-6 text-center">
              <Typography
                variant="h3"
                className="mb-2"
                style={{ color: "#2B0B0B" }}
              >
                Seller Information
              </Typography>
            </div>

            <form className="space-y-5">
              {/* Name */}
              <div>
                <label className="text-sm text-[#2B0B0B] mb-1 block">
                  Full Name
                </label>
                <Input
                  type="text"
                  value={form.name}
                  readOnly
                  icon={<UserIcon className="h-5 w-5" />}
                  className="focus:!border-[#D63A3A] !text-right"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="text-sm text-[#2B0B0B] mb-1 block">
                  Phone Number
                </label>
                <Input
                  type="tel"
                  value={form.phone}
                  readOnly
                  icon={<PhoneIcon className="h-5 w-5" />}
                  className="focus:!border-[#D63A3A] !text-right"
                />
              </div>

              {/* Photos */}
              <div>
                <label className="text-sm text-[#2B0B0B] mb-2 block">
                  Portfolio Photos
                </label>

                {form.uploadedPhotos.length > 0 && (
                  <div className="grid grid-cols-5 gap-2 mt-2">
                    {form.uploadedPhotos.map((photo, i) => {
                      const cleanPath = photo.replace(/\\/g, "/");

                      const photoURL = cleanPath.startsWith("http")
                        ? cleanPath
                        : `http://localhost:5000/${cleanPath}`;

                      return (
                        <a
                          key={i}
                          href={photoURL}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="relative group"
                        >
                          <img
                            src={photoURL}
                            alt={`Work ${i + 1}`}
                            className="w-full h-20 object-cover rounded-lg"
                          />
                        </a>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Selling Type */}
              <div>
                <label className="text-sm text-[#2B0B0B] mb-2 block">
                  Selling Type
                </label>
                <div className="space-y-2 bg-gray-50 p-4 rounded-lg">
                  {form.sellingOffline && (
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked
                        readOnly
                        color="red"
                        icon={<ShoppingBagIcon className="h-3 w-3" />}
                      />
                      <label className="flex items-center gap-2">
                        <ShoppingBagIcon
                          className="h-5 w-5"
                          style={{ color: "#A10D0D" }}
                        />
                        <Typography variant="small" className="text-gray-700">
                          Physical Store
                        </Typography>
                      </label>
                    </div>
                  )}
                  {form.sellingOnline && (
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked
                        readOnly
                        color="red"
                        icon={<GlobeAltIcon className="h-3 w-3" />}
                      />
                      <label className="flex items-center gap-2">
                        <GlobeAltIcon
                          className="h-5 w-5"
                          style={{ color: "#A10D0D" }}
                        />
                        <Typography variant="small" className="text-gray-700">
                          Online
                        </Typography>
                      </label>
                    </div>
                  )}
                </div>
              </div>

              {/* Shop Address */}
              {form.sellingOffline && (
                <div className="animate-[fadeIn_0.3s_ease-in]">
                  <label className="text-sm text-[#2B0B0B] mb-1 block">
                    Store Address
                  </label>
                  <Input
                    type="text"
                    value={form.shopAddress}
                    readOnly
                    icon={<MapPinIcon className="h-5 w-5" />}
                    className="focus:!border-[#D63A3A] !text-right"
                  />
                </div>
              )}

              {/* Website Link */}
              {form.sellingOnline && (
                <div className="animate-[fadeIn_0.3s_ease-in]">
                  <label className="text-sm text-[#2B0B0B] mb-1 block">
                    Website Link
                  </label>
                  <Input
                    type="url"
                    value={form.websiteLink}
                    readOnly
                    icon={<GlobeAltIcon className="h-5 w-5" />}
                    className="focus:!border-[#D63A3A] !text-right"
                  />
                </div>
              )}

              {/* Admin Actions */}
              <SellerActions />
            </form>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default Sellerdets;
