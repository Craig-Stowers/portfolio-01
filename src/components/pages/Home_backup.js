import React, {
   useEffect,
   useLayoutEffect,
   useCallback,
   useRef,
   useState,
   useMemo,
} from "react";

import { isMobile } from "react-device-detect";
import classes from "./HomeStyles.module.css";
import Sticky from "../shared/Sticky";
import PlayfulText from "../shared/PlayfulText";
import SpanChars from "../shared/SpanChars";
import { toRadians } from "../util/utils";
import { Vector } from "../util/vector";
import LagElement from "../shared/LagElement";
import useWindowSize from "../../hooks/useWindowSize";
import { limitNumberRange } from "../util/utils";
import { clamp } from "../../utility/common";
import {
   repellerData1,
   repellerData2,
   repellerData3,
   repellerData4,
} from "../../data/scrollText";
import useRequestAnimationFrame from "../../hooks/useRequestAnimationFrame";
import { UNSAFE_LocationContext } from "react-router-dom";

import SharePosition from "../shared/SharePosition";

import MirrorElement from "../shared/MirrorElement";

import Projects from "./Projects";

import hiddenObjects from "../../images/hidden-objects.png";
import { addTween } from "../../utility/Tweens";
const asciiText = require(`../code/${"bulb"}.txt`);
let debug = false;

const bgColors = [
   [242, 242, 242],
   [242, 242, 242],
   [242, 0, 0],
   [242, 242, 242],
   [0, 0, 0],
   [0, 0, 0],
   [0, 0, 0],
   [0, 0, 0],
];

const slidingTextColors = [
   [255, 89, 89],
   [255, 89, 89],
   [0, 0, 255],

   [255, 89, 89],
   [200, 200, 200],
   [0, 200, 125],
   [0, 200, 125],
   [0, 200, 125],
];
const funTextColors = [
   [10, 10, 10],
   [10, 10, 10],
   [10, 10, 10],
   [10, 10, 10],
   [200, 200, 200],
   [221, 0, 81],
   [252, 246, 104],
   [209, 249, 255],
];

const formatRgbArr = (rgba) => {
   let a = rgba[3];
   if (a === null || a === undefined) {
      a = 1;
   }
   return `rgba(${rgba[0]},${rgba[1]},${rgba[2]}, ${a})`;
};

const blendRgb = (curr, target, perc) => {
   const [r1, g1, b1] = curr;
   const [r2, g2, b2] = target;
   let r, g, b;
   r = r1 + (r2 - r1) * perc;
   g = g1 + (g2 - g1) * perc;
   b = b1 + (b2 - b1) * perc;
   return [r, g, b];
};

