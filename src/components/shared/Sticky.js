import { findByLabelText } from "@testing-library/react";

import useScroller from "../../hooks/useScroller";
import { useRef, useState, useLayoutEffect, useMemo } from "react";
import useWindowSize from "../../hooks/useWindowSize";

const Sticky = (props) => {
   const parentRef = useRef(null);
   const childRef = useRef(null);
   const params = useRef({});
   const [active, setActive] = useState(false);
   const dominant = useRef(false);
   const size = useWindowSize();
   const cooldown = useRef(false);

   // useScroller((curr, prev) => {
   //    const offset = curr.y - params.current.originY;
   //    contentRef.current.style.top = Math.round(offset)+"px";
   //   // console.log(offset);
   // });

   const testParams = (scrollY, params) => {
      if (scrollY < params[0]) return [false, "up"];
      if (scrollY >= params[1]) return [false, "down"];
      return [true, null];
   };

   const checkActive = (scrollY) => {
      const [isActive, direction] = testParams(
         scrollY,
         params.current.activeLimits
      );
      if (isActive && !active) {
         props.activeIn && props.activeIn();
         setActive(true);
      }
      if (!isActive && active) {
         props.activeOut && props.activeOut(direction);
         setActive(false);
      }
   };

   const checkDominant = (scrollY) => {
      const [isDominant, direction] = testParams(
         scrollY,
         params.current.dominantLimits
      );
      if (isDominant && !dominant.current) {
        // if (cooldown.current) clearTimeout(cooldown.current);
       //  cooldown.current = setTimeout(() => {
            props.dominantIn && props.dominantIn(direction);
          //  if (cooldown.current) clearTimeout(cooldown.current);
        // }, 200);

         dominant.current = true;
      }
      if (!isDominant && dominant.current) {
        // props.dominantOut && props.dominantOut(direction);
         dominant.current = false;
      }
   };

   const updateStatus = (scrollY) => {
      checkActive(scrollY);
      checkDominant(scrollY);
   };

   useLayoutEffect(() => {
    
      const parentRect = parentRef.current.getBoundingClientRect();
      const childRect = childRef.current.getBoundingClientRect();
      const y = parentRect.y + window.scrollY;

      params.current.activeLimits = [
         y,
         y + parentRect.height - childRect.height,
      ];

      params.current.dominantLimits = [
         y - childRect.height * 0.5,
         y - childRect.height * 0.5 + parentRect.height,
      ];
      updateStatus(window.scrollY);
   }, [size]);

   useScroller((curr) => {
      updateStatus(curr.y);
   });

   const parentStyle = {
      alignItems: "flex-start",
      // backgroundColor:`rgb(${Math.random()*255},${Math.random()*255},${Math.random()*255})`,
      // backgroundColor:"black",
      // border: dominant ? "4px solid pink" : "none",

      ...props.style,
   };

   const childStyle = {
      position: "sticky",
      height: "200px",
      top: 0,
      width: "100%",
      // border: active ? "4px solid yellow" : "none",
      // boxSizing:"content-box",

      // backgroundColor: active ? "red" : "grey",
      display: "flex",
   };

   const wrapperStyle = {
      marginTop: "auto",
      marginBottom: "auto",
   };

   return (
      <div ref={parentRef} style={parentStyle} className={props.className}>
         {props.children}
         <div ref={childRef} style={childStyle}>
            <div style={wrapperStyle}>{props.stickyChild}</div>
         </div>
      </div>
   );
};
export default Sticky;
