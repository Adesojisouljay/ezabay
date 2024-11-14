import React, { useState } from 'react'
import { MdKeyboardArrowUp } from "react-icons/md";
import { RiArrowDownSLine } from "react-icons/ri";
import "./faq.scss"

export default function Faq() {
    const [CurOpen, setCurOpen] = useState(null);
    const data = [
        {
          title: "What is Ezabay?",
          text:
            "Ezabay is a user-friendly cryptocurrency exchange that allows users to buy, sell, and manage Hive, HBD, and other digital assets. It simplifies the process for those who want to access the Hive ecosystem, including SpendHBD and Distraitor, where Hive and HBD can be spent or used for rewards."
        },
        {
          title: "How do I create an account?",
          text:
            "Creating an account on Ezabay is easy. Click on the 'Register' button, provide your details, and verify your email address. Once you're done, you'll be ready to buy Hive, HBD, and other cryptocurrencies right away."
        },
        {
          title: "How can I buy Hive and HBD?",
          text:
            "Buying Hive and HBD on Ezabay is straightforward. After creating an account, simply go to the trading section, choose Hive or HBD, and make your purchase using supported payment methods."
        },
        {
            title: "Are there any fees for trading on Ezabay?",
            text:
            "Ezabay offers competitive trading fees, especially for Hive and HBD. Our platform has low fees to make sure your trading experience is affordable, with discounts available for high-volume traders."
          },
          {
            title: "Can I use Hive and HBD outside of trading?",
            text:
            "Yes, Hive and HBD can be used on platforms like SpendHBD to make purchases and on Distraitor to participate in community rewards and projects. Ezabay makes it easy to access these platforms by providing a seamless way to buy and manage Hive and HBD."
          },
          {
            title: "Is Ezabay a secure platform?",
            text:
              "Security is our top priority. Ezabay uses advanced measures such as two-factor authentication (2FA), encrypted transactions, and secure storage of assets to protect your funds at all times."
          }
      ];
   
  return (
    <div className="accordion-wrap">
      <div className="accordion">
         <h2>Frequently Asked Questions</h2>
    {data.map((el, i) => (
      <AccordionItem title={el.title} CurOpen={CurOpen} OnOpen={setCurOpen} num={i} key={el.title}>
        {el.text}
      </AccordionItem>   
    ))}
  </div>
    </div>
  )
}

function AccordionItem({ num, title, CurOpen, OnOpen, children }) {
    const isOpen = num === CurOpen;
    
    function handleToggle() {
      OnOpen(isOpen ? null : num);
    }
  
    return (
      <div className={`item ${isOpen ? "acc-open" : ""}`} onClick={handleToggle}>
        <div className={`title-wrap ${isOpen ? "title-wrap-mb" : ""}`}>
          <p className="titles">{title}</p>
          <p className="icon">{isOpen ? <RiArrowDownSLine size={30} /> : <MdKeyboardArrowUp size={30} />}</p>
        </div> 
        {isOpen && <div className={`content-box ${isOpen ? "content-box-mb" : ""}`}>{children}</div>}
      </div>
    );
  }
