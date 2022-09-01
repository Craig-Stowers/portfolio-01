import classes from "./VideoPlayer.module.css";
import ReactPlayer from "react-player";
import React, { useState, useRef, useEffect, createElement } from "react";
import Button from "./Button1";

import useWindowSize from "../hooks/useWindowSize";

function VideoPlayer(props) {
   const [playing, setPlaying] = useState(false);
   const [isOpen, setIsOpen] = useState(false);
   const [hide, setHide] = useState(true);
   const videoRef = useRef();

   useEffect(() => {
      if (props.url) {
         setIsOpen(true);
         setHide(false);
      }
   }, [props.url]);

   const size = useWindowSize();

   const padding = size.width > 600 ? 20 : 0;
   const videoWidth = Math.min(size.width - padding, 840);
   const videoHeight = (videoWidth / 16) * 9;

   console.log("PROPS URL", props.url);

   return (
      <>
         <div className={`${classes.cover} ${props.url && classes.show}`}></div>
         <div
            className={classes.videoPlayer}
            ref={videoRef}
            onClick={(e) => {
               if (e.target !== videoRef.current) return;
               props.close();
            }}
            style={{ visibility: hide ? "hidden" : "visible" }}
         >
            <div
               className={`${classes.window} ${props.url && classes.show}`}
               style={{
                  width: videoWidth + "px",
                  height: videoHeight + "px",
               }}
               onTransitionEnd={(e) => {
                  console.log("end transition", e.propertyName, e);
                  if (e.propertyName == "opacity") {
                     const opacity = window
                        .getComputedStyle(e.target)
                        .getPropertyValue("opacity");
                     console.log("OPACITY", opacity);
                     if (opacity == 0) {
                        console.log("what the fuck");
                        setHide(true);
                     }
                  }
               }}
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
         </div>
      </>
   );
}

export default VideoPlayer;