const Home = ({ changeBackgroundColor }) => {
   const repellingTextVectors = useRef([]);
   const [textIndex, setTextIndex] = useState(null);
   const size = useWindowSize();
   const heightRef = useRef(size.height);
   const widthRef = useRef(size.width);
   const [showPlayText, setShowPlayText] = useState(false);
   const lagTextSpans = useRef([]);
   const [ascii, setAscii] = useState(null);
   const formatingIndex = useRef(0);
   const funTextColorRef = useRef(funTextColors[0]);
   const [projectFocus, setProjectFocus] = useState(null);
   const followProjects = useRef(false);
   const projectImagesY = useRef(null);
   const playfulTextY = useRef(0);
   const playfulTextRef = useRef(null);
   const lockTextToProjects = useRef(false);
   const tracking = useRef([]);
   const [showProjects, setShowProjects] = useState(false);

   const homeRef = useRef(null);

   //repellingTextVectors.current = [];

   //  tracking.current = [];
   //  repellingTextVectors.current = [];

   useRequestAnimationFrame((delta) => {
      const targetColor = funTextColors[formatingIndex.current];
      funTextColorRef.current = blendRgb(
         funTextColorRef.current,
         targetColor,
         0.03
      );
   });

   const changeFormat = (i) => {
      formatingIndex.current = i;
      // if(!homeRef.current)return;
      // homeRef.current.style.backgroundColor = formatRgbArr(bgColors[i])

      document.body.style.backgroundColor = formatRgbArr(bgColors[i]);

      // changeBackgroundColor(formatRgbArr(bgColors[i]));
   };

   useEffect(() => {
      heightRef.current = size.height;
      widthRef.current = size.width;
      console.log("CHANGE SIZE", size.height);
   }, [size]);

   useEffect(() => {
      setTimeout(() => {
         setShowPlayText(true);
      }, 900);

      // fetch(asciiText)
      //    .then((t) => t.text())
      //    .then((text) => {
      //       setAscii(text);
      //      // setShowPlayText(true);
      //    });
   }, []);

   const buildReppellerGroup = (data, colorSet, baseIndex) => {
      const lowIndex = baseIndex;

      const highIndex = lowIndex + data.items.length;

      for (let i = lowIndex; i < highIndex; i++) {
         const v = new Vector(0, 0);
         v.power = 40;
         // v.weight = 10;
         repellingTextVectors.current[i] = v;

         // tracking.current[i] = { x: 0, y: 0, element: null };
      }

      const max = data.items.reduce((prev, curr) => {
         return prev.style.top > curr.style.top ? prev : curr;
      }).style.top;

      // console.log("tracking", lowIndex, repellingTextVectors.current.length)

      return (
         <MirrorElement
            lag={true}
            style={{
               fontSize: 40,
               fontWeight: 800,

               height: max + 300,
               position: "relative",
               color: formatRgbArr(slidingTextColors[colorSet]),
            }}
            onMove={(x, y) => {
               console.log(`?track=mirror${baseIndex}-Y?round=2`, y);

               for (var j = lowIndex; j < highIndex; j++) {
                  const yPos = y + tracking.current[j].y;
                  const xPos = tracking.current[j].x;
                  const v = repellingTextVectors.current[j];

                  v.x = xPos;
                  v.y = yPos;
                  const d = Math.abs(heightRef.current * 0.5 - yPos);
                  const dx = Math.abs(widthRef.current * 0.5 - xPos);
                  const limit = Math.max(heightRef.current * 0.2, 120);
                  const el = tracking.current[j].element;
                  if (d > limit * 2) {
                     if (!v.outOfBounds) {
                        v.outOfBounds = true;
                        el.style.color = formatRgbArr(bgColors[colorSet]);
                     }
                     continue;
                  } else {
                     v.outOfBounds = false;
                  }
                  const darkness = Math.min(Math.max(d - limit, 0) * 0.0065, 1);
                  // const left = `calc(-50% + ${d*0.1}px)`
                  //  el.style.transform = `translate(${left},-50%) scale(${0.75 + darkness*.25})`
                  const newColor = blendRgb(
                     slidingTextColors[colorSet],
                     bgColors[colorSet],
                     darkness
                  );
                  newColor[3] = 1;
                  el.style.color = formatRgbArr(newColor);
               }
            }}
         >
            {data.items.map((e, i) => {
               const index = lowIndex + i;

               const fontSize =
                  e.style.fontSize || 80 / Math.pow(e.text.length, 0.4);

               return (
                  <SharePosition
                     key={"repeller" + index}
                     style={{
                        ...e.style,
                        position: "absolute",
                        display: "inline-block",
                        color: "rgba(0,0,0,1)",
                        fontWeight: 800,
                        fontSize,
                        transform: "translate(-50%,-50%)",
                     }}
                     recieveData={(data) => {
                        tracking.current[index] = data;
                     }}
                  >
                     {e.text}
                  </SharePosition>
               );
            })}
         </MirrorElement>
      );
   };

   // const initReppellerGroups = (repelSets) => {
   //    const repelGroups = [];
   //    let repelIndex = 0;
   //    for (var i = 0; i < repelSets.length; i++) {
   //       repelGroups.push(buildReppellerGroup(repelSets[i], i, repelIndex));
   //       repelIndex += repelSets[i].length;
   //    }
   //    console.log("REPEL GROUPS", repelGroups);
   //    return repelGroups;
   // };

   // const repellerGroup1 = useMemo(
   //    () => buildReppellerGroup(repellerData1, 0),
   //    []
   // );
   // const repellerGroup2 = useMemo(
   //    () => buildReppellerGroup(repellerData2, repellerData1.items.length),
   //    []
   // );

   //have to manually set infex points. problem with re-rendering children pushing too many items into vector/tracker array

   // const [repellerGroup1, repellerGroup2, repellerGroup3, repellerGroup4] =
   //    initReppellerGroups([
   //       repellerData1,
   //       repellerData2,
   //       repellerData3,
   //       repellerData4,
   //    ]);

   const repellerGroup1 = buildReppellerGroup(repellerData1, 0, 0);
   const repellerGroup2 = buildReppellerGroup(
      repellerData2,
      1,
      repellerData1.items.length
   );
   const repellerGroup3 = buildReppellerGroup(
      repellerData3,
      2,
      repellerData1.items.length + repellerData2.items.length
   );
   // const repellerGroup4 = buildReppellerGroup(
   //    repellerData4,
   //    3,
   //    repellerData1.items.length +
   //       repellerData2.items.length +
   //       repellerData3.length
   // );

   return (
      <div className={classes.Home} ref={homeRef}>
         <Sticky
            style={{ position: "relative" }}
            dominantIn={(dir) => {
               setTextIndex(0);
               changeFormat(0);
            }}
         >
            <div> {repellerGroup1}</div>
         </Sticky>

         <Sticky
            style={{
               // backgroundColor: "green",
               position: "relative",
            }}
            dominantIn={() => {
               setTextIndex(1);
               changeFormat(1);
            }}
            // activeOut={(direction) => setTextIndex(direction === "up" ? 0 : 1)}
            // stickyChild={<div>This is the second sticky</div>}
         >
            {repellerGroup2}
         </Sticky>

         <Sticky
            style={{ position: "relative" }}
            dominantIn={() => {
               // if (textIndex !== 2) {
               setTextIndex(2);
               changeFormat(2);
               setShowProjects(false);
               //  }
            }}
         >
            {repellerGroup3}
         </Sticky>

         <Sticky
            style={{ position: "relative" }}
            dominantIn={() => {
               // if (textIndex !== 2) {
               setTextIndex(3);
               changeFormat(3);
               setShowProjects(false);
               //  }
            }}
         >
            {/* {repellerGroup4} */}
         </Sticky>

         <Sticky
            style={{ position: "relative", height: 1000 }}
            dominantIn={() => {
               // if (textIndex !== 2) {
               setTextIndex(4);
               changeFormat(4);
               setShowProjects(false);
               //  }
            }}
         >
            {/* {repellerGroup4} */}
         </Sticky>

         <Sticky
            style={{
               position: "relative",
               width: "100%",
               paddingTop: 400,
               color: "white",
            }}
            dominantIn={(direction) => {
               setTextIndex(null);
               setShowProjects(true);
               changeFormat(3);
            }}
         >
            {/* <MirrorElement lag={!isMobile} tween={0.983}> */}
            <Projects show={showProjects} />
            {/* </MirrorElement> */}
         </Sticky>

         {/* <Sticky
            style={{
               position: "relative",
               height: "50vh",
               width: "100%",
            }}
            dominantIn={() => {
               setTextIndex(4);
               changeFormat(4);
               setProjectFocus(2);
            }}
         >
            <ProjectItem
               focus={projectFocus === 2}
               image={hiddenObjects}
               color={formatRgbArr(funTextColors[4])}
               height={heightRef.current}
            />
         </Sticky>

         <Sticky
            style={{
               position: "relative",
               height: "50vh",
               width: "100%",
            }}
            dominantIn={() => {
               setTextIndex(5);
               changeFormat(5);
               setProjectFocus(3);
            }}
            className={classes.work}
         >
            <ProjectItem
               focus={projectFocus === 3}
               image={hiddenObjects}
               color={formatRgbArr(funTextColors[5])}
               height={heightRef.current}
            />
         </Sticky>

         <Sticky
            style={{
               position: "relative",
               height: "50vh",
               width: "100%",
            }}
            dominantIn={() => {
               setTextIndex(6);
               changeFormat(6);
               setProjectFocus(4);
            }}
            className={classes.work}
         >
            <ProjectItem
               focus={projectFocus === 4}
               image={hiddenObjects}
               color={formatRgbArr(funTextColors[6])}
               height={heightRef.current}
            />
         </Sticky>

         <Sticky
            style={{
               position: "relative",
               height: "50vh",
               width: "100%",
            }}
            dominantIn={() => {
               setTextIndex(7);
               changeFormat(7);
               setProjectFocus(5);
            }}
            className={classes.work}
         >
            <ProjectItem
               focus={projectFocus === 5}
               image={hiddenObjects}
               color={formatRgbArr(funTextColors[7])}
               height={heightRef.current}
            />
         </Sticky> */}

         {/* <div className={classes.frameContainer} style={{backgroundColor:textIndex === 3 ? "black" : "transparent"}}>
            <div
               className={`${classes.frameTop} ${textIndex === 3 && classes.frameTopReveal}`}
            ></div>
            <div className={classes.frameBottom}></div>
         </div> */}

         {showPlayText && (
            <PlayfulText
               ascii={ascii}
               parentRef={playfulTextRef}
               repellers={repellingTextVectors.current}
               selectedText={textIndex}
               textOnDraw={(context, e, dist) => {
                  const d = Math.min(Math.pow(dist, 0.5) * 15, 255);
                  //   // e.rotation = (e.x - e.aim.x) * (e.y - e.aim.y) * -0.008;

                  //    // e.shifting // if letter is tweening
                  const percColorShift = Math.min(d / 180, 1);

                  //    //console.log(distance, percColorShift)

                  const newColor = blendRgb(
                     funTextColorRef.current,
                     slidingTextColors[formatingIndex.current],
                     percColorShift
                  );

                  // console.log(e.opacity)

                  newColor[3] = e.opacity;
                  const color = formatRgbArr(newColor);

                  // console.log(percColorShift);

                  context.fillStyle = color;
                  //  e.element.style.color = formatRgbArr(newColor);
                  //rotation is too expensive, can replace display layer with canvas in future update
                  // e.element.style.transform = `translate(-50%,-50%) rotate(${
                  //    e.rotation * 0.15
                  // }deg)`;
               }}
            />
         )}

         {debug && (
            <div
               style={{
                  textAlign: "left",
                  padding: 8,
                  position: "fixed",
                  width: "100%",
                  top: 0,
                  backgroundColor: "#00000050",
                  left: 0,
               }}
            >
               textIndex: {textIndex}
            </div>
         )}
      </div>
   );
};

// console.log1 = function(...args){
//    console.log()

// }

export default Home;
