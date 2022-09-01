import React, { useEffect, useLayoutEffect, useRef } from "react";
import useScroller from "../../hooks/useScroller";
import useRequestAnimationFrame from "../../hooks/useRequestAnimationFrame";

const LagElement = (props) => {
   const origin = useRef({});
   const fixedPosition = useRef({});
   const lagPosition = useRef({});
   const originalRef = useRef(null);
   const copyRef = useRef(null);
   const animate = useRef(false);

   const setDefaults = () => {
      const rect = originalRef.current.getBoundingClientRect();
      origin.current = {
         width: rect.width,
         height: rect.height,
         x: rect.x + window.scrollX,
         y: rect.y + window.scrollY,
      };
      fixedPosition.current.width = rect.width;
      fixedPosition.current.height = rect.height;
      fixedPosition.current.x = origin.current.x - window.scrollX;
      fixedPosition.current.y = origin.current.y - window.scrollY;

      //  copyRef.current.style.width = rect.width+"px";
   };

   useEffect(() => {
      const onResize = (e) => {
         animate.current = true;
         setDefaults();
      };
      window.addEventListener("resize", onResize);

      window.addEventListener("touchmove", ()=> {
         console.log(window.scrollY)

      })

      // const interval = setInterval(()=>{
      //    animateFrame(16)
      // }, 10)

      return () => {
        // clearInterval(interval);
         window.removeEventListener("resize", onResize);
      };
   }, []);

   useEffect(() => {
      copyRef.current.style.position = "fixed";
      originalRef.current.style.opacity = 0.4;
      //originalRef.current.style.visibility = "hidden";
      setDefaults();
      lagPosition.current.x = fixedPosition.current.x;
      lagPosition.current.y = fixedPosition.current.y;
      if (props.init) props.init(fixedPosition.current);
   }, []);

   // useScroller((curr, prev) => {
   //   // fixedPosition.current.x = origin.current.x - curr.x;
   //   // fixedPosition.current.y = origin.current.y - curr.y;

   //    //   if(fixedPosition.current.y < -800){
   //    //    animate.current = false;
   //    //    return;
   //    //   }
   //    //   if(fixedPosition.current.y > 1200) {
   //    //    animate.current = false;
   //    //    return
   //    //   }
   //    animate.current = true;

   //    // if (fixedPosition.current.y < -600) {
   //    //    fixedPosition.current.y = -600;
   //    // } else {
   //    //    animate.current = true;
   //    // }
   // });

   const getTargetPosition = () => {
      return props.setTargetPosition
         ? props.setTargetPosition(fixedPosition.current, copyRef.current)
         : [fixedPosition.current.x, fixedPosition.current.y];
   };

   const animateFrame= (delta) => {
      //if animation pauses early then vectors not set properly in parent. refactor so following code runs on scroll & init
      //  if (!animate.current) return;

      fixedPosition.current.x = origin.current.x - window.scrollX;
      fixedPosition.current.y = origin.current.y - window.scrollY;

      const [x, y] = getTargetPosition();

      // if( y < -100 ){

      //    return;
      // }
      // if( y > 1000 ){

      //    return;
      // }
      const target = { x, y };

      // if (targetY < 100) {
      //    targetY = 100;
      // }
      // if (lagPosition.current.y < 100) {
      //    lagPosition.current.y = 100;
      //    targetY = 100;
      // }
      // if (props.track) {
      //    //  console.log("ypos", targetY);
      // }

      const dx = target.x - lagPosition.current.x;
      const dy = target.y - lagPosition.current.y;

      if (props.onMove && false) {
         //if onMove exists, it should return new position
         const [newX, newY] = props.onMove(
            lagPosition.current,
            target,
            delta,
            copyRef.current
         );
         lagPosition.current.x = newX;
         lagPosition.current.y = newY;
      } else {
         //default catch up
         const avgSpeed = 0.976;
         const tween = 1 - Math.pow(avgSpeed, delta);
         lagPosition.current.x += dx * tween;
         lagPosition.current.y += dy * tween;
      }
      if (Math.hypot(dx, dy) < 0.25) {
         // animate.current = false;
         // lagPosition.current.x = target.x;
         // lagPosition.current.y = target.y;
      }
      if (props.onMoveEnd && false) {
         props.onMoveEnd(lagPosition.current, copyRef.current);
      }
    
      copyRef.current.style.left = fixedPosition.current.x + "px";
      copyRef.current.style.top = fixedPosition.current.y + "px";
   };

   useRequestAnimationFrame((delta) => {
     animateFrame(delta);
   });

   return (
      <>
         <div ref={originalRef} style={props.style}>
            {props.children}
         </div>
         <div
            ref={copyRef}
            style={{
               ...props.style,
               zIndex: 2000,
            }}
         >
            {props.children}

            {/* {React.cloneElement(props.children, { ref: originalRef })}
         {React.cloneElement(props.children, { ref: copyRef })} */}
         </div>
      </>
   );
};

export default LagElement;
