import { useRef, useEffect } from "react";

let trackIndex = 0;

const useCanvas = (draw, resize, options = {}) => {
   const canvasRef = useRef(null);
   const lastTimeRef = useRef(null);

   const lastTime = useRef(null);

   const lt = useRef(1);
   /// const refreshSize = useRef(false);
   const canvasSize = useRef(null);


  const oldTime = useRef(0);

   const index = trackIndex;
   trackIndex++ 

   console.log("USE CANVAS &*&(*&*(&(*&");

   useEffect(() => {
      const canvas = canvasRef.current;
      const context = canvas.getContext(options.context || "2d");
      let animationFrameId;

      let ratio = window.devicePixelRatio || 1;

      // alert(ratio)
      let refreshSize = true;
      let size = null;

    

      const animate = (time) => {
         //const time = Date.now();
         let delta = time - oldTime.current;
         oldTime.current = time;


         // console.log(oldTime.current)

         if (refreshSize) {
            refreshSize = false;
            const { width, height } = size;
            canvas.width = width * ratio;
            canvas.height = height * ratio;
            canvas.style.width = width + "px";
            canvas.style.height = height + "px";
            // canvas.style.backgroundColor="red"
            context.scale(ratio, ratio);
         }

         

       

       //  console.log(`?track=canvas-delta-${index}?int`, delta, time, oldTime.current);

         if (delta > 50) {
            
            delta = 50;
         }
         //   console.log("canvas delta",delta )

         options.predraw(context, canvas);

         draw({ context, canvas, delta, ratio });
         options.postdraw(context, canvas);

        
         animationFrameId = window.requestAnimationFrame(animate);
      };

      const resizeWindow = () => {
         refreshSize = true;
         ratio = window.devicePixelRatio || 1;
         const rect = canvas.parentElement.getBoundingClientRect();
         size = { width: rect.width, height: rect.height };
         // alert(rect.height)
         resize && resize(rect.width, rect.height);
      };

      options.init && options.init(context, canvas);
      resizeWindow();

      const delayResize = setTimeout(() => {
         resizeWindow();
      }, 1000);

      window.addEventListener("resize", resizeWindow);

      //const interval = setInterval(animate, 1000 / 60);

      animationFrameId = window.requestAnimationFrame(animate);
      return () => {
        // clearInterval(interval);
         console.log("REMOVE CANVAS ANI");
         clearTimeout(delayResize);
         window.cancelAnimationFrame(animationFrameId);
         window.removeEventListener("resize", resizeWindow);
      };
   }, [options]);

   return canvasRef;
};
export default useCanvas;
