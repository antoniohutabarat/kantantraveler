import { FormEvent } from "react";

type ButtonProperties = {
  onClick: (e: FormEvent<HTMLButtonElement>) => void;
  children: string | JSX.Element | JSX.Element[];
};

const Button = ({onClick, children }: ButtonProperties) => {
  return (
    <button className="bg-[#F83156] shadow px-8 py-4 text-white hover:shadow hover:shadow-[#F83156] hover:text-[#F83156] hover:bg-white rounded-md w-full sm:w-auto" onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
