import React from 'react'
import "./feature.scss"
import btc from "../../assets/btc-icon.webp"
import lock from "../../assets/lock-iocn.webp"
import pig from "../../assets/pig-icon.webp"
import save from "../../assets/save-box-icon.webp"

export default function Feature() {
  return (
    // <div>
    //   <div className="feature-text-wrap">
    //     <h1>Innovative Crypto Exchange with </h1>
    //     <h1 className="fea-h1">Unmatched Security & Ease</h1>
    //   </div>
    //   <div className="feature-wrap">
    //     <div className="box-left">
    //     <div className="box">
    //       <div className="box-text">
    //         <h2>Seamless Mobile Trading</h2>
    //         <p>Trade cryptocurrencies effortlessly on the go with our user-friendly mobile platform.</p>
    //       </div>
    //       <div className="feature-img">
    //       <img src={btc} alt="Mobile Trading" />
    //       </div>
    //     </div>
    //     <div className="box">
    //       <div className="box-text">
    //         <h2>Zero Fees on Transactions</h2>
    //         <p>Enjoy lifetime free transactions with no hidden costs or fees.</p>
    //       </div>
    //       <div className="feature-img">
    //       <img src={pig} alt="Zero Fees" />
    //       </div>
          
    //     </div>
    //     </div>
    //     <div className="box-right">
    //     <div className="box">
    //       <div className="box-text">
    //         <h2>Identity Protection</h2>
    //         <p>Your privacy is our priority. Trade with confidence knowing your identity is secure.</p>
    //       </div>
    //       <div className="feature-img">
    //       <img  src={lock} alt="Identity Protection" />
    //       </div>
          
    //     </div>
    //     <div className="box">
    //       <div className="box-text">
    //         <h2>Ultimate Security & Control</h2>
    //         <p>Maintain full control over your assets with top-notch security features.</p>
    //       </div>
    //       <div className="feature-img">
    //       <img  src={save} alt="Security & Control" />
    //       </div>
          
    //     </div>
    //     </div>
        
    //   </div>
    // </div>
    <div>
      <div className="feature-text-wrap">
        <h1>Buy HIVE & HBD with Ease</h1>
        <h1 className="fea-h1">The Gateway to Seamless Spending & Rewards</h1>
      </div>
      <div className="feature-wrap">
        <div className="box-left">
          <div className="box">
            <div className="box-text">
              <h2>Quick & Easy HIVE Purchases</h2>
              <p>Purchase HIVE and HBD instantly with minimal hassle, ready for use on SpendHBD and Distraitor.</p>
            </div>
            <div className="feature-img">
              <img src={btc} alt="Quick Purchases" />
            </div>
          </div>
          <div className="box">
            <div className="box-text">
              <h2>Low Fees on Transactions</h2>
              <p>Enjoy trading HIVE and HBD with minimal fees. Our platform ensures transparent pricing without hidden charges.</p>
            </div>

            <div className="feature-img">
              <img src={pig} alt="Zero Fees" />
            </div>
          </div>
        </div>
        <div className="box-right">
          <div className="box">
            <div className="box-text">
              <h2>Secure Transactions</h2>
              <p>Our platform prioritizes security, ensuring your HIVE and HBD transactions are safe and protected.</p>
            </div>
            <div className="feature-img">
              <img src={lock} alt="Secure Transactions" />
            </div>
          </div>
          <div className="box">
            <div className="box-text">
              <h2>Spend & Earn with HIVE & HBD</h2>
              <p>Use HIVE and HBD on platforms like SpendHBD and Distraitor for payments and rewards.</p>
            </div>
            <div className="feature-img">
              <img src={save} alt="Spend & Earn" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
