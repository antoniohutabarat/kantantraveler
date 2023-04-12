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
    <div className="border-b shadow-md">
      <div className="container mx-auto flex">
        <img
          src={logoImage}
          className="h-[80px] m-4"
        />
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
