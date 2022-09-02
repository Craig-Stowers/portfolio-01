import React, {
   useEffect,
   useCallback,
   useLayoutEffect,
   useRef,
   useState,
} from "react";
import classes from "../pages/HomeStyles.module.css";
import SpanChars from "./SpanChars";
import { funText, getMinimumCharsFromStrings } from "../util/funtext_test";
import useScroller from "../../hooks/useScroller";
import PerspectiveWrapper from "../shared/PerspectiveWrapper";
import Canvas from "../Canvas";
import useWindowSize from "../../hooks/useWindowSize";
import LettersCanvas from "../pages/LettersCanvas";

const scrollDownTriggerPoints = [0, 3000, 6000, 9000, 12000, 15000, 18000];

const debug = false;

const messageStyles = [];

const projectItemStyle = {
   transform: "translate(-50%, 0%)",
   width: "100%",
   maxWidth: 640,

   textAlign: "left",
   top: 20,
   color: "rgba(0,0,0,0)",
};

// messageStyles[3] = projectItemStyle;

const getCSSValues = (element, properties) => {
   const values = {};
   for (let i = 0; i < properties.length; i++) {
      values[properties[i]] = window
         .getComputedStyle(element, null)
         .getPropertyValue(properties[i]);
   }
   return values;
};

