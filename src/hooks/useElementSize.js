import { useState, useLayoutEffect, useEffect } from "react";

// Hook
function useElementSize(element) {
   // Initialize state with undefined width/height so server and client renders match
   // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
   const [elementSize, setElementSize] = useState({
      width: undefined,
      height: undefined,
   });

   useLayoutEffect(() => {
      // Handler to call on window resize

     

      function handleResize() {
         console.log("handleResize1", element.current)
         if(!element.current)return;
         const rect = element.current.getBoundingClientRect();
       
         // Set window width/height to state
         setElementSize({
            width: rect.width,
            height: rect.height,
         });
      }

      // Add event listener
      window.addEventListener("resize", handleResize);

      // Call handler right away so state gets updated with initial window size
      // setTimeout(()=>{
      //    handleResize();
      // }, 1000)
      handleResize();

     

      // Remove event listener on cleanup
      return () => window.removeEventListener("resize", handleResize);
   }, []); // Empty array ensures that effect is only run on mount

   return elementSize;
}

export default useElementSize;
