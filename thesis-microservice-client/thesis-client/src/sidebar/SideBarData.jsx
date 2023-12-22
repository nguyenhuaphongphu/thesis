import HomeIcon from "@mui/icons-material/Home";
import CottageIcon from "@mui/icons-material/Cottage";
import HolidayVillageIcon from "@mui/icons-material/HolidayVillage";
import CategoryIcon from "@mui/icons-material/Category";
import ProductionQuantityLimitsIcon from "@mui/icons-material/ProductionQuantityLimits";
import StyleIcon from "@mui/icons-material/Style";
import SellIcon from "@mui/icons-material/Sell";

export const SidebarDataAdmin = [
  {
    title: "Chi nhánh",
    icon: <HolidayVillageIcon />,
    to: "/branch",
  },
  {
    title: "Người dùng",
    icon: <SellIcon />,
    to: "/user",
  },
  {
    title: "Doanh thu năm",
    icon: <SellIcon />,
    to: "/statisticals",
  },
];

export const SidebarDataManager = [
  {
    title: "Email khách hàng",
    icon: <SellIcon />,
    to: "/emailCustomer",
  },
  {
    title: "Cấp quyền",
    icon: <SellIcon />,
    to: "/userManager",
  },
  {
    title: "Doanh thu chi nhánh",
    icon: <SellIcon />,
    to: "/statisticalManager",
  },
];

export const SidebarDataUpdater = [
  {
    title: "Nhà cung cấp",
    icon: <CottageIcon />,
    to: "/supplier",
  },
  {
    title: "Sản Phẩm",
    icon: <ProductionQuantityLimitsIcon />,
    to: "/product",
  },
  {
    title: "Thương hiệu",
    icon: <StyleIcon />,
    to: "/brand",
  },
  {
    title: "Loại sản phẩm",
    icon: <CategoryIcon />,
    to: "/productCaterogy",
  },
  {
    title: "Thẻ sản phẩm",
    icon: <SellIcon />,
    to: "/tag",
  },
  {
    title: "Đơn nhập hàng",
    icon: <SellIcon />,
    to: "/importOrder",
  },
];

const user = JSON.parse(localStorage.getItem("user")) || [];

function CusSidebar(){
  if (user.managementAt === "651a7df22cc70b06a7ee8679") {
    return [
      {
        title: "Khách hàng tiềm năng",
        icon: <SellIcon />,
        to: "/inforCustomer",
      },
      {
        title: "Hóa đơn",
        icon: <SellIcon />,
        to: "/bill",
      },
    ];
  } else {
    return [
      {
        title: "Hóa đơn",
        icon: <SellIcon />,
        to: "/bill",
      },
    ];
  }
}

export const SidebarDataSeller = CusSidebar()