// messageStyles[3] = {
//    width: 520,
//    top:"auto",
//    bottom:"50%",
//    textAlign: "left",
//    transform: "translate(-50%, 0%)",
// };
// messageStyles[4] = projectItemStyle;
// messageStyles[5] = projectItemStyle;
// messageStyles[6] = projectItemStyle;
// messageStyles[7] = projectItemStyle;
const PlayfulText = (props) => {
   const [selectedP, setSelectedP] = useState(null);
   const spanCollectionRef = useRef([]);
   const spanCollectionRefFlat = useRef([]);

   const textContainerRefs = useRef([]);
   const [charPoolString, setCharPoolString] = useState("");
   const letterSwitcher = useRef(null);
   const lastTime = useRef(0);
   const requestRef = useRef();
   const playAreaRef = useRef();
   const prevParagraph = useRef(0);

   const compiledGroups = useRef([]);

   const bgColor = useRef(`rgb(100,0,200)`);

   const size = useWindowSize();

   // console.log("?count=100", "render PLAYFULTEXT");
   // console.log("new Playful Text", props.repellers[0].x, props.repellers[1].x )
   // const repellingTextRefs = useRef(props.repellers.current);

   useEffect(() => {
      setSelectedP(props.selectedText);
   }, [props.selectedText]);

   // useScroller(({ x, y }, { x: prevX, y: prevY }) => {
   //    const paragraph = scrollDownTriggerPoints.reduce((prev, curr, i, arr) => {
   //       return y > curr ? i : prev;
   //    }, 0);

   //    if (letterSwitcher.current) {
   //       letterSwitcher.current.scrollChange(y - prevY);
   //    }
   //    // setSelectedP(paragraph);
   // });

   const animate = (time) => {
      //requestRef.current = requestAnimationFrame(animate);
      // const delta = time - (lastTime.current ? lastTime.current : 0);
      // lastTime.current = time;
      // letterSwitcher.current.update(delta);
   };

   const compileGroups = useCallback(() => {
      compiledGroups.current = [];

      console.log("compile groups");

      for (let i = 0; i < spanCollectionRefFlat.current.length; i++) {
         const group = spanCollectionRefFlat.current[i];
         const compiledGroup = [];

         for (let j = 0; j < group.length; j++) {
            const span = group[j];
            const char = span.innerText;
            if (char !== " ") {
               const rect = span.getBoundingClientRect();
               const x = rect.left + rect.width * 0.5; //- playArea.x;
               const y = rect.top + rect.height * 0.8; // - playArea.y;

               const values = getCSSValues(span, [
                  "font-size",
                  "font-weight",
                  "color",
               ]);

               const letterObject = {
                  char,
                  color: values["color"],
                  fontWeight: parseFloat(values["font-weight"]),
                  fontSize: parseFloat(values["font-size"]),
                  x,
                  y,
                  element: span,
               };
               compiledGroup.push(letterObject);
            }
         }
         compiledGroups.current.push(compiledGroup);
      }
   }, []);

   useEffect(() => {
      if (letterSwitcher.current) {
         // const x = playAreaRef.current.clientWidth * 0.5;
         // const y = playAreaRef.current.clientHeight * 0.5;
         letterSwitcher.current.resize({
            x: size.width * 0.5,
            y: size.height * 0.5,
         });
      }

      compileGroups();
   }, [size]);

   useEffect(() => {
      console.log("repellers", props.repellers);
      const spanGroupsToStrings = spanCollectionRefFlat.current.map((group) => {
         return group
            .map((obj) => {
               return obj.innerText === " " ? "" : obj.innerText;
            })
            .join("");
      });
      const minChars = getMinimumCharsFromStrings(spanGroupsToStrings);

      // console.log("minChars", minChars);
      setCharPoolString(minChars);

      //const minChars2 = getMinimumCharsFromStrings(spanGroupsToStrings);

      if (letterSwitcher.current) {
         console.log("alt kill");
         letterSwitcher.current.kill();
      }

      if (!letterSwitcher.current) {
         console.log("##############NEW FUN TEXT");
         letterSwitcher.current = new funText(
            playAreaRef.current,
            props.repellers,
            (...args) => {
               props.textOnDraw(...args);

               // const d = Math.min(Math.pow(distance, 0.6) * 16, 255);
               // e.rotation = (e.x - e.aim.x) * (e.y - e.aim.y) * -0.008;

               // if (e.shifting) {
               //    e.element.style.color = `rgb(255,100,0)`;
               // } else {
               //    // e.element.style.color = `rgb(${d * 2},${d / 2},${0})`;
               // }

               // e.element.style.transform = `translate(-50%,-50%) rotate(${
               //    e.rotation * 0.15
               // }deg)`;
            }
         );
      }

      letterSwitcher.current.allLetters(minChars);

      //letterSwitcher.current.setTrackers([...letterPoolSpans.current]);
      // requestRef.current = requestAnimationFrame(animate);
      // window.addEventListener("resize", handleResize);
      return () => {
         letterSwitcher.current.kill();
         letterSwitcher.current = null;
         // window.removeEventListener("resize", handleResize);
         cancelAnimationFrame(requestRef.current);
      };
   }, []);

   useEffect(() => {
      const x = playAreaRef.current.clientWidth * 0.5;
      const y = playAreaRef.current.clientHeight * 0.5;

      if (selectedP === "exitdown") {
         console.log("queue exitdown");
         letterSwitcher.current.queueTargets([], { x, y }, "down");
         prevParagraph.current = 0;
         return;
      }

      if (selectedP === null) {
         console.log("queue null");
         letterSwitcher.current.queueTargets([], { x, y }, "down");
         prevParagraph.current = 0;
         return;
      }

      const { left, top, width, height } =
         textContainerRefs.current[selectedP].getBoundingClientRect();
      const centrePoint = { x: left + width * 0.5, y: top + height * 0.5 };

      // console.log("?track=queue targets", x, y);

      letterSwitcher.current.queueTargets(
         [...compiledGroups.current[selectedP]],
         { x, y },
         selectedP > prevParagraph.current ? "down" : "up"
      );

      // letterSwitcher.current.queueTargets(
      //    [...spanCollectionRefFlat.current[selectedP]],
      //    { x, y },
      //    selectedP > prevParagraph.current ? "down" : "up"
      // );
      prevParagraph.current = selectedP;
   }, [selectedP, spanCollectionRef]);

   const handleSpanRefs = (refs, paragraphIndex, group) => {
      if (!spanCollectionRef.current[paragraphIndex])
         spanCollectionRef.current[paragraphIndex] = [];
      spanCollectionRef.current[paragraphIndex][group] = [...refs];
      spanCollectionRefFlat.current[paragraphIndex] =
         spanCollectionRef.current[paragraphIndex].flat();

      if (selectedP === null) {
         setSelectedP(0);
      }
   };

   // const handleCharPoolRefs = (refs) => {
   //    if (letterSwitcher.current) {
   //       letterSwitcher.current.setTrackers([...refs]);
   //    }
   // };

   // if(!ascii.current)return <></>
   var time = new Date();
   var curHr = time.getHours();

   let greeting = "Good morning!";
   if (curHr >= 12) greeting = "Good afternoon!";
   if (curHr >= 18) greeting = "Good evening!";

   const getMessages = useCallback(() => {
      return [
         <>
            <div style={{marginTop:-30}}>
               <div
                  style={{
                     fontSize: 50,
                     letterSpacing: 1,
                     fontWeight: 600,
                     padding: 20,
                     maxWidth: 800,
                     marginLeft: "auto",
                     marginRight: "auto",
                  }}
               >
                  <SpanChars
                     onSpanRefs={(refs) => {
                        handleSpanRefs(refs, 0, 0);
                        console.log("handle spans");
                     }}
                  >
                    Hello.
                  </SpanChars>
               </div>
               
               <div
                  style={{
                     fontSize: 90,
                     letterSpacing: 4,
                     fontWeight: 800,
                     padding: 20,
                     maxWidth: 800,
                     marginLeft: "auto",
                     marginRight: "auto",
                  }}
               >
                  <SpanChars
                     onSpanRefs={(refs) => {
                        handleSpanRefs(refs, 0, 1);
                     }}
                  >
                     I’m Craig.
                  </SpanChars>
               </div>
               {/* <div>
                  <SpanChars onSpanRefs={(refs) => handleSpanRefs(refs, 0, 1)}>
                  {ASCII[1]}
                  </SpanChars>
               </div>
               */}
            </div>
         </>,

         <div
            style={{
               width: "100%",
               maxWidth: 880,
               marginLeft: "auto",
               marginRight: "auto",
               padding: 14,
            }}
         >
            <div
               style={{
                  fontSize: 34,
                  fontWeight: 500,
                  lineHeight: "44px",
               }}
            >
               <SpanChars onSpanRefs={(refs) => handleSpanRefs(refs, 1, 0)}>
                  I’m a developer with 10 years experience building engaging
                  software across a variety of industries.
               </SpanChars>{" "}
            </div>
            <div
               style={{
                  fontSize: 24,
                  fontWeight: 400,
                  marginTop: 80,
               }}
            >
               <SpanChars onSpanRefs={(refs) => handleSpanRefs(refs, 1, 1)}>
                  (currently freelancing in Melbourne)
               </SpanChars>{" "}
            </div>
         </div>,

         <>
            <div
               style={{
                  fontSize: 34,
                  fontWeight: 500,

                  maxWidth: 900,
                  marginLeft: "auto",
                  marginRight: "auto",
                  lineHeight: "44px",
                  padding: 14,
               }}
            >
               <SpanChars onSpanRefs={(refs) => handleSpanRefs(refs, 2, 0)}>
                  I’m familiar with many tools & frameworks and keen to learn
                  whichever new technology is best suited to each project.
               </SpanChars>
            </div>
         </>,
         <>
            <h1
               style={{
                  fontWeight: 500,
                  fontSize: 34,
                  lineHeight: "44px",
                  padding: 14,
                  maxWidth: 960,
                  marginLeft: "auto",
                  marginRight: "auto",
               }}
            >
               <SpanChars onSpanRefs={(refs) => handleSpanRefs(refs, 3, 0)}>
                  I’m all about coding front end experiences, but I have bonus
                  skills which come in handy...
               </SpanChars>
            </h1>
         </>,

         <>
            <div
               style={{
                  fontWeight: 300,
                  fontSize: 47,
                  color: "white",
                  lineHeight: "44px",
                  padding: 14,
                  marginLeft: "auto",
                  marginRight: "auto",
               }}
            >
               <SpanChars onSpanRefs={(refs) => handleSpanRefs(refs, 4, 0)}>
                  A few places I’ve worked...
               </SpanChars>
            </div>
         </>,
      ];
   }, []);

   const messages = getMessages();

   return (
      <div
         className={`${classes.Home} ${classes.playfulText}`}
         style={{ position: "fixed" }}
      >
         <div
            ref={playAreaRef}
            className={classes.playArea}
            style={{
               height: size.height,
               display: "flex",
            }}
         >
            {messages.map((message, i) => {
               return (
                  <div
                     ref={(ref) => textContainerRefs.current.push(ref)}
                     key={"message" + i}
                     className={`${classes.hoverText}`}
                     style={{
                        ...messageStyles[i],
                        opacity: debug && selectedP === i ? 1 : 0,
                     }}
                  >
                     {message}
                  </div>
               );
            })}
         </div>

         <LettersCanvas
            draw={useCallback((...args) => {
               // const ctx = args[0].context;
               // ctx.beginPath();

               // ctx.fillStyle = bgColor.current;
               // ctx.rect(0, 0, 2000, 2000);
               // ctx.fill();

               letterSwitcher.current.draw(...args);
            }, [])}
         />

         {/* <div
            ref={props.parentRef}
            style={{
               position: "fixed",
               top: 0,
               left: "50%",
               transform: "translateX(-50%)",
               width: "100vw",
               height: "100vh",
               maxWidth: 1200,
               zIndex: 3000,
            }}
         >
            <PerspectiveWrapper
               style={{
                  top: 0,

                  transform: "translate(-25%,-25%)",

                  zIndex: 2001,
               }}
            >
               <div
                  className={classes.trackerText}
                  style={{
                     wordBreak: "break-all",
                     zIndex: 2000,

                     height: "200vh",
                     width: "200vw",
                     maxWidth: "2400px",
                  }}
               >
                  <SpanChars onSpanRefs={handleCharPoolRefs} absolute initStyle={{opacity:0}}>
                     {charPoolString}
                  </SpanChars>
               </div>
            </PerspectiveWrapper>
         </div> */}
      </div>
   );
};
export default React.memo(PlayfulText);
