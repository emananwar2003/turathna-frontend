import React from "react";
import { Card, Typography, Button } from "@material-tailwind/react";
import { Link } from "react-router-dom";
import { XCircleIcon } from "@heroicons/react/24/solid";

const Notfund = () => {
  return (
    <div
      className="min-h-screen flex items-center justify-center  "
      style={{
        backgroundColor: "#EEEEEE",
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23D84040' fill-opacity='0.08'%3E%3Cpath d='M30 0l5 10h10l-8 6 3 10-10-7-10 7 3-10-8-6h10z'/%3E%3C/g%3E%3C/svg%3E")`,
      }}
    >
      <Card className="bg-[#8E1616]/40 backdrop-blur-md border w-3/4 border-[#D84040] px-12 py-16 text-center shadow-2xl">
        <div className="flex justify-center mb-4">
          <XCircleIcon className="h-32 w-32 text-[#550909] " />
        </div>
        <Typography
          variant="h1"
          className="text-[#EEEEEE] text-7xl font-bold mb-4"
        >
          404
        </Typography>

        <Typography variant="h4" className="text-[#EEEEEE] mb-4">
          Page Not Found
        </Typography>

        <Typography className="text-[#EEEEEE]/80 mb-8">
          The page you are looking for does not exist.
        </Typography>

        <Link to="/">
          <Button className="bg-[#D84040] hover:bg-[#8E1616] text-[#EEEEEE]">
            Go To Home
          </Button>
        </Link>
      </Card>
    </div>
  );
};

export default Notfund;
