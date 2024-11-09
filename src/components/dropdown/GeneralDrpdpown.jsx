import React, { useState } from 'react'
import { RiArrowDownSFill, RiBankFill } from 'react-icons/ri';
import nigeria from "../../assets/nigria.png"
import Usa from "../../assets/Usa.webp"
import "./general.scss"

export const GeneralDropdown = (props) => {
    const { items, handleOpenList, setSelectedItem, itemName, openList } = props;
    const [searchQuery, setSearchQuery] = useState("");

    const filteredItems = items?.filter(item =>
        (item.bankName || item.name|| item).toLowerCase().includes(searchQuery.toLowerCase()) 
    );

  return (
    <div className='gd-container'>
        <div className="gd-item-select-wrap" onClick={handleOpenList}>
            {itemName === "NGN" ? 
            <img className='gd-select-image' src={nigeria} alt="" /> : 
            itemName === "USD" ? 
            <img className='gd-select-image' src={Usa} alt="" /> : 
            <RiBankFill size={24} />
            }
            <span className='gd-select-title'>{itemName || "Select Country"}</span>
            <RiArrowDownSFill  size={24}/>
        </div>
        {(openList && items?.length > 6) && 
       <input 
            className={`dropdown-search-input ${"openlist"} `}
            type="text"
            placeholder='Search coin'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
         />}
        <div 
            className={`gd-item-list-wrap ${openList ? "gd-openlist": "gd-openclose"} ${items?.length <= 6 ? "gd-short-list" : ""}`}
            >
            {filteredItems?.map((item, index)=> (<div className={`gd-item-list`} key={index} >
                <div 
                    className="gd-item-picker"
                    onClick={() => {
                        setSelectedItem(item.name || item);
                        handleOpenList();
                    }}
                >
                    {item.image && <img className='gd-select-image' src={item.image} alt="" />}
                    <span style={{width: "200px"}} >{item.bankName || item.name|| item}</span>
                    <span>{item?.accountNumber || null}</span>
                </div>
            </div>))}
        </div>
    </div>
  )
}
