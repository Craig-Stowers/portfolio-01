import { useEffect } from "react";

const SharePosition = (props) => {
   const element = useRef(null);
   const CustomTag = props.tag || "div";

   useEffect(()=>{

   }, [])

   <CustomTag
      ref={element}
      style={{
         ...props.style
      }}
   >
      {props.children}
   </CustomTag>;
};

export default SharePosition;
