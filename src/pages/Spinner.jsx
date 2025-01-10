import React, { useRef, useState } from 'react';
import { Wheel } from "react-custom-roulette";
import './spinner.scss';

const Spinner = () => {
  const wheelRef = useRef(null);
  const prizes = [
    "1 HIVE", "2 HIVE", "3 HIVE", "4 HIVE", "5 HIVE", 
    "6 HIVE", "7 HIVE", "8 HIVE", "9 HIVE", "10 HIVE",
    "OH! TRY AGAIN"
  ];

  const colors = [
    "#FF5733", "#33FF57", "#3357FF", "#FF33A1", "#A133FF",
    "#FFD700", "#FF8C00", "#00FFFF", "#8A2BE2", "#FF4500"
  ];

  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);
  const [spinning, setSpinning] = useState(false);

  const data = prizes.map((prize, index) => ({
    option: prize,
    style: { backgroundColor: colors[index] }
  }));

  const handleSpinClick = () => {
    if (!spinning) {
      const newPrizeNumber = Math.floor(Math.random() * data.length);
      setPrizeNumber(newPrizeNumber);
      setMustSpin(true);
      setSpinning(true);
    }
  };

  const handleSpinEnd = () => {
    setMustSpin(false);
    setSpinning(false);
  };

  return (
    <div className="spinner-wrap">
      <div className="spinner-container">
        <div className="spinner-wheel" ref={wheelRef}>
          <Wheel
            mustStartSpinning={mustSpin}
            prizeNumber={prizeNumber}
            data={data}
            onStopSpinning={handleSpinEnd}
          />
        </div>
        {!spinning && (
          <button className='spinner-btn' onClick={handleSpinClick}>Spin</button>
        )}
        {spinning && <p className="spinner-result">Spinning...</p>}
        {!spinning && <p className="spinner-result">{`You won: ${prizes[prizeNumber]}`}</p>}
      </div>
    </div>
  );
};

export default Spinner;
