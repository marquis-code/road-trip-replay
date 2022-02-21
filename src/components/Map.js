import React, {useState, useEffect} from 'react';
import { GoogleMap, Marker, InfoWindow } from 'react-google-maps';
import Geocode from 'react-geocode';

Geocode.setApiKey('AIzaSyBR5Ra9kNvqfhR0vUe1oOkW-t_M27lJoAY');
Geocode.setLanguage('en');


const Map = () => {
    const [mapData, setMapData] = useState({
      address: '',
      city: '',
      country: '',
      state: '',
      zoom: 10,
      mapPosition: {
        lat: 0,
        lng: 0
      },
      markerPosition: {
        lat: 0,
        lng: 0
      }
    })
  
  
  
    useEffect(() => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          console.log('position' - position);
          setMapData({
            ...mapData,
            mapPosition: {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            },
            markerPosition: {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            }
          })
        }, (error) => {
          console.log(error.message)
        })
      }
    }, [mapData]);
  
    const handleMarkerDrag = (e) => {
      let newLatitude = e.latLng.lat();
      let newLongitude = e.latLng.lng();
      console.log(newLatitude, newLongitude)
  
      Geocode.fromLatLng(newLatitude, newLongitude).then((response) => {
        console.log(response);
        const address = response.results[0].formatted_address;
        let city, state, country;
        for (let i = 0; i < response.results[0].address_components.length; i++) {
          for (let j = 0; j < response.results[0].address_components[i].types.length; j++) {
            switch (response.results[0].address_components[i].types[j]) {
              case "locality":
                city = response.results[0].address_components[i].long_name;
                break;
              case "administrative_area_level_1":
                state = response.results[0].address_components[i].long_name;
                break;
              case "country":
                country = response.results[0].address_components[i].long_name;
                break;
              default:
                console.log('Location Not Available')
            }
          }
        }
  
        setMapData({
          address: (address) ? address : '',
          city: (city) ? city : '',
          state: (state) ? state : '',
          country: (country) ? country : ''
        })
      })
    }
  
    return (
      <GoogleMap defaultZoom={mapData.zoom} defaultCenter={{ lat: mapData.mapPosition.lat, lng: mapData.mapPosition.lng }}>
  
        <Marker draggable={true} onDragEnd={handleMarkerDrag} position={{ lat: mapData.markerPosition.lat, lng: mapData.markerPosition.lng }} >
          <InfoWindow>
            <div>{'Hello' - mapData.mapPosition.lat}</div>
          </InfoWindow>
        </Marker>
  
        {/* <AutoComplete /> */}
  
      </GoogleMap>
    )
  }

  export default Map;