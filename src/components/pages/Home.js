import React, {
   useEffect,
   useLayoutEffect,
   useCallback,
   useRef,
   useState,
   useMemo,
} from "react";

import {
   BrowserView,
   MobileView,
   isBrowser,
   isMobile,
} from "react-device-detect";

import classes from "./HomeStyles.module.css";
import Sticky from "../shared/Sticky";
import PlayfulText from "../shared/PlayfulText";

import arrowDown from "../../images/arrow-down.png";

import { Vector } from "../util/vector";
import useWindowSize from "../../hooks/useWindowSize";
import { limitNumberRange } from "../util/utils";
import { clamp } from "../../utility/common";
import {
   repellerData1,
   repellerData2,
   repellerData3,
   repellerData4,
   repellerData5,
} from "../../data/scrollText";
import useRequestAnimationFrame from "../../hooks/useRequestAnimationFrame";
import { UNSAFE_LocationContext } from "react-router-dom";

import SharePosition from "../shared/SharePosition";

import MirrorElement from "../shared/MirrorElement";

import Projects from "./Projects";

import useScroller from "../../hooks/useScroller";

import {
   disableBodyScroll,
   enableBodyScroll,
   clearAllBodyScrollLocks,
} from "body-scroll-lock";

import hiddenObjects from "../../images/hidden-objects.png";
import { addTween } from "../../utility/Tweens";
const asciiText = require(`../code/${"bulb"}.txt`);
let debug = false;

const electricblue = [0, 173, 255];
const seablue = [0, 240, 255];
const lightpink = [255, 167, 247];
const purpleblue = [27, 44, 86];

const sandyellow = [244, 199, 77];

const coral = [255, 81, 113];
const coral2 = [225, 111, 124];
const teal = [173, 225, 201];
const gold = [241, 174, 117];
const teal2 = [136, 243, 219];

const white = [255, 255, 255];
const black = [0, 0, 0];
const blue = [20, 146, 194];
const orange1 = [255, 159, 28];

const charcoal = [37, 38, 45];

const yellow1 = [245, 197, 69];
const yellow2 = [255, 229, 21];

const skyblue = [49, 109, 145];

const orange = [227, 84, 39];
const hotpink = [209, 64, 129];

const islandgreen = [85, 161, 92];
const mintcream = [243, 247, 240];

const white2 = [252, 244, 244];

const brightgreen = [108, 250, 0];

const red = [225, 23, 6];
const c_eggWhite = [237, 225, 205];
const dullblue = [78, 128, 152];

const wine = [106, 46, 53];

const citrine = [215, 207, 7];
const russiangreen = [111, 143, 114];
const spanishViridian = [28, 124, 84];
const powderblue = [190, 227, 219];
const wildblueyonder = [161, 181, 216];
const persimmon = [235, 100, 36];

const yellow = [241, 210, 89];

const bgColors = [
   [218, 254, 253],
   coral,
   charcoal,
   yellow,
   white2,
   white2,
   [0, 0, 0],
   [0, 0, 0],
];

