import { useState, useRef, useCallback } from "react";

import classes from "./SpinningGlobe.module.css";

import useRequestAnimationFrame from "../../hooks/useRequestAnimationFrame";
import { toRadians } from "../util/utils";

const size = 120;

const GlobeRing = (props) => {
   let ringClass = classes.globeRing;
   if (props.mode == "unflip") ringClass = classes.globeRingUnFlip;
   if (props.mode == "flip") ringClass = classes.globeRingFlip;

   // let ringClass = classes.globeRingUnFlip;

   return (
      <div
         className={ringClass}
         style={{
            position: "absolute",
            top: 0,
            left: "50%",
            top: "50%",
            height: props.height,
            width: props.width,
            borderRadius: `${props.width * 0.5}px / ${props.height * 0.5}px`,

            opacity:1 - props.width*0.002 ,

            border: `${props.width*0.02 + 1}px solid transparent`,
            transform: `translate(-50%, -50%)`,
         }}
      >
         {props.children}
      </div>
   );
};

const totalRings = 10;

const fixCos = (val) => {
   if (val < 180) return val;
   return fixCos(val - 360);
};

const SpinningGlobe = () => {
   const [spinnerParams, setSpinnerParams] = useState([]);
   const masterCycle = useRef(0);

   const test = useRef(0);

   useCallback(
      useRequestAnimationFrame((delta) => {
         masterCycle.current = fixCos(masterCycle.current + delta * 0.03);

         let params = [];
         for (let i = 0; i < totalRings; i++) {
            let c = fixCos(masterCycle.current + (180 / totalRings) * i);

            let width = Math.abs(Math.cos(toRadians(c)) * size);
            let mode = "unflip";

            if (c > 90) mode = "flip";
            if (c > -90 && c < 0) mode = "flip";
            params[i] = { width, mode };
         }

         setSpinnerParams(params);

         // setSpinWidth1((val)=>{
         //    return val + (0.01 * delta)
         // })
      }, 200),
      []
   );

   const rings = [<GlobeRing width={size} height={size} mode={"full"} />];
   for (var i = 0; i < spinnerParams.length; i++) {
      rings.push(
         <GlobeRing
            width={spinnerParams[i].width}
            height={size}
            mode={spinnerParams[i].mode}
         />
      );
   }

   return (
      <div
         style={{
       
            width: 120,
            height: 120,
            position: "relative",
         }}
      >
         {rings}

         <div style={{ position: "absolute", top: 300 }}>
            test:{Math.round(test.current)}
         </div>
      </div>
   );
};

export default SpinningGlobe;
