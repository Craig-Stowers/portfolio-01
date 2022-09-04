import "./App.css";
import Navbar from "./components/Navbar";
import { Routes, Route } from "react-router-dom";
import React, { useEffect, useLayoutEffect, useState, useRef } from "react";
import "./fonts/OPTIStaines-Extended.otf";
import ProjectsPage from "./components/pages/ProjectsPage";

import CodeBlock from "./components/CodeBlock";
import Home from "./components/pages/Home";

import Swirl from "./components/Swirl";
import {
   BrowserView,
   MobileView,
   isBrowser,
   isMobile,
} from "react-device-detect";
import useWindowSize from "./hooks/useWindowSize";

//require("./utility/Console");

var FontFaceObserver = require("fontfaceobserver");

// let codeSnippets = require.context('./components/code', true);
// let code = codeSnippets(`./${"testcode.txt"}`);

const code = require(`./components/code/${"testcode"}.txt`);

function App() {
   const [showNav, setShowNav] = useState(true);
   const [scrollY, setScrollY] = useState(window.scrollY);
   const parallaxRef1 = useRef(null);
   const parallaxRef2 = useRef(null);

   const [codeString, setCodeString] = useState("");
   const [fontsLoaded, setFontsLoaded] = useState(false);
   const appRef = useRef(null);
   const [bgColor, setBgColor] = useState(null);

   const [welcomeImageHeight, setWelcomeImageHeight] = useState(null);
   const [showEnterButton, setShowEnterButton] = useState(false);
   const [hideEnterButton, setHideEnterButton] = useState(true);
   const startExit = useRef(null);
   const [showIntro, setShowIntro] = useState(true);

   const size = useWindowSize();

   console.log("app size", size);

   useEffect(() => {
      var font = new FontFaceObserver("Albert Sans");
      font.load().then(function () {
         setTimeout(() => {
            setFontsLoaded(true);
         }, 0);
      });

      fetch(code)
         .then((t) => t.text())
         .then((text) => {
            setCodeString(text);
         });
   }, []);

   const changeBackgroundColor = (color) => {
      setBgColor(color);
   };
   // useLayoutEffect(() => {
   //    let oldY = window.scrollY;

   //    let showNavTimer = null;

   //    const handleScroll = (e) => {
   //       if (window.scrollY > oldY && window.scrollY > 40) {
   //          setShowNav(false);
   //          clearTimeout(showNavTimer);
   //          showNavTimer = null;
   //       } else {
   //          if (!showNavTimer) {
   //             showNavTimer = setTimeout(() => {
   //                setShowNav(true);
   //             }, 50);
   //          }
   //       }

   //       // console.log(e);
   //       oldY = window.scrollY;
   //       parallaxRef1.current.style.top = -oldY * 0.3 + "px";
   //       parallaxRef2.current.style.top = -oldY * 0.14 + "px";
   //       setScrollY(oldY);
   //    };

   //    document.addEventListener("scroll", handleScroll);

   //    return () => document.removeEventListener("scroll", handleScroll);

   // }, []);

   // const swirl = React.useMemo(
   //    () => (
   //       <Swirl
   //          onImageHeight={(h) => {
   //             setWelcomeImageHeight(h);
   //          }}
   //          onCloseOrbit={() => {
   //             setShowEnterButton(true);
   //          }}
   //          startExit={startExit}
   //          onComplete={() => console.log("complete")}
   //       />
   //    ),
   //    []
   // );

   if (!fontsLoaded) return <></>;

   const enterPosition = `calc(100% - calc( calc(100% - ${welcomeImageHeight}px) / 4))`;

   // return <></>

   return (
      <>
         <div
            className={`App${!showIntro ? " secondaryColor" : ""}`}
            ref={appRef}
         >
            {showIntro && (
               <Swirl
                  onImageHeight={(h) => {
                     setWelcomeImageHeight(h);
                  }}
                  onCloseOrbit={() => {
                     setShowEnterButton(true);
                     setTimeout(() => {
                        setHideEnterButton(false);
                     }, 800);
                  }}
                  startExit={startExit}
                  onComplete={() => {
                     setShowIntro(false);
                  }}
               />
            )}

            {/* {showEnterButton && showIntro && (
               <div
                  className="enter"
                  style={{
                     top: enterPosition,
                     opacity: hideEnterButton ? 0 : 1,
                  }}
                  onClick={(e) => {
                     e.preventDefault();
                     if (startExit.current) startExit.current();
                     setHideEnterButton(true);
                  }}
                  onTouchEnd={(e) => {
                     e.preventDefault();
                     if (startExit.current) startExit.current();
                     setHideEnterButton(true);
                  }}
               >
                  enter
               </div>
            )} */}

            {!showIntro && (
               <div id="content">
                  <Home changeBackgroundColor={changeBackgroundColor} />
               </div>
            )}

            {/* <CodeBlock codeString={codeString} /> */}
            {/* <div className="debug">
            showNav: {showNav ? "true" : "false"} | scrollY: {scrollY}
         </div>
         <div className="parallax1" ref={parallaxRef1}></div>
         <div
            className="parallax2"
            ref={parallaxRef2}
            style={{
               backgroundImage: `url(${background})`,
               backgroundPosition: "center",
               backgroundSize: "50px",
            }}
         ></div>

         <header className={`App-header${!showNav ? " hideNav" : ""}`}>
            <Navbar
               items={[
                  "about",
                  "work",
                  "projects",
                  "snippets",
                  "blog",
                  "contact",
               ]}
            />
         </header> */}

            {/* {true && (
            <h3 style={{ color: "white" }}>
               Mobile version in development. Please open on a desktop browser.
            </h3>
         )} */}

            {/* {true && (
            <div id="content">
               <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="about" element={<About />} />
                  <Route path="work" element={<Work />} />
                  <Route path="projects" element={<ProjectsPage />} />
                  <Route path="snippets" element={<Snippets />} />
                  <Route path="blog" element={<Blog />} />
                  <Route path="contact" element={<Contact />} />
               </Routes>
            </div>
         )} */}

            {/* <div className="water"></div> */}
         </div>
         <div
            style={{
               backgroundColor: bgColor,
               position: "fixed",
               top: "-50vh",
               left: "-50vw",
               width: "200vw",
               height: "200vh",
               zIndex: -1,
               transition: "background-color 500ms",
            }}
         ></div>
      </>
   );
}

export default App;
