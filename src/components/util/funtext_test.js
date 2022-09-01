import { isFirefox } from "react-device-detect";
import { addTween, updateTween, updateTweens } from "../../utility/Tweens";
import extender from "./extender";

import { gravity } from "./textGravity.js";

import { Vector } from "./vector";

const padding = 50;
const maxVelocity = 300;
//const maxVelocity = 30;
const getDistance = (point1, point2) => {
   const dx = point2.x - point1.x;
   const dy = point2.y - point1.y;
   return Math.sqrt(dx * dx + dy * dy);
};

function Target(e, playArea) {
   // const rect = e.getBoundingClientRect();
   // const x = rect.left + rect.width * 0.5 //- playArea.x;
   // const y = rect.top + rect.height * 0.8 // - playArea.y;
   Vector.call(this, e.x, e.y);
   this.element = e.element;
   this.base = {
      fontWeight: e.fontWeight,
      fontSize: e.fontSize,
      color: e.color,
   };
   this.char = e.char;
}

extender(Target, Vector, {});

function Repeller(e, playArea) {
   const rect = e.getBoundingClientRect();
   const x = rect.left;
   const y = rect.top;
   Vector.call(this, x, y);
   this.element = e;
   this.text = e.innerText;
}

extender(Repeller, Vector, {});

//aim is where tracker "wants" to be. used for tweens and moves indpendant of actual location.
function Tracker(e) {
   Vector.call(this, 0, 0);
   this.vx = 0;
   this.vy = 0;
   //this.element = e;
   this.char = e;
   this.aim = new Vector(0, 0);
   this.link = null;
   this.opacity = 0;
   this.lockstep = true;
   this.flyin = null;
   this.flyout = null;
   this.shifting = null;
   this.morphing = null;
   this.isTouched = false;
   this.pushForce = 0;
   this.pullForce = 0;
   this.rotation = 0;
   this.randomPosNeg = Math.random() >= 0.5 ? 1 : -1;
   this.scale = 1;
   // this.element.style.transform = "translate(-50%,-50%)";
}
extender(Tracker, Vector, {
   getChar() {
      return "my char!";
   },
});
//invert Y for vector system
const createVector = (x, y) => new Vector(x, -y);

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

const funText = function (playArea, repellingObjects, callback) {
   this.targets = [];
   this.trackers = [];
   this.explodeGuides = [];
   this.queue = [];
   this.deltaMod = 1;
   this.sway = 0;
   this.swayTarget = 0;
   this.prevScrollY = 0;
   this.playArea = getParams(playArea);
   this.mouse = createVector(0, 0);
   this.midPoint = createVector(0, 0);
   this.callback = callback;

   // this.repellingObjects = repellingObjects.map((e) => {
   //    return new Repeller(e);
   // });

   this.repellingObjects = repellingObjects;

   this.fixedRepellers = repellingObjects.map((e) => {
      let v = new Vector(e.x + e.width * 0.5, e.y + e.height * 0.5);

      v.element = e.element;
      v.xPower = e.xPower;
      v.yPower = e.yPower;
      v.power = e.power;
      v.xFix = 0;
      return v;
   });

   //this.updateRepellerParams();

   window.addEventListener("mousemove", (e) => {
      this.mouse.x = e.clientX - this.playArea.x;
      this.mouse.y = e.clientY - this.playArea.y;
   });
};
funText.prototype.scrollChange = function (amount) {
   //this.updateRepellerParams();
};

const getParams = (element) => {
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
   // this.queue.splice(0, 1);
   // setTimeout(()=>{
   //if (this.queue.length > 0) this.loadTargets(this.queue[0]);
   //},1000)
};

funText.prototype.setTrackers = function (spansArr) {
   // console.log("setTrackers");
   this.trackers = spansArr.map((e, i) => new Tracker(e));
};

funText.prototype.allLetters = function (letters) {
   // console.log("all letters", letters);
   this.trackers = [];

   for (let i = 0; i < letters.length; i++) {
      const t = new Tracker(letters[i]);
      this.trackers.push(t);
      console.log("add tracker");
   }
   // console.log("added trackers", this.trackers);
};

funText.prototype.resize = function ({ x: midX, y: midY }) {
   this.midX = midX;
   this.midY = midY;

   if (!this.playArea) return;

   this.playArea = getParams(this.playArea.element);
   this.targets.forEach((e) => {
      const rect = e.element.getBoundingClientRect();
      e.x = rect.left + rect.width * 0.5; //- this.playArea.x;
      e.y = rect.top + rect.height * 0.8; //- this.playArea.y;
   });
   this.trackers.forEach((e) => {
      e.lockstep = false;
      if (e.link != null) {
         // console.log("change aim")
         e.aim.x = this.targets[e.link].x;
         e.aim.y = this.targets[e.link].y;
      }
   });

   this.fixAlignedPushers();

   //this.updateRepellerParams();
};

