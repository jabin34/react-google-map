import logo from './logo.svg';
import './App.css';
import React, {  useEffect, useState } from 'react';
import { GoogleMap, LoadScript, Marker} from '@react-google-maps/api';
import locationData from "./location.json";
const containerStyle = {
  width: '1200px',
  height: '1200px'
};

const center = {
  lat: 54.5260,
  lng: 15.2551
};

function App() {
  const dataset = locationData.cities;
   const [lat,setLat] = useState(0);
   const [lng,setLng] = useState(0);
   const[dist,setDist] = useState(0);
   const[result,setResult] = useState(1500);

   function distance(lat1, lat2, lon1, lon2) {
    // The math module contains a function
    // named toRadians which converts from
    // degrees to radians.
    lon1 = (lon1 * Math.PI) / 180;
    lon2 = (lon2 * Math.PI) / 180;
    lat1 = (lat1 * Math.PI) / 180;
    lat2 = (lat2 * Math.PI) / 180;

    // Haversine formula
    let dlon = lon2 - lon1;
    let dlat = lat2 - lat1;
    let a =
      Math.pow(Math.sin(dlat / 2), 2) +
      Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(dlon / 2), 2);

    let c = 2 * Math.asin(Math.sqrt(a));

    // Radius of earth in kilometers. Use 3956
    // for miles
    let r = 6371;

    // calculate the result
    return c * r;
  }
  const nerestPoint =  (platitude, plongitude) => {
    var mindistance = [];
    dataset.map( (data) =>
      mindistance.push(
       distance(platitude, data.gps.lat, plongitude, data.gps.lng)
      )
    );
    var min =  Math.min(...mindistance);
    console.log( min,mindistance);
    setDist(min);
    return min;
  };
  
   useEffect(() => { 
       console.log('Updated State',lat,lng)
       setLat( lat);
       setLng( lng);
     
       
       if(nerestPoint(lat,lng)<=50){
        alert("Correct!!"+nerestPoint(lat,lng)+"km");
     
        let newResult = result-1;
        setDist(nerestPoint(lat,lng));
      setResult(newResult);
      }
      else{
       
      }
      
    }, [lng,lat]);
    
    

  return (
    <div className="App">
     <LoadScript
        googleMapsApiKey={process.env.GOOGLE_API}
      >
        <GoogleMap
          mapContainerStyle={containerStyle}
          
          center={center}
          zoom={5}
          options={{
           
            streetViewControl:false,
            mapTypeControl:false,
            fullscreenControl:false
          }}
          onClick={ev => {
            console.log("latitide = ", ev.latLng.lat());
            console.log("longitude = ", ev.latLng.lng());
            setLat( ev.latLng.lat());
            setLng( ev.latLng.lng());
            
          //  <Marker position={center} />
            console.log(lat,lng);
          }}
        >
 
{ <Marker position={center} />}
          
              


        
          {/* <Marker position={{ lat:ev.latLng.lat(), lng: ev.latLng.lng() }} /> */}
          { /* Child components, such as markers, info windows, etc. */ }
          <></>
        </GoogleMap>
      </LoadScript>
      <div style={{"display":"flex" ,"flexDirection":"column","alignItems":"center"}}>
          <h2> Total:{result}</h2>
      <h4><p>Distance:{dist} KM</p></h4>
      </div>
    </div>
  );
}

export default App;
