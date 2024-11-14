import React from 'react'
import "./hero.scss"
import { Link } from 'react-router-dom';
// import btc from "../../assets/btc-icon.webp"
import btc from "../../assets/btc-icon.webp"
import safe from "../../assets/safe-icon.webp"

export default function Hero() {
  return (
    // <div>
    //     <div className="hero-wrap" data-aos="fade-up"
    //  data-aos-duration="3000">
    //         <div className="hero-content-wrap">
    //             <div className="hero-container-wrap">
    //             <h1 className="title">Welcome to Ezabay</h1>
    //             <h3>Trade, Invest, and Secure Your Digital Assets</h3>
    //             <div className="p-text">
    //             <p>Join Ezabay to start trading cryptocurrencies with ease. Experience secure transactions, low fees, and unparalleled support. Get started today and take control of your financial future.</p>
    //             </div>
    //             <Link to="/register">
    //               <button className="btn-start">Get Started</button>
    //             </Link>
    //             <img className="hero-btc-img" src={btc} alt="Crypto Trading" />
    //             <img className="hero-safe-img" src={safe} alt="Secure Transactions" />
    //             </div>
    //         </div>
    //     </div>
    // </div>
    <div>
      <div className="hero-wrap" data-aos="fade-up" data-aos-duration="3000">
        <div className="hero-content-wrap">
          <div className="hero-container-wrap">
            <h1 className="title">Welcome to Ezabay</h1>
            <h3>Buy HIVE & HBD Easily, Trade, and Spend</h3>
            <div className="p-text">
              <p>
                Join Ezabay to start buying HIVE and HBD with ease. Our platform offers seamless transactions, minimal fees, and access to SpendHBD and Distraitor for payments and rewards. Plus, get up to 55% cashback when you pay with HIVE or HBD! Get started today and empower your digital journey.
              </p>
            </div>
            <Link to="/register">
              <button className="btn-start">Get Started</button>
            </Link>
            <img className="hero-btc-img" src={btc} alt="Buy HIVE & HBD" />
            <img className="hero-safe-img" src={safe} alt="Secure Transactions" />
          </div>
        </div>
      </div>
    </div>
  )
}
