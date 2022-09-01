import classes from "./VideoPlayer2.module.css";
import ReactPlayer from "react-player";
import React, { useState, useRef, useEffect, createElement } from "react";
import Button from "./Button1";

import useWindowSize from "../hooks/useWindowSize";

function VideoPlayer2(props) {
   const [playing, setPlaying] = useState(false);
   const videoRef = useRef();
   const size = useWindowSize();
   const videoWidth = Math.min(size.width, 940);
   const videoHeight = (videoWidth / 16) * 9;

   return (
      <div
         className={classes.window}
         style={{ width: videoWidth + "px", height: videoHeight + "px" }}
      >
         {/* <Button
               className={classes.close}
               onClick={() => {
                  props.close();
               }}
            >
               Close
            </Button> */}
         <ReactPlayer
            url={props.url}
            width={"100%"}
            height={"100%"}
            controls={true}
            playing={true}
         />
      </div>
   );
}

export default VideoPlayer2;
