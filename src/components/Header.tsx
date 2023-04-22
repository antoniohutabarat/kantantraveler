import { NavLink } from "react-router-dom";
import logoImage from "../images/logo.png";

export const Header = () => {
  const menus = [
    {
      title: "Home",
      path: "/",
    },
    {
      title: "Checkout",
      path: "/checkout",
    },
  ];

  return (
    <div className="shadow-md bg-primary">
      <div className="container mx-auto flex items-center h-[80px]">
        {/* <img
          src={logoImage}
          className="h-[80px] my-4 ml-4 sm:ml-0"
        /> */}
        <span className="text-2xl font-bold ml-4 text-background">KT</span>
        {/* <ul className="flex">
          {menus.map((menu, index) => (
            <li key={index} className="p-8">
              <NavLink to={menu.path}>{menu.title}</NavLink>
            </li>
          ))}
        </ul> */}
      </div>
    </div>
  );
};
