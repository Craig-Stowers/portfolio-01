import { getSpaceUntilMaxLength } from "@testing-library/user-event/dist/utils";
import image1 from "../images/hidden-objects.png";

import workClasses from "./work.module.css";

const deadZone = (target, [startY, endY], element) => {
   //   console.log(element)

   //  console.log(target)
   if (target < startY && target > endY) {
      //   console.log("fixed", target, startY, endY);
      target = target + startY - target;
   }
   if (target < endY) {
      //  console.log(target);
      target = target + startY - endY;
   }

   if (element) {
      const d = Math.abs(target - startY);
      const scale = 1 - Math.min(d / 180, 1);
      const opacity = 1 - Math.min(d / 100, 1);
      const img = element.firstElementChild;
      img.style.transform = `scale(${scale})`;
      img.style.opacity = opacity;

      //   console.log(element)
      //  element.style.transformOrigin = "50% 50%";
      // img.style.border = "1px solid red";
   }

   return target;
};

const slowTowardsMid = (current, target, windowHeight, delta) => {
   const midY = windowHeight * 0.5;
   const yDiff = target.y - midY;
   const plusMinus = yDiff < 0 ? -1 : 1;
   //slow down towards middle

   return midY + plusMinus * Math.pow(Math.abs(yDiff), 1.6) * 0.009;
};

const projectFade = function (position, element, height) {
   const d = height * 0.5 - 240 - position.y;

   // if (d > 0) {
   //element.style.opacity = 1 - Math.max(d / 60, 0);
   // }

   // console.log("el", element);
};

const getSpacing = (spacing, arr) => {
   arr.forEach((e, i) => {
      const spaceFactor = i - (arr.length - 1) * 0.5;
      const gap = (spaceFactor / arr.length) * 65;

      e.style.left = `calc(50% + ${gap}%)`;
      e.style.top = 1100 + i * 150;
   });
   return arr;
};

export const repellerData1 = {
   maxWidth:400,
   items: getSpacing(40, [
      {
         text: "I",
         style: {
            left: "calc(50% - 110px",
            top: 1000,
            fontSize: 100,
         },
         // modMove: slowTowardsMid,
      },
      {
         text: "build",
         style: {
            left: "calc(50% - 66px",
            top: 1150,
         },
         expandSpans: true,
         // modMove: slowTowardsMid,
      },
      {
         text: "things",
         style: {
            left: "calc(50% - 22px)",
            top: 1300,
         },
         expandSpans: true,
         // modMove: slowTowardsMid,
      },
      {
         text: "for",
         style: {
            left: "calc(50% + 22px)",
            top: 1450,
         },
         expandSpans: true,
         // modMove: slowTowardsMid,
      },
      {
         text: "the",
         style: {
            left: "calc(50% + 66px)",
            top: 1600,
         },
         expandSpans: true,
         // modMove: slowTowardsMid,
      },
      {
         text: "web",
         style: {
            left: "calc(50% + 110px)",
            top: 1750,
         },
         expandSpans: true,
         // modMove: slowTowardsMid,
      },
   ]),
};

export const repellerData2 = {
   maxWidth:400,
   items: getSpacing(40, [
      {
         text: "websites",
         style: {
            left: "calc(50% + -110px)",
            top: 700,
            fontSize: 30,
         },
         expandSpans: true,
      },
      {
         text: "interactivity",
         power: 34,
         style: {
            left: "calc(50% - 90px)",
            top: 850,
            fontSize: 24,
         },
         expandSpans: true,
      },
      {
         text: "e-learning",
         power: 34,
         style: {
            left: "calc(50% - 90px)",
            top: 850,
            fontSize: 24,
         },
         expandSpans: true,
      },

      {
         text: "simulations",
         style: {
            left: "calc(50% + 22px)",
            top: 1000,
            fontSize: 23,
         },
         expandSpans: true,
      },
      {
         text: "apps",
         style: {
            left: "calc(50% + 66px)",
            top: 1150,
         },
         expandSpans: true,
      },
      {
         text: "games",
         style: {
            left: "calc(50% + 110px)",
            top: 1300,
            fontSize: 40,
         },
         expandSpans: true,
      },
   ]),
};

