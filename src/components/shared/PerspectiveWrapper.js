import React from "react";

import useMouse from "../../hooks/useMouse";

//notes can modify style if props.children object is a regular <div>, but object is locked if it's a react class component
const PerspectiveWrapper = (props) => {
   // const {style} = props.children.props;

   // const originalProps = props.children.props;

   const mouse = useMouse();

   const style = {
      WebkitPerspective: 1000,
      WebkitBackfaceVisibility: "hidden",
      textRendering: "auto",
      MozOsxFontSmoothing: "grayscale",
      fontSmooth: "always",
      WebkitFontSmoothing: "antialiased",
      width: 1000,
      height: 1000,
    
    

      ...props.style,
   };

   //  props.children.props.x = "234"

   // style.backgroundColor = "red"

   return (
      <div style={style}>
         <div
            style={{
               transform: "scale(1) translateZ(-1000px)",

               width: 800,
               height: 800,
              
            }}
         >
            {React.cloneElement(props.children, {})}
         </div>
      </div>
   );
};

export default PerspectiveWrapper;
