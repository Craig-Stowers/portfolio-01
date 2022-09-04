import image1 from "../../images/projects/greatminds.png";
import crossword from "../../images/projects/crossword.png";
import backgammon from "../../images/projects/backgammon.png";
import image2 from "../../images/projects/memorygame.png";
import image3 from "../../images/projects/03.png";
import image4 from "../../images/projects/04.png";
import image5 from "../../images/projects/05.png";
import newto from "../../images/projects/newto.png";
import VideoPlayer from "./../VideoPlayer";
import VideoPlayer2 from "./../VideoPlayer2";
import { useEffect, useState } from "react";
import ReactPlayer from "react-player";

import {
   BrowserView,
   MobileView,
   isBrowser,
   isMobile,
} from "react-device-detect";

import videoIcon from "./../../images/video-icon.png";

import classes from "./Projects.module.css";

const projectData = [
   {
      image: crossword,
      title: " Crossword (desktop)",
      text: "Crossword game with intutive text input and across/down toggle.",
      support: "desktoponly",
      url: "https://toi-crossword.netlify.app/",
   },
   {
      image: crossword,
      title: " Crossword (mobile)",
      text: "Crossword game with intutive text input and across/down toggle.",
      support: "mobileonly",
      url: "https://toi-crossword.netlify.app/",
   },
   {
      image: backgammon,
      title: "Backgammon",
      text: "Prototype game to test live socket connections.",
      url: "https://silvereye.dev/",
   },
   {
      image: backgammon,
      title: "Penguin Game",
      // support: "mobileonly",
      text: "Prototype game to test live socket connections.",
      video: "https://www.dropbox.com/s/u7c2q99m7ieykzm/penguin-game.mp4",
   },
   {
      image: newto,
      title: "Newto",
      text: "Prototype game to test live socket connections. Prototype game to test live socket connections. Prototype game to test live socket connections. Prototype game to test live socket connections.",
      video: "https://www.dropbox.com/s/cauralukkzb3hdf/gravity-game.mp4",
   },

   {
      image: backgammon,
      title: "Stone Roses",
      text: "Great video of a great band.",
      video: "https://www.youtube.com/watch?v=cokwtKStjKQ",
   },
];

const Projects = ({ show, scrollable }) => {
   const midSplit = Math.ceil(projectData.length / 2);
   const col1 = projectData.slice(0, midSplit);
   const col2 = projectData.slice(midSplit, projectData.length);

   const [videoUrl, setVideoUrl] = useState(null);

   useEffect(() => {
      if (videoUrl) {
         scrollable(false);
      } else {
         scrollable(true);
      }
   }, [videoUrl]);

   return (
      <div className={classes.projects}>
         <div className={classes.projectsWrapper}>
            <div className={classes.topNote}>
               <h3>This website is a work in progress...</h3>
               <p>
                  I apologize for any performance issues. I built that
                  ridiculous text morphing feature from scratch and am currently
                  optimising it.
               </p>

               <p>
                  Please flick an email to{" "}
                  <a href="mailto:craig.stowers@proton.me">
                     craig.stowers@proton.me
                  </a>
                  if you'd like to discuss a project or job opportunity.
               </p>

               <p>
                  I'm in the process of collating many years of work to show
                  below (so watch this space).
               </p>
            </div>

            <div className={classes.heading}>
               <h1>projects.</h1>
            </div>

            <div className={classes.columnsWrapper}>
               <div className={[classes.column, classes.column1].join(" ")}>
                  {col1.map((e, i) => {
                     return (
                        <Project
                           key={"leftProject_" + i}
                           data={e}
                           style={{ opacity: show ? 1 : 0 }}
                           setVideo={(url) => {
                              setVideoUrl(url);
                           }}
                        />
                     );
                  })}
               </div>

               <div className={[classes.column, classes.column2].join(" ")}>
                  {col2.map((e, i) => {
                     return (
                        <Project
                           key={"rightProject_" + i}
                           data={e}
                           style={{ opacity: show ? 1 : 0 }}
                           setVideo={(url) => {
                              setVideoUrl(url);
                           }}
                        />
                     );
                  })}
               </div>
            </div>
         </div>
         <VideoPlayer
            url={videoUrl}
            close={() => {
               setVideoUrl(null);
            }}
         />
      </div>
   );
};

const Project = ({ data, isLeft, style, setVideo }) => {
   const [showMessage, setShowMessage] = useState(false);

   const showWarning =
      (data.support === "mobileonly" && !isMobile) ||
      (data.support === "desktoponly" && isMobile);

  // console.log(data.title, "warning", showWarning);

   let WarningMessage = "";
   if (data.support === "mobileonly") {
      WarningMessage = (
         <div>
            Developed for mobile only.
            <br />
            Please launch from a mobile device.
         </div>
      );
   }
   if (data.support === "desktoponly") {
      WarningMessage = (
         <div>
            Developed for desktop only.
            <br />
            Please launch from a desktop computer.
         </div>
      );
   }

   useEffect(() => {
      if (!showMessage) return;

      const timer = setTimeout(() => {
         setShowMessage(false);
      }, 3000);

      return () => {
         clearTimeout(timer);
      };
   }, [showMessage]);

   return (
      <div className={classes.projectWrapper}>
         <div
            className={classes.project}
            onClick={() => {
               // if (data.url) {
               //    window.open(data.url, "_blank").focus();
               // }

               if (data.video) {
                  setVideo(data.video);
               }
               if (showWarning) {
                  setShowMessage(true);
               }
               if (showMessage) {
                  setShowMessage(false);
               }
            }}
         >
            <div className={classes.imageWrapper}>
               <img src={data.image} />
            </div>

            <div
               className={`${classes.content} ${showMessage && classes.hide}`}
            >
               <div className={`${classes.gradientCover}`}>
                  {data.url && (
                     <div className={classes.link}>
                        <svg
                           xmlns="http://www.w3.org/2000/svg"
                           role="img"
                           viewBox="0 0 24 24"
                           fill="none"
                           stroke="currentColor"
                           strokeWidth="2"
                           strokeLinecap="round"
                           strokeLinejoin="round"
                           className="feather feather-external-link"
                        >
                           <title>External Link</title>
                           <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                           <polyline points="15 3 21 3 21 9"></polyline>
                           <line x1="10" y1="14" x2="21" y2="3"></line>
                        </svg>
                     </div>
                  )}
                  {data.video && (
                     <img className={classes.videoIcon} src={videoIcon} />
                  )}
               </div>

               <div className={`${classes.infoSlide}`}>
                  <h2>{data.title}</h2>
                  <p>{data.text}</p>
               </div>
            </div>

            <div
               className={`${classes.warning} ${showMessage && classes.show}`}
            >
               {WarningMessage}
            </div>
            {!showWarning && data.url && (
               <a
                  className={classes.externalLink}
                  href={data.url}
                  target={"_blank"}
               ></a>
            )}
         </div>
      </div>

      // <div className={`${classes.project} ${isLeft && classes.left}`} style={{...style}}>
      //    <div className={classes.imageContainer}>
      //       <div className={classes.imageWrapper}>
      //          <img src={data.image} />
      //       </div>
      //    </div>

      //    <div className={`${classes.info} ${isLeft && classes.left}`}>
      //       <div className={classes.wrapper}>
      //          <div>
      //             <h2>{data.title}</h2>
      //          </div>
      //          <div className={classes.textbox}>
      //             <div className={classes.text}>{data.text}</div>
      //          </div>
      //       </div>
      //    </div>
      // </div>
   );
};

export default Projects;
