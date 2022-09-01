import { useEffect } from "react";

// https://usehooks.com/useOnClickOutside/

const useClickOutside = (refs, handler) => {
   useEffect(
      () => {
         const listener = (event) => {
            // Do nothing if clicking ref's element or descendent elements
            let isOutside = true;

            refs.forEach((ref) => {
               if (ref.current) {
                  if (
                     ref.current === event.target ||
                     ref.current.contains(event.target)
                  ) {
                     isOutside = false;
                  }
               }
            });
            console.log("isOutside", isOutside);
            if (isOutside) handler(event);
         };

         document.addEventListener("mousedown", listener);
         document.addEventListener("touchstart", listener);

         return () => {
            document.removeEventListener("mousedown", listener);
            document.removeEventListener("touchstart", listener);
         };
      },
      // Add ref and handler to effect dependencies
      // It's worth noting that because passed in handler is a new ...
      // ... function on every render that will cause this effect ...
      // ... callback/cleanup to run every render. It's not a big deal ...
      // ... but to optimize you can wrap handler in useCallback before ...
      // ... passing it into this hook.
      [refs, handler]
   );
};

export default useClickOutside;
