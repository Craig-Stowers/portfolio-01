import React, { useEffect, useLayoutEffect, useState, useRef } from "react";
import Canvas from "./Canvas";
import classes from "./Swirl.module.css";
import ImageSwirler from "../canvas/ImageSwirler";



import useImagePreloader from "./hooks/useImagePreloader";

import portrait from '../images/craig-small.png'
import star from "../images/star.png";
import orb from "../images/orb.png";
const preloadSrcList = [
   portrait,
   star,
   orb,
]


const Swirl = ({ onImageHeight, onCloseOrbit, startExit, onComplete }) => {
   const { imagesPreloaded } = useImagePreloader(preloadSrcList)
   const swirler = useRef(null);

   useEffect(()=>{
      document.body.style.overflow = "hidden";
      swirler.current = new ImageSwirler();
      startExit.current = swirler.current.loadImage(
         portrait,
         onImageHeight,
         onCloseOrbit,
         onComplete
      );

      return () => {
         document.body.style.overflow = "auto";
         swirler.current.unload();
      };

   }, [imagesPreloaded])

   // useLayoutEffect(() => {
   //    document.body.style.overflow = "hidden";
   //    swirler.current = new ImageSwirler();
   //    startExit.current = swirler.current.loadImage(
   //       portrait,
   //       onImageHeight,
   //       onCloseOrbit,
   //       onComplete
   //    );

   //    return () => {
   //       document.body.style.overflow = "auto";
   //       swirler.current.unload();
   //    };

   // }, []);

   // if(!imagesPreloaded)return <div>loading...</div>

   // const canvas = React.useMemo(
   //    () => (
   //       <Canvas
   //          init={(...args) => swirler.current.init(...args)}
   //          draw={(...args) => swirler.current.draw(...args)}
   //          resize={(...args) => swirler.current.resize(...args)}
   //          options={{ context: "2d", fillParent: true }}
   //          style={{
   //             display: "block",
              
              
   //          }}
   //       />
   //    ),
   //    []
   // );

   return (
      <div
         className={classes.Swirl}
         style={{
            width: "100%",
            height: "100%",
            left: 0,
            top: 0,
            position: "fixed",
            userSelect: "none",
            WebkitUserSelect: "none",
            MozUserSelect: "none",
            msUserSelect: "none",
         }}
      >
          <Canvas
            init={(...args) => swirler.current && swirler.current.init(...args)}
            draw={(...args) => swirler.current && swirler.current.draw(...args)}
            resize={(...args) => swirler.current && swirler.current.resize(...args)}
            options={{ context: "2d", fillParent: true }}
            style={{
               display: "block",
              
              
            }}
         />
         
      </div>
   );
};

export default Swirl;
