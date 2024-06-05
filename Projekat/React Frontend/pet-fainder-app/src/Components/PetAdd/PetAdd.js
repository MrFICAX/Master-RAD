import React, { useState, useMemo, useEffect } from 'react';
import PetSearchList from '../PetSearchList';
import axios from 'axios'; // For making API requests
// import S3 from 'react-aws-s3-typescript'
import MapClickable from '../MapClickable';
import LoadingOverlay from '../Spinner/Spinner';
import "./PetAdd.css";

function PetAdd({ backend_route, heading, heading_2, is_found, is_missing, person_title }) {

  const [searchResults, setSearchResults] = useState([]);
  const [image, setImage] = useState(null)
  const [selectedImageName, setSelectedName] = useState("");

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    number: '',
    latitude: '',
    longitude: ''
  });

  // const [ACCESS_KEY, setAccessKey] = useState("");
  // const [SECRET_ACCESS_KEY, setSecretAccessKey] = useState("");
  // const [REGION, setRegion] = useState("");
  // const [BUCKET_NAME, setBucketName] = useState("");

  useEffect(() => {
    //   setAccessKey(process.env.REACT_APP_ACCESS_KEY)
    //   setSecretAccessKey(process.env.REACT_APP_SECRET_ACCESS_KEY)
    //   setRegion(process.env.REACT_APP_REGION)
    //   setBucketName(process.env.REACT_APP_BUCKET_NAME)
    console.log("PetAdd initialised!");
  }, []);

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

  // function getPetData() {


  //   axios({
  //     method: "POST",
  //     url: "/getdata",
  //     data: { top_number: 10, SHOULD_BE_NORMALISED: 'norm', is_found: is_found, is_missing: is_missing }

  //   })
  //     .then((response) => {
  //       const res = response.data.pet_results
  //       setSearchResults(res)
  //       console.log(res)
  //     }).catch((error) => {
  //       if (error.response) {
  //         console.log(error.response)
  //         console.log(error.response.status)
  //         console.log(error.response.headers)

  //       }
  //     })
  // }

  const handlePetUpload = async (e) => {
    e.preventDefault();

    if (formData.name && formData.number && formData.latitude && formData.longitude && image) {

      // alert("All data filled")
      // console.log(formData)
      // console.log(image)
      setLoading(true)

      const pet_data = new FormData();
      pet_data.append('name', formData.name);
      pet_data.append('contact', formData.number);
      pet_data.append('latitude', formData.latitude);
      pet_data.append('longitude', formData.longitude);
      pet_data.append('image', image);
      pet_data.append('is_found', is_found);
      pet_data.append('is_missing', is_missing);

      axios({
        method: "POST",
        url: `/${backend_route}`,
        data: pet_data,
      })
        .then((response) => {
          const res = response.data.pet_results
          setSearchResults(res)
          setLoading(false)
          // console.log(res)
        }).catch((error) => {
          if (error.response) {
            console.log(error.response)
            console.log(error.response.status)
            console.log(error.response.headers)
            setLoading(false)

          }
        })
    } else {
      alert('Please fill in all fields');
    }
  };


  const handleImage = (event) => {
    const file = event.target.files[0];
    if (file !== undefined){

      setImage(file)
      setSelectedName(file.name);
    } else{
      setImage(null)
      setSelectedName("");
    }
  }


  // Function to handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleMapClick = (latitude, longitude) => {
    setFormData(prevFormData => ({
      ...prevFormData,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude)
    }));
  };

  const searchList = useMemo(() => {

    console.log("searchResults changed!");
    console.log(searchResults);
    return (
      <div>
        {searchResults !== undefined && <PetSearchList petResults={searchResults} person_title={person_title} />}
      </div>
    );
  }, [searchResults, person_title]);


  return (
    <section className="garamond">
      <div className="navy georgia ma0 grow">
        <h2 className="f2">{heading}</h2>
      </div>
      <div className="horizontal-form">

        <div className="add-group">
          <div className="app">
            <div className="parent">
              <div className="file-upload">
                {image && <img
                  style={{
                    maxWidth: "100%", 
                    maxHeight: "100%", 
                    width: "auto", 
                    height: "300px",
                  }}
                  src={URL.createObjectURL(image)} alt='' />}
                <h3> {selectedImageName || "Click box to upload image of a pet"}</h3>
                <p>Dog or cat</p>
                <input type="file" onChange={handleImage} />
              </div>
            </div>
          </div>
        </div>

        <div className="container">
          <h2>Enter Your Information</h2>
          <form>
            <div className="form-group">
              <label htmlFor="name">Name and surname:</label>
              <input  className="searchfield" type="text" maxLength={40} id="name" name="name" value={formData.name} onChange={handleInputChange} placeholder="Enter your name and surname" />
            </div>
            <div className="form-group">
              <label htmlFor="number">Contact number:</label>
              <input className="searchfield" type="text" maxLength="10" id="number" name="number" value={formData.number} onChange={handleInputChange} placeholder="Enter your contact number" />
            </div>
            <div className="location-group">
              <label htmlFor="number"> Latitude: {formData.latitude}</label>
              <label htmlFor="number">Longtude: {formData.longitude}</label>
            </div>
            <MapClickable onMapClick={handleMapClick} latitude={43.331175996846994} longitude={21.893123133369564} />
            <button type="submit" className='ma3' onClick={handlePetUpload} >ADD PET</button>
          </form>
        </div>
      </div>

      {loading && <LoadingOverlay />}

      <h2 className="f2">{heading_2}</h2>
      {searchList}
    </section>
  );
}

export default PetAdd;