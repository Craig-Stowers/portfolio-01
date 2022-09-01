import { hasSelectionSupport } from "@testing-library/user-event/dist/utils";
import React, { useEffect, useState, useRef } from "react";

function toRadians(angle) {
   return angle * (Math.PI / 180);
}
function toDegrees(angle) {
   return angle * (180 / Math.PI);
}

const inverseSquare = (num) => {
   return 1 / (num * num);
};

const inverseCube = (num) => {
   return 1 / (num * num * num);
};

const fixAngleTo360 = (num) => {
   if (num < 0) return fixAngleTo360(num + 360);
   if (num > 360) return fixAngleTo360(num - 360);
   return num;
};

const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

const ScaredText = ({ text }) => {
   const textArr = text.split("");

   const [frame, setFrame] = useState(0);

   //const textArr = "ABC".split("");
   const letterRefs = useRef([]);
   const parentRefs = useRef([]);
   const mousePosition = useRef({ x: 0, y: 0 });
   const lastTime = useRef(null);
   const lastScrollPosition = useRef({ x: window.scrollX, y: window.scrollY });
   const animationData = useRef({
      lastScrollY: window.scrollY,
   });

   const [textColors, setTextColors] = useState([]);

   const requestRef = useRef();

   const handleMouseMove = (e) => {
      mousePosition.current.x = e.clientX; //+ window.scrollX;
      mousePosition.current.y = e.clientY; //+ window.scrollY;
   };

   const setOrigins = () => {
      for (var i = 0; i < parentRefs.current.length; i++) {
         const parent = parentRefs.current[i];
         if (!parent.ref) return;
         const rect = parent.ref.getBoundingClientRect();
         parent.x = window.scrollX + rect.left + rect.width * 0.5;
         parent.y = window.scrollY + rect.top + rect.height * 0.5;
      }
   };

   const handleScroll = (e) => {
      const yDiff = window.scrollY - lastScrollPosition.current.y;
      mousePosition.current.y += yDiff;

      lastScrollPosition.current = { x: window.scrollX, y: window.scrollY };

      // console.log("scroll")
   };

   const handleResize = (e) => {
      setOrigins();
   };

   const animate = (time) => {
      requestRef.current = requestAnimationFrame(animate);
      const delta = time - (lastTime.current ? lastTime.current : 0);

      const scrollSpeed = clamp(
         window.scrollY - animationData.current.lastScrollY,
         -80,
         80
      );
      animationData.current.lastScrollY = window.scrollY;

      //setFrame((frame) => frame + 1);

      // if (delta < 16.667) {
      //    return;
      // }

      // console.log(delta);
      lastTime.current = time;
      const mouseX = mousePosition.current.x;
      const mouseY = mousePosition.current.y;

      let newTextColors = [];

      let hasChanged = false;
      const deltaMod = delta * 0.05;

      for (var i = 0; i < letterRefs.current.length; i++) {
         const letterObject = letterRefs.current[i];
         const letter = letterRefs.current[i];
         const parentObject = parentRefs.current[i];
         if (!letterObject) return;

         //distance factor (creates a much stronger "bubble wall"), low values can create cool magnetic waves
         const distFactor = 0.55;
         const mid = {
            x: parentObject.x + letterObject.x * distFactor,
            y: parentObject.y + letterObject.y * distFactor,
         };
         const dx = mid.x - mouseX;
         const dy = mouseY - mid.y;
         const d = Math.sqrt(dx * dx + dy * dy);

         //  letter.alive = true;
         if (!letter.alive) {
            if (d < 3000) {
               letter.alive = true;
               // letter.ref.style.color = "green";
            } else {
               continue;
            }
         }

         letter.y -= scrollSpeed * 0.5;

         //maybe better to limit speed, than limit force
         //push text
         // if (d < 700) {
         const angle = Math.atan2(dx, dy) * (180 / Math.PI);
         let pushForce = (1 / (d * d * d)) * 1099900;
         pushForce = Math.round(pushForce * 100) / 100;
         if (pushForce < 0) pushForce = 0;
         const pushX = Math.sin(angle * (Math.PI / 180)) * pushForce;
         const pushY = -Math.cos(angle * (Math.PI / 180)) * pushForce;
         letter.mx += pushX * deltaMod;
         letter.my += pushY * deltaMod;
         // }

         const angleOrigin = Math.atan2(letter.x, letter.y) * (180 / Math.PI);
         const distOrigin = Math.sqrt(
            letter.x * letter.x + letter.y * letter.y
         );

         //speeds up the return
         //higher power(exponent) changes strength profile, so the tug exponentially gets stronger
         let pullForce = distOrigin;
         //pullForce = Math.min(pullForce, 300);
         // console.log(pullForce)
         const pullX = -Math.sin(angleOrigin * (Math.PI / 180)) * pullForce;
         const pullY = -Math.cos(angleOrigin * (Math.PI / 180)) * pullForce;

         // tune to remove spring shake when returning
         //having higher restricts bubble from expanding too much
         //  letter.x += (pullX * (0.22)) //* deltaMod;
         //  letter.y += (pullY * (0.22)) //* deltaMod;
         //needed to counter the mx/my already set. If too strong it will do spring wobble. If too weak it won't fix any old momentum and allow the above lines to work.
         letter.mx += pullX * 0.01 * deltaMod;
         letter.my += pullY * 0.01 * deltaMod;

         //damper. also reduces spring bounce, but also slows all movement "thickens" the space
         //effects push AND PULL, while abbove .x.y mod only effects pull
         const decayTween = 0.01;
         const decayTweenDelta = 1 - Math.pow(1 - decayTween, delta);

         letter.mx = letter.mx + -letter.mx * decayTweenDelta;
         letter.my = letter.my + -letter.my * decayTweenDelta;

         // letter.mx *=0.98
         // letter.my *= 0.98;
         // if(i === 1 ){
         //    console.log(xd, yd, d, mid, mouseX, mouseY);
         // }

         const vel = Math.sqrt(letter.mx * letter.mx + letter.my * letter.my);
         if (vel !== 0) {
            const limitVel = Math.min(vel, 60);
            const limitRatio = limitVel / vel;
            letter.mx *= limitRatio;
            letter.my *= limitRatio;
         }

         //still delta mod .x/.y because mx is always changing and modifying the mx change (as above) is not sufficient to apply delta penalty
         letter.x += letter.mx * deltaMod;
         letter.y += letter.my * deltaMod;

         if (
            distOrigin < 0.1 &&
            Math.abs(letter.mx < 0.1) &&
            Math.abs(letter.my) < 0.1
         ) {
            letter.alive = false;
            letter.x = 0;
            letter.y = 0;
            // letter.ref.style.color = "red";
         }

         // let change = (0 - letterObject.yPos) * (0.05 * (delta / 10));
         // if (change > 0 && change < 0.1) {
         //    change = 0.1;
         // }
         // if (change < 0 && change > -0.1) {
         //    change = -0.1;
         // }

         // letterObject.yPos += change;

         // if (Math.abs(letterObject.yPos) < 0.1) {
         //    letterObject.yPos = 0;
         // }

         // const xSpeed =
         //    Math.sin(letterObject.heading * (Math.PI / 180)) *
         //    letterObject.speed;
         // const ySpeed =
         //    -Math.cos(letterObject.heading * (Math.PI / 180)) *
         //    letterObject.speed;

         // if(Math.abs(letter.x) < 0.01 && Math.abs(letter.mx) < 0.01 ){
         //    letter.x = 0;
         //    letter.alive = false;
         // }
         // if(Math.abs(letter.y) < 0.01 && Math.abs(letter.my) < 0.01 ){
         //    letter.y = 0;
         //    letter.alive = false;

         // }

         // const r = Math.max(letter.x, 0)
         // const g = Math.abs(Math.min(letter.x, 0))
         // const b = Math.abs(letter.y);

         const angleTo360 = fixAngleTo360(angleOrigin + 0);

         const h = Math.round(angleTo360);
         const s = Math.round(Math.min(10 + distOrigin * 2, 100)) + "%";
         const l =
            Math.round(30 + Math.min(Math.pow(distOrigin, 0.6) * 1.2, 75)) +
            "%";

         const textColor = `hsl(${h},${s},${l})`;

         // if (textColor !== textColors[i]) {
         //    hasChanged = true;
         // }
         // newTextColors[i] = textColor;

         // if (i === 0) {
         letter.ref.style.color = textColor;
         letter.ref.style.zIndex = Math.round(distOrigin);
         // }
         // }
         // letter.ref.style.transform = `scale(${0.8+(distOrigin/200)}) rotate(${rotation}deg)`;
         letter.ref.style.top = Math.round(letter.y * 20) / 20 + "px";
         letter.ref.style.left = Math.round(letter.x * 20) / 20 + "px";
      }

      //setTextColors(newTextColors);

      // console.log(letterRefs)

      // The 'state' will always be the initial value here
   };

   useEffect(() => {
      requestRef.current = requestAnimationFrame(animate);
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("scroll", handleScroll);

      window.addEventListener("resize", handleResize);

      const delaySetup = setTimeout(() => {
         setOrigins();
      }, 500);

      return () => {
         if (delaySetup) clearTimeout(delaySetup);
         document.removeEventListener("mousemove", handleMouseMove);
         window.removeEventListener("resize", handleResize);
         cancelAnimationFrame(requestRef.current);
      };

      // return () => {
      //    clearInterval(timer);
      // };
   }, []);

   return (
      <>
         {textArr.map((e, i) => {
            const char = e === " " ? " " : e;
            return (
               <span
                  className="scaredText"
                  // style={{ marginRight: char === " " ? "0.3em" : "0px" }}
                  key={"p" + i}
                  ref={(ref) => {
                     //const rect = ref.getBoundingClientRect();
                     parentRefs.current.push({
                        ref,
                        //x: rect.left + rect.width * 0.5,
                        //y: rect.top + rect.height * 0.5,
                     });
                  }}
               >
                  <span
                     key={"c" + i}
                     style={{
                        position: "relative",
                        // color: `hsla(${100}, 0%, 10%, 50)`,
                        ignore: char === " ",
                        //display: "inline-block",
                        // opacity:0.1 //slows chrome a lot
                     }}
                     ref={(ref) => {
                        letterRefs.current.push({
                           ref: ref,
                           y: 0,
                           x: 0,
                           mx: 0,
                           my: 0,
                           heading: 0,
                           speed: 0,
                           alive: false,
                           ignore: char === " ",
                        });
                     }}
                  >
                     {char}
                  </span>
               </span>
            );
         })}
      </>
   );
};

export default ScaredText;
