export type Place = {
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
