import React, { useState, useEffect } from 'react';
import { withScriptjs, withGoogleMap, GoogleMap, Marker, InfoWindow } from 'react-google-maps';
import axios from 'axios';
import ModalItem from './components/Modal';

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
  });



  useEffect(() => {
    let geolocation = navigator.geolocation;
    if (geolocation) {
      geolocation.getCurrentPosition(function (position) {
        let currentLatitude = position.coords.latitude;
        let currentLongitude = position.coords.longitude;
        console.log(currentLongitude, currentLatitude)
        setMapData({
          ...mapData,
          mapPosition: {
            lat: currentLatitude,
            lng: currentLongitude
          },
          markerPosition: {
            lat: currentLatitude,
            lng: currentLongitude
          }
        })
      }, function (error) {
        if (error.code === error.PERMISSION_DENIED) {
          console.log("User denied the request for Geolocation.");
        }
        else if (error.code === error.POSITION_UNAVAILABLE) {
          console.log("Location information is unavailable.")
        }
        else if (error.code === error.TIMEOUT) {
          console.log("The request to get user location timed out.")
        }
        else if (error.code === error.UNKNOWN_ERROR) {
          console.log("An unknown error occurred.")
        } else {
          console.log(error)
        }
      })
    } else {
      console.log('GeoLocation is Not Supported by this browser');
    }
  }, [mapData]);

  const handleMarkerDrag = (e) => {
    let newLatitude = e.latLng.lat();
    let newLongitude = e.latLng.lng();
    console.log(newLatitude, newLongitude)
    setMapData({
      ...mapData,
      markerPosition: {
        lat: newLatitude,
        lng: newLongitude
      }
    })
  }

  return (
    <div>
      <GoogleMap defaultZoom={mapData.zoom} defaultCenter={{ lat: mapData.mapPosition.lat, lng: mapData.mapPosition.lng }}>
        <Marker draggable={true} onDragEnd={handleMarkerDrag} position={{ lat: mapData.markerPosition.lat, lng: mapData.markerPosition.lng }} >
          <InfoWindow>
            <div>
              <p className='text-sm font-mono font-semibold'>Latitude : {mapData.markerPosition.lat}</p>
              <p className='text-sm font-mono font-semibold'>Longitude : {mapData.markerPosition.lng}</p>
            </div>
          </InfoWindow>
        </Marker>
      </GoogleMap>
    </div>
  )
}

const WrapedMap = withScriptjs(withGoogleMap(Map));


const App = () => {
  const [mapInfo, setMapInfo] = useState({
    origin: '',
    destination: ''
  });

  const [showModal, setShowModal] = useState(false);

  const { origin, destination } = mapInfo;

  const handleChange = (e) => {
    let fieldName = e.target.name;
    let fieldValue = e.target.value;
    setMapInfo({
      ...mapInfo, [fieldName]: fieldValue
    })
  }

  const handlePost = async () => {
    const { origin, destination } = mapInfo;
    const formData = { origin, destination }
    console.log(formData);
    await axios.post('https://reqres.in/invalid-url', formData)
      .then((response) => {
        console.log(response.data);
      })
      .catch(error => {
        console.log(error.message);
      });
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    handlePost();
  }


  return (
    <>
      <div>
        <div className='lg:flex justify-center items-center w-11/12 mx-auto my-0 '>

          <div className='w-1/4 mr-3 hidden lg:flex lg:flex-col'>
            <div className='border my-6 py-2 rounded-lg shadow-sm p-3'>
              <p className='font-semibold my-2 text-sm my-2'>View Trip history Geolocation data</p>
              <div className='border py-2 rounded-lg shadow-sm border px-3 text-sm font-mono font-semibold my-2'>Latitude:</div>
              <div className='border py-2 rounded-lg shadow-sm border px-3 text-sm font-mono font-semibold my-2'>longitude:</div>
              <div className='border py-2 rounded-lg shadow-sm border px-3 text-sm font-mono font-semibold my-2'>Timestamp:</div>
            </div>
            <div className='shadow-sm rounded-lg border p-3'>
              <form onSubmit={handleSubmit}>
                <p className='font-semibold my-2 text-sm'>Enter Origin / Destination to simulate trip</p>
                <div className='flex flex-col'>
                  <label className='text-mono font-semibold'>Origin</label>
                  <input type='text' name='origin' value={origin} onChange={handleChange} className='py-3 px-2 border my-3 rounded-lg shadow-sm outline-none ' placeholder='Enter Origin Location' />
                </div>
                <div className='flex flex-col'>
                  <label className='text-mono font-semibold'>Destination</label>
                  <input type='text' name='destination' value={destination} onChange={handleChange} className='py-3 px-2 border my-3 rounded-lg shadow-sm outline-none ' placeholder='Enter Destination' />
                </div>

                <div className='flex justify-center items-center my-3'>
                  <button className='py-2 rounded-lg bg-green-600 font-semibold text-white w-full'>Show route</button>
                </div>
              </form>
            </div>
          </div>



          <div className='lg:w-3/4 lg:ml-3 z-10'>
            {showModal && <ModalItem modal={showModal} modalFunction={setShowModal} />}
            <div className='shadow-sm rounded-lg my-2 p-3 bg-gray-100'>
              <WrapedMap
                googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_KEY}&v=3.exp&libraries=geometry,drawing,places`}
                loadingElement={<div style={{ height: `100%` }} />}
                containerElement={<div style={{ height: `400px` }} />}
                mapElement={<div style={{ height: `100%` }} />}
              />

            </div>

            <div className='lg:hidden border my-6 py-2 rounded-lg shadow-sm p-3'>
              <p className='font-semibold my-2 text-sm my-2'>View Trip history Geolocation data</p>
              <div className='border py-2 rounded-lg shadow-sm border px-3 text-sm font-mono font-semibold my-2'>Latitude:</div>
              <div className='border py-2 rounded-lg shadow-sm border px-3 text-sm font-mono font-semibold my-2'>longitude:</div>
              <div className='border py-2 rounded-lg shadow-sm border px-3 text-sm font-mono font-semibold my-2'>Timestamp:</div>
            </div>

            <button className='lg:hidden font-semibold my-2 rounded-lg py-2 px-4 text-sm border bg-green-500 text-white select-none' onClick={() => { setShowModal(!showModal); }}>Click me to simulate trip</button>

            <div className='Lg:flex justify-center items-center'>
              <p className='font-semibold font-sans my-2'>Click to view travel history</p>
              <div className='cursor-pointer flex justify-between items-center px-6 bg-green-500 rounded-full py-1 my-3 lg:w-1/2'>
                <div><img src='./car.svg' className='h-10 w-10' alt='cars' /></div>
                <div>
                  <h1 className='font-semibold text-xl'>UberX</h1>
                  <p className='text-sm text-white font-semibold'>6:44am - 7:13pm</p>
                </div>
                <div className='font-semibold'>$65.600</div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </>
  )
}

export default App;



