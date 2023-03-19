import routeImage from "../images/route.png"

export const Home = () => {
  return (
    <div className="container mx-auto mb-16">
        <div className="h-[30vh] bg-red-500 flex justify-center items-center text-white">Plan your travel with ease with our great recommendation.</div>
      <div className="grid grid-cols-2 gap-8">
        <div>
          <div>
            <label htmlFor="origin">Origin</label>
            <input id="origin" name="origin" placeholder="Chicago, IL" />
          </div>
          <div>
            <label htmlFor="destination">Destination</label>
            <input
              id="destination"
              name="destination"
              placeholder="Seattle, WA"
            />
          </div>
        </div>
        <div>
          <div>
            <label htmlFor="departureDate">Departure Date</label>
            <input id="departureDate" name="departureDate" type="date" />
          </div>
          <div>
            <label htmlFor="arrivalDate">Arrival Date</label>
            <input id="arrivalDate" name="arrivalDate" type="date" />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-8">
        <div>
          Map
          <div className="bg-red-500 h-[50vh] w-full">
            <img className="object-cover w-full h-full" src={routeImage}/>
          </div>
        </div>
        <div>
          Cities
          <div className="border h-[50vh] w-full"></div>
        </div>
      </div>
    </div>
  );
};
