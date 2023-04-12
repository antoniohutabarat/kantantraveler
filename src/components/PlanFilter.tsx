import { FormEvent, useEffect, useState } from "react";
import { Place } from "../models/Place";
import Button from "./Button";
import AutocompleteDirectionsHandler from "../Utils/AutocompleteDirectionsHandler";
import { useHomeContext } from "../pages/Home";

const PlanFilter = () => {
  const maxDuration = 1800;
  const { map, setMap, cities, setCities } = useHomeContext();
  const [directions, setDirections] = useState<google.maps.DirectionsResult>();

  useEffect(() => {
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
          initMap((map) => {
            // const handler = new AutocompleteDirectionsHandler(map);
            // handler.directionsRenderer.setDirections(directions);
            const directionsRenderer = new google.maps.DirectionsRenderer();
            directionsRenderer.setMap(map);
            directionsRenderer.setDirections(directions);
          });
        }
      }
    }
  }, [directions, cities]);

  const initMap = (onComplete: (map: google.maps.Map) => void) => {
    const map = new google.maps.Map(
      document.getElementById("map") as HTMLElement,
      {
        mapTypeControl: false,
        center: { lat: -33.8688, lng: 151.2195 },
        zoom: 13,
      }
    );

    onComplete(map);
    setMap(map);
  };

  const getDirection = async () => {
    const response = await fetch(
      `${process.env.REACT_APP_KT_API_HOST}/api/v1/direction`
    );
    const directions =
      (await response.json()) as unknown as google.maps.DirectionsResult;

    setDirections(directions);
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

  const getAddress = async (lat: number, lng: number): Promise<any> => {
    const reverseGEOURL = `https://geocode.maps.co/reverse?lat=${lat}&lon=${lng}`;
    const response = await fetch(reverseGEOURL);
    const address = await response.json();

    return address;
  };

  return (
    <div className="">
      <div className="grid grid-cols-2 gap-8 mx-4 sm:mx-0">
        <div>
          <div className="mt-4">
            <label htmlFor="origin-input">Origin</label>
            <input
              id="origin-input"
              name="origin-input"
              placeholder="Chicago, IL"
            />
          </div>
          <div className="mt-4">
            <label htmlFor="destination-input">Destination</label>
            <input
              id="destination-input"
              name="destination-input"
              placeholder="Seattle, WA"
            />
          </div>
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
        <div>
          <div className="mt-4">
            <label htmlFor="departureDate">Departure Date</label>
            <input id="departureDate" name="departureDate" type="date" />
          </div>
          <div className="mt-4">
            <label htmlFor="arrivalDate">Arrival Date</label>
            <input id="arrivalDate" name="arrivalDate" type="date" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanFilter;
