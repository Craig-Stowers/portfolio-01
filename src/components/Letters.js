import React, { useEffect, useLayoutEffect, useState, useRef } from "react";
import Canvas from "./Canvas";
import classes from "./Swirl.module.css";
import ImageSwirler from "../canvas/ImageSwirler";

import image from "../images/craig-blue.png";

const Swirl = ({ onImageHeight, onCloseOrbit, startExit, onComplete }) => {
   const swirler = useRef(null);

   useLayoutEffect(() => {
      document.body.style.overflow = "hidden";
      swirler.current = new ImageSwirler();
      startExit.current = swirler.current.loadImage(
         image,
         onImageHeight,
         onCloseOrbit,
         onComplete
      );

      return () => {
         document.body.style.overflow = "auto";
         swirler.current.unload();
      };

      // initParticles();
   }, []);

   const canvas = React.useMemo(
      () => (
         <Canvas
            init={(...args) => swirler.current.init(...args)}
            draw={(...args) => swirler.current.draw(...args)}
            resize={(...args) => swirler.current.resize(...args)}
            options={{ context: "2d", fillParent: true }}
            style={{
               display: "block",
            }}
         />
      ),
      []
   );

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
         {canvas}
      </div>
   );
};

export default Swirl;