funText.prototype.findTrackerMatch = function (targetChar) {
   const index = this.trackers.findIndex((e) => {
      return e.char === targetChar && e.link == null;
   });
   return index;
};

funText.prototype.queueTargets = function (spansArr, centrePoint, direction) {
   // console.log("queueTargets", spansArr);
   // this.queue.push({ spansArr: [...spansArr], centrePoint, direction });
   //  console.log("queue length", this.queue.length);
   // if (this.isSwitchingText()) return;
   // if (this.queue.length == 1) {
   //    this.loadTargets(this.queue[0]);
   // }

   

   // if(this.hasStarted){
   //    return;
   // }

   // if(spansArr.length)this.hasStarted = true;
   // console.log("queuetargets", spansArr)


   this.loadTargets({ spansArr, centrePoint, direction });
};

const removeAllTweens = function (t) {
   // console.log("remove all", t);
   //  if (t.morphing) t.morphing.remove();
   // if (t.flyout) t.flyout.remove();
   if (t.shifting) t.shifting.remove();
   if (t.flyin) t.flyin.remove();
   // t.morphing = null;
   // t.flyout = null;
   t.shifting = null;
   t.flyin = null;
};

funText.prototype.loadTargets = function ({
   spansArr,
   centrePoint,
   direction,
}) {
   //console.log("loadtargets", spansArr);
   this.midPoint.x = centrePoint.x - this.playArea.x;
   this.midPoint.y = centrePoint.y; //this.getMidPoint();
   const flyInDistance = 150;
   const flyOutDistance = 150;
   this.targets = spansArr.map((e, i) => new Target(e, this.playArea));

   const prevLinked = this.trackers.filter((tracker) => tracker.link != null);

   //console.log("PREVLINKED", prevLinked)
   //reset link so can begin search cycle
   // this.handleTweenComplete();
   this.trackers.forEach((tracker) => {
      tracker.link = null;
      removeAllTweens(tracker);
      // tracker.lockstep = true;
   });

   const matched = [];
   this.targets.forEach((target, index) => {
      const trackerIndex = this.findTrackerMatch(target.char);

      if (trackerIndex !== -1) {
         //  console.log("found link")
         const t = this.trackers[trackerIndex];

         // const values = getCSSValues(target.element, [
         //    "font-size",
         //    "font-weight",
         //    "color",
         // ]);

         if (!t.fontSize) t.fontSize = target.base.fontSize;
         if (!t.fontWeight) t.fontWeight = target.base.fontWeight;
         t.fontSizeTarget = target.base.fontSize;
         t.fontWeightTarget = target.base.fontWeight;
         t.color = target.base.color;

         // if (t.morphing) t.morphing.remove();

         const tweenParams = {
            duration: 800,
            delay: 0 + Math.abs(target.x - this.midPoint.x) * 0.5,
            exponent: 0.8,
            callback: (percIncr) => {
               t.fontSize += (t.fontSizeTarget - t.fontSize) * percIncr;
               // t.element.style.fontSize = t.fontSize + "px";
               t.fontWeight += (t.fontWeightTarget - t.fontWeight) * percIncr;
               //  t.element.style.fontWeight = t.fontWeight;
               // t.element.style.color = "purple";
            },
            onComplete: () => {
               t.morphing = null;
               //  console.log("complete morph")
               //  this.handleTweenComplete();
            },
         };
         if (t.morphing) t.morphing.remove();
         t.morphing = addTween(tweenParams);
         if (t.flyout) t.flyout.remove();

         // matchedTracker.element.style.fontWeight = fontWeight;
         t.link = index;
         matched.push(t);
      }
   });

   const newLinks = matched.filter((tracker) => !prevLinked.includes(tracker));
   const oldLinks = matched.filter((tracker) => prevLinked.includes(tracker));
   const unlinked = prevLinked.filter((tracker) => !matched.includes(tracker));
   this.activeTrackers = [...newLinks, ...oldLinks];

   //console.log("OLD LINKS", oldLinks);

   unlinked.forEach((tracker, i) => {
      tracker.link = null;
      // tracker.lockstep = true;
      let distance;
      if (direction === "up") distance = -flyInDistance;
      if (direction === "down") distance = flyOutDistance;
      const targetY = tracker.y - distance;

      const duration = Math.abs(tracker.x - this.midPoint.x) * 0.5 + 200;
      // tracker.lockstep = true

      // if (!duration) {
      //    console.log("duration error", tracker.x, tracker);
      // }

      const tweenParams = {
         duration,
         // delay: 400 - Math.abs(tracker.x - this.midPoint.x) * 0.2,
         delay: 0,
         exponent: 1,
         type: "ease-in-out",
         callback: (percIncr) => {
            tracker.aim.y += (targetY - tracker.aim.y) * percIncr;
            tracker.opacity += (0 - tracker.opacity) * percIncr;
            //tracker.element.style.color = "red";
         },
         onComplete: () => {
            tracker.flyout = null;
            tracker.opacity = 0;

            tracker.aim.y = targetY;
            // this.handleTweenComplete();
            // tracker.element.style.color = "black";
         },
      };

      //removeAllTweens(tracker);
      tracker.flyout = addTween(tweenParams);
   });

   //existing letters on screen. If tracker is still "flyin" from prior view, kill old tween.
   oldLinks.forEach((tracker, i) => {
      let preDelay = 0;
      const target = this.targets[tracker.link];

      // if(tracker.shifting)tracker.shifting.remove();
      // removeAllTweens(tracker);

      const tweenParams = {
         duration: 600,
         delay: 0, //preDelay + Math.abs(target.x - this.midPoint.x) * 2,
         exponent: 1,
         onStart: () => {
            // console.log("shift sSTART")
            tracker.opacity = 1;
            // tracker.lockstep = true;
         },
         callback: (percIncr) => {
            // console.log("shift perc", percIncr)
            // tracker.element.style.color = "yellow";
            tracker.aim.x += (target.x - tracker.aim.x) * percIncr;
            tracker.aim.y += (target.y - tracker.aim.y) * percIncr;
         },
         onComplete: () => {
            //  console.log("SHIFT end")
            tracker.shifting = null;
            tracker.aim.x = target.x;
            tracker.aim.y = target.y;
            //tracker.lockstep = false;
            this.handleTweenComplete();
         },
      };
      // if (tracker.flyout) tracker.flyout.remove();
      //  if (tracker.shifting) tracker.shifting.remove();
      tracker.shifting = addTween(tweenParams);
   });

   newLinks.forEach((tracker) => {
      const target = this.targets[tracker.link];
      const preDelay = 0; //tracker.flyout ? 1200 : 200;
      let distance;
      if (direction === "up") distance = -flyOutDistance;
      if (direction === "down") distance = flyOutDistance;

      if (tracker.flyin) tracker.flyin.remove();
      if (tracker.flyout) tracker.flyout.remove();
      //  removeAllTweens(tracker);

      const tweenParams = {
         duration: 500,
         // delay: Math.pow(Math.abs(target.x - this.midPoint.x), 0.5) * 30,
         delay: preDelay + Math.abs(target.x - this.midPoint.x) * 1.2,
         exponent: 1,
         type: "ease-out",
         onStart: () => {
            tracker.lockstep = true;
            tracker.opacity = 0;
            tracker.x = tracker.aim.x = target.x;
            tracker.y = tracker.aim.y = target.y + distance;
         },
         callback: (percIncr) => {
            //tracker.element.style.color = "green";
            tracker.aim.x += (target.x - tracker.aim.x) * percIncr;
            tracker.aim.y += (target.y - tracker.aim.y) * percIncr;
            tracker.opacity += percIncr;
         },
         onComplete: () => {
            tracker.aim.x = target.x;
            tracker.aim.y = target.y;
            tracker.flyin = null;
            tracker.opacity = 1;
            //this.handleTweenComplete();
         },
      };

      // if (tracker.flyout) tracker.flyout.remove();
      // if (tracker.flyin) tracker.flyin.remove();

      tracker.flyin = addTween(tweenParams);
      // console.log("new flyin", tracker.flyin)
   });

   //in case incoming array ie empty. must flat "animmation" as complete to not hold up queue
   if (!newLinks.length) {
     this.handleTweenComplete();
   }

   this.fixAlignedPushers();
};

