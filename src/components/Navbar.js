import "./navbar.css";
import { NavLink } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import Hamburger from "./Hamburger";
import { useMediaQuery } from "react-responsive";

import useClickOutside from "./hooks/useClickOutside";
// Navbar.js
export default function Navbar({ items }) {
   const [showMobileMenu, setShowMobileMenu] = useState(false);
   const sidedrawRef = useRef(null);
   const hamburgerRef = useRef(null);

   const handleMediaQueryChange = (matches) => {
      if (!matches) {
         setShowMobileMenu(false);
      }
      // matches will be true or false based on the value for the media query
   };
   const isMobile = useMediaQuery(
      { maxWidth: 768 },
      undefined,
      handleMediaQueryChange
   );

   useClickOutside([sidedrawRef, hamburgerRef], () => {
      setShowMobileMenu(false);
   });

   const toggleHamburger = () => {
      setShowMobileMenu((show) => {
         if (!show) {
            return true;
         }

         return false;
      });
   };

   useEffect(() => {
      if (showMobileMenu) {
         document.body.classList.add("blur");
      } else {
         document.body.classList.remove("blur");
      }
   }, [showMobileMenu]);

   return (
      <nav className="navigation">
         <NavLink to="/" className="brand-name">
            Craig Stowers
         </NavLink>

         {isMobile && (
            <>
               <Hamburger
                  className="hamburger"
                  handleClick={toggleHamburger}
                  open={showMobileMenu}
                  ref={hamburgerRef}
               />
               <div
                  className={`sidedraw${showMobileMenu ? " open" : ""}`}
                  ref={sidedrawRef}
               >
                  <ol>
                     {items.map((item, i) => {
                        return (
                           <li key={i}>
                              <NavLink
                                 onClick={() => {
                                    setShowMobileMenu(false);
                                 }}
                                 to={item.toLowerCase()}
                                 className={({ isActive }) =>
                                    "navlink" + (!isActive ? " unselected" : "")
                                 }
                              >
                                 {item}
                              </NavLink>
                           </li>
                        );
                     })}

                     {/* <a class="resume-button" href="/resume.pdf" target="_blank" rel="noopener noreferrer">Resume</a> */}
                  </ol>
               </div>
            </>
         )}

         <div className="navigation-menu">
            <ol>
               {items.map((item, i) => {
                  return (
                     <li key={i}>
                        <NavLink
                           to={item.toLowerCase()}
                           className={({ isActive }) =>
                              "navlink" + (!isActive ? " unselected" : "")
                           }
                        >
                           <span className="spinreel">
                              <CharsToSpans chars={item} />
                           </span>
                        </NavLink>
                     </li>
                  );
               })}

               {/* <a class="resume-button" href="/resume.pdf" target="_blank" rel="noopener noreferrer">Resume</a> */}
            </ol>
         </div>
      </nav>
   );
}

const CharsToSpans = ({ chars }) => {
   return (
      <>
         {chars.split("").map((char, i) => {
            const style = {
               transitionDelay: i * 26 + "ms",
            };
            return (
               <span style={style} key={i}>
                  {char}
               </span>
            );
         })}
      </>
   );
};
