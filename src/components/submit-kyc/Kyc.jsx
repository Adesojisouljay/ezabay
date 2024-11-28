import React, { useRef, useState } from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { submitKYC } from '../../api/kyc';
import { getUserProfile } from '../../api/profile';
import { Loader } from '../loader/Loader';
import './kyc.scss';

export const Kyc = () => {
  const user = useSelector(state => state?.ekzaUser?.user);
  const dispatch = useDispatch();

  const [step, setStep] = useState(1);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [otherName, setOtherName] = useState('');
  const [selfie, setSelfie] = useState(null);
  const [idImage, setIdImage] = useState(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [selfieTaken, setSelfieTaken] = useState(false)
  const [message, setMessage] = useState("");
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [loading, setLoading] = useState(false)
  const selfieVideoRef = useRef(null);
  const selfieCanvasRef = useRef(null);

  const startCamera1 = async () => {
    setCameraActive(true)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      selfieVideoRef.current.srcObject = stream;
      selfieVideoRef.current.play();
    } catch (error) {
      console.error('Error accessing camera for selfie', error);
    }
  };

  const capturePhoto1 = () => {
    if (selfieCanvasRef.current && selfieVideoRef.current) {
      const context = selfieCanvasRef.current.getContext('2d');
      context.drawImage(selfieVideoRef.current, 0, 0, selfieCanvasRef.current.width, selfieCanvasRef.current.height);
      setSelfie(selfieCanvasRef.current.toDataURL('image/jpeg'));
      stopCamera(selfieVideoRef);
      setCameraActive(false);
      setSelfieTaken(true);
    }
  };

  const goBack = () => {
    setCameraActive(false);
    stopCamera(selfieVideoRef)
  }

  const stopCamera = (videoRef) => {
    const stream = videoRef.current.srcObject;
    if (stream) {
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
    }
  };

  const idUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setIdImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)
  
    if (!firstName || !lastName || !selfie || !idImage) {
      setMessage('Please fill in all required fields and capture the images.');
      return;
    }
  
    try {
      const formData1 = new FormData();
      formData1.append('file', selfie);
      formData1.append('upload_preset', process.env.REACT_APP_CLOUDINARY_PRESET);
      
      const response1 = await axios.post(process.env.REACT_APP_CLOUDINARY_URL, formData1);
      const imageUrl1 = response1.data.secure_url;
  
      const formData2 = new FormData();
      formData2.append('file', idImage);
      formData2.append('upload_preset', process.env.REACT_APP_CLOUDINARY_PRESET);
      
      const response2 = await axios.post(process.env.REACT_APP_CLOUDINARY_URL, formData2);
      const imageUrl2 = response2.data.secure_url;
  
      const kycData = {
        firstName,
        lastName,
        otherName,
        selfie: imageUrl1,
        idDocument: imageUrl2,
      };
  
      await submitKYC(kycData);
      getUserProfile(dispatch);
      setSubmissionSuccess(true);
      setStep(2);
      setLoading(false)
    } catch (error) {
      console.error('Error submitting KYC', error);
      setLoading(false)
    }
  };  

  return (
    <div className="kyc-container">
     { step === 1 &&
        ((user?.kyc?.kycStatus === "Pending" && user?.kyc?._id) ? <div className='pending-kyc'>
            <h1>You have already submitted Kyc, please wait for review</h1>
            <button type="button" className="kyc-btn">
              <Link to="/dashboard">
                Return to Dashboard
              </Link>
            </button>
          </div> : 
          user?.kyc.kycStatus === "Verified" ?
          <div className='approved-kyc'>
            <h1>Your kyc submission has already been approved</h1>
            <button type="button" className="kyc-btn">
              <Link to="/dashboard">
                Return to Dashboard
              </Link>
            </button>
          </div> :
          <>
            <form onSubmit={handleSubmit} className="form">
              {loading && <Loader/>}
              <h2>KYC Submission</h2>
              <span>{message}</span>

                  {!cameraActive && <div className="step step-1">
                    <h3>Personal Information</h3>
                    <input
                      type="text"
                      placeholder="First Name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="input"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Last Name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="input"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Other Name"
                      value={otherName}
                      onChange={(e) => setOtherName(e.target.value)}
                      className="input"
                    />
                  </div>}

                  <div className="step">
                    <h3>Selfie</h3>
                    {selfie && <img src={selfie} alt="Captured Selfie" className="preview-image" />}
                    {cameraActive && 
                      <div className='video-frame'>
                        <video ref={selfieVideoRef} className="video"></video>
                    </div>
                    }
                        {!cameraActive ? 
                        !selfieTaken && <button type="button" onClick={startCamera1} className="button">Take selfie</button> :
                        <div className='kyc-seldie-btns'>
                        <button type="button" onClick={goBack} className="button">Back</button>
                        <button type="button" onClick={capturePhoto1} className="button">Capture Selfie</button>
                        </div>
                        }
                
                  </div>

                  {!cameraActive && <div className="step step-3">
                    <h3>Please upload an ID Document</h3>
                    <h5 className='warning'>(Nigerian NIN/ Int Passport/ Voters Card/ Drivers Liscense)</h5>
                    {idImage && <img src={idImage} alt="Uploaded ID" className="preview-image" />}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={idUpload}
                      className="input"
                    />
                  </div>}

                <canvas ref={selfieCanvasRef} style={{ display: 'none' }}></canvas>

                {!cameraActive && <div className="button-group">
                    <button
                    style={{cursor: loading ? "not-allowed" : "pointer"}}
                      type="submit" 
                      className="submit-button"
                      disabled={loading}
                      >
                      Submit KYC
                    </button>
                </div>}
            </form>
          </>)
      }
      
      {step === 2 && submissionSuccess && (
            <div className="kyc-step-2">
              <h3 className='kyc-success-text'>KYC Submitted Successfully!</h3>
              <button type="button" className="kyc-btn">
                <Link to="/dashboard">
                  Return to Dashboard
                </Link>
              </button>
            </div>
          )}
    </div>
  );
};
