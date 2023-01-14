import { Icon, IconOptions, icon } from "leaflet";
export const defaultIcon: Icon<IconOptions> = icon({
  // This define the displayed icon size, in pixel
  iconSize: [25, 41],
  // This defines the pixel that should be placed right above the location
  // If not provided, the image center will be used, and that could be awkward
  iconAnchor: [13, 41],
  // The path to the image to display. In this case, it's a Leaflet asset
  iconUrl: "../../../assets/marker.svg",
  // The path to the image's shadow to display. Also a leaflet asset
  // shadowUrl: "leaflet/marker-shadow.png",
});
