import React from 'react';
import PetListCard from './PetListCard';

function PetList({ petResults, person_title }) {

  console.log(petResults);
  const filtered = petResults.map(pet_info =>  <PetListCard key={pet_info.pet_id} pet={pet_info.entity} distance={pet_info.distance} person_title={person_title} />); 
  return (
    <div>
      {filtered}
    </div>
  );
}

export default PetList;