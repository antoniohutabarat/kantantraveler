import { FormEvent } from "react";

type ButtonProperties = {
  onClick: (e: FormEvent<HTMLButtonElement>) => void;
  children: string | JSX.Element | JSX.Element[];
};

const Button = ({onClick, children }: ButtonProperties) => {
  return (
    <button className="bg-primary shadow px-8 py-4 text-background hover:shadow-lg hover:brightness-90 rounded-md w-full sm:w-auto" onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
