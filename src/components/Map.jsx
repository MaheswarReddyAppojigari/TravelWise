import { useNavigate, useSearchParams } from "react-router-dom";
import styles from "./Map.module.css";
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from "react-leaflet";
import { useEffect, useState } from "react";
import { useCities } from "../contexts/CitiesContext";
import { useGeolocation } from "../hooks/useGeolocation.js";
import { useUrlPosition } from "../hooks/useUrlPosition";
import Button from './Button'
function Map() {
  const { cities } = useCities();
  const [mapPosition, setMapPosition] = useState([40, 12]);
  const {isLoading:isLoadingPosition,position:getlocationPosition,
    getPosition
  }=useGeolocation();
  const [mapLat,mapLng]=useUrlPosition()
  useEffect(function(){
  if(mapLat&&mapLng)  setMapPosition([Number(mapLat),Number(mapLng)]);
  },[mapLat,mapLng])
 useEffect(function(){
if(getlocationPosition) setMapPosition([getlocationPosition.lat,getlocationPosition.lng])
 },[getlocationPosition])
  return (
    <div className={styles.mapContainer}>
   {!getlocationPosition && <Button type="position" onClick={getPosition}>
   
   {isLoadingPosition ? "Loading...": "use your position"}
   
    </Button>}
      <MapContainer center={[mapLat,mapLng]} zoom={6} scrollWheelZoom={true} className={styles.map}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.fr/hot/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {cities.map((city) => (
          <Marker
            position={mapPosition}
            key={city.id}
          >
            <Popup>
            <span>{city.emoji}</span> <span>{city.cityName}</span>
            </Popup>
          </Marker>
        ))}
        <ChangeCenter position={mapPosition}/>
        <DetectClick/>
      </MapContainer>
      
    </div>
  );
}
function ChangeCenter({position}){

    const map=useMap();
 
    map.setView(position);
 
}
function DetectClick({position}){
  
  const navigate = useNavigate();
useMapEvents({
  click:(e)=>navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`)
})

}
export default Map;
