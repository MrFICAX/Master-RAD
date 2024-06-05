import React, { useState, useMemo, useEffect } from 'react';
import PetList from '../PetList';
import axios from 'axios';
import MapClickableWithRadius from '../MapClickableWithRadius';
import LoadingOverlay from '../Spinner/Spinner';
import './PetSearchUsingMap.css';
function PetSearchUsingMap({ backend_route, heading, heading_2, is_found, is_missing, person_title }) {

  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    pet_description: "",
    latitude: 43.331175996846994,
    longitude: 21.893123133369564,
    radius: 500
  });

  useEffect(() => {

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(function (position) {
        setFormData({ ...formData, ['latitude']: position.coords.latitude, ['longitude']: position.coords.longitude });

        console.log(position.coords.latitude);
        console.log(position.coords.longitude);

      });
    } else {
      console.log("Geolocation is not available in your browser.");
    }
  }, []);

  const handlePetSearch = async (e) => {
    e.preventDefault();

    if (formData.pet_description !== "" && formData.latitude && formData.longitude) {

      setLoading(true)
      axios({
        method: "POST",
        url: `/${backend_route}`,
        data: { top_number: 15, SHOULD_BE_NORMALISED: 'norm', 'latitude': formData.latitude, 'longitude': formData.longitude, 'radius': formData.radius, 'pet_description': formData.pet_description }
      })
        .then((response) => {
          const res = response.data.pet_results
          setSearchResults(res)
          setLoading(false)
        }).catch((error) => {
          if (error.response) {
            console.log(error.response)
            console.log(error.response.status)
            console.log(error.response.headers)
            setLoading(false)

          }
        })
    } else {
      alert('Please fill in all fields');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleMapClick = (latitude, longitude) => {
    setFormData(prevFormData => ({
      ...prevFormData,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude)
    }));
  };

  const searchList = useMemo(() => {

    console.log("searchResults changed!");
    console.log(searchResults);
    return (
      <div>
        {searchResults !== undefined && <PetList petResults={searchResults} person_title={person_title} />}
      </div>

    );
  }, [searchResults, person_title]);


  return (
    <section className="garamond">
      <div className="navy georgia ma0 grow">
        <h2 className="f2">{heading}</h2>
      </div>

      <div className="container">
        <form>
          <div className="form-group">
            <div className="form-group">
              <label htmlFor="pet_description">Enter pet description:</label>
              <input type="text" maxLength={40} id="pet_description" name="pet_description" value={formData.pet_description} onChange={handleInputChange} placeholder="Pet description here.." />
            </div>
            <label htmlFor="radius">Radius in meters:</label>
            <input type="text" maxLength="10" id="radius" name="radius" value={formData.radius} onChange={handleInputChange} placeholder="Enter your contact number" />
          </div>
          <div className="location-group">

            <label htmlFor="number"> Latitude: {formData.latitude}</label>
            <br></br>
            <label htmlFor="number">Longitude: {formData.longitude}</label>
          </div>

          {formData.latitude !== null && <MapClickableWithRadius onMapClick={handleMapClick} latitude={formData.latitude} longitude={formData.longitude} radius={formData.radius} />}
          <button type="submit" className='ma3' onClick={handlePetSearch} >Submit</button>
        </form>
      </div>

      {loading && <LoadingOverlay />}

      <h2 className="f2">{heading_2}</h2>
      {searchList}
    </section>
  );
}

export default PetSearchUsingMap;