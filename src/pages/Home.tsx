import { FormEvent, useEffect, useState } from "react";

type Place = {
  address: {
    city: string;
    country: string;
    country_code: string;
    county: string;
    postcode: string;
    road: string;
    hamlet: string;
    state: string;
    village: string;
    town: string;
  };
  display_name: string;
  expanded: boolean;
  time: number;
};

class AutocompleteDirectionsHandler {
  map: google.maps.Map;
  originPlaceId: string;
  destinationPlaceId: string;
  directionsService: google.maps.DirectionsService;
  directionsRenderer: google.maps.DirectionsRenderer;

  constructor(map: google.maps.Map) {
    this.map = map;
    this.originPlaceId = "";
    this.destinationPlaceId = "";
    this.directionsService = new google.maps.DirectionsService();
    this.directionsRenderer = new google.maps.DirectionsRenderer();
    this.directionsRenderer.setMap(map);

    const originInput = document.getElementById(
      "origin-input"
    ) as HTMLInputElement;
    const destinationInput = document.getElementById(
      "destination-input"
    ) as HTMLInputElement;

    // Specify just the place data fields that you need.
    const originAutocomplete = new google.maps.places.Autocomplete(
      originInput,
      { fields: ["place_id"] }
    );

    // Specify just the place data fields that you need.
    const destinationAutocomplete = new google.maps.places.Autocomplete(
      destinationInput,
      { fields: ["place_id"] }
    );

    this.setupPlaceChangedListener(originAutocomplete, "ORIG");
    this.setupPlaceChangedListener(destinationAutocomplete, "DEST");

    // this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(originInput);
    // this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(
    //   destinationInput
    // );
  }

  // Sets a listener on a radio button to change the filter type on Places
  // Autocomplete.
  setupClickListener(id: string, mode: google.maps.TravelMode) {
    const radioButton = document.getElementById(id) as HTMLInputElement;

    radioButton.addEventListener("click", () => {
      this.route();
    });
  }

  setupPlaceChangedListener(
    autocomplete: google.maps.places.Autocomplete,
    mode: string
  ) {
    autocomplete.bindTo("bounds", this.map);

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();

      if (!place.place_id) {
        window.alert("Please select an option from the dropdown list.");
        return;
      }

      if (mode === "ORIG") {
        this.originPlaceId = place.place_id;
      } else {
        this.destinationPlaceId = place.place_id;
      }

      this.route();
    });
  }

  route() {
    if (!this.originPlaceId || !this.destinationPlaceId) {
      return;
    }

    const me = this;

    this.directionsService.route(
      {
        origin: { placeId: this.originPlaceId },
        destination: { placeId: this.destinationPlaceId },
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (response, status) => {
        if (status === "OK") {
          me.directionsRenderer.setDirections(response);
        } else {
          window.alert("Directions request failed due to " + status);
        }
      }
    );
  }
}

declare global {
  interface Window {
    initMap: () => void;
  }
}

export const Home = () => {
  const maxDuration = 1800;
  const [map, setMap] = useState<google.maps.Map>();
  const [cities, setCities] = useState<Place[]>();

  useEffect(() => {
    const script = document.createElement("script");
    script.id = "googleAPIs";
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_API_KEY}&callback=initMap&libraries=places&v=weekly`;
    script.defer = true;

    window.initMap = initMap;

    if (!document.getElementById("googleAPIs")) {
      document.body.appendChild(script);
    }

    if (!!map) {
      const getDirection = async () => {
        const response = await fetch("http://localhost:3001/api/v1/direction");
        const directions =
          (await response.json()) as unknown as google.maps.DirectionsResult;

        const onComplete = (cities: Place[]) => {
          const handler = new AutocompleteDirectionsHandler(map);
          handler.directionsRenderer.setDirections(directions);

          setCities(cities);
        };

        directions.routes.forEach((route) => {
          route.legs.forEach((leg) => {
            let duration = 0;

            getCities([...leg.steps], duration, maxDuration, onComplete);
          });
        });
      };

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
              getAddress(
                step.start_location.lat as unknown as number,
                step.start_location.lng as unknown as number
              ).then((response: Place) => {
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

      getDirection();
    }
  }, [map]);

  const initMap = () => {
    const map = new google.maps.Map(
      document.getElementById("map") as HTMLElement,
      {
        mapTypeControl: false,
        center: { lat: -33.8688, lng: 151.2195 },
        zoom: 13,
      }
    );

    setMap(map);
  };

  const getAddress = async (lat: number, lng: number): Promise<any> => {
    const reverseGEOURL = `https://geocode.maps.co/reverse?lat=${lat}&lon=${lng}`;
    const response = await fetch(reverseGEOURL);
    const address = await response.json();

    return address;
  };

  return (
    <div>
      <div className="h-[30vh] bg-gray-500 flex justify-center items-center text-white">
        Plan your travel with ease with our great recommendation.
      </div>
      <div className="container mx-auto mb-16">
        <div className="hidden">
          <div className="grid grid-cols-2 gap-8 mx-4 sm:mx-0">
            <div>
              <div>
                <label htmlFor="origin-input">Origin</label>
                <input
                  id="origin-input"
                  name="origin-input"
                  placeholder="Chicago, IL"
                />
              </div>
              <div>
                <label htmlFor="destination-input">Destination</label>
                <input
                  id="destination-input"
                  name="destination-input"
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
        </div>
        <div className="sm:grid sm:grid-cols-2 sm:gap-8 mx-4 sm:mx-0">
          <div>
            Map
            <div className="min-h-[50vh] w-full">
              <div className="min-h-[50vh]" id="map" />
            </div>
          </div>
          <div>
            Cities
            <div className="border min-h-[50vh] w-full">
              {cities && (
                <ul>
                  {cities.map((city, index) => (
                    <li key={index} className="mb-1">
                      <button
                        className="border border-[#F70012] rounded-md w-full flex justify-between p-4 bg-[#F70012] text-white"
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
                        <ul className="border-x border-b border-[#F70012]">
                          <li className="border-b">
                            <a
                              className="flex justify-between p-4"
                              target="_blank"
                              rel="noreferrer"
                              href={`https://www.yelp.com/search?find_desc=&find_loc=${encodeURIComponent(
                                city.display_name
                              )}`}
                            >
                              <span className="text-ellipsis whitespace-nowrap overflow-hidden">
                                Yelp - The 10 Best Places near{" "}
                                {city.display_name}
                              </span>
                              <span>
                                <i className="fa-solid fa-chevron-right" />
                              </span>
                            </a>
                          </li>
                          <li>
                            <a
                              className="flex justify-between p-4"
                              target="_blank"
                              rel="noreferrer"
                              href={`https://www.airbnb.com/s/${encodeURIComponent(
                                city.display_name
                              )}/homes`}
                            >
                              <span className="text-ellipsis whitespace-nowrap overflow-hidden">
                                Airbnb - Over 1,000 homes in {city.display_name}
                              </span>
                              <span>
                                <i className="fa-solid fa-chevron-right" />
                              </span>
                            </a>
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
    </div>
  );
};
