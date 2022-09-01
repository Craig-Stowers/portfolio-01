import Canvas from "../Canvas";
import React from "react";

const LettersCanvas = (props) => {
   console.log("$$$$$$$$new canvas!!!");

   return (
      <div
         style={{
            width: "100%",
            height: "100vh",
            left: 0,
            top: 0,

            position: "fixed",
            userSelect: "none",
            WebkitUserSelect: "none",
            MozUserSelect: "none",
            msUserSelect: "none",
            zIndex: 10,
         }}
      >
         <Canvas
            // init={(...args) => falseswirler.current.init(...args)}
            draw={(...args) => {
               

              // console.log(context)
               props.draw(...args);
            }}
            // resize={(...args) => swirler.current.resize(...args)}
            options={{ context: "2d", fillParent: true }}
            style={{
               display: "block",
               position: "fixed",
            }}
         />
      </div>
   );
};

export default React.memo(LettersCanvas);
