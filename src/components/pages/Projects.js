import image1 from "../../images/projects/greatminds.png";
import crossword from "../../images/projects/crossword.png";
import backgammon from "../../images/projects/backgammon.png";
import image2 from "../../images/projects/memorygame.png";
import image3 from "../../images/projects/03.png";
import image4 from "../../images/projects/04.png";
import image5 from "../../images/projects/05.png";

import VideoPlayer from "./../VideoPlayer";
import VideoPlayer2 from "./../VideoPlayer2";
import { useEffect, useState } from "react";
import ReactPlayer from "react-player";

import videoIcon from "./../../images/video-icon.png";

import classes from "./Projects.module.css";

const isMobile = false;

const projectData = [
   {
      image: crossword,
      title: " Crossword",
      text: "Crossword game with intutive text input and across/down toggle.",
      support: "desktoponly",
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
      title: "SquirrelBank",
      support: "mobileonly",
      text: "Prototype game to test live socket connections.",

      video: "https://www.dropbox.com/s/n4i1jcgvgoox20z/video2.mp4?dl=0",
   },
   {
      image: backgammon,
      title: "Newto",
      text: "Prototype game to test live socket connections. Prototype game to test live socket connections. Prototype game to test live socket connections. Prototype game to test live socket connections.",
      video: "https://www.dropbox.com/s/cauralukkzb3hdf/gravity-game.mp4",
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
                  </a>{" "}
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
         )
      </div>
   );
};

const Project = ({ data, isLeft, style, setVideo }) => {
   return (
      <a
         className={classes.project}
         onClick={() => {
            if (data.video) {
               setVideo(data.video);
            }
         }}
      >
         <div className={classes.imageWrapper}>
            <img src={data.image} />
         </div>

         <div className={classes.gradientCover}>
            {data.url && (
               <div className={classes.link}>
                  <svg
                     xmlns="http://www.w3.org/2000/svg"
                     role="img"
                     viewBox="0 0 24 24"
                     fill="none"
                     stroke="currentColor"
                     stroke-width="2"
                     stroke-linecap="round"
                     stroke-linejoin="round"
                     class="feather feather-external-link"
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

         <div className={classes.infoSlide}>
            <h2>{data.title}</h2>
            <p>{data.text}</p>
         </div>

         {data.support === "mobileonly" && !isMobile && (
            <div className={`${classes.warning} ${classes.mobileonly}`}>
               Developed for mobile only upon clients request.
               <br />
               Please launch from mobile device.
            </div>
         )}
         {data.support === "desktoponly" && isMobile && (
            <div className={`${classes.warning}`}>
               Developed for desktop upon clients request.
               <br />
               Please launch from a desktop computer.
            </div>
         )}
      </a>

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
