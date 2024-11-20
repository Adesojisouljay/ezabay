import React from "react";
import "./Spinner.scss"; // Ensure this contains the spinner styles

const Spinner = () => {
  return (
    <div className="lds-spinner">
      <div></div><div></div><div></div><div></div><div></div><div></div>
      <div></div><div></div><div></div><div></div><div></div><div></div>
    </div>
  );
};

export default Spinner;