const slidingTextColors = [
   dullblue,
   charcoal,
   hotpink,
   spanishViridian,
   [0, 0, 0],
   [0, 0, 0],
   [0, 0, 0],
   [0, 0, 0],
];
const funTextColors = [
   coral,
   mintcream,
   yellow,
   charcoal,
   black,
   white,
   white,
   [0, 0, 0],
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

   const [scrolled, setScrolled] = useState(false);
   const startScroll = useRef(null);

   const scrollLockRef = useRef(document.createElement("div"));
   const storedScrollY = useRef(null);
   const [hidePlayText, setHidePlayText] = useState(false);
   const slideTextRefs = useRef([]);
   const slideTextPositions = useRef([]);

   useScroller(
      (scroll) => {
         if (scroll.y > 100) {
            setScrolled(true);
         } else {
            setScrolled(false);
         }

         // console.log(scroll)
      },
      true,
      [scrolled, setScrolled]
   );

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

      slideTextRefs.current[0].style.color = "red";
   });

   const changeFormat = (i) => {
      formatingIndex.current = i;
      // if(!homeRef.current)return;
      // homeRef.current.style.backgroundColor = formatRgbArr(bgColors[i])

      // document.body.style.backgroundColor = formatRgbArr(bgColors[i]);

      changeBackgroundColor(formatRgbArr(bgColors[i]));
   };

   useEffect(() => {
      heightRef.current = size.height;
      widthRef.current = size.width;

      //  console.log("cal new positions", slideTextRefs.current.length);

      for (let i = 0; i < slideTextRefs.current.length; i++) {
         const ref = slideTextRefs.current[i];
         const parent = ref.parentElement;
         const parentRect = parent.getBoundingClientRect();
         const rect = ref.getBoundingClientRect();
         const x = rect.left - parentRect.left + rect.width * 0.5;
         const y = rect.top - parentRect.top + rect.height * 0.5;

         slideTextPositions.current[i] = { x, y };
      }
   }, [size]);

   useEffect(() => {
      setTimeout(() => {
         setShowPlayText(true);
      }, 400);

      // fetch(asciiText)
      //    .then((t) => t.text())
      //    .then((text) => {
      //       setAscii(text);
      //      // setShowPlayText(true);
      //    });
   }, []);

   const handleScrollable = (isScrollable) => {
      if (isMobile) return;

      if (isScrollable) {
         enableBodyScroll(scrollLockRef.current);
         // document.body.style.setProperty("top", "");
         // document.body.scrollTo(0, storedScrollY.current);
         setHidePlayText(false);
         document.body.style.width = "100%";

         //lockMessages.current = false
      } else {
         document.body.style.width = `calc(100vw - ${size.gutter}px)`;
         // lockMessages.current = true;
         setHidePlayText(true);
         // storedScrollY.current = window.scrollY;
         disableBodyScroll(scrollLockRef.current);
         // document.body.style.setProperty("top", `${window.scrollY * -1}px`);
      }
   };

   const buildReppellerGroup = (data, colorSet, baseIndex) => {
      const lowIndex = baseIndex;
      const highIndex = lowIndex + data.items.length;

      // for (let i = lowIndex; i < highIndex; i++) {
      //    const v = new Vector(0, 0);
      //    v.power = 40 //e.text.length * e.fontSize;
      //    // v.weight = 10;
      //    repellingTextVectors.current[i] = v;

      //    // tracking.current[i] = { x: 0, y: 0, element: null };
      // }

      for (let i = 0; i < data.items.length; i++) {
         const v = new Vector(0, 0);
         const fontSize = data.items[i].style.fontSize || 30;
         v.power =
            data.items[i].power ||
            Math.pow(data.items[i].text.length * fontSize, 0.4) * 0.8;
         // v.weight = 10;
         repellingTextVectors.current[i + baseIndex] = v;

         // tracking.current[i] = { x: 0, y: 0, element: null };
      }

      const max = data.items.reduce((prev, curr) => {
         return prev.style.top > curr.style.top ? prev : curr;
      }).style.top;

      // console.log("tracking", lowIndex, repellingTextVectors.current.length)

      let paddingBottom = 10//data.paddingBottom || 100;
      if (data.paddingBottom === 0) paddingBottom = 0;

      const maxWidth = data.maxWidth || data.items.length * 80;

      return (
         <MirrorElement
            lag={true}
            style={{
               fontSize: 40,
               fontWeight: 800,
               width: "100%",
               maxWidth,
               changeBackgroundColor: "green",
               marginLeft: "auto",
               marginRight: "auto",
             
               marginBottom:-400,
             

               height: max + paddingBottom,
               position: "relative",
               color: formatRgbArr(slidingTextColors[colorSet]),
            }}
            onResize={() => {}}
            //recieve x,y of sliding mirror

            onMove={(x, y, clones) => {
               for (var j = lowIndex; j < highIndex; j++) {
                  const slideText = slideTextPositions.current[j];
                  if (!slideText) continue;

                  const yPos = y + slideText.y;
                  const xPos = x + slideText.x;
                  const v = repellingTextVectors.current[j];

                  const d = yPos - heightRef.current * 0.5;

                  let newDistance = d; //Math.pow(Math.abs(d), 1.2)/4;

                  const sinMod = Math.sin(d * 0.01) * 40;
                  if (j === 0) {
                     //  console.log(yPos, sinMod)
                  }

                  // let newDistance = Math.pow(Math.abs(d*2), 2)/9999; //very cool cascade of appearences because distnace is tightend so much

                  //this combo has cool bouncing back effect (never goes above halfway)
                  //   let newDistance = d
                  //    if (d < 0) {
                  //       newDistance *= -1;
                  //    }

                  // let modDistance = Math.pow(Math.abs(newDistance),1.2)*10

                  //  if(newDistance < 0)modDistance *= -1

                  const newY = heightRef.current * 0.5 + newDistance;

                  //simple const newY = heightRef.current * 0.5 + newDistance

                  const yDiff = newY - yPos;

                  //const yMod = Math.pow(Math.abs(d*0.1), 2)*0.

                  // if( d < 0){
                  //    console.log("neg d", d)
                  //    newY = `calc(-50% + ${yMod}px)`
                  // }
                  const dx = Math.abs(widthRef.current * 0.5 - xPos);
                  const limit = Math.max(heightRef.current * 0.2, 120);
                  const el = clones[j - lowIndex];

                  const darkness = Math.min(
                     Math.max(Math.abs(d) - limit, 0) * 0.0065,
                     1
                  );

                  const newColor = blendRgb(
                     slidingTextColors[colorSet],
                     bgColors[formatingIndex.current],
                     darkness
                  );
                  newColor[3] = 1;
                  el.style.color = formatRgbArr(newColor);

                  if (d > limit * 2) {
                     v.x = xPos;
                     v.y = yPos;
                     if (!v.outOfBounds) {
                        v.outOfBounds = true;
                        // el.style.color = formatRgbArr(bgColors[formatingIndex.current]);
                     }
                     continue;
                  } else {
                     v.outOfBounds = false;
                  }

                  // const left = `calc(-50% + ${d*0.1}px)`


                  const scale = 0.9 + Math.max(Math.abs(d), 50) * 0.0018;

                  const sign = sinMod < 0 ? "-" : "+";

                  const transLeft = `calc(-50% ${sign} ${Math.round(
                     Math.abs(sinMod)
                  )}px)`; //using % instead of px would scale deviance with word width
                  // if (j == 6) {
                  //    console.log(xPos, yPos, transLeft);
                  // }

                  el.style.transform = `translate(${transLeft}, -50%) scale(${scale}) rotate(${
                     -sinMod * 0.0
                  }deg)`;

                  v.x = xPos + sinMod;
                  v.y = yPos;
               }
            }}
         >
            {data.items.map((e, i) => {
               const index = lowIndex + i;

               const fontSize =
                  e.style.fontSize || 80 / Math.pow(e.text.length, 0.4);

               return (
                  <div
                     ref={(ref) => {
                        slideTextRefs.current[index] = ref;
                     }}
                     key={"repeller" + index}
                     style={{
                        ...e.style,
                        position: "absolute",
                        display: "block",
                        color: formatRgbArr(bgColors[formatingIndex.current]),
                        fontWeight: 800,
                        fontSize,
                        transform: "translate(-50%,-50%)",
                     
                     }}
                  >
                     {e.text}
                  </div>
               );
            })}
         </MirrorElement>
      );
   };

   const initReppellerGroups = (repelSets) => {
      const repelGroups = [];
      let repelIndex = 0;
      for (var i = 0; i < repelSets.length; i++) {
         //    console.log("repelindex", repelIndex);
         repelGroups.push(buildReppellerGroup(repelSets[i], i, repelIndex));
         repelIndex += repelSets[i].items.length;
      }

      return repelGroups;
   };

   // const repellerGroup1 = useMemo(
   //    () => buildReppellerGroup(repellerData1, 0),
   //    []
   // );
   // const repellerGroup2 = useMemo(
   //    () => buildReppellerGroup(repellerData2, repellerData1.items.length),
   //    []
   // );

   //have to manually set infex points. problem with re-rendering children pushing too many items into vector/tracker array

   const repelGroups = useMemo(() => {
      return initReppellerGroups([
         repellerData1,
         repellerData2,
         repellerData3,
         repellerData4,
         repellerData5,
      ]);
   }, []);

   const [
      repellerGroup1,
      repellerGroup2,
      repellerGroup3,
      repellerGroup4,
      repellerGroup5,
   ] = repelGroups;

   // const repellerGroup1 = buildReppellerGroup(repellerData1, 0, 0);
   // const repellerGroup2 = buildReppellerGroup(
   //    repellerData2,
   //    1,
   //    repellerData1.items.length
   // );
   // const repellerGroup3 = buildReppellerGroup(
   //    repellerData3,
   //    2,
   //    repellerData1.items.length + repellerData2.items.length
   // );
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
               style={{
                  position: "relative",
                  visibility: hidePlayText ? "hidden" : "visible",
               }}
               dominantIn={(dir) => {
                  if (hidePlayText) return;
                  setTextIndex(0);
                  changeFormat(0);
               }}
            >
               <div> {repellerGroup1}</div>
            </Sticky>

            <Sticky
               style={{
                  position: "relative",
                  visibility: hidePlayText ? "hidden" : "visible",
               }}
               dominantIn={() => {
                  if (hidePlayText) return;
                  setTextIndex(1);
                  changeFormat(1);
               }}
               // activeOut={(direction) => setTextIndex(direction === "up" ? 0 : 1)}
               // stickyChild={<div>This is the second sticky</div>}
            >
               {repellerGroup2}
            </Sticky>

            <Sticky
               style={{
                  position: "relative",
                  visibility: hidePlayText ? "hidden" : "visible",
               }}
               dominantIn={() => {
                  if (hidePlayText) return;
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
               style={{
                  position: "relative",
                  visibility: hidePlayText ? "hidden" : "visible",
               }}
               dominantIn={() => {
                  if (hidePlayText) return;
                  // if (textIndex !== 2) {
                  setTextIndex(3);
                  changeFormat(3);
                  setShowProjects(false);
                  //  }
               }}
            >
               {repellerGroup4}
            </Sticky>

            <Sticky
               style={{
                  position: "relative",
                  visibility: hidePlayText ? "hidden" : "visible",
               }}
               dominantIn={() => {
                  if (hidePlayText) return;
                  // if (textIndex !== 2) {
                  setTextIndex(4);
                  changeFormat(4);
                  setShowProjects(false);
                  //  }
               }}
            >
               {repellerGroup5}
            </Sticky>

            <Sticky
               style={{
                  position: "relative",
                  width: "100%",
                  paddingTop: 1000,
                  color: "white",
               }}
               dominantIn={(direction) => {
                  if (hidePlayText) return;
                  setTextIndex(null);
                  setShowProjects(true);
                  changeFormat(5);
               }}
            >
               {/* <MirrorElement lag={!isMobile} tween={0.983}> */}
               <Projects show={showProjects} scrollable={handleScrollable} />
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
            <div style={{ visibility: hidePlayText ? "hidden" : "visible" }}>
               <PlayfulText
                  ascii={ascii}
                  parentRef={playfulTextRef}
                  repellers={repellingTextVectors.current}
                  selectedText={textIndex}
                  textOnDraw={(context, e, dist) => {
                     const d = Math.min(Math.pow(dist, 0.5) * 15, 255);
                     //   // e.rotation = (e.x - e.aim.x) * (e.y - e.aim.y) * -0.008;

                     //    // e.shifting // if letter is tweening
                     const percColorShift = Math.min(
                        Math.pow(d * 0.12, 2) / 270,
                        1
                     );

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

               {!scrolled && (
                  <div className={"downArrowContainer"}>
                     <div
                        className={"downArrow downArrow1"}
                        // style={{
                        //    top: heightRef.current * 0.8 + "px",
                        //    left: "50%",
                        // }}
                     >
                        <img src={arrowDown} />
                     </div>
                     {/* <div
                        className={"downArrow downArrow1"}
                        style={{
                           top: heightRef.current * 0.8 + "px",
                           left: "50%",
                        }}
                     >
                        <img src={arrowDown} />
                     </div>
                     <div
                        className={"downArrow downArrow2"}
                        style={{
                           top: heightRef.current * 0.8 + 40 + "px",
                           left: "50%",
                        }}
                     >
                        <img src={arrowDown} />
                     </div>
                     <div
                        className={"downArrow downArrow3"}
                        style={{
                           top: heightRef.current * 0.8 + 80 + "px",
                           left: "50%",
                        }}
                     >
                        <img src={arrowDown} />
                     </div> */}
                  </div>
               )}
            </div>
         )}
      </div>
   );
};

// console.log1 = function(...args){
//    console.log()

// }

export default Home;
