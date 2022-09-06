import crossword from "../../images/projects/crossword.jpg";
import backgammon from "../../images/projects/backgammon.jpg";
import memorygame from "../../images/projects/memorygame.jpg";
import unitecReel from "../../images/projects/unitec-reel.jpg";
import moes from "../../images/projects/moes.jpg";
import easythreesy from "../../images/projects/easy-threesy.jpg";
import greatMinds from "../../images/projects/great-minds.jpg";
import hiddenObjects from "../../images/projects/hidden-objects.jpg";
import penguinGame from "../../images/projects/penguin-game.jpg";
import squirrelEditor2 from "../../images/projects/squirrel-editor.jpg";
import jewelMatch from "../../images/projects/jewel-match.jpg";
import fruitSwipe from "../../images/projects/fruit-swipe.jpg";
import fill from "../../images/projects/fill.jpg";
import newto from "../../images/projects/newto.jpg";
import videoIcon from "./../../images/video-icon.png";

import VideoPlayer from "./../VideoPlayer";
import { useEffect, useState } from "react";

import {
   BrowserView,
   MobileView,
   isBrowser,
   isMobile,
} from "react-device-detect";

import classes from "./Projects.module.css";

const projectData = [
   {
      image: crossword,
      title: "Crossword (desktop only)",
      text: "Crossword game which features an intuitive input method. Toggle input direction by clicking intersecting squares. Use arrow keys to navigate squares or click a clue to refocus input.",
      support: "desktoponly",
      url: "https://toi-crossword.netlify.app/",
   },
   {
      image: squirrelEditor2,
      title: "Squirrel Editor (desktop)",
      text: "Training software that guides user through the basics of photo editing. This is one small lesson among many.",
      support: "desktoponly",
      url: "https://toi-photo-editor.netlify.app?activity=2",
   },
   {
      image: backgammon,
      title: "Backgammon",
      text: "Multiplayer prototype game developed using Node.js & socket connections.",
      support: "desktoponly",
      url: "https://silvereye.dev/",
   },
   {
      image: hiddenObjects,
      title: "Hidden Objects",
      support:"mobileonly",
      text: "A game to teach non-digital-native people how to pinch & zoom.",
      url: "https://craigstowers-hidden-objects.netlify.app/",
   },
   {
      image: moes,
      title: "moes.co.nz",
      text: "Simple website I designed, built and photographed.",
      url: "https://moes.co.nz/",
   },
   
   {
      image: greatMinds,
      title: "Great Minds",
      text: "Quiz game where you flip an image to reveal multi-choice answers.",
      url: "https://toi-great-minds.netlify.app/",
   },
  
   {
      image: fruitSwipe,
      title: "Fruit Swipe",
      text: "A game to get users familiar with swiping.",
      url: "https://esafety-fruitswipe.netlify.app/",
   },
   {
      image: newto,
      title: "Newto (ios/android)",
      text: "Early stages of a personal project in development for mobile devices. The idea is to drift, make use of gravity wells and orbit planets to conserve gas. There is a time slowing component and custom built newtonian physics calculations",
      video: "https://www.dropbox.com/s/8i13dumn23oemfo/gravity-game.mp4?dl=0",
   },
   {
      image: penguinGame,
      title: "Penguin Game (ios/android)",
      text: "An experiement to create 2d wave/splash physics from scratch. It hopefully evolves into a surfing type scroller game. I applied buoyancy to icebergs which accurately reacts to how much mass is being submerged by a variable wave shape.",
      video: "https://www.dropbox.com/s/c5xpycsq3760dp1/penguin-game.mp4?dl=0",
   },
  

  
   {
      image: fill,
      title: "Fill",
      text: "Quiz game where you flip an image to reveal multi-choice answers.",
      url: "https://craigstowers-fill.netlify.app/",
   },
  
   {
      image: memorygame,
      title: "Memory Game",
      text: "Simple website I designed, built and photographed.",
      url: "https://toi-memory-game.netlify.app/",
   },
   
   {
      image: easythreesy,
      title: "Easy Threesy (desktop)",
      text: "Training software that guides user through the basics of photo editing.",
      support: "desktoponly",
      url: "https://toi-easy-threesy.netlify.app/",
   },
   
   {
      image: jewelMatch,
      title: "Jewel Match",
      text: "Game constructed in Construct tools using programming GUI which can get a little overcomplicted for making complex games",
      url: "https://jewelmatch-test.netlify.app/",
   },
  


   {
      image: unitecReel,
      title: "Carpentry/Plumbing training",
      text: "Training modules to help train carpentry & plumbing students. Very dated but thought I'd share to show my background in vectors & Flash",
      video: "https://www.dropbox.com/s/4k1b0thjjpsjpbb/carpentryplumbingvideo.mp4?dl=0",
   },
];

const Projects = ({ show, scrollable }) => {
   const midSplit = Math.ceil(projectData.length / 2);
   

   //put every 2nd item in seperate column
   const col1 = projectData.filter((e, i) => {
      return i % 2 == 0;
   });
   const col2 = projectData.filter((e, i) => {
      return i % 2 == 1;
   });

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
            <div className={classes.topNote}>
               <h3>This website is a work in progress...</h3>
               <p>
                  I built that ridiculous text morphing feature from scratch and
                  am currently optimising it so apologies for any performance
                  issues.
               </p>
               <p>
                  I'm in the process of collating many years of work so watch
                  this space.
               </p>

               <p>
                  Please flick an email to{" "}
                  <a href="mailto:craig.stowers@proton.me">
                     craig.stowers@proton.me
                  </a>{" "}
                  if you'd like to discuss a project or job opportunity.
               </p>
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
