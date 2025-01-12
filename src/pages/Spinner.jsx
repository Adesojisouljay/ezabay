import React, { useRef, useState, useEffect } from 'react';
import { Wheel } from "react-custom-roulette";
import { useDispatch } from 'react-redux';
import { spinTheWheel } from '../api/spinner';
import { useSelector } from 'react-redux';
import { getUserProfile } from '../api/profile';
// import spinnerSound from "../assets/spinner.mp3";
import coinSpinner from "../assets/coinSpinner.mp3";
import './spinner.scss';

const Spinner = () => {
  const dispatch = useDispatch()
  const wheelRef = useRef(null);
  const user = useSelector((state) => state.ekzaUser?.user);
  const audio = useRef(new Audio(coinSpinner));

  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [message, setMessage] = useState("Get Ready!");

  const prizes = [
    "10 HIVE", "20 HIVE", "30 HIVE", "40 HIVE", "50 HIVE", 
    "60 HIVE", "70 HIVE", "80 HIVE", "90 HIVE", "100 HIVE",
    "OH! Better luck next time! 🤞"
  ];

  const colors = [
    "#FF5733", "#33FF57", "#3357FF", "#FF33A1", "#A133FF",
    "#FFD700", "#FF8C00", "#00FFFF", "#8A2BE2", "#FF4500"
  ];

  const data = prizes.map((prize, index) => ({
    option: prize,
    style: { backgroundColor: colors[index] }
  }));

  const handleSpinEnd = () => {
    setMustSpin(false);
    setIsSpinning(false);
    audio.current.pause();
    audio.current.currentTime = 0;
    getUserProfile(dispatch);
  };

  const handleSpinClick = async () => {
    if (isSpinning) return;

    setIsSpinning(true);
    setMessage("Spinning...");

    audio.current.loop = true;
    audio.current.play();

    const response = await spinTheWheel();
    console.log(response);

    if (response.success) {
      const index = prizes.indexOf(response.prize);
      setPrizeNumber(index !== -1 ? index : prizes.length - 1);
      setMustSpin(true);
      setMessage(response.prize === "OH! Better luck next time! 🤞" 
        ? response.prize 
        : `You won: ${response.prize}`);
    } else {
      setMessage("Spin failed.");
      setIsSpinning(false);
    }
  };

  return (
    <div className="spinner-wrap">
      <div className="spinner-main-container">
        <div className='spinner-top-wrapper'>
          <div className="spinner-data-wrapper">
            <span>Ezapoint Balance: {user?.ezaPoints?.balance}</span>
            <span>Total Hive Won: {user?.ezaPoints?.balance}</span>
            <span>Total Spins: 3000</span>
            <span>Pending Rewards: {user.pendingSpinHiveReward}</span>
          </div>
          <button className="claim-btn">Claim pending reward</button>
        </div>
        <div className="spinner-container">
          <div className="spinner-wheel" ref={wheelRef}>
            <Wheel
              mustStartSpinning={mustSpin}
              prizeNumber={prizeNumber}
              data={data}
              onStopSpinning={handleSpinEnd}
            />
          </div>
          {!isSpinning && (
            <button className='spinner-btn' onClick={handleSpinClick}>Spin</button>
          )}
          {isSpinning && <p className="spinner-result">Spinning...</p>}
          {!isSpinning && <p className="spinner-result">{message}</p>}
        </div>
      </div>
    </div>
  );
};

export default Spinner;
