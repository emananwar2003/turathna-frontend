import React from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Navbar,
  Collapse,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
} from "@material-tailwind/react";
import { CiLogin } from "react-icons/ci";
import Swal from "sweetalert2";
import {
  ChevronDownIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Avatar } from "@material-tailwind/react";
import {
  Squares2X2Icon,
  SwatchIcon,
  CubeIcon,
  SparklesIcon,
  HomeIcon,
  ShoppingBagIcon,
  FireIcon,
  GiftIcon,
  PaintBrushIcon,
} from "@heroicons/react/24/solid";
import { useAuth } from "../../context/Authcontext";
import ProfileMenu from "./ProfileMenu";

const navListMenuItems = [
  {
    title: "All Products",
    description: "Browse all authentic Egyptian handmade products.",
    icon: Squares2X2Icon,
  },
  {
    title: "textiles and embroidery",
    description: "Handwoven fabrics, kilims, and Sinai embroidery.",
    icon: SwatchIcon,
  },
  {
    title: "pottery and ceramics",
    description: "Traditional handmade pottery and decorative ceramics.",
    icon: CubeIcon,
  },
  {
    title: "jewelry and accessories",
    description: "Silver, copper, and heritage-inspired accessories.",
    icon: SparklesIcon,
  },
  {
    title: "home-decor",
    description: "Authentic Egyptian decorative pieces.",
    icon: HomeIcon,
  },
  {
    title: "bags and leather goods",
    description: "Handcrafted leather bags and accessories.",
    icon: ShoppingBagIcon,
  },
  {
    title: "wood and carved-art",
    description: "Hand-carved wooden crafts and ornaments.",
    icon: FireIcon,
  },
  {
    title: "Handmade Gifts",
    description: "Unique gift items crafted by local artisans.",
    icon: GiftIcon,
  },
  {
    title: "art and paintings",
    description: "Cultural paintings and handcrafted artwork.",
    icon: PaintBrushIcon,
  },
];

const NavLink = ({ to, children }) => (
  <Link
    to={to}
    className="text-[#EEEEEE] font-serif text-2xl px-4 py-2 rounded-lg hover:bg-[#2B0B0B] transition-colors duration-150"
  >
    {children}
  </Link>
);

