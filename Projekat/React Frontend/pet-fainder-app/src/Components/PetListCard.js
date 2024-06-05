import React, { useState, useEffect } from 'react';
import MapWithImageOverlay from './MapWithImageOverlay.js';
import PetImageWithLazyLoad from './PetImageWithLazyLoad.js'
import './PetCard/PetCard.css'; 


function PetListCard({ pet, person_title }) {

  const [checkedFound, setCheckedFound] = useState(true);
  const [checkedMissing, setCheckedMissing] = useState(true);

  useEffect(() => {
    if (pet && typeof pet === 'object') { // Check if pet is defined and is an object
     setCheckedFound(pet.is_found)
     setCheckedMissing(pet.is_missing)
    }
  }, [pet]);

  return (
    <div className="tc bg-light-green dib br3 pa3 ma2 grow bw2 shadow-5">

      <PetImageWithLazyLoad image={pet.pet_image_filename}></PetImageWithLazyLoad>
      <div>
        <h2>{person_title}: {pet.pet_finder_name}</h2>
        <h3>{person_title} contact: {pet.pet_finder_contact}</h3>
        <label className="checkbox-container">
          <input
            type="checkbox"
            checked= {checkedMissing}
            readOnly
          />
          <span className="checkmark"></span>
         Pet is missing!
        </label>

        <label className="checkbox-container">
          <input
            type="checkbox"
            checked= {checkedFound}
            readOnly
          />
          <span className="checkmark"></span>
         Pet is found!
        </label>

        <br></br>
        <div>
          <MapWithImageOverlay latitude={pet.pet_latitude} longitude={pet.pet_longitude} image={pet.pet_image_filename} />
        </div>
      </div>
    </div>
  );
}

export default PetListCard;