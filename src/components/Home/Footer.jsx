import React from "react";
import "./footer.css";
import circlebig from "../../assets/circle-big.webp";
import circlesmall from "../../assets/circle-small.webp";
import { BiLogoTelegram } from "react-icons/bi";

export default function Footer() {
  return (
    <div className="footer-main-wrap">
      <div className="contact-container">
        <div className="contact-wrap">
          <h1>Have Any Questions?</h1>
          <div className="contact-box">
            <h2>Get In Touch Now</h2>
            <div className="input-wrap">
              <input className="con-input-name" type="text" placeholder="Your Name" />
              <input className="con-input-email" type="text" placeholder="Your Email" />
            </div>
            <input className="con-input-message" type="text" placeholder="Message..." />
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
              <div className="footer-text-left">
                <div className="footer-box">
                  <h3>Company</h3>
                  <ul>
                    <li>About Us</li>
                    <li>Contact</li>
                    <li>Careers</li>
                  </ul>
                </div>
                <div className="footer-box">
                  <h3>Support</h3>
                  <ul>
                    <li>FAQ</li>
                    <li>Help Center</li>
                    <li>Security</li>
                  </ul>
                </div>
              </div>
              <div className="footer-box">
                <h3>Subscribe to Our Newsletter</h3>
                <p>Stay updated with the latest news and offers from Ezabay by subscribing to our newsletter. Enter your email below to subscribe.</p>
                {/* <div className="newsletter-wrap">
                  <input type="text" placeholder="Email" />
                  <div className="send-icon">
                    <BiLogoTelegram size={35} color="black" />
                  </div>
                </div> */}
              </div>
            </div>
            <div className="footer-bm">
              <hr />
              <h3>Copyright © 2023 Ezabay. All rights reserved.</h3>
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
