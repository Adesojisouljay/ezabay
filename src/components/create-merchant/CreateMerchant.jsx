import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { createMerchant } from '../../api/ekzat';
import './create-merchant.scss';
import { GeneralDropdown } from '../dropdown/GeneralDrpdpown';
import { countriesList } from '../../vairables/countries';

export const CreateMerchantForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    accountNumber: '',
    accountName: '',
    bankName: '',
    residentialAddress: '',
    residencePicture: '',
    selfiePhotograph: '',
    NIN: '',
    BVN: '',
    socialMediaHandle: ''
  });
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const [cameraActive1, setCameraActive1] = useState(false);
  const [cameraActive2, setCameraActive2] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [openCountryList, setOpenCountryList] = useState(false);

  const videoRef1 = useRef(null);
  const videoRef2 = useRef(null);
  const canvasRef1 = useRef(null);
  const canvasRef2 = useRef(null);

  // useEffect(() => {
  //   const fetchCountries = async () => {
  //     try {
  //       const response = await fetch('https://restcountries.com/v3.1/all');
  //       const data = await response.json();
  //       const countryNames = data.map(country => country.name.common).sort();
  //       setCountries(countryNames);
  //     } catch (error) {
  //       console.error('Error fetching countries:', error);
  //     }
  //   };
  
  //   fetchCountries();
  // }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const imageFormData = new FormData();
      imageFormData.append('file', image1);
      imageFormData.append('upload_preset', process.env.REACT_APP_CLOUDINARY_PRESET);
      const selfieResponse = await axios.post(process.env.REACT_APP_CLOUDINARY_URL, imageFormData);
      const selfiePhotographUrl = selfieResponse.data.secure_url;

      imageFormData.set('file', image2);
      const residenceResponse = await axios.post(process.env.REACT_APP_CLOUDINARY_URL, imageFormData);
      const residencePictureUrl = residenceResponse.data.secure_url;

      const updatedFormData = {
        ...formData,
        selfiePhotograph: selfiePhotographUrl,
        residencePicture: residencePictureUrl,
        country: selectedCountry
      };

      const result = await createMerchant(updatedFormData);
      setLoading(false);

      if (result.success) {
        setMessage(result.message);
        setError(null);
        setIsSubmitted(true);
      } else {
        setError(result.message);
        setMessage(null);
      }
    } catch (err) {
      console.log(err);
      setLoading(false);
      setError('Failed to upload images or create merchant');
      setMessage(null);
    }
  };

  const startCamera = async (videoRef) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      await videoRef.current.play();
    } catch (error) {
      console.error('Error accessing camera', error);
    }
  };

  const capturePhoto = (videoRef, canvasRef, setImage, setCameraActive) => {
    if (canvasRef.current && videoRef.current) {
      const context = canvasRef.current.getContext('2d');
      context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
      setImage(canvasRef.current.toDataURL('image/jpeg'));
      stopCamera(videoRef);
      setCameraActive(false);
    }
  };

  const stopCamera = (videoRef) => {
    const stream = videoRef.current.srcObject;
    if (stream) {
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  const handleCountryChange = (country) => {
    const selectedC = countriesList.find(c => c === country);
    setSelectedCountry(selectedC)
    
  };

  const handleOpenList = () => {
    setOpenCountryList(!openCountryList);
  };

  return (
    <div className="create-merchant-form">
      {isSubmitted ? (
        <div className="success-message">
          <h2>Merchant Request Submitted Successfully!</h2>
          <p>Your application as a merchant has been submitted successfully. We will review your details and get back to you shortly.</p>
          <Link to="/dashboard">Back to dashboard</Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <h2>Create Merchant</h2>
          {message && <p className="message">{message}</p>}
          {error && <p className="error">{error}</p>}
          {/* Form Fields */}
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input type="text" id="username" name="username" value={formData.username} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="accountNumber">Account Number</label>
            <input type="text" id="accountNumber" name="accountNumber" value={formData.accountNumber} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="accountName">Account Name</label>
            <input type="text" id="accountName" name="accountName" value={formData.accountName} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="bankName">Bank Name</label>
            <input type="text" id="bankName" name="bankName" value={formData.bankName} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Country</label>
            <GeneralDropdown
                  items={countriesList}
                  setSelectedItem={handleCountryChange} 
                  handleOpenList={handleOpenList} 
                  openList={openCountryList}
                  itemName={selectedCountry}
                  selectLabal="country"
                />
          </div>
          <div className="form-group">
            <label htmlFor="residentialAddress">Residential Address</label>
            <input type="text" id="residentialAddress" name="residentialAddress" value={formData.residentialAddress} onChange={handleChange} required />
          </div>

          {/* Camera 1 */}
          <div className="form-group">
            <label>Selfie Photograph</label>
            {cameraActive1 ? (
              <div>
                <video ref={videoRef1} width="320" height="240" className="video"></video>
                <button type="button" onClick={() => capturePhoto(videoRef1, canvasRef1, setImage1, setCameraActive1)} className="button">Capture Selfie</button>
              </div>
            ) : (
              <div>
                <button type="button" onClick={() => { startCamera(videoRef1); setCameraActive1(true); }} className="button">Start Camera</button>
                {image1 && <img src={image1} alt="Captured Selfie" className="preview-image" />}
              </div>
            )}
            <canvas ref={canvasRef1} width="320" height="240" style={{ display: 'none' }} />
          </div>

          {/* Camera 2 */}
          <div className="form-group">
            <label>Residence Picture</label>
            {cameraActive2 ? (
              <div>
                <video ref={videoRef2} width="320" height="240" className="video"></video>
                <button type="button" onClick={() => capturePhoto(videoRef2, canvasRef2, setImage2, setCameraActive2)} className="button">Capture Residence</button>
              </div>
            ) : (
              <div>
                <button type="button" onClick={() => { startCamera(videoRef2); setCameraActive2(true); }} className="button">Start Camera</button>
                {image2 && <img src={image2} alt="Captured Residence" className="preview-image" />}
              </div>
            )}
            <canvas ref={canvasRef2} width="320" height="240" style={{ display: 'none' }} />
          </div>

          <div className="form-group">
            <label htmlFor="NIN">NIN</label>
            <input type="text" id="NIN" name="NIN" value={formData.NIN} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="BVN">BVN</label>
            <input type="text" id="BVN" name="BVN" value={formData.BVN} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="socialMediaHandle">Social Media Handle</label>
            <input type="text" id="socialMediaHandle" name="socialMediaHandle" value={formData.socialMediaHandle} onChange={handleChange} required />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create Merchant'}
          </button>
        </form>
      )}
    </div>
  );
};
