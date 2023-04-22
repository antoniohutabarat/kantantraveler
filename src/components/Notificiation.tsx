const Notification = () => {
  return (
    <div className="bg-alert m-2 p-4 sm:mx-0 rounded-lg text-background flex">
      <button>
        <i className="fa-solid fa-xmark" />
      </button>
      <div className="pl-4">
        Stay safe while driving at night. Find a safe place along your route to
        stop and rest.
      </div>
    </div>
  );
};

export default Notification;
