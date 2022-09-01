import React, { useEffect, useRef } from "react";
import useRequestAnimationFrame from "../../hooks/useRequestAnimationFrame";
import useWindowSize from "../../hooks/useWindowSize";

const MirrorElement = (props) => {
   const mirrorRef = useRef(null);
   const guideRef = useRef(null);
   const origin = useRef({});
   const mirrorPosition = useRef({ x: 0, y: 0 });
   const oldScreenPosition = useRef({ x: 0, y: 0 });
   const CustomTag = props.tag || "div";
   const size = useWindowSize();

   const oldTime = useRef(Date.now());

   const resize = () => {
      const rect = guideRef.current.getBoundingClientRect();
      origin.current.y = rect.y + window.scrollY;
      origin.current.x = rect.x + window.scrollX;
      if (!mirrorRef.current) return;
      var computedStyle = getComputedStyle(guideRef.current);
      //boundingClient includes padding/borderwhich are already included
      const width = parseFloat(computedStyle.width);
      const height = parseFloat(computedStyle.height);
      mirrorPosition.current.x = rect.x;
      mirrorPosition.current.y = rect.y;
      mirrorRef.current.style.width = width + "px";
      mirrorRef.current.style.height = height + "px";
      oldScreenPosition.current.x = rect.x;
      oldScreenPosition.current.y = rect.y;
      if(props.onMove)props.onMove(rect.x, rect.y);

      // setTimeout(()=>{
      //    props.onMove(rect.x, rect.y);
      // }, 10)
   };

   // useEffect(() => {
   //    setTimeout(() => {
   //       resize();
   //    }, 500);

   

   //    const scrollHandler = () => {
   //       // const newTime = Date.now();
   //       // const delta = newTime - oldTime.current;
   //       // animate(delta)
   //       // oldTime.current = newTime;

   //    };

   //   // window.addEventListener("scroll", scrollHandler);
   // }, []);

   useEffect(() => {
  
      resize();
   }, [size]);

   const animate = () => {

      const newTime = Date.now()
      const delta = newTime - oldTime.current;
      oldTime.current = newTime

      const originScreenX =
         origin.current.x - document.documentElement.scrollLeft;
      const originScreenY = origin.current.y - window.pageYOffset; //document.documentElement.scrollTop;
      let screenX = originScreenX;
      let screenY = originScreenY;

      if (mirrorRef.current) {
         const tweenDecay = props.tween || 0.991;
         const tween = 1 - Math.pow(tweenDecay, delta);
         const moveX = (originScreenX - mirrorPosition.current.x) * tween;
         const moveY = (originScreenY - mirrorPosition.current.y) * tween;
         mirrorPosition.current.x += moveX;
         mirrorPosition.current.y += moveY;
         const newX = (screenX = Math.round(mirrorPosition.current.x * 2) / 2);
         const newY = (screenY = Math.round(mirrorPosition.current.y * 2) / 2);

         mirrorRef.current.style.transform = `translate(${newX}px,${newY}px)`;
      }

      if (props.onMove) {
         if (
            screenX != oldScreenPosition.current.x ||
            screenY != oldScreenPosition.current.y
         ) {
            props.onMove(screenX, screenY);
         }
         oldScreenPosition.current.x = screenX;
         oldScreenPosition.current.y = screenY;
      }
      if (props.onFrame) props.onFrame(screenX, screenY);
   };

   useRequestAnimationFrame(
      (delta) => {
         animate(delta);
      },
      null,
      []
   );

   const clones = [];
   const createClone = (child) => {
      const { recieveData, ...childProps } = child.props;
      const filteredChild = { ...child, props: childProps };
     return React.cloneElement(filteredChild);
   }

   //remove recieveData from children as doublling of child events would upload too much data. i.e the SharedElement sending position twice
   const children = props.children.length ? props.children : [props.children];
   for (var i = 0; i < children.length; i++) {
     
      clones.push(createClone(children[i]));
   }

   return (
      <>
         <CustomTag
            ref={guideRef}
            style={{
               ...props.style,
               visibility: props.lag ? "hidden" : "visible",
            }}
         >
            {clones}
         </CustomTag>

         {props.lag && (
            <CustomTag
               ref={mirrorRef}
               style={{
                  ...props.style,
                  position: "fixed",
                  margin: 0,
                  top: 0,
                  left: 0,
                  boxSizing:"border-box"
               }}
            >
               {props.children}
            </CustomTag>
         )}
      </>
   );
};
export default MirrorElement;
