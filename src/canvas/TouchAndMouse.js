import { click } from "@testing-library/user-event/dist/click";

const getTouchXY = (e) => {
   var evt = typeof e.originalEvent === "undefined" ? e : e.originalEvent;
   var touch = evt.touches[0] || evt.changedTouches[0];
   return [touch.pageX, touch.pageY];
};

const TouchAndMouse = function ({ el = window, tap, down, up, move }) {
   let tapTimer = null;
   let touchStartX = null;
   let touchStartY = null;

   const handleTouchStart = (e) => {
      e.preventDefault();
      [touchStartX, touchStartY] = getTouchXY(e);

      tapTimer = setTimeout(() => {
         tapTimer = null;
         down(touchStartX, touchStartY);
      }, 160);
   };

   const handleTouchEnd = (e) => {
      e.preventDefault();
      const [x, y] = getTouchXY(e);
      if (tapTimer) {
         clearTimeout(tapTimer);
         tap(x, y);
      }
      up(x, y);
   };

   const handleTouchMove = (e) => {
      e.preventDefault();
      const [x, y] = getTouchXY(e);
      if (tapTimer) {
         const d = Math.hypot(touchStartX - x, touchStartY - y);
         if (d < 10) return;
         clearTimeout(tapTimer);
         tapTimer = null;
      }
      move(x, y);
   };

   const handleMouseClick = (e) => {
      console.log("mouse click");
      tap(e.clientX, e.clientY);
   };
   const handleMouseMove = (e) => {
      move(e.clientX, e.clientY);
   };

   el.addEventListener("touchstart", handleTouchStart);
   el.addEventListener("touchmove", handleTouchMove);
   el.addEventListener("touchend", handleTouchEnd);
   window.addEventListener("click", handleMouseClick);
   window.addEventListener("mousemove", handleMouseMove);

   this.unload = () => {
      el.removeEventListener("touchstart", handleTouchStart);
      el.removeEventListener("touchmove", handleTouchMove);
      el.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("click", handleMouseClick);
      window.removeEventListener("mousemove", handleMouseMove);
   };
};

export default TouchAndMouse;
