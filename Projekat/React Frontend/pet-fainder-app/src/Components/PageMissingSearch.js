import React, { useEffect } from 'react';
import PetSearch from './PetSearch/PetSearch';

const PageMissingSearch = () => {

  const heading = "SEARCH MISSING PETS"
  const is_found = false
  const is_missing = true
  const person_title = "Owner"

  return (
    <div className="tc bg-green ma0 pa4 min-vh-100">
      <PetSearch heading={heading} is_found={is_found} is_missing={is_missing} person_title={person_title} />
    </div>
  );
}

export default PageMissingSearch;