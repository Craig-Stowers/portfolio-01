import { isFirefox } from "react-device-detect";
import { addTween, updateTween, updateTweens } from "../../utility/Tweens";

import { Vector } from "./vector";

const padding = 50;

const debugColors = {
   default: "white",
   shifting: "yellow",
   flyin: "green",
   flyout: "red",
   morphing: "purple",
};

//invert Y for vector system
const createVector = (x, y) => new Vector(x, -y);

const getCSSValues = (element, properties) => {
   const values = {};
   for (let i = 0; i < properties.length; i++) {
      values[properties[i]] = window
         .getComputedStyle(element, null)
         .getPropertyValue(properties[i]);
   }
   return values;
};

const getMinimumCharsFromStrings = (strings) => {
   let minChars = [];
   for (var i = 0; i < strings.length; i++) {
      const string = strings[i];
      let charBank = [...minChars];
      let charsRequired = [];
      for (var j = 0; j < string.length; j++) {
         const char = string[j];
         const foundCharIndex = charBank.findIndex((item) => item === char);
         if (foundCharIndex !== -1) charBank.splice(foundCharIndex, 1);
         charsRequired.push(char);
      }
      minChars = [...charBank, ...charsRequired];
   }
   return minChars.join("");
};

setTimeout(() => {
   var startTime = performance.now();
   // for (var i = 0; i < 2000; i++) {
   //    const v4 = Vector(10, 20);
   // }
   var endTime = performance.now();
   console.log(`Call to test took ${endTime - startTime} milliseconds`);

   const v1 = createVector(30, 80);
   console.log(v1.length);
   console.log(v1.length);
}, 500);

const funText = function (playArea) {
   this.targets = [];
   this.trackers = [];
   this.playArea = getPlayAreaParams(playArea);
   this.explodeGuides = [];
   this.unlinked = [];
   this.deltaMod = 1;
   this.queue = [];
   this.sway = 0;
   this.swayTarget = 0;
   this.mouse = { x: 0, y: 0 };
   this.prevScrollY = 0;

   window.addEventListener("mousemove", (e) => {
      this.mouse = { x: e.clientX, y: e.clientY };
   });
};

const getPlayAreaParams = (element) => {
   const rect = element.getBoundingClientRect();
   return {
      element,
      x: rect.left,
      y: rect.top,
      width: rect.width,
      height: rect.height,
   };
};

funText.prototype.isSwitchingText = function () {
   for (let i = 0; i < this.trackers.length; i++) {
      const t = this.trackers[i];
      if (t.flyin || t.flyout || t.shifting || t.morphing) return true;
   }

   return false;
};

funText.prototype.handleTweenComplete = function () {
   if (this.isSwitchingText()) return;
   console.log("ANIMATION COMPLETE", this.queue.length);
   this.queue.splice(0, 1);
   console.log("deleted?", this.queue.length);
   if (this.queue[0]) this.loadTargets(this.queue[0]);
};

funText.prototype.setTrackers = function (spansArr) {
   this.trackers = spansArr.map((e, i) => {
      const rect = e.getBoundingClientRect();
      const randomPos = this.getRandomXY();

      return {
         element: e,
         char: e.innerText,
         x: 0,
         y: 0,
         vector: createVector(0, 0),
         baseX: 0,
         baseY: 0,
         link: null,
         vx: 0,
         vy: 0,
         opacity: 0,
         lockstep: true,
      };
   });
};

funText.prototype.resize = function () {
   this.playArea = getPlayAreaParams(this.playArea.element);

   //get new guide text positions
   this.targets.forEach((e) => {
      const rect = e.element.getBoundingClientRect();
      e.x = rect.left - this.playArea.x;
      e.y = rect.top - this.playArea.y;
   });
   this.trackers.forEach((e) => {
      //update target position if linked
      // if (e.link != null) e.baseX = this.targets[e.link].x;
      // if (e.link != null) e.baseY = this.targets[e.link].y;

      // //instantly shift other objects. i.e entering/exiting letters
      // if (e.link == null) e.x = e.xp * this.playArea.width;
      // if (e.link == null) e.y = e.yp * this.playArea.height;

      if (e.link != null) {
         e.baseX = this.targets[e.link].x;
         e.baseY = this.targets[e.link].y;
      }
      // e.lockstep = false;
   });
};

