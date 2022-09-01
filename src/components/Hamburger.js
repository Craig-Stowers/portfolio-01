import "./Hamburger.css";
import React from "react";

const Hamburger = React.forwardRef(({ open, handleClick, className }, ref) => {
   return (
      <button
         id="nav-icon"
         className={`${open ? "open" : ""} ${className}`}
         onClick={handleClick}
         ref={ref}
      >
         <span></span>
         <span></span>
         <span></span>
         <span></span>
      </button>
   );
});

export default Hamburger
