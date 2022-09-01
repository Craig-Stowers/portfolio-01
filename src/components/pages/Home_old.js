import {
   useEffect,
   useLayoutEffect,
   useCallback,
   useRef,
   useState,
   useMemo,
} from "react";
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
   lagText2,
   lagText3,
   work1,
} from "../../data/scrollText";
import useRequestAnimationFrame from "../../hooks/useRequestAnimationFrame";
import { UNSAFE_LocationContext } from "react-router-dom";

import SharePosition from "../shared/SharePosition";

import MirrorElement from "../shared/MirrorElement";

import ProjectSlider2 from "./ProjectSlider2";

import { ProjectItem } from "./ProjectItem";

import hiddenObjects from "../../images/hidden-objects.png";
import { addTween } from "../../utility/Tweens";
const asciiText = require(`../code/${"bulb"}.txt`);
let debug = false;

const bgColors = [
   [80, 50, 120],
   [180, 69, 100],
   [0, 0, 255],
   [0, 0, 0],
   [0, 0, 0],
   [0, 0, 0],
   [0, 0, 0],
   [0, 0, 0],
];
const slidingTextColors = [
   [0, 255, 200],
   [242, 66, 37],
   [0, 200, 125],
   [0, 200, 125],
   [0, 200, 125],
   [0, 200, 125],
   [0, 200, 125],
   [0, 200, 125],
];
const funTextColors = [
   [255, 0, 255],
   [100, 255, 49],
   [255, 255, 100],
   [6, 223, 232],
   [27, 254, 73],
   [221, 0, 81],
   [252, 246, 104],
   [209, 249, 255],
];

const formatRgbArr = (rgb) => {
   return `rgba(${rgb[0]},${rgb[1]},${rgb[2]}, 1)`;
};

const baseStyle1 = {
   position: "absolute",
   transform: "translate(-50%,-50%)",
   fontSize: "auto",
   fontWeight: 700,
   textAlign: "center",
   color: formatRgbArr(slidingTextColors[0]),
};

