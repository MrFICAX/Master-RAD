// src/components/SearchList.js

import React from 'react';
import PetCard from './PetCard/PetCard';

function PetSearchList({ petResults, person_title }) {

  const filtered = petResults.map((pet_info, index) =>  <PetCard key={index} pet={pet_info.entity} distance={pet_info.distance} person_title={person_title} />); 
  return (
    <div>
      {filtered}
    </div>
  );
}

export default PetSearchList;