import React, { useEffect } from 'react';
import './home.css';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { isTokenValid } from '../utils';
import Hero from '../components/Home/Hero';
import Feature from '../components/Home/Feature';
import Faq from '../components/Home/Faq';

import Footer from '../components/Home/Footer';
export const Home = () => {
  const navigate = useNavigate()
  const global = useSelector(state => state)

  // useEffect(() => {
  //   AOS.init({duration:1000});
  //   if(global.ekzaUser.user)
  //   }, [])
  useEffect(() => {
    const token = localStorage.getItem('token');
          
    if (isTokenValid(token)) {
        navigate("/dashboard")
    }
  }, []);
  
  return (
    <div className="home-wrap">
    <Hero />
    <Feature />
    {/* <Stunt /> */}
    <Faq />
    <Footer />
    </div>
  );
};

