export interface IpLocation {
  country: string;
  region: string;
  city: string;
  lat: number;
  lng: number;
  postalCode: string;
  timezone: string;
}

export interface IpAsn {
  asn: number;
  name: string;
  route: string;
  domain: string;
  type: string;
}

export interface IpLookupResult {
  ip: string;
  location: IpLocation;
  isp: string;
  as?: IpAsn;
  domains: string[];
}