const createGuidePoint = (point, parent, color = "#FF0000", text = null) => {
   const span = document.createElement("span");

   if (text) span.appendChild(document.createTextNode(text));
   span.style.position = "absolute";
   span.style.padding = "0px";
   span.style.margin = "0px";
   // span.style.backgroundColor = color;
   span.style.width = "10px";
   span.style.height = "10px";
   span.style.borderRadius = "5px";
   span.style.transform = "translate(-50%, -50%)";
   span.style.left = `${point.x}px`;
   span.style.top = `${point.y}px`;
   parent.appendChild(span);
   const guide = {
      element: span,
      x: point.x,
      y: point.y,
   };
   return guide;
};

funText.prototype.addGuides = function (count) {
   if (this.midGuide) this.midGuide.element.remove();
   this.midGuide = createGuidePoint(
      this.midPoint,
      this.playArea.element,
      "#00FF00"
   );
   for (let i = 0; i < this.explodeGuides.length; i++) {
      this.explodeGuides[i].element.remove();
   }
   this.explodeGuides = [];
   for (var i = 0; i < count; i++) {
      const angle = (360 / count) * i;
      const x = this.midPoint.x + Math.sin(angle * (Math.PI / 180)) * 500;
      const y = this.midPoint.y + Math.cos(angle * (Math.PI / 180)) * 500;
      const halfX = this.midPoint.x + Math.sin(angle * (Math.PI / 180)) * 250;
      const halfY = this.midPoint.y + Math.cos(angle * (Math.PI / 180)) * 250;

      const guide = createGuidePoint(
         { x, y },
         this.playArea.element,
         "#00FF00",
         i.toString()
      );

      guide.halfX = halfX;
      guide.halfY = halfY;

      this.explodeGuides.push(guide);
   }
};

funText.prototype.findTrackerMatch = function (targetChar) {
   const index = this.trackers.findIndex((e) => {
      return e.char === targetChar && e.link == null;
   });
   return index;
};

funText.prototype.queueTargets = function (spansArr, centrePoint, direction) {
   this.queue.push({ spansArr: [...spansArr], centrePoint, direction });
   if (this.queue[0]) this.loadTargets(this.queue[0]);
};

