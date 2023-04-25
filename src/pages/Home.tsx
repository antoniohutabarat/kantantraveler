import PlanFilter from "../components/PlanFilter";
import Stops from "../components/Stops";
import { createContext, useContext, useEffect, useState } from "react";
import { Place } from "../models/Place";
import Notification from "../components/Notificiation";

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

  useEffect(() => {});

  return (
    <HomeContext.Provider value={{ map, setMap, cities, setCities }}>
      <div className="container mx-auto mt-4">
        <div className="grid grid-cols-2">
          <ul className="border border-primary flex justify-between">
            <li>
              <button className="p-4">Stays</button>
            </li>
            <li>
              <button className="p-4">Flights</button>
            </li>
            <li>
              <button className="p-4">Cars</button>
            </li>
            <li>
              <button className="p-4">Packages</button>
            </li>
            <li>
              <button className="p-4">Things to do</button>
            </li>
            <li>
              <button className="p-4">Cruises</button>
            </li>
          </ul>
        </div>
      </div>
      <div className="min-h-[calc(70vh_-_80px)]">
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
