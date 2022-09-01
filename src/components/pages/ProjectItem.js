import classes from "./ProjectItem.module.css";

export const ProjectItem = ({ focus, image, color, height, left, hide }) => {
   const largeScale = Math.round(height / 70) / 10;
   const smallScale = largeScale * 0.65;

   let opacity = focus ? 0.7 : 0.3;

   if(hide)opacity = 0;

   const backgroundOpacity = hide ? 0 : 1
  
   return (
      <div
         className={classes.workContainer}
         style={{
          
            position: "absolute",
            left: left,
            width: 0,
         }}
      >
         <div
            className={classes.workBackground}
            style={{
               background: focus ? color : "black",
               width: 200,
               height: 200,
               opacity:backgroundOpacity,
               transform: focus
                  ? `scale(${largeScale}) translate(-50%, -50%)`
                  : `scale(${smallScale}) translate(-50%, -50%)`,
               // opacity: projectFocus === 4 ? 1 : 0.3,
               // transform: projectFocus === 4 ? "scale(1.2)" : "scale(0.7)",
            }}
         >
            <img
               className={classes.image}
               style={{
                  opacity,
                  // top: "calc(50vh - 160px)",
                  display: "block",
               }}
               src={image}
            />
         </div>
      </div>
   );
};