funText.prototype.loadTargets = function ({
   spansArr,
   centrePoint,
   direction,
}) {
   this.midPoint = centrePoint; //this.getMidPoint();
   const flyInDistance = 200;
   const flyOutDistance = 200;
   this.targets = spansArr.map((e, i) => {
      const rect = e.getBoundingClientRect();
      return {
         element: e,
         char: e.innerText,
         x: rect.left - this.playArea.x,
         y: rect.top - this.playArea.y,
      };
   });
   const prevLinked = this.trackers.filter((tracker) => tracker.link != null);
   //reset link so can begin search cycle
   this.trackers.forEach((tracker) => {
      tracker.link = null;
   });

   const matched = [];
   this.targets.forEach((target, index) => {
      const trackerIndex = this.findTrackerMatch(target.char);
      if (trackerIndex !== -1) {
         const t = this.trackers[trackerIndex];

         const values = getCSSValues(target.element, [
            "font-size",
            "font-weight",
         ]);

         if (!t.fontSize) t.fontSize = 20;
         if (!t.fontWeight) t.fontWeight = 400;
         t.fontSizeTarget = parseFloat(values["font-size"]);
         t.fontWeightTarget = values["font-weight"];

         const tweenParams = {
            duration: 900,
            delay: 50 + Math.abs(target.x - this.midPoint.x) * 1,
            exponent: 0.8,
            callback: (percIncr) => {
               t.fontSize += (t.fontSizeTarget - t.fontSize) * percIncr;
               t.element.style.fontSize = t.fontSize + "px";
               t.fontWeight += (t.fontWeightTarget - t.fontWeight) * percIncr;
               t.element.style.fontWeight = t.fontWeight;
               t.element.style.color = "purple";
            },
            onComplete: () => {
               t.morphing = null;
               this.handleTweenComplete();
            },
         };
         t.morphing = addTween(tweenParams);

         // matchedTracker.element.style.fontWeight = fontWeight;
         t.link = index;

         matched.push(t);
      }
   });
   const newLinks = matched.filter((tracker) => !prevLinked.includes(tracker));
   const oldLinks = matched.filter((tracker) => prevLinked.includes(tracker));
   this.unlinked = prevLinked.filter((tracker) => !matched.includes(tracker));

   //
   this.unlinked.forEach((tracker, i) => {
      tracker.link = null;
      tracker.lockstep = true;
      let distance;
      if (direction === "up") distance = -flyInDistance;
      if (direction === "down") distance = flyInDistance;
      const targetY = tracker.y - distance;

      // if (tracker.flyout) {
      //    tracker.flyout.remove();
      // }
      // if (tracker.shifting) {
      //    tracker.shifting.remove();
      // }
      // if (tracker.flyin) {
      //    tracker.flyin.remove();
      // }

      const tweenParams = {
         duration: 600,
         delay: Math.pow(Math.abs(tracker.x - this.midPoint.x), 0.5) * 40,
         exponent: 0.7,
         type: "ease-in",
         callback: (percIncr) => {
            tracker.baseY += (targetY - tracker.baseY) * percIncr;
            tracker.opacity -= percIncr;
            tracker.element.style.color = "red";
         },
         onComplete: () => {
            tracker.flyout = null;
            tracker.opacity = 0;
            this.handleTweenComplete();
            tracker.element.style.color = "black";
         },
      };
      tracker.flyout = addTween(tweenParams);
   });

   //existing letters on screen. If tracker is still "flyin" from prior view, kill old tween.
   oldLinks.forEach((tracker, i) => {
      let preDelay = 0;
      // if (tracker.flyout) {
      //    tracker.flyout.remove();
      // }
      // if (tracker.shifting) {
      //    tracker.shifting.remove();
      // }
      // if (tracker.flyin) {
      //    tracker.flyin.remove();
      // }

      const target = this.targets[tracker.link];

      const tweenParams = {
         duration: 1000,
         delay: 0, //preDelay + Math.abs(target.x - this.midPoint.x) * 2,
         exponent: 0.8,
         onStart: () => {
            tracker.opacity = 1;
         },
         callback: (percIncr) => {
            tracker.element.style.color = "yellow";
            tracker.baseX += (target.x - tracker.baseX) * percIncr;
            tracker.baseY += (target.y - tracker.baseY) * percIncr;
         },
         onComplete: () => {
            tracker.shifting = null;
            this.handleTweenComplete();
         },
      };
      tracker.shifting = addTween(tweenParams);
   });

   newLinks.forEach((tracker) => {
      const target = this.targets[tracker.link];
      const preDelay = 200; //tracker.flyout ? 1200 : 200;

      let distance;
      if (direction === "up") distance = -flyOutDistance;
      if (direction === "down") distance = flyOutDistance;

      // if (tracker.flyout) {
      //    tracker.flyout.remove();
      // }
      // if (tracker.shifting) {
      //    tracker.shifting.remove();
      // }
      // if (tracker.flyin) {
      //    tracker.flyin.remove();
      // }
      tracker.x = tracker.baseX = target.x;
      tracker.y = tracker.baseY = target.y + distance;

      tracker.lockstep = true;
      // tracker.flyin = true;
      const tweenParams = {
         duration: 1000,
         delay: preDelay + Math.abs(target.x - this.midPoint.x) * 1.5,
         exponent: 0.5,
         type: "ease-out",
         onStart: () => {
            tracker.opacity = 0;
            tracker.x = tracker.baseX = target.x;
            tracker.y = tracker.baseY = target.y + distance;
         },
         callback: (percIncr) => {
            tracker.element.style.color = "green";
            tracker.baseX += (target.x - tracker.baseX) * percIncr;
            tracker.baseY += (target.y - tracker.baseY) * percIncr;
            tracker.opacity += percIncr;
         },
         onComplete: () => {
            tracker.flyin = null;
            tracker.opacity = 1;
            this.handleTweenComplete();
         },
      };

      tracker.flyin = addTween(tweenParams);
      // console.log("new flyin", tracker.flyin)
   });
};

