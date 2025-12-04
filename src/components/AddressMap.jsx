import React, { useEffect, useRef, useState } from "react";
import { loadGoogleMaps } from "../utils/loadGoogleMaps";

export default function AddressMap({ lat = -23.55, lng = -46.63, stores = [] }){
  const ref = useRef(null);
  const mapRef = useRef(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const key = import.meta.env.VITE_GOOGLE_MAPS_KEY;
    let mounted = true;

    if(key){
      loadGoogleMaps(key).then(google => {
        if(!mounted) return;
        if(!mapRef.current){
          mapRef.current = new google.maps.Map(ref.current, {center:{lat,lng}, zoom:13});
        } else {
          mapRef.current.setCenter({lat,lng});
        }
        new google.maps.Marker({ position:{lat,lng}, map: mapRef.current, title: "Você" });
        stores.forEach(s => {
          const m = new google.maps.Marker({ position:{lat:s.lat,lng:s.lng}, map: mapRef.current, title: s.name });
          const inf = new google.maps.InfoWindow({ content: `<b>${s.name}</b>`});
          m.addListener("click", ()=>inf.open(mapRef.current, m));
        });
      }).catch(e => { setError(e.message); });
    } else {
      setError("NO_KEY");
    }

    return () => { mounted = false; };
  }, [lat,lng,stores]);

  if(!import.meta.env.VITE_GOOGLE_MAPS_KEY || error){
    const osm = `https://www.openstreetmap.org/export/embed.html?bbox=${lng-0.03}%2C${lat-0.02}%2C${lng+0.03}%2C${lat+0.02}&layer=mapnik&marker=${lat}%2C${lng}`;
    return (<div style={{width:"100%",height:340,borderRadius:12,overflow:"hidden",position:"relative"}}>
      <iframe title="map" src={osm} style={{width:"100%",height:"100%",border:0}}/>
      <div style={{position:"absolute",right:12,top:12,background:"#fff9",padding:6,borderRadius:8}}>Mapa fallback (OSM)</div>
    </div>);
  }

  return <div ref={ref} style={{width:"100%",height:340,borderRadius:12,overflow:"hidden"}} />;
}
