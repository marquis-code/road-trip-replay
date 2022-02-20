import React, { useState, useEffect } from 'react';
import { GoogleMap, withScriptjs, withGoogleMap, Marker, InfoWindow } from 'react-google-maps';
// import AutoComplete from 'react-google-autocomplete';
import Geocode from 'react-geocode';
import axios from 'axios';

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

const WrapedMap = withScriptjs(withGoogleMap(Map));

const ModalItem = ({ modal, modalFunction }) => {
  const [modalData, setModalData] = useState({
    origin: '',
    destination: ''
  });

  const { origin, destination } = modalData;

  const handleChange = (e) => {
    let fieldName = e.target.name;
    let fieldValue = e.target.value;
    setModalData({
      ...modalData, [fieldName]: fieldValue
    })
  }

  const handlePost = async () => {
    const { origin, destination } = modalData;
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
      <div className='flex justify-center items-center w-11/12 absolute mt-12'>
        <div className='lg:hidden  bg-gray-500 py-3 px-10 rounded-lg shadow-sm z-40 ' onClick={() => { modalFunction(!modal) }}>
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
              <button className='py-2 rounded-lg bg-green-600 font-semibold text-white w-full select-none'>Show route</button>
            </div>
          </form>
        </div>
      </div>
  )
}

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

  const getMapData = () => {
    axios.get('https://api.github.com/users/mapbox')
      .then((response) => {
        console.log(response.data);
      });
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
                googleMapURL='https://maps.googleapis.com/maps/api/js?key=AIzaSyBR5Ra9kNvqfhR0vUe1oOkW-t_M27lJoAY&v=3.exp&libraries=geometry,drawing,places'
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

            <button className='font-semibold my-2 rounded-lg py-2 px-4 text-sm border bg-green-500 text-white select-none' onClick={() => { setShowModal(!showModal); }}>Click me to simulate trip</button>

            <div className='Lg:flex justify-center items-center'>
              <p className='font-semibold font-sans my-2'>Click to view travel history</p>
              <div className='cursor-pointer flex justify-between items-center px-6 bg-green-500 rounded-full py-1 my-3 lg:w-1/2' onClick={() => { getMapData() }}>
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



