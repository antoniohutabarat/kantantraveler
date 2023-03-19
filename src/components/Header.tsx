import { NavLink } from "react-router-dom";

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
    <div className="bg-red-500 flex text-white">
      Kantan Traveler
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
