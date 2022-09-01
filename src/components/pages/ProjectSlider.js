import { useState, useRef, useLayoutEffect } from "react";

import { ProjectItem } from "./ProjectItem";

import useWindowSize from "../../hooks/useWindowSize";
import hiddenObjects from "../../images/hidden-objects.png";
import useRequestAnimationFrame from "../../hooks/useRequestAnimationFrame";

import useElementSize from "../../hooks/useElementSize";

import rightArrow from "../../images/arrow-right.png"

import image1 from "../../images/projects/01.png";
import image2 from "../../images/projects/02.png";
import image3 from "../../images/projects/03.png";
import image4 from "../../images/projects/04.png";
import image5 from "../../images/projects/05.png";
import { calculateNewValue } from "@testing-library/user-event/dist/utils";

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
];

const ProjectSlider = (props) => {
   const size = useWindowSize();
   const [slideIndex, setSlideIndex] = useState(0);
   const sliderRef = useRef(null);

   const offsetX = useRef(0);
   const offsetTargetX = useRef(0);
   const slidePanelRef = useRef(null);
   const windowWidth = useRef(null);
   // const [height, setHeight] = useState(size.height);

   const elementSize = useElementSize(sliderRef);

   const height = elementSize.height;

   const gap = height * 0.3;

   offsetTargetX.current = slideIndex * gap;

   // useLayoutEffect(() => {
   //    if (windowWidth.current !== size.width) {
   //       windowWidth.current = size.width;
   //       // setHeight(size.height);
   //       // gap.current = size.height * 0.3;
   //    }

   //    offsetTargetX.current = slideIndex * gap;
   // }, [size]);

   const nextSlide = () => {
      let slide = slideIndex + 1;
      if (slide > items.length - 1) {
         slide = 0;
         offsetX.current -= items.length * gap;
      }

      offsetTargetX.current = slide * gap;
      setSlideIndex(slide);
   };

   const prevSlide = () => {
      let slide = slideIndex - 1;
      if (slide < 0) {
         slide = items.length - 1;
         offsetX.current += items.length * gap;
      }

      offsetTargetX.current = slide * gap;
      setSlideIndex(slide);
   };

   useRequestAnimationFrame((delta) => {
      const deltaTween = 1 - Math.pow(0.987, delta);
      offsetX.current += (offsetTargetX.current - offsetX.current) * deltaTween;

      slidePanelRef.current.style.left = `calc(50% - ${offsetX.current}px)`;

      // console.log("update", delta)
   });

   const isNeighbour = (item) => {
      if (item === slideIndex) return true;
      if (item === slideIndex + 1) return true;
      if (item === slideIndex - 1) return true;
      if (item - items.length === slideIndex - 1) return true;
      if (item - items.length === slideIndex + 1) return true;
      if (item + items.length === slideIndex - 1) return true;
      if (item + items.length === slideIndex + 1) return true;
      //if(item + items.length === slideIndex - 1)return true;
      return false;
   };

   let topOffset = 0;
   if (size.height < 600) {
      topOffset = (600 - size.height) * 0.25;
   }

   const arrowGap = Math.min(gap*1.2, elementSize.width * 0.4);

   const projectFocus = 1;

   const sliderWidth = Math.min(gap * 3, size.width)
   return (
      <div
         ref={sliderRef}
         style={{
            width: sliderWidth,
            marginLeft: "auto",
            marginRight: "auto",
            height: "100vh",
            position:"relative",
           
            
           
          
            overflow: "hidden",
         }}
      >
         <div
            style={{
               width: sliderWidth,
             
              
               position: "absolute",
               display: "flex",
               top: height * 0.5 + topOffset,
               transform:"translateY(-50%)",
               // paddingRight:40,
               // paddingLeft:40,
               zIndex:2000,
             
            }}
         >
            <div
               onClick={() => {
                  prevSlide();
               }}
               style={{
                  position:"absolute",
                  left:`calc(50% - ${arrowGap}px)`,
                  transform:"translate(-50%,-50%)"
               }}
            >
                <img src={rightArrow} style={{transform:"scaleX(-1)"}}/>
            </div>
            <div
               onClick={() => {
                  nextSlide();
               }}
               style={{
                  position:"absolute",
                  left:`calc(50% + ${arrowGap}px)`,
                  transform:"translate(-50%,-50%)"
               }}
            >
               <img src={rightArrow}/>
            </div>
         </div>
         <div
            ref={slidePanelRef}
            style={{
               position: "relative",
               left: `calc(50% - ${offsetX.current}px)`,
               top: `calc(50% + ${topOffset}px)`,
            }}
         >
            <ProjectItem
               left={-gap}
               focus={slideIndex === items.length - 1}
               hide={!isNeighbour(items.length - 1)}
               image={items[items.length - 1].image}
               color={`rgba(255,255,255,1)`}
               height={height}
            />
            {items.map((e, i) => {
               return (
                  <ProjectItem
                     left={i * gap}
                     focus={slideIndex === i}
                     hide={!isNeighbour(i)}
                     image={e.image}
                     color={`rgba(255,255,255,1)`}
                     height={height}
                  />
               );
            })}
            <ProjectItem
               left={gap * items.length}
               focus={slideIndex === 0}
               hide={!isNeighbour(0)}
               image={items[0].image}
               color={`rgba(255,255,255,1)`}
               height={height}
            />
         </div>
         SLIDER
      </div>
   );
};

export default ProjectSlider;
