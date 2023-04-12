import { FormEvent } from "react";

type ButtonProperties = {
  onClick: (e: FormEvent<HTMLButtonElement>) => void;
  children: string | JSX.Element | JSX.Element[];
};

const Button = ({onClick, children }: ButtonProperties) => {
  return (
    <button className="bg-[#F70012] px-8 py-4 text-white hover:brightness-75 rounded-md" onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
