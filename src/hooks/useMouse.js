import { useState, useRef, useLayoutEffect, useEffect } from "react";


const useMouse = (effect) => {

   const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
 
   const onMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
   };

   useLayoutEffect(() => {
      window.addEventListener("mousemove", onMouseMove);

      return () => window.removeEventListener("mousemove", onMouseMove);
   }, []);

 return mousePosition;
};

export default useMouse;
