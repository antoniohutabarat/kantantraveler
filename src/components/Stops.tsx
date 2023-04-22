import { FormEvent } from "react";
import { useHomeContext } from "../pages/Home";

const Stops = () => {
  const { cities, setCities } = useHomeContext();

  return (
    <>
      {cities.length > 0 && (
        <div className="py-8">
          <div className="sm:grid sm:grid-cols-2 sm:gap-8 mx-4 sm:mx-0">
            <div>
              <div className="min-h-[50vh] w-full">
                <div className="min-h-[50vh]" id="map" />
              </div>
            </div>
            <div>
              Stops
              <div className="min-h-[50vh] w-full">
                {cities && (
                  <ul>
                    {cities.map((city, index) => (
                      <li key={index} className="mb-1">
                        <button
                          className="rounded-md w-full flex justify-between p-4 bg-primary text-background"
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
                          <span>
                            {city.address.city ||
                              city.address.town ||
                              city.address.village ||
                              city.address.county ||
                              city.address.road ||
                              city.address.hamlet}
                            , {city.address.state} ({city.time} seconds)
                          </span>
                          <span>
                            {city.expanded ? (
                              <i className="fa-solid fa-chevron-up"></i>
                            ) : (
                              <i className="fa-solid fa-chevron-down"></i>
                            )}
                          </span>
                        </button>
                        {city.expanded && (
                          <ul className="grid grid-cols-2">
                            <li className="flex items-center justify-center">
                              <button
                                className="rounded-md w-[80%] m-4 p-4 bg-secondary text-primary font-bold bg-white shadow hover:shadow-primary"
                                onClick={(e: FormEvent<HTMLButtonElement>) => {
                                  e.preventDefault();

                                  window.open(
                                    `https://www.yelp.com/search?find_desc=&find_loc=${encodeURIComponent(
                                      city.display_name
                                    )}`,
                                    "_blank"
                                  );
                                }}
                              >
                                Yelp
                              </button>
                            </li>
                            <li className="flex items-center justify-center">
                              <button
                                className="rounded-md w-[80%] m-4 p-4 bg-secondary text-primary font-bold bg-white shadow hover:shadow-primary"
                                onClick={(e: FormEvent<HTMLButtonElement>) => {
                                  e.preventDefault();

                                  window.open(
                                    `https://www.airbnb.com/s/${encodeURIComponent(
                                      city.display_name
                                    )}/homes`,
                                    "_blank"
                                  );
                                }}
                              >
                                Airbnb
                              </button>
                            </li>
                            <li className="flex items-center justify-center">
                              <button
                                className="rounded-md w-[80%] m-4 p-4 bg-secondary text-primary font-bold bg-white shadow hover:shadow-primary"
                                onClick={(e: FormEvent<HTMLButtonElement>) => {
                                  e.preventDefault();

                                  window.open(
                                    `https://turo.com/us/en/search?country=US&defaultZoomLevel=11&delivery=false&deliveryLocationType=googlePlace&itemsPerPage=200&location=${encodeURIComponent(
                                      city.display_name
                                    )}&pickupType=ALL&sortType=RELEVANCE&useDefaultMaximumDistance=true`,
                                    "_blank"
                                  );
                                }}
                              >
                                Turo
                              </button>
                            </li>
                            <li className="flex items-center justify-center">
                              <button
                                className="rounded-md w-[80%] m-4 p-4 bg-secondary text-primary font-bold bg-white shadow hover:shadow-primary"
                                onClick={(e: FormEvent<HTMLButtonElement>) => {
                                  e.preventDefault();

                                  window.open(
                                    `https://www.google.com/maps/search/Gas+Station/@${city.lat},${city.lon},13z`,
                                    "_blank"
                                  );
                                }}
                              >
                                Gas Stations
                              </button>
                            </li>
                            <li className="flex items-center justify-center">
                              <button
                                className="rounded-md w-[80%] m-4 p-4 bg-secondary text-primary font-bold bg-white shadow hover:shadow-primary"
                                onClick={(e: FormEvent<HTMLButtonElement>) => {
                                  e.preventDefault();

                                  window.open(
                                    `https://www.google.com/maps/search/EV+Charging+Station/@${city.lat},${city.lon},13z`,
                                    "_blank"
                                  );
                                }}
                              >
                                EV Charging Stations
                              </button>
                            </li>
                          </ul>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Stops;
