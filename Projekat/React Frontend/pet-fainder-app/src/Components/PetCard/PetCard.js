import React, { useState, useEffect } from 'react';
import MapWithImageOverlay from '../MapWithImageOverlay.js';
import PetImageWithLazyLoad from '../PetImageWithLazyLoad.js'
// import DeckGL from '@deck.gl/react';
// import { StaticMap } from 'react-map-gl';
import './PetCard.css'; // Import CSS file for styling


function PetCard({ pet, distance, person_title }) {

  // const [bounds, setBounds] = useState(null);
  const [checkedFound, setCheckedFound] = useState(true);
  const [checkedMissing, setCheckedMissing] = useState(true);


  useEffect(() => {
    if (pet && typeof pet === 'object') { // Check if pet is defined and is an object
      //  console.log(pet);
      setCheckedFound(pet.is_found)
      setCheckedMissing(pet.is_missing)

      //  if (pet.pet_longitude && pet.pet_latitude) {
      // generateBounds(pet.pet_longitude, pet.pet_latitude);
      // }
    }
  }, [pet]);

  // const generateBounds = ({ pet_longitude, pet_latitude }) => {

  //   let point_in_map = [pet_longitude, pet_latitude]
  //   let earth = 6378.137 //radius of the earth in kilometer
  //   let pi = Math.PI;
  //   let m = (1 / ((2 * pi / 360) * earth)) / 1000
  //   let radius_in_meters = 35
  //   // new_latitude = latitude + (radius_in_meters * m)

  //   let cos = Math.cos;
  //   m = (1 / ((2 * pi / 360) * earth)) / 1000 //1 meter in degree

  //   let tmp_bound = [
  //     [point_in_map[0] + (-radius_in_meters * m) / cos(point_in_map[1] * (pi / 180)), point_in_map[1] + (-radius_in_meters * m)],
  //     [point_in_map[0] + (-radius_in_meters * m) / cos(point_in_map[1] * (pi / 180)), point_in_map[1] + (radius_in_meters * m)],
  //     [point_in_map[0] + (radius_in_meters * m) / cos(point_in_map[1] * (pi / 180)), point_in_map[1] + (radius_in_meters * m)],
  //     [point_in_map[0] + (radius_in_meters * m) / cos(point_in_map[1] * (pi / 180)), point_in_map[1] + (-radius_in_meters * m)]
  //   ]

  //   setBounds(tmp_bound);
  // };


  return (
    // <div className="tc bg-light-green dib br3 pa3 ma2 grow bw2 shadow-5">
    <div className="card">

      <PetImageWithLazyLoad image={pet.pet_image_filename}></PetImageWithLazyLoad>
      <div>
        <h2>{person_title}: {pet.pet_finder_name}</h2>
        <h3>{person_title} contact: {pet.pet_finder_contact}</h3>
        <p>Vector Similarity Distance: {Math.round(distance * 100000) / 100000}</p>
        {/* <p>IS found: {pet.is_found && "True"}</p>
        <p>IS missing: {pet.is_missing && "True"}</p> */}

        <label className="checkbox-container">
          <input
            type="checkbox"
            checked={checkedMissing}
            readOnly
          />
          <span className="checkmark"></span>
          Pet is missing!
        </label>

        <label className="checkbox-container">
          <input
            type="checkbox"
            checked={checkedFound}
            readOnly
          />
          <span className="checkmark"></span>
          Pet is found!
        </label>


        <br></br>
        <div className='map-with-overlay'>
          <MapWithImageOverlay latitude={pet.pet_latitude} longitude={pet.pet_longitude} image={pet.pet_image_filename} />
        </div>
        {/* <div className="location-group">
          <label htmlFor="number"> Latitude: {pet.pet_latitude}</label>
          <label htmlFor="number">Longtude: {pet.pet_longitude}</label>
        </div> */}
      </div>
    </div>
  );
}

export default PetCard;