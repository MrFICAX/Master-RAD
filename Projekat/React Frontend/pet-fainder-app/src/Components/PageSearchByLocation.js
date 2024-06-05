import React from 'react';
import PetSearchUsingMap from './PetSearchUsingMap/PetSearchUsingMap';

const PageSearchByLocation = () => {

    const backend_route = "search_by_location"
    const heading = "SEARCH BY LOCATION"
    const heading_2 = "CLOSEST PETS"
    const is_found = false
    const is_missing = true
    const person_title = "Founder"

    return (
        <div className="tc bg-green ma0 pa4 min-vh-100">
      <PetSearchUsingMap backend_route={backend_route} heading={heading} heading_2={heading_2} is_found={is_found} is_missing={is_missing} person_title={person_title} />
    </div>
    );
}

export default PageSearchByLocation;