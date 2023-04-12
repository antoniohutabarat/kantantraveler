import PlanFilter from "../components/PlanFilter";
import Stops from "../components/Stops";
import { createContext, useContext, useEffect, useState } from "react";
import { Place } from "../models/Place";

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
  const [map, setMap] = useState<google.maps.Map>();
  const [cities, setCities] = useState<Place[]>([]);

  useEffect(() => {
    const script = document.createElement("script");
    script.id = "googleAPIs";
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_API_KEY}&libraries=places&v=weekly`;

    if (!document.getElementById("googleAPIs")) {
      document.body.appendChild(script);
    }
  });

  return (
    <HomeContext.Provider value={{ map, setMap, cities, setCities }}>
      <div className="min-h-[calc(70vh_-_112px)]">
        <div className="container mx-auto">
          <PlanFilter />
        </div>
        <div className="bg-gray-200 mt-8">
          <div className="container mx-auto">
            <Stops />
          </div>
        </div>
      </div>
    </HomeContext.Provider>
  );
};

export const useHomeContext = () => useContext(HomeContext);