export const repellerData3 = {
   items: getSpacing(30, [
      {
         text: "React",
         style: {
            left: "calc(50% + 0px)",
            top: 1000,
         },
         expandSpans: true,
      },
      {
         text: (
            <span style={{ textAlign: "centre" }}>
               React
               <br />
               hooks
            </span>
         ),
         power: 37,
         style: {
            left: "calc(50% - 90px)",
            top: 1300,
            fontSize: 23,
         }
      
      },
      {
         text: (
            <span style={{ textAlign: "centre" }}>
               Javascript
               <br />
               (ES6+)
            </span>
         ),
         power: 37,
         style: {
            left: "calc(50% - 90px)",
            top: 1300,
            fontSize: 23,
         }
      
      },

      {
         text: "PixiJS",
         style: {
            left: "calc(50% - 90px)",
            top: 1600,
         },
         expandSpans: true,
      },
      {
         text: "Canvas",
         style: {
            left: "calc(50% + 0px)",
            top: 1900,
         },
         expandSpans: true,
      },
      {
         text: "Node.js",
         style: {
            left: "calc(50% - 90px)",
            top: 2200,
         },
         expandSpans: true,
      },
      {
         text: "Unity",
         style: {
            left: "calc(50% - 0px)",
            top: 2500,
         },
         expandSpans: true,
      },
      {
         text: "Strapi",
         style: {
            left: "calc(50% + 0px)",
            top: 1000,
         },
     
      },

      {
         text: "Git",
         style: {
            left: "calc(50% - 90px)",
            top: 1600,
         },
         expandSpans: true,
      },
     
   ]),
};

export const repellerData4 = {
   items: getSpacing(40, [
      {
         text: "Photoshop",
         style: {
            left: "calc(50% + 0px)",
            top: 1000,
            fontSize: 25,
         },
         expandSpans: true,
      },
      {
         text: "animation",
         style: {
            left: "calc(50% + 90px",
            top: 1250,
            fontSize: 25,
         },
         expandSpans: true,
      },

      {
         text: "audio & video",
         style: {
            left: "calc(50% - 90px)",
            top: 1500,
            fontSize: 23,
         },
         expandSpans: true,
      },
      {
         text: "design",
         style: {
            left: "calc(50% + 40px)",
            top: 1750,
            fontSize: 30,
         },
         expandSpans: true,
      },
      {
         text: "databases",
         style: {
            left: "calc(50% + 0px)",
            top: 2000,
            fontSize: 27,
         },
         expandSpans: true,
      },
   ]),
};

export const repellerData5 = {
   paddingBottom: -290,
   items: getSpacing(80, [
      {
         text: "Westpac",
         style: {
            left: "calc(50% + 0px)",
            top: 1000,
            fontSize: 32,
         },
         expandSpans: true,
      },
      {
         text: "Air NZ",
         style: {
            left: "calc(50% + 50px",
            top: 1300,
            fontSize: 32,
         },
         expandSpans: true,
      },
      {
         text: (
            <span style={{ textAlign: "centre" }}>
               Theory of
               <br />
               Invention
            </span>
         ),
         power: 44,
         style: {
            left: "calc(50% - 90px)",
            top: 1585,
            fontSize: 23,
         },
         expandSpans: true,
      },

      {
         text: "Marops",
         style: {
            left: "calc(50% + 70px)",
            top: 1900,
            fontSize: 32,
         },
         expandSpans: true,
      },
      {
         text: "Unitec",
         style: {
            left: "calc(50% + 0px)",
            top: 2200,
            fontSize: 32,
         },
         expandSpans: true,
      },
   ]),
};

const startY = 100;
const gap = 100;
const imageHeight = 120;
const startY2 = startY + gap * 3 + imageHeight;
const startY3 = startY2 + gap * 3 + imageHeight;

