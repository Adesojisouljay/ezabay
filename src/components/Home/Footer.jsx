import React from "react";
import "./footer.scss";
import circlebig from "../../assets/circle-big.webp"
import circlesmall from "../../assets/circle-small.webp"
import { BiLogoTelegram } from "react-icons/bi";
import Logo from "../../../src/assets/Ezabay-logo.png"
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <div className="footer-main-wrap">
    <div className="contact-container" >
        <div className="contact-wrap">
            <h1>Have Any Questions?</h1>
            <div className="contact-box">
                <h2>Get In Touch Now</h2>
                <div className="input-wrap">
                    <input className="con-input-name" type="text" placeholder='Your Name' />
                    <input className="con-input-email" type="text" placeholder='Your Email' />
                </div>
                <input className="con-input-message" type="text" placeholder='Message...' />
                <div className="con-btn">
                <button>Send Message</button>
                </div>
                
            </div>
        </div>
    </div>
    <div>
      <div className="footer-container">
        <div className="footer-wrap">
            
          <div className="footer-text-wrap">

            <div className="foot-left">
              <img src={Logo} alt="" />
              <span>Buying and Selling HIVE and <br />HBD with ease.  </span>
            </div>
            <div className="foot-right">
            <span>We offers seamless transactions, minimal fees, and access to SpendHBD and Distraitor for payments and rewards.</span>
            <Link to={"/login"}><button>Get Started</button></Link>
            </div>
          </div>
          <div className="foooter-bm">
          <hr />
          <h3>Copyright © 2023 Ezabay.  All rights reserved.  </h3>
          </div>
          <div className="circle-wrap">
                <img className="circlebig" src={circlebig} alt="" />
                <img className="circlesmall" src={circlesmall} alt="" />
            </div>
          
        </div>
      </div>
    </div>
    </div>
  );
}