const MobileNavLink = ({ to, children, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    className="text-[#EEEEEE] font-serif text-lg px-4 py-3 rounded-lg hover:bg-[#2B0B0B] transition-colors duration-150 block w-full"
  >
    {children}
  </Link>
);

const Navbars = () => {
  const [openNav, setOpenNav] = React.useState(false);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const { token, loading } = useAuth();
  const navigate = useNavigate();

  const handleClick = () => {
    Swal.fire({
      title: "Are you a buyer or a seller?",
      html: `
        <div style="text-align:center;">
          <button id="speakBtn" class="speak-btn">
            🔊 تشغيل الصوت
          </button>
        </div>
      `,
      icon: "question",
      confirmButtonText: "Seller",
      cancelButtonText: "Buyer",
      showCancelButton: true,
      showCloseButton: true,
      confirmButtonColor: "#D84040",
      cancelButtonColor: "#1D1616",
      didOpen: () => {
        const text = "هل انت بائع ام شاري؟ ان كنت بائع اضغط علي الزر الاحمر";
        const speech = new SpeechSynthesisUtterance(text);
        speech.lang = "ar-EG";
        speech.rate = 1;
        window.speechSynthesis.speak(speech);
      },
    }).then((result) => {
      if (result.isConfirmed) {
        navigate("/registration/sellerlogin");
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        navigate("/registration/userlogin");
      }
    });
  };

  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 960) setOpenNav(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleMenuItemClick = (key, title) => {
    setIsMenuOpen(false);
    setIsMobileMenuOpen(false);
    setOpenNav(false);
    if (key === 0) {
      navigate("/products");
    } else {
      navigate(`/category/${title.toLowerCase().replace(/\s+/g, "-")}`);
    }
  };

  const renderMenuItems = navListMenuItems.map(
    ({ icon, title, description }, key) => (
      <MenuItem
        key={key}
        className="flex items-center gap-3 rounded-lg"
        onClick={() => handleMenuItemClick(key, title)}
      >
        <div className="flex items-center justify-center rounded-lg bg-blue-gray-50 p-2">
          {React.createElement(icon, {
            strokeWidth: 2,
            className: "h-6 w-6 text-[#EEEEEE] bg-[#D84040]",
          })}
        </div>
        <div>
          <Typography variant="h6" className="text-sm font-bold text-blue-gray">
            {title}
          </Typography>
          <Typography className="text-xs font-medium text-blue-gray">
            {description}
          </Typography>
        </div>
      </MenuItem>
    ),
  );

  return (
    <div className="w-full overflow-x-hidden">
      <Navbar className="sticky top-0 z-50 w-full max-w-full rounded-none px-4 py-2 shadow-md bg-[#8f1515] border-[#2B0B0B] text-[#EEEEEE]">
        {/* Main Row */}
        <div className="flex items-center justify-between text-[#EEEEEE] font-serif">
          {/* Logo */}
          <Typography
            as={Link}
            to="/"
            variant="h5"
            className="font-bold text-4xl flex items-center gap-2 font-serif text-[#EEEEEE]"
          >
            <Avatar src="/logo.jpg" alt="logo" size="xl" />
            Turathna
          </Typography>

          {/* Desktop Menu */}
          <div className="hidden  lg:flex items-center gap-1 text-[#EEEEEE] font-serif">
            <NavLink to="/">Home</NavLink>

            {/* Products Dropdown */}
            <Menu open={isMenuOpen} handler={setIsMenuOpen} placement="bottom">
              <MenuHandler>
                <button className="flex items-center gap-2 text-[#EEEEEE] font-serif text-2xl px-4 py-2 rounded-lg hover:bg-[#2B0B0B] transition-colors duration-150">
                  Products
                  <ChevronDownIcon
                    className={`h-4 w-4 transition-transform duration-200 ${
                      isMenuOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
              </MenuHandler>
              <MenuList className="grid grid-cols-3 gap-3">
                {renderMenuItems}
              </MenuList>
            </Menu>

            <NavLink to="/workshops">Workshops</NavLink>
            <NavLink to="/about">About</NavLink>

            {!loading && token ? (
              <ProfileMenu />
            ) : (
              <Button
                variant="text"
                className="text-2xl text-[#EEEEEE]"
                onClick={handleClick}
              >
                <CiLogin />
              </Button>
            )}
          </div>

          {/* Mobile Hamburger */}
          <IconButton
            variant="text"
            className="lg:hidden text-[#EEEEEE]"
            onClick={() => setOpenNav(!openNav)}
          >
            {openNav ? (
              <XMarkIcon className="h-6 w-6" />
            ) : (
              <Bars3Icon className="h-6 w-6" />
            )}
          </IconButton>
        </div>

        {/* Mobile Menu */}
        <Collapse open={openNav}>
          <div className="flex flex-col gap-1 mt-3 pb-3">
            <MobileNavLink to="/" onClick={() => setOpenNav(false)}>
              Home
            </MobileNavLink>

            {/* Mobile Products Toggle */}
            <button
              className="text-[#EEEEEE] font-serif text-lg px-4 py-3 rounded-lg hover:bg-[#2B0B0B] transition-colors duration-150 flex items-center justify-between w-full"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              Products
              <ChevronDownIcon
                className={`h-4 w-4 transition-transform duration-200 ${
                  isMobileMenuOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            <Collapse open={isMobileMenuOpen}>
              <div className="pl-4 flex flex-col gap-1">{renderMenuItems}</div>
            </Collapse>

            <MobileNavLink to="/workshops" onClick={() => setOpenNav(false)}>
              Workshops
            </MobileNavLink>

            <MobileNavLink to="/about" onClick={() => setOpenNav(false)}>
              About
            </MobileNavLink>

            <div className="mt-2 px-2">
              {!loading && token ? (
                <ProfileMenu />
              ) : (
                <Button
                  variant="text"
                  className="text-2xl text-[#EEEEEE]"
                  onClick={handleClick}
                >
                  <CiLogin />
                </Button>
              )}
            </div>
          </div>
        </Collapse>
      </Navbar>
    </div>
  );
};

export default Navbars;
