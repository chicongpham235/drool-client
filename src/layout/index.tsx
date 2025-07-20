import { FC, Suspense, useState } from "react";
import "./layout.scss";
import SideBar from "./side-bar";
import NavBar from "./nav-bar";
import { Outlet } from "react-router-dom";
import { PageLoading } from "@/pages/loading";
import { Drawer, type MenuProps } from "antd";
import { FaMoneyCheckAlt } from "react-icons/fa";
import { TbTransactionDollar } from "react-icons/tb";
import { FiTarget } from "react-icons/fi";

const menu: MenuProps["items"] = [
  {
    label: "Quản trị Rule",
    key: "rules",
    icon: <FaMoneyCheckAlt size="20" />,
  },
  {
    label: "Giao dịch",
    key: "transactions",
    icon: <TbTransactionDollar size="20" />,
  },
  {
    label: "Tham số",
    key: "targets",
    icon: <FiTarget size="20" />,
  },
];

const LayoutPage: FC = () => {
  const [navMobile, setNavMobile] = useState(false);
  return (
    <div className="main">
      <div className="side-bar">
        <SideBar menu={menu} />
      </div>
      <div className="page_header">
        <NavBar setNavMobile={setNavMobile} />
      </div>

      <div className="wrapper-content">
        <div className="wrapper-content__main">
          <Suspense fallback={<PageLoading />}>
            <Outlet />
          </Suspense>
        </div>
      </div>
      <Drawer
        className="menu-mobile"
        placement="right"
        onClose={() => setNavMobile(false)}
        open={navMobile}
      >
        <SideBar setOpenDrawer={setNavMobile} menu={menu} />
      </Drawer>
    </div>
  );
};

export default LayoutPage;
