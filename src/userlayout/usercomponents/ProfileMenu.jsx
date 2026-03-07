import React from "react";
import {
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Typography,
  IconButton,
} from "@material-tailwind/react";
import { UserCircleIcon } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/Authcontext";

const ProfileMenu = () => {
  const { userinfo, logout } = useAuth();
  const navigate = useNavigate();

  const role = userinfo?.role;

  const speak = (text) => {
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = "ar-EG";
    speech.rate = 1;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(speech);
  };

  const Speaker = ({ text }) => (
    <span
      onClick={(e) => {
        e.stopPropagation();
        speak(text);
      }}
      className="cursor-pointer text-sm"
    >
      🔊
    </span>
  );

  const buyerMenu = [
    { label: "My Reservations", path: "/reservasions" },
    { label: "Cart", path: "/cart" },
    { label: "Edit Profile", path: "/registration/editprofile" },
  ];

  const adminMenu = [
    { label: "Dashboard", path: "/admindashboard/" },
    { label: "Edit Profile", path: "/registration/editprofile" },
  ];

  const sellerMenu = [
    { label: "لوحة التحكم", path: "/sellerdashboard/" },
    { label: "تعديل الملف الشخصي", path: "/registration/editprofile" },
  ];

  let menuItems = [];
  if (role === "buyer") menuItems = buyerMenu;
  if (role === "admin") menuItems = adminMenu;
  if (role === "seller") menuItems = sellerMenu;

  const logoutLabel = role === "seller" ? "تسجيل الخروج" : "Logout";

  return (
    <Menu>
      <MenuHandler>
        <IconButton variant="text">
          <UserCircleIcon className="h-10 w-15 text-white  text-5xl" />
        </IconButton>
      </MenuHandler>

      <MenuList
        className={`${
          role === "seller" ? "text-right font-serif" : "text-left"
        }`}
      >
        {menuItems.map((item, index) => (
          <MenuItem
            key={index}
            className="flex items-center justify-between"
            onClick={() => navigate(item.path)}
          >
            {role === "seller" && <Speaker text={item.label} />}
            <Typography variant="small" className="font-medium">
              {item.label}
            </Typography>
          </MenuItem>
        ))}

        <hr className="my-2 border-blue-gray-50" />

        <MenuItem
          className="flex items-center justify-between text-red-600"
          onClick={() => {
            logout();
            navigate("/");
          }}
        >
          {role === "seller" && <Speaker text={logoutLabel} />}
          <Typography variant="small" className="font-medium">
            {logoutLabel}
          </Typography>
        </MenuItem>
      </MenuList>
    </Menu>
  );
};

export default ProfileMenu;
