import { useState, useLayoutEffect, useEffect } from "react";


console.log("CREATE WINDOW SIZE BOXES")

const newDiv = document.createElement("div");
newDiv.style.height = "100vh";
newDiv.style.width = "100vw";
document.body.appendChild(newDiv);
newDiv.style.visibility = "hidden"
newDiv.style.position="fixed";
newDiv.style.top = "0px"
newDiv.style.left = "0px"
newDiv.style.zIndex=999999999
newDiv.style.border="2px solid red"

const newDiv2 = document.createElement("div");
newDiv2.style.height = "100vh";
newDiv2.style.width = "100%";
document.body.appendChild(newDiv2);
newDiv2.style.visibility = "hidden"
newDiv2.style.position="fixed";
newDiv2.style.top = "0px"
newDiv2.style.left = "0px"



newDiv2.style.zIndex=999999999
newDiv2.style.border="1px solid green"





// Hook
function useWindowSize() {
   // Initialize state with undefined width/height so server and client renders match
   // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
   const [windowSize, setWindowSize] = useState({
      width: undefined,
      height: undefined,
      fullHeight:undefined,
      fullWidth:undefined
   });

   useLayoutEffect(() => {
      let width;
      let height;
      let fullHeight;
      let fullWidth;

      let timer = null;

      // Handler to call on window resize
      function handleResize() {
         const rect = newDiv.getBoundingClientRect();
         const rect2 = newDiv2.getBoundingClientRect();
         // console.log("height", rect.height, window.innerHeight)

         const newWidth = window.innerWidth;
         const newFullWidth = rect.width;
         const newHeight = window.innerHeight;
         const newFullHeight = rect.height;
        
         console.log('WIDTH DIFF ---------------------', rect.width - rect2.width)

         // console.log("test", height, windowSize.height);

         if (newWidth !== width || fullHeight !== newFullHeight) {
           
            setWindowSize({
               width: newWidth,
               height: newHeight,
               fullHeight: newFullHeight,
               fullWidth: newFullWidth,
               gutter:rect.width - rect2.width
            });

            if(timer)clearTimeout(timer);

            timer = setTimeout(()=>{
               setWindowSize({
                  width: newWidth,
                  height: newHeight,
                  fullHeight: newFullHeight,
                  fullWidth: newFullWidth,
                  gutter:rect.width - rect2.width
               });
   
            }, 50)
         }

         // Set window width/height to state

         fullHeight = newFullHeight;
         fullWidth = newFullWidth
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
