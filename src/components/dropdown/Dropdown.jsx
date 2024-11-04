import React, { useState } from 'react'
import "./dropdown.scss"

export const Dropdown = (props) => {
    const { user, handleOpencoinList, setCurrency, openList, displaySearch} = props;
    const [searchQuery, setSearchQuery] = useState("");

    const filteredAssets = user?.assets?.filter(asset =>
        asset.currency?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.symbol?.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <>
       {openList && 
       <input 
            className={`dropdown-search-input ${displaySearch? "openlist": "openclose"} `}
            type="text"
            placeholder='Search coin'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
         />}
        <div 
            className={`coin-list-wrap ${openList ? "openlist": "openclose"}`}
            style={{height: filteredAssets?.length <= 6 && "max-content"}}
        >
        {filteredAssets?.map((asset)=> (<div className={`coin-list  `} >
            <div 
            className="asset-picker"
            onClick={() => {
                setCurrency(asset);
                handleOpencoinList();
            }}
            >
            <img className="picker-image" src={asset.image} alt="" />
            <span className="picker-image">{asset.currency}</span>
            </div>
        </div>))}
    </div>
    </>
  )
}
