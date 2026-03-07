import React from "react";
import {
  Card,
  CardBody,
  Typography,
  Button,
  Avatar,
} from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";

const actions = [
  {
    title: "See New Sellers",
    description: "Review and approve newly registered sellers.",
    route: "/admindashboard/newseller",
  },

];

const Admindashboard = () => {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen p-12"
      style={{
        backgroundColor: "#EEEEEE",
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23D84040' fill-opacity='0.08'%3E%3Cpath d='M30 0l5 10h10l-8 6 3 10-10-7-10 7 3-10-8-6h10z'/%3E%3C/g%3E%3C/svg%3E")`,
      }}
    >
      {/* Page Title */}
      <Typography variant="h3" className="mb-10 font-bold text-[#8E1616] font-serif text-center text-5xl">
        Admin Dashboard
      </Typography>

      {/* Cards Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {actions.map((item, index) => (
          <Card key={index} className="shadow-lg hover:shadow-2xl transition">
            <CardBody className="flex flex-col gap-4">
              {/* Logo Avatar */}
              <Avatar
                src="/logo.jpg"
                alt="logo"
                size="lg"
                className="rounded-full border border-[#D84040]"
              />

              {/* Title */}
              <Typography variant="h5" className="text-[#1D1616]">
                {item.title}
              </Typography>

              {/* Description */}
              <Typography className="text-gray-600">
                {item.description}
              </Typography>

              {/* Button */}
              <Button
                className="bg-[#D84040] hover:bg-[#8E1616] w-fit"
                onClick={() => navigate(item.route)}
              >
                Open
              </Button>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Admindashboard;
