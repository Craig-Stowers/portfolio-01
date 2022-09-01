import { useLayoutEffect, useRef } from "react";

const ElementSnagger = (props) => {
   const snagZoneRef = useRef(null);
   const contentRef = useRef(null);
   const params = useRef({});

   useLayoutEffect(() => {
      const rect = snagZoneRef.current.getBoundingClientRect();
      params.current.originY = rect.y + window.scrollY;
      const checkStickiness = () => {
         const offset = window.scrollY - params.current.originY;
         contentRef.current.style.top = Math.round(offset) + "px";
      };
      window.addEventListener("scroll", function () {
         return window.requestAnimationFrame(checkStickiness);
      });
   }, []);

   const snagZoneStyle = {
      height: props.boxHeight,
      width: 400,

      position: "relative",
   };

   const contentStyle = {
      height: "100vh",
      width: 300,
      top: 0,

      position: "absolute",
   };

   return (
      <div style={snagZoneStyle} ref={snagZoneRef}>
         <div ref={contentRef} style={contentStyle}>
            {props.children}
         </div>
      </div>
   );
};

export default ElementSnagger;
