import PlanFilter from "../components/PlanFilter";
import Stops from "../components/Stops";
import {
  FormEvent,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { Place } from "../models/Place";
import Notification from "../components/Notificiation";
import Button from "../components/Button";

declare global {
  interface Window {
    initMap: () => void;
  }
}

export type HomeContextType = {
  cities: Place[];
  setCities: (c: Place[]) => void;
  map: google.maps.Map | undefined;
  setMap: (m: google.maps.Map) => void;
};

export const HomeContext = createContext<HomeContextType>({
  cities: [],
  setCities: () => {},
  map: undefined,
  setMap: () => {},
});

export const Home = () => {
  const maxDuration = 1800;
  const [map, setMap] = useState<google.maps.Map>();
  const [cities, setCities] = useState<Place[]>([]);
  const [directions, setDirections] = useState<google.maps.DirectionsResult>();

  const [originPlaceId, setOriginPlaceId] = useState<string>();
  const [destinationPlaceId, setDestinationPlaceId] = useState<string>();

  const getAddress = async (lat: number, lng: number): Promise<any> => {
    const reverseGEOURL = `https://geocode.maps.co/reverse?lat=${lat}&lon=${lng}`;
    const response = await fetch(reverseGEOURL);
    const address = await response.json();

    return address;
  };

  function toHoursAndMinutes(totalSeconds: number) {
    const totalMinutes = Math.floor(totalSeconds / 60);

    const seconds = totalSeconds % 60;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    return [hours, minutes, seconds];
  }

  const getCities = (
    steps: google.maps.DirectionsStep[],
    duration: number,
    maxDuration: number,
    onComplete: (cities: Place[]) => void,
    cities: Place[] = []
  ) => {
    if (steps.length > 0) {
      const step = steps.shift();

      if (step) {
        duration += step.duration.value;

        if (duration < maxDuration) {
          getCities(steps, duration, maxDuration, onComplete, cities);
        } else {
          const lat =
            typeof step.start_location.lat === "function"
              ? step.start_location.lat()
              : (step.start_location.lat as unknown as number);
          const lng =
            typeof step.start_location.lng === "function"
              ? step.start_location.lng()
              : (step.start_location.lng as unknown as number);
          getAddress(lat, lng).then((response: Place) => {
            response.time = duration;
            cities.push(response);
            getCities(steps, 0, maxDuration, onComplete, cities);
          });
        }
      }
    } else {
      onComplete(cities);
    }
  };

  useEffect(() => {
    if (directions) {
      if (!cities.length && map) {
        const onComplete = (cities: Place[]) => {
          setCities(cities);
          const directionsRenderer = new google.maps.DirectionsRenderer();
          directionsRenderer.setMap(map);
          directionsRenderer.setDirections(directions);
        };

        directions.routes.forEach((route) => {
          route.legs.forEach((leg) => {
            let duration = 0;

            getCities([...leg.steps], duration, maxDuration, onComplete);
          });
        });
      } else {
        if (map) {
          const directionsRenderer = new google.maps.DirectionsRenderer();
          directionsRenderer.setMap(map);
          directionsRenderer.setDirections(directions);
        } else {
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                initMap(position, (map) => {
                  // const handler = new AutocompleteDirectionsHandler(map);
                  // handler.directionsRenderer.setDirections(directions);
                  const directionsRenderer =
                    new google.maps.DirectionsRenderer();
                  directionsRenderer.setMap(map);
                  directionsRenderer.setDirections(directions);
                });
              },
              (e) => {
                initMap(null, (map) => {
                  const directionsRenderer =
                    new google.maps.DirectionsRenderer();
                  directionsRenderer.setMap(map);
                  directionsRenderer.setDirections(directions);
                });
              }
            );
          } else {
          }
        }
      }
    }
  }, [directions]);

  const setupDirectionAutocomplete = () => {
    const originInput = document.getElementById(
      "origin-input"
    ) as HTMLInputElement;
    const destinationInput = document.getElementById(
      "destination-input"
    ) as HTMLInputElement;

    originInput.setAttribute("autocomplete", "true");

    const originAutocomplete = new google.maps.places.Autocomplete(
      originInput,
      { fields: ["place_id"] }
    );

    // Specify just the place data fields that you need.
    const destinationAutocomplete = new google.maps.places.Autocomplete(
      destinationInput,
      { fields: ["place_id"] }
    );

    setupPlaceChangedListener(originAutocomplete, "ORIG");
    setupPlaceChangedListener(destinationAutocomplete, "DEST");
  };

  const setupPlaceChangedListener = (
    autocomplete: google.maps.places.Autocomplete,
    mode: string
  ) => {
    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();

      if (!place.place_id) {
        window.alert("Please select an option from the dropdown list.");
        return;
      }

      if (mode === "ORIG") {
        setOriginPlaceId(place.place_id);
      } else {
        setDestinationPlaceId(place.place_id);
      }
    });
  };

  const getDirection = async () => {
    if (true) {
      const directionsService = new google.maps.DirectionsService();

      directionsService.route(
        {
          origin: { placeId: originPlaceId },
          destination: { placeId: destinationPlaceId },
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (response, status) => {
          if (status === "OK") {
            setDirections(response);
          }
          // if (status === "OK") {
          //   me.directionsRenderer.setDirections(response);
          // } else {
          //   window.alert("Directions request failed due to " + status);
          // }
        }
      );
    } else {
      const response = await fetch(
        `${process.env.REACT_APP_KT_API_HOST}/api/v1/direction`
      );
      const directions =
        (await response.json()) as unknown as google.maps.DirectionsResult;

      setDirections(directions);
    }
  };

  const initMap = (
    position: GeolocationPosition | null,
    onComplete: (map: google.maps.Map) => void
  ) => {
    const map = new google.maps.Map(
      document.getElementById("map") as HTMLElement,
      {
        mapTypeControl: false,
        center: {
          lat: position?.coords.latitude || 47.8637987,
          lng: position?.coords.longitude || -122.2780536,
        },
        zoom: 13,
      }
    );

    onComplete(map);
    setMap(map);
  };

  useEffect(() => {
    if (!document.getElementById("googleAPIs")) {
      const script = document.createElement("script");
      script.id = "googleAPIs";
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_API_KEY}&libraries=places&v=weekly&callback=initMap`;
      document.body.appendChild(script);

      window.initMap = setupDirectionAutocomplete;
    }

    if (map) {
      const directionsRenderer = new google.maps.DirectionsRenderer();
      directionsRenderer.setMap(map);
      // directionsRenderer.setDirections(directions);
    } else {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            initMap(position, (map) => {
              // const handler = new AutocompleteDirectionsHandler(map);
              // handler.directionsRenderer.setDirections(directions);
              const directionsRenderer = new google.maps.DirectionsRenderer();
              directionsRenderer.setMap(map);
              // directionsRenderer.setDirections(directions);
            });
          },
          (e) => {
            initMap(null, (map) => {
              const directionsRenderer = new google.maps.DirectionsRenderer();
              directionsRenderer.setMap(map);
              // directionsRenderer.setDirections(directions);
            });
          }
        );
      } else {
      }
    }
  }, [map]);

  return (
    <HomeContext.Provider value={{ map, setMap, cities, setCities }}>
      <div className="min-h-[calc(70vh_-_80px)] container mx-auto mt-4">
        <div className="">
          <div className="grid sm:grid-cols-2 gap-8">
            <div>
              <div className="bg-primary text-background p-4 flex justify-between mb-4">
                <div>Let us plan your trip!</div>
                <div>Packages + Deals</div>
              </div>
              <div className="grid sm:grid-cols-2 sm:gap-4">
                <div>
                  <input
                    className="w-full mb-4"
                    id="origin-input"
                    name="origin-input"
                    placeholder="Where you are"
                  />
                  <input
                    className="w-full mb-4"
                    id="destination-input"
                    name="destination-input"
                    placeholder="Where you want to be"
                  />
                  <input
                    className="w-full mb-4"
                    id="origin-input"
                    name="origin-input"
                    placeholder="2 adults, 1 room"
                  />
                </div>
                <div>
                  <div className="grid sm:grid-cols-2 sm:gap-4">
                    <input
                      className="w-full mb-4"
                      id="departureDate"
                      name="departureDate"
                      type="date"
                      placeholder="mm/dd/yyyy"
                    />
                    <input
                      className="w-full mb-4"
                      id="departureDate"
                      name="departureDate"
                      type="date"
                      placeholder="mm/dd/yyyy"
                    />
                  </div>
                  <div className="grid grid-cols-2 mb-4">
                    <div>
                      <input className="mr-2" type="checkbox" id="add_flight" />
                      <label htmlFor="add_flight">Add a flight</label>
                    </div>
                    <div>
                      <input
                        className="mr-2"
                        type="checkbox"
                        id="add_things_to_do"
                      />
                      <label htmlFor="add_things_to_do">Add things to do</label>
                    </div>
                    <div>
                      <input className="mr-2" type="checkbox" id="add_car" />
                      <label htmlFor="add_car">Add a car</label>
                    </div>
                    <div>
                      <input
                        className="mr-2"
                        type="checkbox"
                        id="add_food_beverage"
                      />
                      <label htmlFor="add_food_beverage">
                        Add food & beverage
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <Button
                onClick={() => {
                  getDirection();
                }}
              >
                Search
              </Button>
            </div>
            <div id="map" className="w-full h-full border min-h-[40vh]" />
          </div>
        </div>
        <div>
          {cities.length ? (
            <div className="my-4 font-bold">Stop Options</div>
          ) : (
            ""
          )}
          <div className="min-h-[50vh] w-full mb-8">
            {cities && (
              <ul>
                {cities.map((city, index) => {
                  const [hours, minutes, seconds] = toHoursAndMinutes(
                    city.time
                  );
                  const time = `${hours ? hours + " hours " : ""}${
                    minutes ? minutes + " minutes " : ""
                  }${seconds ? seconds + " seconds " : ""}`;
                  return (
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
                          , {city.address.state} ({time})
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
                        <ul className="grid grid-cols-2 sm:grid-cols-4">
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
                              className="rounded-md w-[80%] m-4 p-4 bg-secondary text-primary font-bold bg-white shadow hover:shadow-primary truncate"
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
                  );
                })}
              </ul>
            )}
          </div>
        </div>
        <div className="flex mx-auto sm:w-[90%] p-4 border-primary border bg-white items-center">
          <i className="fa-solid fa-mobile text-[4rem] py-4 pr-4" />
          <div>
            <h3 className="text-xl">Get more deals in our App</h3>
            <div>
              Discover more deals when you download and book on the app. Our app
              will help your travel planning and experience easier on-the-go.
            </div>
          </div>

          <Button onClick={() => {}}>Download Now</Button>
        </div>
        <hr className="my-8"></hr>
        <ul className="grid sm:grid-cols-3 sm:gap-4">
          <li className="border border-primary flex items-center p-4 my-2 justify-between">
            <div>
              <div className="font-bold">Modify a Trip</div>
              <div>Make updates to itinerary or cancel a booking</div>
            </div>
            <i className="fa-solid fa-angle-right" />
          </li>
          <li className="border border-primary flex items-center p-4 my-2 justify-between">
            <div>
              <div className="font-bold">Use your points or coupons</div>
              <div>Apply points or coupon code to a new trip</div>
            </div>
            <i className="fa-solid fa-angle-right" />
          </li>
          <li className="border border-primary flex items-center p-4 my-2 justify-between">
            <div>
              <div className="font-bold">Earn rewards</div>
              <div>Earn more from your travel</div>
            </div>
            <i className="fa-solid fa-angle-right" />
          </li>
        </ul>
        <div className="container mx-auto">{/* <PlanFilter /> */}</div>
        <div className="bg-gray-200 mt-8"></div>
      </div>
    </HomeContext.Provider>
  );
};

export const useHomeContext = () => useContext(HomeContext);
