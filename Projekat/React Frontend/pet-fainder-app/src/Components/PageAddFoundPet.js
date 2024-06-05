import React from 'react';
import PetAdd from './PetAdd/PetAdd';

const PageAddFoundPet = () => {

    const backend_route = "add_new_pet"
    const heading = "ADD FOUND PET"
    const heading_2 = "SIMILAR MISSING PETS"
    const is_found = true
    const is_missing = false
    const person_title = "Owner"

    return (
        <div className="tc bg-green ma0 pa4 min-vh-100">
      <PetAdd backend_route={backend_route} heading={heading} heading_2={heading_2} is_found={is_found} is_missing={is_missing} person_title={person_title} />
    </div>
    );
}

export default PageAddFoundPet;