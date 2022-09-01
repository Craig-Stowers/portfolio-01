import { useRef, useEffect, useLayoutEffect, forwardRef } from "react";

const SpanChars = (props) => {
   const spanRefs = useRef([]);
   useEffect(() => {
      spanRefs.current = spanRefs.current.filter((item) => {
         return item !== null;
      });
      if (props.onSpanRefs) props.onSpanRefs([...spanRefs.current]);
   }, [props.children]);

   // const addSpansToChildren = () => {
   //    if (typeof props.children == "string") {
   //       return props.children;
   //    }
   //    if (typeof props.children == "object") {

   //       if (props.children.type == "p") {
   //          return <p>{addSpansToChildren(props.children.props.children)}</p>;
   //       }
   //    }
   // };

   if(!props.children)return  <></>

   return (
      <>
         {props.children.split("").map((e, i) => {
            return (
               <span
                  key={"sw-" + i}
                  ref={(ref) => (spanRefs.current[i] = ref)}
                  style={{
                     ...props.initStyle,
                     position: props.absolute ? "absolute" : "relative",
                  }}
               >
                  {e}
               </span>
            );
         })}
      </>
   );
};

export default SpanChars;
