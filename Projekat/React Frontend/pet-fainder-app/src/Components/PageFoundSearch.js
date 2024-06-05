import React, { useEffect } from 'react';
import PetSearch from './PetSearch/PetSearch';

const PageFoundSearch = () => {

  const heading = "SEARCH FOUND PETS"
  const is_found = true
  const is_missing = false
  const person_title = "Founder"

  return (
    <div className="tc bg-green ma0 pa4 min-vh-100">
      <PetSearch heading={heading} is_found={is_found} is_missing={is_missing} person_title={person_title} />
    </div>
  );
}

export default PageFoundSearch;