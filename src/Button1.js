import classes from "./Button1.module.css";

function Button1(props) {
   return (
      <button
         onClick={(e) => {
            e.preventDefault();
            if (props.buttonHit) {
               props.buttonHit();
            }
            if (props.onClick) {
               props.onClick();
            }
         }}
         className={`${classes.main} ${props.className && props.className}`}
         style={{
            width: props.setWidth || null,
         }}
      >
         <div className={classes.inner}>
            {props.leftArrow && (
               <i className={classes.arrow + " " + classes.left}></i>
            )}
            <span>{props.children}</span>
            {props.rightArrow && (
               <i className={classes.arrow + " " + classes.right}></i>
            )}
         </div>
      </button>
   );
}
export default Button1;
