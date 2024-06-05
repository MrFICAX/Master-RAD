import React, { useState, useEffect, useRef } from 'react';
import PetSearchList from '../PetSearchList';
import axios from 'axios'; // For making API requests
// import S3 from 'react-aws-s3-typescript'
import Spinner from '../Spinner/Spinner';
import "./PetSearch.css";

import MapClickableWithRadius from '../MapClickableWithRadius';

function PetSearch({ heading, is_found, is_missing, person_title }) {

  const [searchField, setSearchField] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null)
  const fileInputRef = useRef(null);
  const [selectedImageName, setSelectedName] = useState("");

  const [formData, setFormData] = useState({
    latitude: 43.331175996846994,
    longitude: 21.893123133369564,
    radius: 5000
  });

  // const [ACCESS_KEY, setAccessKey] = useState("");
  // const [SECRET_ACCESS_KEY, setSecretAccessKey] = useState("");
  // const [REGION, setRegion] = useState("");
  // const [BUCKET_NAME, setBucketName] = useState("");

  useEffect(() => {

    const getPetData = async () => {

      setLoading(true)
      axios({
        method: "POST",
        url: "/getdata",
        data: { top_number: 15, SHOULD_BE_NORMALISED: 'norm', 'is_found': is_found, 'is_missing': is_missing, 'latitude': formData.latitude, 'longitude': formData.longitude, 'radius': formData.radius }

      })
        .then((response) => {
          const res = response.data.pet_results
          setSearchResults(res)
          setLoading(false)
        }).catch((error) => {
          if (error.response) {
            console.log(error.response)
            console.log(error.response.status)
            console.log(error.response.headers)
            setLoading(false)

          }
        })
    }
    // setAccessKey(process.env.REACT_APP_ACCESS_KEY)
    // setSecretAccessKey(process.env.REACT_APP_SECRET_ACCESS_KEY)
    // setRegion(process.env.REACT_APP_REGION)
    // setBucketName(process.env.REACT_APP_BUCKET_NAME)

    getPetData();
  }, [is_found, is_missing]);

  // const handleUpload = () => {
  // const ReactS3Client = new S3({
  //   accessKeyId: ACCESS_KEY,
  //   secretAccessKey: SECRET_ACCESS_KEY,
  //   bucketName: BUCKET_NAME,
  //   region: REGION,
  //   s3Url: "https://mrficax-react-bucket.s3.amazonaws.com" 
  // })
  // ReactS3Client.uploadFile(image)
  //   .then(data => console.log(data))
  //   .catch(err => {

  //     console.error(err)
  //     console.error(ACCESS_KEY)
  //     console.error(SECRET_ACCESS_KEY)
  //     console.error(BUCKET_NAME)
  //     console.error(REGION)
  //   })
  // }

  const handleImage = (event) => {
    const file = event.target.files[0];
    if (file !== undefined) {

      setImage(file)
      setSelectedName(file.name);
    } else {
      setImage(null)
      setSelectedName("");
    }
  }

  const handleMapClick = (latitude, longitude) => {
    setFormData(prevFormData => ({
      ...prevFormData,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude)
    }));
  };

  const handleChange = e => {
    setSearchField(e.target.value);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageUpload = async () => {

    if (image !== null && formData.latitude && formData.longitude && formData.radius) {
      setSearchField("")
      let requestData = new FormData();
      requestData.append('image', image);
      requestData.append('is_found', is_found);
      requestData.append('is_missing', is_missing);
      requestData.append('latitude', formData.latitude);
      requestData.append('longitude', formData.longitude);
      requestData.append('radius', formData.radius);

      setLoading(true)

      axios({
        method: "POST",
        url: '/searchimage_pet',
        data: requestData,
      })
        .then((response) => {
          const res = response.data.pet_results
          setSearchResults(res)
          setLoading(false)
          // console.log(res)
        }).catch((error) => {
          setLoading(false)
          if (error.response) {
            console.log(error.response)
            console.log(error.response.status)
            console.log(error.response.headers)
          }
        })
    } else {
      alert("Upload image first!")
    };
  };

  const handleTextSearch = async () => {

    if (searchField !== "") {
      setImage(null)
      fileInputRef.current.value = null;
      setSelectedName('')
      setLoading(true)

      axios({
        method: "POST",
        url: "/searchtext",
        data: { text: searchField, 'latitude': formData.latitude, 'longitude': formData.longitude, 'radius': formData.radius, top_number: 50, SHOULD_BE_NORMALISED: 'norm', is_found: is_found, is_missing: is_missing }
      })
        .then((response) => {
          const res = response.data.pet_results
          setSearchResults(res);
          setLoading(false)
          console.log(res)
        }).catch((error) => {
          setLoading(false)
          if (error.response) {
            console.log(error.response)
            console.log(error.response.status)
            console.log(error.response.headers)

          }
        })
    } else {
      alert("Type pet description!")
    }
  };

  const handleHybridSearch = async () => {
    if (searchField !== "" && image !== null && formData.latitude && formData.longitude && formData.radius) {

      const requestData = new FormData();
      requestData.append('text', searchField);
      requestData.append('SHOULD_BE_NORMALISED', 'norm');
      requestData.append('is_found', is_found);
      requestData.append('is_missing', is_missing);
      requestData.append('image', image);
      requestData.append('latitude', formData.latitude);
      requestData.append('longitude', formData.longitude);
      requestData.append('radius', formData.radius);

      setLoading(true)
      axios({
        method: "POST",
        url: "/hybrid_search_pet",
        data: requestData
      })
        .then((response) => {
          const res = response.data.pet_results
          setSearchResults(res);
          setLoading(false)
          console.log(res)
        }).catch((error) => {
          setLoading(false)
          if (error.response) {
            console.log(error.response)
            console.log(error.response.status)
            console.log(error.response.headers)

          }
        })
    } else {
      alert("Upload image and type pet description!")
    }
  }

  function searchList() {
    return (
      <div className='pet-results'>
        {searchResults !== undefined && <PetSearchList petResults={searchResults} person_title={person_title} />}
      </div>
    );
  }

  return (
    <section className="garamond">

      <div className="navy georgia ma0 grow">
      </div>
      <div className="horizontal-form">

        <div className="vertical-form">
        <h2 className="f2">{heading}</h2>



          <div className="search-vertical-form">
            {/* 
            <div className="search-group">
              <label className="f2" htmlFor="name">Upload pet image and search... </label>
              {image && <img
                style={{
                  maxWidth: "300px", // Ensures the image doesn't exceed the container's width
                  maxHeight: "300px", // Ensures the image doesn't exceed the container's height
                  width: "auto", // Set the fixed width you desire
                  height: "auto", // Maintains the aspect ratio
                }}
                src={URL.createObjectURL(image)} alt='' />}
              <input type="file" ref={fileInputRef} className="input-reset bb pa2 db w-100 br3 bg-transparent hover-bg-black-10 white-80 pointer ma3" onChange={handleImage} />

            </div> */}

            <div className="search-group">
            <div className="search-group">
              <label className="f2" htmlFor="name">Describe your pet and search...</label>

              <input className="searchfield" type="text" maxLength={100} id="name" name="name" value={searchField} onChange={handleChange} placeholder="Enter pet visual description..." />
              <input className="f6 link br2 ph3 pv2 dib white bg-dark-green" onClick={handleTextSearch} type="submit" value="SEARCH BY DESCRIPTION" />
            </div>

              <label className="f2" htmlFor="name">Upload pet image and search... </label>

              <div className="app">
                <div className="parent">
                  <div className="file-upload">
                    {image && <img
                      style={{
                        maxWidth: "100%",
                        maxHeight: "100%",
                        width: "auto",
                        height: "auto",
                      }}
                      src={URL.createObjectURL(image)} alt='' />}
                    <h3> {selectedImageName || "Click box to upload image of a pet"}</h3>
                    <p>Dog or cat</p>
                    <input type="file" ref={fileInputRef} onChange={handleImage} />
                  </div>
                </div>
              </div>
              <input className="f6 link br2 ph3 pv2 mb2 dib white bg-dark-green" onClick={handleImageUpload} type="submit" value="SEARCH BY IMAGE" />
            </div>
            {/* <input
          className="pa3 bb br3 grow b--none bg-lightest-blue ma4"
          type="search"
          placeholder="Search pets..."
          value={searchField}
          onChange={handleChange}
        /> */}

          </div>

          <div className="hybrid-search-group">

            <label className="f2" htmlFor="name">Search pet with both image and pet description</label>
            <label className="" htmlFor="name">Hybrid search is combination of visual and textual vector search</label>

            <input className="f6 link br2 ph3 pv2 mb2 dib white bg-dark-green" onClick={handleHybridSearch} type="submit" value="HYBRID SEARCH" />
          </div>

          <div className="search-container">
            <form className="clickable-map-form">
              <div className="form-group">
                <label htmlFor="radius">Radius in meters:</label>
                <input type="text" maxLength="10" id="radius" name="radius" value={formData.radius} onChange={handleInputChange} placeholder="Input range" />
              </div>
              <div className="location-group">

                <label htmlFor="number"> Latitude: {formData.latitude}</label>
                <br></br>
                <label htmlFor="number">Longitude: {formData.longitude}</label>
              </div>

              {formData.latitude !== null && <MapClickableWithRadius onMapClick={handleMapClick} latitude={formData.latitude} longitude={formData.longitude} radius={formData.radius} />}
            </form>
          </div>

        </div>

        {/* Conditionally render loading overlay */}
        {loading && <Spinner />}

        {searchList()}
      </div>
    </section>
  );
}

export default PetSearch;