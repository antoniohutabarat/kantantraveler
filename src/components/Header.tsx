import { NavLink } from "react-router-dom";
import logoImage from "../images/logo.png";

export const Header = () => {
  const menus = [
    {
      title: "Support",
      path: "/",
    },
    {
      title: "Trips",
      path: "/",
    },
    {
      title: "Sign in",
      path: "/",
    },
  ];

  return (
    <div className="text-primary">
      <div className="border-b border-primary container mx-auto flex items-center h-[80px] justify-between">
        {/* <img
          src={logoImage}
          className="h-[80px] my-4 ml-4 sm:ml-0"
        /> */}
        <span className="text-2xl font-bold ml-4">KT</span>
        <div className="flex">
          <button className="p-8"><i className="fa-solid fa-earth-americas px-2"></i><span>English</span></button>
          <ul className="flex">
            {menus.map((menu, index) => (
              <li key={index} className="p-8">
                <NavLink to={menu.path}>{menu.title}</NavLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
