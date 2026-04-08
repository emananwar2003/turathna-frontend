import React from "react";
import {
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Typography,
  Button,
} from "@material-tailwind/react";
import {
  UserCircleIcon,
  SpeakerWaveIcon,
  Cog6ToothIcon,
  PowerIcon,
} from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/Authcontext";

const UserProfileMenu = () => {
  const { userinfo, logout } = useAuth();
  const navigate = useNavigate();

  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const role = userinfo?.role;
  const userId = userinfo?.userId;


  const speak = (text) => {
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = "ar-EG";
    speech.rate = 1;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(speech);
  };

  const Speaker = ({ text }) => (
    <SpeakerWaveIcon
      className="h-5 w-5 cursor-pointer text-blue-500"
      onClick={(e) => {
        e.stopPropagation();
        speak(text);
      }}
    />
  );

  const buyerMenu = [
    { label: "My Reservations", path: "/reservasions" },
    { label: "Cart", path: "/cart" },
    { label: "Edit Profile", path: `/registration/editprofile/${userId}` },
    { label: "My Orders", path: "/buyerorders" },
  ];

  const adminMenu = [
    { label: "Dashboard", path: "/admindashboard/" },
    { label: "Edit Profile", path: `/registration/editprofile/${userId}` },
  ];

  const sellerMenu = [
    { label: "لوحة التحكم", path: "/sellerdashboard/" },
    {
      label: "تعديل الملف الشخصي",
      path: `/registration/editprofile/${userId}`,
    },
  ];

  let menuItems = [];
  if (role === "buyer") menuItems = buyerMenu;
  if (role === "admin") menuItems = adminMenu;
  if (role === "seller") menuItems = sellerMenu;

  const logoutLabel = role === "seller" ? "تسجيل الخروج" : "Logout";

  return (
    <Menu open={isMenuOpen} handler={setIsMenuOpen} placement="bottom-end">
      <MenuHandler>
        <Button
          variant="text"
          color="blue-gray"
          className="flex items-center rounded-full p-0"
        >
          <UserCircleIcon className="h-16 w-16 text-white p-1 border-2 border-white rounded-full shadow-lg hover:shadow-xl" />
        </Button>
      </MenuHandler>

      <MenuList className="p-1">
        {menuItems.map((item) => (
          <MenuItem
            key={item.label}
            className="flex items-center justify-between gap-2"
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
          className="flex items-center justify-between gap-2 text-red-600"
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

export default UserProfileMenu;
