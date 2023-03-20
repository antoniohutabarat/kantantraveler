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
    <div className="bg-[#F70012] flex text-white">
      <img src={logoImage} className="h-[80px] border border-white bg-white rounded-lg m-4"/>
      <ul className="flex">
        {menus.map((menu, index) => (
          <li key={index} className="p-8">
            <NavLink to={menu.path}>{menu.title}</NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
};
