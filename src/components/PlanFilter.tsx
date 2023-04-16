import { FormEvent, useEffect, useState } from "react";
import { Place } from "../models/Place";
import Button from "./Button";
import { useHomeContext } from "../pages/Home";

const PlanFilter = () => {
  const maxDuration = 1800;
  const { map, setMap, cities, setCities } = useHomeContext();
  const [directions, setDirections] = useState<google.maps.DirectionsResult>();
  const [mockEnabled, setMockEnabled] = useState<boolean>(true);
  const [originPlaceId, setOriginPlaceId] = useState<string>();
  const [destinationPlaceId, setDestinationPlaceId] = useState<string>();

  useEffect(() => {
    if (!document.getElementById("googleAPIs")) {
      const script = document.createElement("script");
      script.id = "googleAPIs";
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_API_KEY}&libraries=places&v=weekly&callback=initMap`;
      document.body.appendChild(script);

      window.initMap = setupDirectionAutocomplete;
    }
    const originInput = document.getElementById("origin-input");

    if (originInput?.getAttribute("autocomplete") !== "true") {
      // setupDirectionAutocomplete();
    }

    if (directions) {
      if (!cities.length) {
        const onComplete = (cities: Place[]) => {
          setCities(cities);
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

                console.log("aaaa", navigator.geolocation);
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
            console.log("aaaa", navigator.geolocation);
          }
        }
      }
    }
  }, [directions, cities]);

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
          console.log(response);
          console.log(JSON.stringify(response));
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

  const getAddress = async (lat: number, lng: number): Promise<any> => {
    const reverseGEOURL = `https://geocode.maps.co/reverse?lat=${lat}&lon=${lng}`;
    const response = await fetch(reverseGEOURL);
    const address = await response.json();
    console.log(address);

    return address;
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

  return (
    <div className="">
      <div className="hidden">
        Mock Request
        <label htmlFor="enable-mock-input" className="switch">
          <input
            id="enable-mock-input"
            type="checkbox"
            checked={mockEnabled}
            onChange={(e) => {
              e.preventDefault();

              setMockEnabled(!mockEnabled);
            }}
          />
          <span className="slider round" />
        </label>
      </div>

      <div className="sm:grid sm:grid-cols-2 sm:gap-8 mx-4 sm:mx-0">
        <div className="sm:grid sm:grid-cols-2 sm:gap-8">
          <div className="mt-4">
            <label htmlFor="origin-input">Origin</label>
            <input
              className="w-full appearance-none"
              id="origin-input"
              name="origin-input"
              placeholder="Chicago, IL"
            />
          </div>
          <div className="mt-4">
            <label htmlFor="destination-input">Destination</label>
            <input
              className="w-full appearance-none"
              id="destination-input"
              name="destination-input"
              placeholder="Seattle, WA"
            />
          </div>
        </div>
        <div className="sm:grid sm:grid-cols-2 sm:gap-8">
          <div className="mt-4">
            <label htmlFor="departureDate">Departure Date</label>
            <input
              className="w-full appearance-none"
              id="departureDate"
              name="departureDate"
              type="date"
            />
          </div>
          <div className="mt-4">
            <label htmlFor="arrivalDate">Arrival Date</label>
            <input
              className="w-full appearance-none"
              id="arrivalDate"
              name="arrivalDate"
              type="date"
            />
          </div>
        </div>
      </div>
      <div className="mx-4 sm:mx-0">
        <div className="mt-4">
          <Button
            onClick={(e: FormEvent<HTMLButtonElement>) => {
              e.preventDefault();
              getDirection();
            }}
          >
            Plan It
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PlanFilter;