export const lagText4 = [
   // {
   //    text: "Here are a few projects I've built recently:",
   //    style: {
   //       left: "calc(50%)",
   //    },
   //    type: "object",
   //    grav: false,
   //    mod: (t, windowHeight) => deadZone(t, [windowHeight * 0.5 - 150, -3000]),
   // },
   {
      text: <img src={image1} />,
      type: "object",
      style: {
         left: "calc(50% - 120px)",
         top: startY,
      },
      grav: false,
      mod: (t, windowHeight, element) =>
         deadZone(t, [windowHeight * 0.5 - 120, -1040], element),
      onMoveEnd: projectFade,
   },
   {
      text: (
         <div style={{ color: "red", backgroundColor: "black" }}>
            <img src={image1} />
         </div>
      ),
      type: "object",
      style: {
         left: "calc(50% + 0px",
         top: startY + gap,
      },
      grav: false,
      mod: (t, windowHeight, element) =>
         deadZone(t, [windowHeight * 0.5 - 120, -940], element),
      onMoveEnd: projectFade,
   },
   {
      text: (
         <div style={{ color: "red", backgroundColor: "black" }}>
            <img src={image1} />
         </div>
      ),
      type: "object",
      style: {
         left: "calc(50% + 120px)",
         top: startY + gap * 2,
      },
      mod: (t, windowHeight, element) =>
         deadZone(t, [windowHeight * 0.5 - 120, -840], element),
      onMoveEnd: projectFade,
   },
   {
      text: (
         <div style={{ color: "red", backgroundColor: "black" }}>
            <img src={image1} />
         </div>
      ),
      type: "object",
      style: {
         left: "calc(50% + 120px)",
         top: startY2,
      },
      mod: (t, windowHeight, element) =>
         deadZone(t, [windowHeight * 0.5 + 0, -620], element),
      onMoveEnd: projectFade,
   },
   {
      text: (
         <div style={{ color: "red", backgroundColor: "black" }}>
            <img src={image1} />
         </div>
      ),
      type: "object",
      style: {
         left: "calc(50% - 0px)",
         top: startY2 + gap,
      },
      mod: (t, windowHeight, element) =>
         deadZone(t, [windowHeight * 0.5 + 0, -520], element),
      onMoveEnd: projectFade,
   },
   {
      text: (
         <div style={{ color: "red", backgroundColor: "black" }}>
            <img src={image1} />
         </div>
      ),
      type: "object",
      style: {
         left: "calc(50% - 120px)",
         top: startY2 + gap * 2,
      },
      mod: (t, windowHeight, element) =>
         deadZone(t, [windowHeight * 0.5 + 0, -420], element),
      onMoveEnd: projectFade,
   },
   {
      text: (
         <div style={{ color: "red", backgroundColor: "black" }}>
            <img src={image1} />
         </div>
      ),
      type: "object",
      style: {
         left: "calc(50% - 120px)",
         top: startY3,
      },
      mod: (t, windowHeight, element) =>
         deadZone(t, [windowHeight * 0.5 + 120, -200], element),
      onMoveEnd: projectFade,
   },
   {
      text: (
         <div style={{ color: "red", backgroundColor: "black" }}>
            <img src={image1} />
         </div>
      ),
      type: "object",
      style: {
         left: "calc(50% + 0px)",
         top: startY3 + gap,
      },
      mod: (t, windowHeight, element) =>
         deadZone(t, [windowHeight * 0.5 + 120, -100], element),
      onMoveEnd: projectFade,
   },
   {
      text: (
         <div style={{ color: "red", backgroundColor: "black" }}>
            <img src={image1} />
         </div>
      ),
      type: "object",
      style: {
         left: "calc(50% + 120px)",
         top: startY3 + gap * 2,
      },
      mod: (t, windowHeight, element) =>
         deadZone(t, [windowHeight * 0.5 + 120, 0], element),
      onMoveEnd: projectFade,
   },
];

const shrinkWork = function (target, windowHeight, element) {
   const img = element.firstElementChild;

   const fadeLimit = windowHeight * 0.25;
   const d = target - fadeLimit;
   const scale = d / 200;
   const limitScale = Math.min(Math.max(scale, 0.2), 1);

   // img.style.transform = `scale(${limitScale})`;
   img.style.opacity = limitScale;

   return target;
};

export const work1 = [
   {
      text: (
         <div className={workClasses.work}>
            <img src={image1} />
         </div>
      ),
      type: "object",
      ignore: true,

      style: {
         left: "calc(50%)",
         top: 400,
      },
      mod: (...args) => shrinkWork(...args),

      // mod: (t, windowHeight, element) =>
      //    deadZone(t, [windowHeight * 0.5 - 120, -1040], element),
      // onMoveEnd: projectFade,
   },
];
