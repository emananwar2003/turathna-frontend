import React from "react";
import {
  Card,
  CardBody,
  Typography,
  Button,
  Avatar,
} from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import { SpeakerWaveIcon } from "@heroicons/react/24/solid";

const actions = [
  {
    title: "إضافة منتج",
    description: "أضف منتجًا جديدًا إلى المتجر.",
    route: "/sellerdashboard/addproduct",
  },
  {
    title: " رؤية جميع منتجاتي",
    description: "قم بتعديل أو تحديث المنتجات الموجودة.",
    route: "/sellerdashboard/seemyproducts",
  },
];

const Dashboard = () => {
  const navigate = useNavigate();

  
  const speakText = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "ar-SA"; // اللغة العربية
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div
      className="min-h-screen p-12"
      style={{
        backgroundColor: "#F9F9F9",
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23008B8B' fill-opacity='0.05'%3E%3Cpath d='M30 0l5 10h10l-8 6 3 10-10-7-10 7 3-10-8-6h10z'/%3E%3C/g%3E%3C/svg%3E")`,
      }}
    >
      {/* Page Title */}
      <Typography
        variant="h3"
        className="mb-10 font-bold text-[#8E1616] font-serif text-center text-5xl flex justify-center items-center gap-3"
      >
        لوحة تحكم البائع
        <SpeakerWaveIcon
          className="w-8 h-8 cursor-pointer text-[#D84040]"
          onClick={() => speakText("لوحة تحكم البائع")}
        />
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

              {/* Title with speaker */}
              <div className="flex items-center gap-2">
                <Typography variant="h5" className="text-[#1D1616]">
                  {item.title}
                </Typography>
                <SpeakerWaveIcon
                  className="w-6 h-6 text-[#D84040] cursor-pointer"
                  onClick={() => speakText(item.title)}
                />
              </div>

              {/* Description with speaker */}
              <div className="flex items-center gap-2">
                <Typography className="text-gray-600">
                  {item.description}
                </Typography>
                <SpeakerWaveIcon
                  className="w-6 h-6 text-[#D84040] cursor-pointer"
                  onClick={() => speakText(item.description)}
                />
              </div>

              {/* Button */}
              <Button
                className="bg-[#D84040] hover:bg-[#8E1616] w-fit"
                onClick={() => navigate(item.route)}
              >
                فتح
              </Button>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