funText.prototype.fixAlignedPushers = function () {
   this.fixedRepellers.forEach((e) => {
      e.xFix = 0;
   });
   this.updateRepellerParams();
};

funText.prototype.getRandomXY = function () {
   return {
      x: padding + Math.random() * (this.playArea.width - padding * 2),
      y: padding + Math.random() * (this.playArea.height - padding * 2),
   };
};

funText.prototype.start = function () {};

funText.prototype.kill = function () {
   console.log("KILL", this.trackers.length);
   this.trackers.forEach((e, i) => {
      // console.log(e)
      if (e.flyin) {
         console.log("remove flyin");
      }
      if (e.flyout) {
         console.log("remove flyout");
      }
      if (e.shifting) {
         console.log("remove shifting");
      }
      if (e.morphing) {
         console.log("remove morphing");
      }
   });

   // this.trackedSpans = null;
   // this.trackingSpans = null;
};

funText.prototype.updateRepellerParams = function () {
   for (var i = 0; i < this.repellingObjects.length; i++) {
      const r = this.repellingObjects[i];

      this.fixedRepellers[i].x =
         r.x - this.playArea.x + this.fixedRepellers[i].xFix;
      this.fixedRepellers[i].y = r.y - this.playArea.y;

      const distanceFromCenter = r.y - this.midPoint.y;

      if (distanceFromCenter > 400 || distanceFromCenter < -400) {
         this.fixedRepellers[i].disabled = true;
      } else {
         this.fixedRepellers[i].disabled = false;
      }
   }
};

