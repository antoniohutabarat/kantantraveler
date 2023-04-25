export const Footer = () => {
  return (
    <div className="border-t border-primary h-[30vh] text-primary">
      <div className="container mx-auto p-4 sm:px-0 flex justify-between">
        <div className="mt-4">© 2023 KT Inc. All right Reserved.</div>
        <ul className="flex mt-4 text-4xl">
          <li>
            <button className="mx-2">
              <i className="fa-brands fa-square-facebook"></i>
            </button>
          </li>
          <li>
            <button className="mx-2">
              <i className="fa-brands fa-square-twitter"></i>
            </button>
          </li>
          <li>
            <button className="mx-2">
              <i className="fa-brands fa-square-instagram"></i>
            </button>
          </li>
          <li>
            <button className="mx-2">
              <i className="fa-brands fa-linkedin"></i>
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};