const getDistance = (point1, point2) => {
   const dx = point2.x - point1.x;
   const dy = point2.y - point1.y;
   return Math.sqrt(dx * dx + dy * dy);
};

funText.prototype.matchWithTrajectoryOption = function (trackers) {
   this.addGuides(trackers.length);
   //map array to retain original index after array is spliced
   const availablePositions = this.explodeGuides.map((e, i) => {
      return {
         index: i,
         value: e,
      };
   });
   const availableTrackers = trackers.map((e, i) => {
      return {
         index: i,
         value: e,
      };
   });
   const findCleanMatch = (positions, trackers) => {
      for (let i = 0; i < positions.length; i++) {
         const trackerDistances = trackers.map((tracker) => {
            return getDistance(tracker.value, positions[i].value);
         });
         const minTrackerIndex = trackerDistances.indexOf(
            Math.min(...trackerDistances)
         );
         const positionDistances = positions.map((testPosition) => {
            return getDistance(
               trackers[minTrackerIndex].value,
               testPosition.value
            );
         });
         const minPositionIndex = positionDistances.indexOf(
            Math.min(...positionDistances)
         );
         if (minPositionIndex === i)
            return { trackerIndex: minTrackerIndex, positionIndex: i };
      }
      return null;
   };

   const matches = [];
   while (availablePositions.length > 0) {
      const { trackerIndex, positionIndex } = findCleanMatch(
         availablePositions,
         availableTrackers
      );
      matches.push({
         trackerIndex: availableTrackers[trackerIndex].index,
         positionIndex: availablePositions[positionIndex].index,
      });
      availablePositions.splice(positionIndex, 1);
      availableTrackers.splice(trackerIndex, 1);
   }
   return matches;
};

funText.prototype.getRandomXY = function () {
   return {
      x: padding + Math.random() * (this.playArea.width - padding * 2),
      y: padding + Math.random() * (this.playArea.height - padding * 2),
   };
};

funText.prototype.start = function () {};

funText.prototype.kill = function () {
   // this.trackedSpans = null;
   // this.trackingSpans = null;
};

funText.prototype.letterForces = function () {
   // if (!this.looseTrackers) return;
   //this.looseTrackers.forEach((letterA, i) => {
   //  letterA.opacity = Math.max(letterA.opacity - 0.001, 0);
   // const [dx, dy] = [
   //    letterA.x - this.midPoint.x,
   //    letterA.y - this.midPoint.y,
   // ];
   // const d = Math.sqrt(dx * dx + dy * dy) * 0.01;
   // const invsd = d * d * 0.001;
   // const pullX = -dx * invsd * 0.1;
   // const pullY = -dy * invsd * 0.1;
   // letterA.vx += pullX;
   // letterA.vy += pullY;
   // if (this.targets.length) {
   //    this.targets.forEach((targetLetter, targetIndex) => {
   //       const [dx, dy] = [
   //          letterA.x - targetLetter.x,
   //          letterA.y - targetLetter.y,
   //       ];
   //       const d = Math.sqrt(dx * dx + dy * dy) * 0.1;
   //       const invsd = (1 / (d * d)) * 0.001;
   //       const pullX = -dx * invsd * 0.1;
   //       const pullY = -dy * invsd * 0.1;
   //       letterA.vx += pullX;
   //       letterA.vy += pullY;
   //    });
   // }
   // this.looseTrackers.forEach((letterB, j) => {
   // if (j !== i) {
   //    const [dx, dy] = [letterA.x - letterB.x, letterA.y - letterB.y];
   //    const d = Math.sqrt(dx * dx + dy * dy) * 0.1;
   //    const invsd = 1 / (d * d * d);
   //    const pushX = -dx * invsd * 0.1;
   //    const pushY = -dy * invsd * 0.1;
   //    letterB.vx += pushX;
   //    letterB.vy += pushY;
   // }
   //});
   // });
};