funText.prototype.draw = function ({ context, canvas, delta, ratio }) {


   // console.log("delta", delta)
   // const scrollY = window.scrollY;
   // const scrollChange = scrollY - this.prevScrollY;
   // this.prevScrollY = scrollY;
   // this.sway += scrollChange * 0.1;
   // this.sway *= 0.95;

   //this.sway += (this.swayTarget - this.sway) * 0.65;

   // this.swayTarget *= 0.8;

   // this.sway = this.swayTarget;

   //acclerated by tweening mod towards target. Should set target less often.
   this.deltaMod += (Math.pow(this.queue.length, 1.5) - this.deltaMod) * 0.2;

   // console.log(this.queue.length)
   if (this.deltaMod < 1) this.deltaMod = 1;
   if (this.deltaMod > 10) this.deltaMod = 10;

   const newDelta = delta * this.deltaMod;

   updateTweens(newDelta);

   this.handleTweenComplete();

   //const pullers = this.trackers.map((e) => e.aim);
   //const gravObjects = this.trackers.filter((e)=>e.)

   this.updateRepellerParams();
   if (this.activeTrackers) {
      for (let i = 0; i < this.activeTrackers.length; i++) {
         const t = this.activeTrackers[i];
         gravity([t], [t.aim], this.fixedRepellers, delta);
      }

      // if (!e.lockstep) {
   }

   //console.log("draw", this.trackers.length)

   this.fixedRepellers.forEach((e, i) => {
      // e.element.style.color = 'yellow'
      // const scale = Math.min(e.closestPoint * .03, 1);
      // e.element.style.transform = `scale(${scale})`
      // e.closestPoint = null;
   });

   // console.log("update trackers", this.trackers.length);

   this.trackers.forEach((e, i) => {
      //  console.log("tracker", e);
      const distFromAim = e.subtract(e.aim).length;

      // if(this.trackers[i].shifting){
      //    console.log(this.trackers[i].char)
      // }

      e.scale = 1 + e.pullForce * 200;

      if (e.char === "#") {
         ///   console.log("push", e.pushForce);
         //  console.log("repel y", this.fixedRepellers[0].y);
      }

      if (e.pushForce > 0) {
         //  console.log("unlock")
         e.lockstep = false;
      } else {
         // if (e.pullForce < 0.8) {
         if (distFromAim < 0.3) {
            e.lockstep = true;
            e.pullForce = 0;
            e.vx = 0;
            e.vy = 0;
            e.x = e.aim.x;
            e.y = e.aim.y;
         }
         // }
      }
      //dampen

      // if (distFromAim > 30 && Math.abs(e.vx) === 0) {

      //    e.vx += (e.randomPosNeg * 2);
      // }

      const decayTweenDelta = Math.pow(0.97, delta);
      e.vx *= decayTweenDelta;
      e.vy *= decayTweenDelta;

      // if (distFromAim < 0.1 && Math.abs(e.vx < 0.1) && Math.abs(e.vy) < 0.1) {
      //    e.x = e.aim.x;
      //    e.y = e.aim.y;
      //    // letter.ref.style.color = "red";
      // }

      const vel = Math.sqrt(e.vx * e.vx + e.vy * e.vy);
      if (vel !== 0) {
         const limitVel = Math.min(vel, maxVelocity);
         const limitRatio = limitVel / vel;
         e.vx *= limitRatio;
         e.vy *= limitRatio;
      }

      if (e.lockstep) {
         e.x = e.aim.x;
         e.y = e.aim.y;
      } else {
         e.x += e.vx * delta;
         e.y += e.vy * delta;
      }

      e.xp = e.x / this.playArea.width;
      e.yp = e.y / this.playArea.height;

      context.font = `${e.fontWeight} ${e.fontSize}px Albert Sans`;
      const letter = e.char;

      //console.log(distFromAim)

      //console.log(distFromAim)
      this.callback(context, e, distFromAim);

      context.textAlign = "center";

      context.fillText(letter, e.x, e.y);

      // e.element.style.left = e.x * 2 + "px";
      // e.element.style.top = e.y * 2 + "px";
      // e.element.style.zIndex = Math.round(distFromAim);

      // e.element.style.opacity = Math.min(e.opacity, 1);
      // if (e.opacity === 0) {
      //    //e.element.style.visibility = "hidden"
      //    //console.log('hide')
      // }

      // this.callback(e, distFromAim);
   });
};
export { funText, getMinimumCharsFromStrings };
