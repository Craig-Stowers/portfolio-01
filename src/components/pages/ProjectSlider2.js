import { useState, useRef, useLayoutEffect } from "react";

import { ProjectItem } from "./ProjectItem";

import useWindowSize from "../../hooks/useWindowSize";
import hiddenObjects from "../../images/hidden-objects.png";
import useRequestAnimationFrame from "../../hooks/useRequestAnimationFrame";

import rightArrow from "../../images/arrow-right.png";

import image1 from "../../images/projects/01.png";
import image2 from "../../images/projects/02.png";
import image3 from "../../images/projects/03.png";
import image4 from "../../images/projects/04.png";
import image5 from "../../images/projects/05.png";
import { calculateNewValue } from "@testing-library/user-event/dist/utils";

import useElementSize from "../../hooks/useElementSize";

const items = [
   {
      image: image1,
   },
   {
      image: image2,
   },
   {
      image: image3,
   },
   {
      image: image4,
   },
   {
      image: image5,
   },
   {
      image: image1,
   },
   {
      image: image1,
   },
   {
      image: image2,
   },
   {
      image: image3,
   },
   {
      image: image4,
   },
   {
      image: image5,
   },
   {
      image: image1,
   },
];

const ProjectSlider2 = (props) => {
   const projectsRef = useRef(null);
   //const size = useElementSize(projectsRef);



   let imageWidth = "25%";
   let padding = 20;

   const width = "100%";

   // if(size.width < 800){
   //    imageWidth = "33.3%"
   //    padding = 15;
   // }
   // if(size.width < 600){
   //    imageWidth = "20%"
   //    padding = 10;
   // }
   return (
      <div
         ref={projectsRef}
         style={{
            marginLeft: "auto",
            marginRight: "auto",
            width: "100%",
            maxWidth: 500,

            backgroundColor: "red",
         }}
      >
         {items.map((e, i) => {
            return (
               <div
                  onClick={() => {
                     props.selectItem(i);
                  }}
                  style={{
                     width: imageWidth,
                     display: "block",
                     float: "left",
                     margin: 0,
                     padding: 3,
                  }}
               >
                  <img
                     src={e.image}
                     width={"100%"}
                     style={{ display: "block", margin: 0, padding: 0 }}
                  />
               </div>
            );
         })}
      </div>
   );
};

export default ProjectSlider2;
