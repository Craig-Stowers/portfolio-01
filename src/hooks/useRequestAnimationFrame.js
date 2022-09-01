import {
   useState,
   useRef,
   useCallback,
   useLayoutEffect,
   useEffect,
} from "react";

const useRequestAnimationFrame = (effect, fps, depend) => {
   const requestRef = useRef(null);
   const lastTimeRef = useRef(null);
   const minimumTime = useRef(fps !== null ? 1000 / fps : null);
  

   const animate = useCallback((time) => {
      requestRef.current = requestAnimationFrame(animate);
      const delta = time - (lastTimeRef.current ? lastTimeRef.current : 0);

      if (minimumTime.current) {
         if (delta < minimumTime.current) return;
      }

      lastTimeRef.current = time;
      effect(delta);
   }, depend);

   useEffect(() => {
      requestRef.current = requestAnimationFrame(animate);
      return () => {
        
         if (requestRef.current) cancelAnimationFrame(requestRef.current);
      };
   }, depend);
};

export default useRequestAnimationFrame;
