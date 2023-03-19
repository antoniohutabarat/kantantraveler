import { NavLink } from "react-router-dom"

export const Header = () => {
    const menus = [
        {
            title: "Home",
            path: "/"
        },
        {
            title: "Checkout",
            path: "/checkout"
        }
    ]

    return <div>
        <ul className="bg-red-500 flex text-white">
            {
                menus.map((menu, index) =>
                    <li key={index}><NavLink to={menu.path}>{menu.title}</NavLink></li>
                )
            }
        </ul>
    </div>
}