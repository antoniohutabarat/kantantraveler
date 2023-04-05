import { FormEvent, useEffect, useState } from "react";

class AutocompleteDirectionsHandler {
  map: google.maps.Map;
  originPlaceId: string;
  destinationPlaceId: string;
  travelMode: google.maps.TravelMode;
  directionsService: google.maps.DirectionsService;
  directionsRenderer: google.maps.DirectionsRenderer;

  constructor(map: google.maps.Map) {
    this.map = map;
    this.originPlaceId = "";
    this.destinationPlaceId = "";
    this.travelMode = google.maps.TravelMode.WALKING;
    this.directionsService = new google.maps.DirectionsService();
    this.directionsRenderer = new google.maps.DirectionsRenderer();
    this.directionsRenderer.setMap(map);

    const originInput = document.getElementById(
      "origin-input"
    ) as HTMLInputElement;
    const destinationInput = document.getElementById(
      "destination-input"
    ) as HTMLInputElement;
    const modeSelector = document.getElementById(
      "mode-selector"
    ) as HTMLSelectElement;

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

    this.setupClickListener(
      "changemode-walking",
      google.maps.TravelMode.WALKING
    );
    this.setupClickListener(
      "changemode-transit",
      google.maps.TravelMode.TRANSIT
    );
    this.setupClickListener(
      "changemode-driving",
      google.maps.TravelMode.DRIVING
    );

    this.setupPlaceChangedListener(originAutocomplete, "ORIG");
    this.setupPlaceChangedListener(destinationAutocomplete, "DEST");

    this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(originInput);
    this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(
      destinationInput
    );
    this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(modeSelector);
  }

  // Sets a listener on a radio button to change the filter type on Places
  // Autocomplete.
  setupClickListener(id: string, mode: google.maps.TravelMode) {
    const radioButton = document.getElementById(id) as HTMLInputElement;

    radioButton.addEventListener("click", () => {
      this.travelMode = mode;
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
        travelMode: this.travelMode,
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
  const recommendationCities = [
    { name: "Minneapolis, MI", expanded: false },
    { name: "Bismark, ND", expanded: false },
    { name: "Billings, MO", expanded: false },
    { name: "Spokane, WA", expanded: false },
  ];

  const [cities, setCities] =
    useState<{ name: string; expanded: boolean }[]>(recommendationCities);

  useEffect(() => {
    const script = document.createElement("script");
    script.id = "googleAPIs";
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_API_KEY}&callback=initMap&libraries=places&v=weekly`;
    script.defer = true;

    if (!document.getElementById("googleAPIs")) {
      document.body.appendChild(script);
    }

    window.initMap = initMap;
  });

  const initMap = () => {
    const map = new google.maps.Map(
      document.getElementById("map") as HTMLElement,
      {
        mapTypeControl: false,
        center: { lat: -33.8688, lng: 151.2195 },
        zoom: 13,
      }
    );

    new AutocompleteDirectionsHandler(map);
  };

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
              <div className="h-[50vh]" id="map" />
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
