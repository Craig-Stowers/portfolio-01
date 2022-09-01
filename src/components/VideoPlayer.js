import classes from "./VideoPlayer.module.css";
import ReactPlayer from "react-player";
import React, { useState, useEffect } from "react";
import Button from "./Button1";

import useWindowSize from "../hooks/useWindowSize";

function VideoPlayer(props) {
   const [playing, setPlaying] = useState(false);

   const size = useWindowSize();

   const videoWidth = Math.min(size.width, 940);
   const videoHeight = (videoWidth / 16) * 9




   useEffect(() => {
      // setTimeout(() => {
      //    setPlaying(true);
      //    console.log("set playing");
      // }, 1000);
   }, []);

   return (
      <div className={classes.videoPlayer}>
         <div className={classes.window} style={{width:videoWidth, height:videoHeight}}>
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
               width="100%"
               height="100%"
              
               controls={true}
               // playing={playing}
            />
         </div>
      </div>
   );
}

export default VideoPlayer;
