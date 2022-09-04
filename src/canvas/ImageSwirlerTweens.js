import { addTween } from "../utility/Tweens";

export let fadeSunTween = function () {
   let brightnessTarget = 0;
   let duration = 1000;
   let delay = 0;
   if (this.sunTween) {
      duration *= this.sunTween.percTime;
      if (this.sunTween) this.sunTween.remove();
   }
   const sunTween = {
      duration,
      delay,
      exponent: 1,
      type: "ease-in-out",
      callback: (percIncr) => {
         // console.log("target", brightnessTarget, percIncr);
         this.brightness += (brightnessTarget - this.brightness) * percIncr;
      },
      onComplete: () => {
         this.brightness = brightnessTarget;
      },
   };
   this.sunTween = addTween(sunTween);
};

export let switchModesWithTween = function () {
   if (this.exiting) return;

   let duration, delay, brightnessTarget;
   if (this.orbiting) {
      duration = 800;
      delay = 1300;
      brightnessTarget = 1;
   } else {
      duration = 800;
      delay = 0;
      brightnessTarget = 0;
   }
   if (this.sunTween) {
      console.log("remove old", this.sunTween.percTime);
      //duration *= this.sunTween.percTime;
      if (this.sunTween) this.sunTween.remove();
   }
   const sunTween = {
      duration,
      delay,
      exponent: 1,
      type: "ease-in-out",
      callback: (percIncr) => {
         // console.log("target", brightnessTarget, percIncr);
         this.brightness += (brightnessTarget - this.brightness) * percIncr;
      },
      onComplete: () => {
         this.brightness = brightnessTarget;
      },
   };

   this.sunTween = addTween(sunTween);

   /////////

   let distortX, distortY, tweenType;
   if (this.orbiting) {
      duration = 4000;
      delay = 0;
      distortX = this.orbitDistortX;
      distortY = this.orbitDistortY;
      tweenType = "ease-in-out";
   } else {
      duration = 4000;
      delay = 0;
      distortX = this.pixDistortX;
      distortY = this.pixDistortY;
      tweenType = "ease-out";
   }

   if (this.distortTween) {
      //duration *= this.distortTween.percTime;
     
   }
   if (this.distortTween) this.distortTween.remove();
   const distortTween = {
      duration,
      delay,
      exponent: 1,
      type: tweenType,
      callback: (percIncr) => {
         this.xDistort += (distortX - this.xDistort) * percIncr;
         this.yDistort += (distortY - this.yDistort) * percIncr;

         if (this.distortTween.percTime > 0.75) {
         }
      },
      onComplete: () => {
         this.xDistort = distortX;
         this.yDistort = distortY;

         if (this.orbiting) {
            this.enableSunClick = true;
         } else {
            this.enableImageClick = true;
         }
         this.testHover();
         if (!this.orbiting) this.enableRepel = true;
      },
   };

  // this.distortTween = addTween(distortTween);

   console.log("this.orbiting", this.orbiting)

   tweenType = this.orbiting ? "ease-in-out" : "ease-in-out";

   for (var i = 0; i < this.smartPixels.length; i++) {
      const sp = this.smartPixels[i];
      sp.real.lockToTarget = false;
      sp.mod.x = 0;
      sp.mod.y = 0;
      sp.mod.vx = 0;
      sp.mod.vy = 0;
      let skipAhead = 0;
      let duration = 1;
      if (this.orbiting) {
         sp.real.target = sp.orbit;
         duration = 3000 //Math.pow(Math.hypot(sp.orbit.x, sp.orbit.y), 0.3) * 1400;
      } else {
         sp.real.trail = [];
         sp.real.target = sp.pix;
         duration = 1000 //Math.pow(sp.pix.distance, 0.4) * 400;
         //reduce tween by how far through previous tween
        // if (sp.tween) duration *= sp.tween.percTween;
      }
      const tweenParams = {
         duration,
         delay: 0,
         exponent: 1,
         type: tweenType,
         callback: (percIncr) => {
            const t = sp.real.target;
            sp.real.x += (t.x - sp.real.x) * percIncr;
            sp.real.y += (t.y - sp.real.y) * percIncr;
            sp.real.width += (t.width - sp.real.width) * percIncr;
            sp.real.height += (t.height - sp.real.height) * percIncr;
            sp.real.alpha += (t.alpha - sp.real.alpha) * percIncr;
         },
         onComplete: () => {
            sp.real.lockToTarget = true;
         },
      };

      if (sp.tween) sp.tween.remove();
      sp.tween = addTween(tweenParams);
   }
   if (!this.orbiting) {
      this.onCloseOrbit();
   }
};
