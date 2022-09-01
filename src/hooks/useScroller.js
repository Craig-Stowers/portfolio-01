import { useState, useRef, useLayoutEffect, useEffect } from "react";

const isBrowser = typeof window !== `undefined`;

function getScrollPosition() {
   if (!isBrowser) return { x: 0, y: 0 };
   return { x: window.scrollX, y: window.scrollY };
}

const useScroller = (effect, track, depend = []) => {
   const position = useRef(getScrollPosition());

   useEffect(() => {

      if(track === false)return;
    
     
      const onScroll = (e) => {
         if(track === false)return;
         const prev = position.current;
         position.current = getScrollPosition();
         effect(position.current, prev);     
      };
    
      window.addEventListener("scroll", onScroll, {passive:true});

      return () => window.removeEventListener("scroll", onScroll);
   }, depend);

   // return scrollPosition;
};

export default useScroller;
