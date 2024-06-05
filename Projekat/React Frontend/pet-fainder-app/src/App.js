import './App.css';
import PageMissingSearch from './Components/PageMissingSearch';
import PageFoundSearch from './Components/PageFoundSearch';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import PageAddFoundPet from './Components/PageAddFoundPet';
import PageAddMissingPet from './Components/PageAddMissingPet';
import Navbar from './Components/NavBar/NavBar';
import React, { useEffect } from 'react';
import PageSearchByLocation from './Components/PageSearchByLocation';

function App() {

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route exact path="/" element={<PageMissingSearch />} />
        <Route exact path="/search_found" element={<PageFoundSearch />} />
        <Route exact path="/add_found_pet" element={<PageAddFoundPet />} />
        <Route exact path="/add_missing_pet" element={<PageAddMissingPet />} />
        {/* <Route exact path="/search_by_location" element={<PageSearchByLocation />} /> */}
      </Routes>
    </BrowserRouter>

  );
}
export default App;