funText.prototype.flyaway = function (e) {
   if (e.opacity > 0) {
      e.vy *= 1.04;
      //const opacity = 1.5 - Math.abs(e.y - this.midPoint.y) / 80;
      const opacity = e.opacity - 0.01;
      e.opacity = Math.max(Math.min(opacity, 1), 0);
      e.baseX += e.vx;
      e.baseY += e.vy;
   }
};

funText.prototype.findTarget = function (e, delta) {
   //general updates
};

funText.prototype.updateTracker = function (e, delta) {
   if (e.enterTimer < 0) {
      e.enterTimer += 1;
      return;
   }

   // if (e.vFontSizeTarget) {
   //    e.vFontSize;
   // }

   // if (e.link == null) {
   //    if (e.exitTimer < 0) {
   //       e.exitTimer += 1;
   //    } else {
   //       e.baseX = e.x;
   //       e.baseY = e.y;
   //       e.lockstep = true;
   //       this.flyaway(e, delta);
   //    }
   // }

   //if (e.link != null) e.opacity = Math.min(e.opacity + 0.01, 1);

   e.xp = e.x / this.playArea.width;
   e.yp = e.y / this.playArea.height;

   e.x = e.baseX;
   e.y = e.baseY - this.sway;

   // if (e.lockstep) {
   //    e.x = e.baseX;
   //    e.y = e.baseY;
   // } else {
   //    e.x += (e.baseX - e.x) * 0.08;
   //    e.y += (e.baseY - e.y) * 0.08;

   //    if (getDistance(e, { x: e.baseX, y: e.baseY }) < 0.2) {
   //       e.lockstep = true;
   //    }
   // }
};

funText.prototype.scrollChange = function (amount) {
   //this.swayTarget += amount;
};

funText.prototype.update = function (delta) {
   const scrollY = window.scrollY;
   const scrollChange = scrollY - this.prevScrollY;
   this.prevScrollY = scrollY;
   this.sway += scrollChange * 0.1;
   this.sway *= 0.95;

   //this.sway += (this.swayTarget - this.sway) * 0.65;

   // this.swayTarget *= 0.8;

   // this.sway = this.swayTarget;

   this.deltaMod += (Math.pow(this.queue.length, 1.5) - this.deltaMod) * 0.2;
   if (this.deltaMod < 1) this.deltaMod = 1;

  // updateTweens(delta * this.deltaMod);

   this.trackers.forEach((e, i) => {
      this.updateTracker(e, delta);

      // const force = 1 / Math.sqrt(md * md * md);

      //const mousePoint = new Vector(this.mouse.x, this.mouse.y);
      // const trackerPoint = new Vector(e.x, e.y);
      // const md = mousePoint.subtract(trackerPoint).length();

      // for(var i = 0; i <1000000; i++){
      //    const vv = {x:this.mouse.x, y:this.mouse.y}
      // }
      // console.log(md);

      if (i == 0) {
         //const mouseAngle = mousePoint.angleToPoint(trackerPoint);

         e.element.style.color = "#ff0000";
      }

      // if (md < 20) {
      //     e.element.style.color = "red";
      // } else {
      //    if ((!e.shifting && !e.flyin && !e.flyout && !e.morphing)) {
      //       e.element.style.color = debugColors.default;
      //    }
      // }

      e.element.style.left = e.x + "px";
      e.element.style.top = e.y + "px";

      //e.element.color = debugColors.default;
      // if(e.shifting)e.element.color = debugColors.shifting;

      // e.element.style.color = e.;
      // e.element.style.color = e.animating ? "yellow" : "white";
      // e.element.style.color = e.lockstep ? "yellow" : "white";
      // if (e.link == null) e.element.style.color = "red";
      e.element.style.opacity = Math.min(e.opacity, 1);
   });
};
export { funText, getMinimumCharsFromStrings };
