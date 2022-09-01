import { useState, useLayoutEffect, useEffect } from "react";

const newDiv = document.createElement("div");
newDiv.style.height = "100vh";
document.body.appendChild(newDiv);
newDiv.style.visibility = "hidden"
newDiv.style.position="fixed";
newDiv.style.left = 0+"px";
newDiv.style.right = 0+"px";
newDiv.style.width = 1+"px"





// Hook
function useWindowSize() {
   // Initialize state with undefined width/height so server and client renders match
   // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
   const [windowSize, setWindowSize] = useState({
      width: undefined,
      height: undefined,
      fullHeight:undefined,
   });

   useLayoutEffect(() => {
      let width;
      let height;
      let fullHeight;

      let timer = null;

      // Handler to call on window resize
      function handleResize() {
         const rect = newDiv.getBoundingClientRect();
         // console.log("height", rect.height, window.innerHeight)

         const newWidth = window.innerWidth;
         const newHeight = window.innerHeight;
         const newFullHeight = rect.height;

         // console.log("test", height, windowSize.height);

         if (newWidth !== width || fullHeight !== newFullHeight) {
           
            setWindowSize({
               width: newWidth,
               height: newHeight,
               fullHeight: newFullHeight
            });

            if(timer)clearTimeout(timer);

            timer = setTimeout(()=>{
               setWindowSize({
                  width: newWidth,
                  height: newHeight,
                  fullHeight: newFullHeight
               });
   
            }, 50)
         }

         // Set window width/height to state

         fullHeight = newFullHeight;
         width = newWidth;
         height = newHeight;
      }

      // Add event listener
      window.addEventListener("resize", handleResize);

      // Call handler right away so state gets updated with initial window size
      timer = setTimeout(()=>{
         handleResize();
      }, 1000)
      handleResize();

      // Remove event listener on cleanup
      return () => {
         if(timer)clearTimeout(timer);
         window.removeEventListener("resize", handleResize)}
   }, [setWindowSize]); // Empty array ensures that effect is only run on mount

   return windowSize;
}

export default useWindowSize;
