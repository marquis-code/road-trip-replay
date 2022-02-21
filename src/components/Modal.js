import React, {useState} from 'react';
import axios from 'axios';

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

export default ModalItem;