const baseStyle2 = {
   ...baseStyle1,
   color: formatRgbArr(slidingTextColors[1]),
};
const baseStyle3 = {
   ...baseStyle1,
   color: formatRgbArr(slidingTextColors[2]),
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

const addBaseStyle = (arr, style) => {
   arr.forEach((e) => {
      const oldStyle = e.style;
      e.style = {
         ...style,
         ...oldStyle,
      };
   });
};

const setTopSpacing = (arr, start, spacing) => {
   let height = 0;
   arr.forEach((e, i) => {
      height = start + spacing * i;
      e.style.top = height;
   });
   return height;
};

const Home = ({ changeBackgroundColor }) => {
   const repellingTextVectors = useRef([]);
   const [textIndex, setTextIndex] = useState(null);
   const size = useWindowSize();
   const heightRef = useRef(size.height);
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
   const tracking = useRef([{}]);

   useRequestAnimationFrame((delta) => {
      const targetColor = funTextColors[formatingIndex.current];
      funTextColorRef.current = blendRgb(
         funTextColorRef.current,
         targetColor,
         0.01
      );
   });

   useEffect(() => {
      heightRef.current = size.height;
   }, [size]);

   useEffect(() => {
      fetch(asciiText)
         .then((t) => t.text())
         .then((text) => {
            setAscii(text);
            setShowPlayText(true);
         });
   }, []);

   // addBaseStyle(lagText1, baseStyle1);
   // addBaseStyle(lagText2, baseStyle2);
   // addBaseStyle(lagText3, baseStyle3);
   // addBaseStyle(work1, baseStyle3);
   // addBaseStyle(lagText4, baseStyle3);

   // const height1 = setTopSpacing(lagText1, 1200, 500) + 1400;
   // const height2 = setTopSpacing(lagText2, 1600, 500) + 1400;
   // const height3 = setTopSpacing(lagText3, 1200, 600) + 900;

   // const height4 = 2000; //setTopSpacing(lagText4, 600, 120) + 400;

   const getLagText = (lagText, startIndex) => {
      return lagText.map((e, i) => {
         let power = 100;
         let weight = 1;
         const vectorIndex = startIndex + i;
         if (lagText[i].type != "object") {
            const style = lagText[i].style;
            if (!lagTextSpans.current[vectorIndex]) {
               lagTextSpans.current[vectorIndex] = [];
            }

            if (style.fontSize === "auto") {
               lagText[i].style.fontSize = Math.max(
                  120 / Math.pow(lagText[i].text.length, 0.5),
                  20
               );
            }
            power =
               lagText[i].power ||
               Math.pow(lagText[i].text.length, 1.5) *
                  lagText[i].style.fontSize *
                  0.1;
            weight =
               lagText[i].text.length *
               Math.pow(lagText[i].style.fontSize, 2) *
               0.0002;
         }

         if (!!!lagText[i].repeller) {
            repellingTextVectors.current[vectorIndex] = new Vector(0, 0);
            repellingTextVectors.current[vectorIndex].power = power;
         }

         return (
            <LagElement
               key={"lag" + i}
               track={i === 0}
               //used to put limtis on the target "ghost" element
               setTargetPosition={(fixedPosition, element) => {
                  // const destinationY = limitNumberRange(
                  //    fixedPosition.y + fixedPosition.height * 0.5,
                  //    -2000,
                  //    2000
                  // );

                  const newY = lagText[i].mod
                     ? lagText[i].mod(
                          fixedPosition.y,
                          heightRef.current,
                          element
                       )
                     : fixedPosition.y;

                  return [
                     fixedPosition.x + fixedPosition.width * 0.5,
                     newY + fixedPosition.height * 0.5,
                  ];
               }}
               //overrides default catch up logic (returns value of attached element)
               onMove={(current, target, delta, element) => {
                  // let targetY = lagText[i].modMove
                  //    ? lagText[i].modMove(
                  //         current,
                  //         target,
                  //         heightRef.current,
                  //         delta,
                  //         element
                  //      )
                  //    : target.y;

                  // if(lagText[i].modMove)lagText[i].mode
                  // const yDiff = target.y - 420;
                  // const plusMinus = yDiff < 0 ? -1 : 1;
                  // //slow down towards middle

                  // let modTarget =
                  //    420 + plusMinus * Math.pow(Math.abs(yDiff), 1.3) * 0.09;

                  // let modTarget = target.y;

                  // if (lagText[i].yLimitLow && lagText[i].yLimitHigh) {
                  //    falseTarget = clamp(
                  //       modTarget,
                  //       lagText[i].yLimitLow,
                  //       lagText[i].yLimitHigh
                  //    );
                  // }

                  const dx = target.x - current.x;
                  // const dy = targetY - current.y;
                  const dy = target.y - current.y;
                  // const damp = 0.98 + Math.pow(weight, 0.5) * 0.0049;
                  const tween = 1 - Math.pow(0.95, delta);
                  const newY = current.y + dy * tween;

                  return [current.x + dx * tween, newY];
                  // return [target.x, target.y]
               }}
               onMoveEnd={(position, element) => {
                  if (lagText[i].expandSpans) {
                     // const yDiff = position.y - heightRef.current * 0.5;
                     // const d = Math.max(Math.abs(yDiff) - 30, 0);
                     // const sin = Math.sin(toRadians(d * 0.15));
                     // const margin = Math.pow(sin * 20, 1.3);
                     // const fontSize = lagText[i].style.fontSize;
                     // const marginMod = (margin * fontSize) / 90;
                     // const posNeg = yDiff < 0 ? 1 : -1;
                     // // console.log("font size", fontSize)
                     // const spans = lagTextSpans.current[vectorIndex];
                     // for (let j = 0; j < spans.length; j++) {
                     //    const e = spans[j];
                     //   if (j < spans.length - 1) {
                     //       e.style.marginRight = marginMod - 3 + "px";
                     //   }
                     //    e.style.opacity = 2.6 - d * 0.008;
                     //    const zeroMidIndex = j + 0.5 - spans.length * 0.5;
                     // }
                  }

                  if (lagText[i].onMoveEnd) {
                     // lagText[i].onMoveEnd(position, element, heightRef.current);
                  }

                  //updating arrays which have been passed to funtext class so can be used as repellers
                  if (
                     !lagText[i].ignore &&
                     repellingTextVectors.current[vectorIndex]
                  ) {
                     repellingTextVectors.current[vectorIndex].x = position.x;
                     repellingTextVectors.current[vectorIndex].y = position.y;
                  }
               }}
               style={lagText[i].style}
            >
               {typeof lagText[i].text === "object" && lagText[i].text}

               {typeof lagText[i].text === "string" && (
                  <SpanChars
                     onSpanRefs={(refs) => {
                        lagTextSpans.current[vectorIndex] = refs;
                     }}
                  >
                     {lagText[i].text}
                  </SpanChars>
               )}
            </LagElement>
         );
      });
   };

   const changeFormat = (i) => {
      formatingIndex.current = i;
      changeBackgroundColor(formatRgbArr(bgColors[i]));
   };

   // const lagComponents1 = getLagText(lagText1, 0);
   // const lagComponents1 = useMemo(() => getLagText(lagText1, 0), []);
   // const lagComponents2 = useMemo(
   //    () => getLagText(lagText2, lagText1.length),
   //    []
   // );
   // const lagComponents3 = useMemo(
   //    () => getLagText(lagText3, lagText1.length + lagText2.length),
   //    []
   // );

   // const lagComponents4 = getLagText(
   //    lagText4,
   //    lagText1.length + lagText2.length + lagText3.length
   // );

   // const work1lag = getLagText(
   //    work1,
   //    lagText1.length + lagText2.length + lagText3.length
   // );

   // const lagComponents1 = useMemo(() => getLagText(lagText1, 0), []);

   const buildReppellerGroup = (items) => {
      return (
         <MirrorElement
            lag={true}
            style={{
               fontSize: 40,
               marginTop: 500,
               backgroundColor: "#44882240",
            }}
            onMove={(x, y) => {
               if (!repellingTextVectors.current[0])
                  repellingTextVectors.current[0] = new Vector(0, 0);
               repellingTextVectors.current[0].power = 19;

               repellingTextVectors.current[0].x = x + tracking.current[0].x;
               repellingTextVectors.current[0].y = y + tracking.current[0].y;

            
            }}
         >
            <SharePosition
               style={{
                  position: "relative",
                  display: "inline-block",
                  top: 0,
                  left: 0,
               }}
               onRelative={() => {}}
               storeData={tracking.current[0]}
            >
               TEST
            </SharePosition>
            <div style={{ position: "relative", top: 1000 }}>like</div>
            <div style={{ position: "relative", top: 1500 }}>to</div>
            <div style={{ position: "relative", top: 2000 }}>build</div>
            <div style={{ position: "relative", top: 2500 }}>things</div>
            <div style={{ position: "relative", top: 3000 }}>for</div>
            <div style={{ position: "relative", top: 3500 }}>the</div>
            <div style={{ position: "relative", top: 4000 }}>web</div>
         </MirrorElement>
      );
   };

   const repellerGroup1 = buildReppellerGroup(repellerData1);

   return (
      <div className={classes.Home}>
         <Sticky
            style={{
               height: 700,
               width: "100%",
            }}
            dominantIn={(dir) => {
               setTextIndex(0);
               changeFormat(0);
            }}
            // stickyChild={<div>This is the first sticky</div>}
         >
            {repellerGroup1}
         </Sticky>

         {/* <Sticky
            style={{
               height: height2,
               width: "100%",
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
            {lagComponents2}
         </Sticky>

         <Sticky
            style={{ position: "relative", height: height3, width: "100%" }}
            dominantIn={() => {
               if (textIndex !== 2) {
                  setTextIndex(2);
                  changeFormat(2);
               }

               // followProjects.current = false;
               // lockTextToProjects.current = false;

               // const tweenParams = {
               //    duration: 500,
               //    type: "ease-in-out",
               //    callback: (percIncr) => {
               //       playfulTextY.current +=
               //          (0 - playfulTextY.current) * percIncr;

               //       playfulTextRef.current.style.top =
               //          playfulTextY.current + "px";
               //    },
               //    onComplete: () => {
               //       //lockTextToProjects.current = true;
               //    },
               // };
               // if (tracking.current.followTween)
               //    tracking.current.followTween.remove();
               // if (tracking.current.returnTween)
               //    tracking.current.returnTween.remove();
               // tracking.current.returnTween = addTween(tweenParams);
            }}
         >
            {lagComponents3}
         </Sticky> */}

         <Sticky
            style={{
               position: "relative",
               height: "200vh",
               width: "100%",
            }}
            dominantIn={(direction) => {
               if (textIndex !== 3) {
                  setTextIndex(3);
                  changeFormat(3);
                  // setProjectFocus(1);
               }

               // followProjects.current = true;
               // lockTextToProjects.current = false;

               // const tweenParams = {
               //    duration: 500,
               //    type: "ease-in-out",
               //    callback: (percIncr) => {
               //       playfulTextY.current +=
               //          (projectImagesY.current - playfulTextY.current) *
               //          percIncr;

               //       playfulTextRef.current.style.top =
               //          playfulTextY.current + "px";
               //    },
               //    onComplete: () => {
               //       lockTextToProjects.current = true;
               //    },
               // };

               // if (tracking.current.returnTween)
               //    tracking.current.returnTween.remove();
               // if (tracking.current.followTween)
               //    tracking.current.followTween.remove();
               // tracking.current.followTween = addTween(tweenParams);

               //
            }}
         >
            {/* <LagElement
               style={{
                  width: "auto",
                  position: "relative",
                  display: "block",
                  top: 300,
               }}
               // onMoveEnd={(position, element) => {
               //    const rect = element.getBoundingClientRect();
               //    //  var x = document. getElementsByClassName('inner');
               //    //  var v = x.getBoundingClientRect();

               //    projectImagesY.current =
               //       position.y - heightRef.current * 0.5 + rect.height + 10;

               //    if (projectImagesY.current > heightRef.current * 0.5 - 90) {
               //       projectImagesY.current = heightRef.current * 0.5 - 90;
               //    }

               //    if (lockTextToProjects.current) {
               //       playfulTextY.current = projectImagesY.current;
               //       playfulTextRef.current.style.top =
               //          playfulTextY.current + "px";
               //    }
               //}}
            > */}
            {/* <img src={hiddenObjects}/> */}

            {/* <ProjectSlider2
                  selectItem={(i) => {
                     setTextIndex(i + 3);
                  }}
               /> */}
            {/* </LagElement> */}

            {/* <LagElement style={{height:100, width:"auto", display:"block"}}>
               <ProjectSlider />
            </LagElement> */}
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

         {showPlayText && (
            <PlayfulText
               ascii={ascii}
               parentRef={playfulTextRef}
               repellers={repellingTextVectors.current}
               selectedText={textIndex}
               textOnDraw={(e, distance) => {
                  const d = Math.min(Math.pow(distance, 0.6) * 10, 255);
                  e.rotation = (e.x - e.aim.x) * (e.y - e.aim.y) * -0.008;

                  // e.shifting // if letter is tweening
                  const percColorShift = Math.min(d / 180, 1);
                  const newColor = blendRgb(
                     funTextColorRef.current,
                     slidingTextColors[formatingIndex.current],
                     percColorShift
                  );
                  e.element.style.color = formatRgbArr(newColor);
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

export default Home;
