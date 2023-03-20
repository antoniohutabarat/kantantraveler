import { FormEvent, useState } from "react";
import routeImage from "../images/route.png";

export const Home = () => {
  const recommendationCities = [
    { name: "Minneapolis, MI", expanded: false },
    { name: "Bismark, ND", expanded: false },
    { name: "Billings, MO", expanded: false },
    { name: "Spokane, WA", expanded: false },
  ];

  const [cities, setCities] =
    useState<{ name: string; expanded: boolean }[]>(recommendationCities);

  return (
    <div>
      <div className="h-[30vh] bg-gray-500 flex justify-center items-center text-white">
        Plan your travel with ease with our great recommendation.
      </div>
      <div className="container mx-auto mb-16">
        <div className="grid grid-cols-2 gap-8 mx-4 sm:mx-0">
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
        <div className="sm:grid sm:grid-cols-2 sm:gap-8 mx-4 sm:mx-0">
          <div>
            Map
            <div className="h-[50vh] w-full">
              <img className="object-cover w-full h-full" src={routeImage} />
            </div>
          </div>
          <div>
            Cities
            <div className="border h-[50vh] w-full">
              <ul>
                {cities.map((city, index) => (
                  <li key={index}>
                    <button
                      onClick={(e: FormEvent<HTMLButtonElement>) => {
                        e.preventDefault();

                        const updatedCities = cities.map((aCity, i) => {
                          if (i === index) {
                            return { ...aCity, expanded: !aCity.expanded };
                          } else {
                            return aCity;
                          }
                        });
                        setCities(updatedCities);
                      }}
                    >
                      {city.expanded ? (
                        <i className="fa-sharp fa-solid fa-chevron-down mr-4"></i>
                      ) : (
                        <i className="fa-solid fa-chevron-right mr-4"></i>
                      )}
                      {city.name}
                    </button>
                    {city.expanded && (
                      <ul className="text-left">
                        <li className="ml-8">Airbnb</li>
                        <li className="ml-8">Hotels</li>
                        <li className="ml-8">Gas Stations</li>
                        <li className="ml-8">Restaurants</li>
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
