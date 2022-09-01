import React, { useEffect } from "react";
import useCanvas from "../hooks/useCanvas";



const _predraw = (context, canvas) => {
   context.save();
   //  resizeCanvas(context, canvas);
   const { width, height } = context.canvas;
   context.clearRect(0, 0, width, height);
};

const _postdraw = (context, canvas) => {
   context.restore();
};

const Canvas = (props) => {
   const { draw, resize, options, init, ...rest } = props;

   console.log("RENDER new canvas");

   const {
      context,
      predraw = _predraw,
      postdraw = _postdraw,

      ...moreConfig
   } = options;

   const canvasRef = useCanvas(draw, resize, {
      context,
      predraw,
      postdraw,
      init,

      ...moreConfig,
   });

   useEffect(() => {
      //  addEventListener()
   }, []);

   return <canvas ref={canvasRef} {...rest} />;
};

export default Canvas;
