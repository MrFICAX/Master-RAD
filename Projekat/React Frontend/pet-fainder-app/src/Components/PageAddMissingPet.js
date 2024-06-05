import React from 'react';
import PetAdd from './PetAdd/PetAdd';

const PageAddMissingPet = () => {

    const backend_route = "add_new_pet"
    const heading = "ADD MISSING PET"
    const heading_2 = "SIMILAR FOUND PETS"
    const is_found = false
    const is_missing = true
    const person_title = "Founder"

    return (
        <div className="tc bg-green ma0 pa4 min-vh-100">
      <PetAdd backend_route={backend_route} heading={heading} heading_2={heading_2} is_found={is_found} is_missing={is_missing} person_title={person_title} />
    </div>
    );
}

export default PageAddMissingPet;