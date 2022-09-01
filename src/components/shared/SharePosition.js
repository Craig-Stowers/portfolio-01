import React, { useEffect, useRef } from "react";
import useWindowSize from "../../hooks/useWindowSize";
const SharePosition = ({ tag, style, recieveData, children }) => {
   const element = useRef(null);
   const CustomTag = tag || "div";
   const offsetParent = useRef({ x: 0, y: 0 });
   const size = useWindowSize()

   useEffect(() => {
   
    //  const resize = () => {
        // console.log("resize share")
    
         const parent = element.current.parentElement;
         const parentRect = parent.getBoundingClientRect();
         const rect = element.current.getBoundingClientRect();
         const x = rect.left - parentRect.left + rect.width * 0.5;
         const y = rect.top - parentRect.top + rect.height * 0.5;


         if (recieveData) {
            recieveData({x, y, element:element.current})
         }
      //   storeData.element.style.color = "red";
    //  };

    //  resize();
      // window.addEventListener("resize", resize);
      // return () => window.removeEventListener("resize", resize);
   }, [size]);

   return (
     <CustomTag
         ref={(ref) => {
            element.current = ref;
         }}
         style={{
            ...style,
         }}
      >
         {children}
      </CustomTag>
   );
};

export default SharePosition;
