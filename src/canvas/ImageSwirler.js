import { toRadians, xyNorms, toAngle, limitAngle } from "../utility/common";
import { addTween, updateTweens } from "../utility/Tweens";
import { ImageHelper, createImageData } from "../utility/ImageHelper";
import TouchAndMouse from "./TouchAndMouse";

import { limitVectorVelocity } from "./ParticleForces";
import { switchModesWithTween, fadeSunTween } from "./ImageSwirlerTweens";
import { draw } from "./ImageSwirlerUpdate";

import star from "../images/star.png";
import orb from "../images/orb.png";

let speedMod = 0.27;
const baseVelocity = Math.pow(2, 0.5) * 0.01;
const velDeviation = 0.001;
const angleDeviation = 20;
const orbitRadius = 190;
const deadZone = 2;

const testObject = {
   x: 20,
   y: 40,
};

const gaussianRand = (itterations = 6) => {
   let rand = 0;
   for (let i = 0; i < itterations; i += 1) {
      rand += Math.random();
   }
   return rand / itterations;
};

const ImageSwirler = function () {
   this.name = "ImageSwirler";
   this.orbiting = false;
   this.brightness = 0;
   let tapTimer = null;
   let touchStartX = null;
   let touchStartY = null;
   this.hasTouched = false;
   this.exiting = false;
   this.pixDistortX = 1;
   this.pixDistortY = 1;
   this.orbitDistortY = 20;
   this.orbitDistortX = this.orbitDistortY * 1.618;
   this.enableRepel = true;

   this.xDistort = this.pixDistortX;
   this.yDistort = this.pixDistortY;
   this.starImage = new Image();
   this.starImage.src = star;
   this.orb = new Image();
   this.orb.src = orb;
   this.plugholeStrength = 1;
   this.finished = false;
   this.fadeSunTween = fadeSunTween;
   this.sunScale = 1;
   this.enableImageClick = true;
   this.enableSunClick = false;

   //add external methods
   this.switchModesWithTween = switchModesWithTween;
   this.draw = draw;
};
ImageSwirler.prototype.unload = function () {
   if(!this.touchAndMouse)return;
   this.touchAndMouse.unload();
};

ImageSwirler.prototype.transMouse = function(mouseX, mouseY){
   return {x: mouseX - this.left, y:mouseY - this.top}
}

ImageSwirler.prototype.init = function (context, canvas) {
   this.showPointer = false;
   this.canvas = canvas;
   this.width = 100
   this.height = 100
   this.touchAndMouse = new TouchAndMouse({
      el: canvas,
      tap: (x, y) => {
         this.mouseX = x
         this.mouseY = y
         this.testTap(x, y);
         console.log("tap", x,y)
      },
      down: (x, y) => {
         this.mouseX = x;
         this.mouseY = y;
         console.log("down", x,y)
      },
      up: (x, y) => {
         this.mouseX = null;
         this.mouseY = null;
      },
      move: (x, y) => {
         const {x:fixX, y:fixY} = this.transMouse(x, y)
         this.mouseX = fixX;
         this.mouseY = fixY;
         if (!this.exploding) this.testHover();
      },
   });
};

ImageSwirler.prototype.testHover = function () {
   if (this.enableImageClick && this.testHoverImage()) {
      if (this.showPointer) return;
      this.canvas.style.cursor = "pointer";
      this.showPointer = true;
      return;
   }
   if (this.enableSunClick && this.testHoverSun()) {
      if (this.showPointer) return;
      this.canvas.style.cursor = "pointer";
      this.showPointer = true;
      return;
   }
   if (!this.showPointer) return;
   this.canvas.style.cursor = "default";
   this.showPointer = false;
};

ImageSwirler.prototype.testTap = function (x, y) {
   if (this.exiting || this.exploding) return;

   

   if (this.enableImageClick && this.testHoverImage()) {
      this.enableImageClick = false;
      this.canvas.style.cursor = "default";
      this.showPointer = false;
      this.enableRepel = false;
      setTimeout(() => {
         console.log("switch modes")
         this.orbiting = true;
         this.switchModesWithTween();
      }, 200);
      return;
   }

   if (this.enableSunClick && this.testHoverSun()) {
      this.exitAnimation();
      return;
      
   }

   if(this.enableSunClick){
      this.enableSunClick = false;
      this.canvas.style.cursor = "default";
      this.showPointer = false;
      this.orbiting = false;
      
      this.switchModesWithTween();

   }
};

ImageSwirler.prototype.testHoverImage = function () {
   const [x, y] = [this.mouseX, this.mouseY];

   
   const limit = this.imageWidth * 0.5;
   if (x < this.midX - limit) return false;
   if (x > this.midX + limit) return false;
   if (y < this.midY - limit) return false;
   if (y > this.midY + limit) return false;
   return true;
};

ImageSwirler.prototype.testHoverSun = function () {
   const [x, y] = [this.mouseX, this.mouseY];
   const d = Math.hypot(x - this.midX, y - this.midY);
   const limit = 40;
   if (d > limit) return false;
   return true;
};

ImageSwirler.prototype.loadImage = function (
   img,
   onImageHeight,
   onCloseOrbit,
   onComplete
) {
   console.log("loadImage", img)
   this.onImageHeight = onImageHeight;
   this.onCloseOrbit = onCloseOrbit;
   this.onComplete = onComplete;

  // this.onCloseOrbit();

   ImageHelper(img, (data) => {
      this.imageData = data;

      this.smartPixels = data.pixels
         .map((e, i) => {
            const [col, row] = data.positionFromIndex(i);

            return {
               pix: {
                  rgba: e,
                  col,
                  row,
                  x: 0,
                  y: 0,
                  vx: 0,
                  vy: 0,
               },
               orbit: {},
               real: [{}],
               mod: {
                  x: 0,
                  y: 0,
                  vx: 0,
                  vy: 0,
                  vel: 0,
               },
            };
         })
         .filter((e) => {
            const [r, g, b, a] = e.pix.rgba;
            if (r + g + b < 0) return false;
            return true;
         });

      //  console.log("count", this.smartPixels.length, data.pixels.length);
      this.calcPixelOrigins(true);

      
     // console.log(this.smartPixels)
      this.matchPixelsToOrbits();

      for (let i = 0; i < this.smartPixels.length; i++) {
         const sp = this.smartPixels[i];

         sp.real.x = sp.pix.x;
         sp.real.y = sp.pix.y;
         sp.real.height = sp.orbit.height;
         sp.real.width = sp.orbit.width;
         sp.real.alpha = sp.orbit.alpha;
         sp.real.trail = [];
         sp.real.lockToTarget = true;
         sp.real.target = sp.pix;
      }
   });

   //called from React component. Inside anon function to allocate "this" to ImageHelper instance
   return () => this.exitAnimation();
};

ImageSwirler.prototype.exitAnimation = function () {
   // this.sinkParticles();
   this.explode();
};

ImageSwirler.prototype.explode = function () {
   if (this.exploding) return;

   this.exiting = true;

   this.exploding = true;

   const force = this.orbiting ? 0.005 : 0.4;

   for (var i = 0; i < this.smartPixels.length; i++) {
      const sp = this.smartPixels[i];
      sp.real.lockToTarget = false;
      sp.orbit.hasTail = false;
      sp.real.trail = [];

      if (i === 0) console.log(sp.pix);
      const t = sp.real.target;

      t.x = sp.real.x;
      t.y = sp.real.y;
      if (t.tween) t.tween.remove();
      let explodeAngle;
      if (this.orbiting) {
         explodeAngle = toAngle(t.x, t.y) + (Math.random() * 90 - 45);
      } else {
         explodeAngle = Math.random() * 360; //toAngle(t.x, t.y);
      }

      // explodeAngle += Math.random() * 40 - 20;
      const [xNorm, yNorm] = xyNorms(explodeAngle);
      const vel = Math.max(Math.pow(t.distance, 0.8) * force, 0);
      t.vx = xNorm * vel;
      t.vy = yNorm * vel;
   }
};

ImageSwirler.prototype.sinkParticles = function () {
   if (this.exiting) return;
   // this.plugholeStrength = 4
   this.plugholeStrength = 2;
   this.plugholeRate = 1.001;
   this.plugholeDimPow = 0.5;
   this.deadZone = 0.2;
   this.slowZone = 3;
   this.fadeSunTween();
   if (!this.orbiting) {
      this.deadZone = 5;
      this.slowZone = 30;
      this.orbiting = true;
      this.plugholeStrength = 2000;
      this.plugholeRate = 1.005;
      this.plugholeDimPow = 0.5;

      for (var i = 0; i < this.smartPixels.length; i++) {
         const sp = this.smartPixels[i];
         sp.mod.x = 0;
         sp.mod.y = 0;
         sp.orbit.x = sp.real.x;
         sp.orbit.y = sp.real.y;
         const angleToCentre = toAngle(sp.real.x, sp.real.y);
         const heading = limitAngle(angleToCentre - 90, -180, 180);
         const [xvNorm, yvNorm] = xyNorms(heading);
         const velMod = baseVelocity * speedMod;
         sp.orbit.vx = xvNorm * 0.01;
         sp.orbit.vy = yvNorm * 0.01;
         sp.orbit.alpha = sp.real.alpha;
         sp.orbit.width = sp.real.width;
         sp.orbit.hasTail = false;
         sp.real.target = sp.orbit;
      }
   }

   this.exiting = true;
};

ImageSwirler.prototype.convertPixelsToOrbits = function () {
   for (var i = 0; i < this.smartPixels.length; i++) {
      const sp = this.smartPixels[i];
      sp.mod.x = 0;
      sp.mod.y = 0;
      sp.orbit.x = sp.real.x;
      sp.orbit.y = sp.real.y;
      const angleToCentre = toAngle(sp.real.x, sp.real.y);
      const heading = limitAngle(angleToCentre - 90, -180, 180);
      const [xvNorm, yvNorm] = xyNorms(heading);
      const velMod = baseVelocity * speedMod;
      sp.orbit.vx = xvNorm * baseVelocity * 2;
      sp.orbit.vy = yvNorm * baseVelocity * 1;
      sp.orbit.alpha = sp.real.alpha;
      sp.orbit.width = sp.real.width; //* 1.5;

      // sp.orbit.hasTail = true;
      sp.real.target = sp.orbit;
      sp.real.tail = [];
   }
};

ImageSwirler.prototype.matchPixelsToOrbits = function () {
   console.log("matching pixels to orbits")
   const orbits = this.getInitOrbits(this.smartPixels.length).sort((a, b) =>
      a.distance < b.distance ? 1 : -1
   );
   //calc pixel distance from centre so can match with closest orbits
   const pixDistFromMidImage = this.smartPixels
      .map((e, index) => {
         console.log("e.pix.distance", e.pix)
         return {
            distance: e.pix.distance,
            index,
         };
      })
      .sort((a, b) => (a.distance < b.distance ? 1 : -1));

   for (let i = 0; i < pixDistFromMidImage.length; i++) {
      this.smartPixels[pixDistFromMidImage[i].index].orbit = orbits[i];
   }
};

//should fire first from canvas controller.
ImageSwirler.prototype.resize = function (width, height, left, top) {
   this.width = width;
   this.height = height;
   this.midX = this.width * 0.5;
   this.midY = this.height * 0.5;
   this.left = left;
   this.top = top

 

   if (this.exploding) return; //otherwise repositions exiting particles
   if(!this.imageData)return;

   //refresh origins on resize
   this.calcPixelOrigins();

}

ImageSwirler.prototype.calcPixelOrigins = function (isInit) {
   if (!this.smartPixels) return;

   const { width, height } = this;
   console.log("width/height", width,height)
   const imageData = this.imageData;

   let imageHeight = Math.min(Math.pow(height * 0.4, 0.4) * 25, height);
   const imageWidth = Math.min(
      imageHeight * (imageData.width / imageData.height),
      width
   );
   this.imageWidth = imageWidth;

   imageHeight = imageWidth * (imageData.height / imageData.width);
  
   const roundingFactor = 1;
   // const pixelSize =
   //    Math.ceil((imageWidth / imageData.width) * roundingFactor) /
   //    roundingFactor;

   const pixelSize = imageWidth / 90;


   console.log("imageWidth", imageWidth, imageData.width)

   for (let i = 0; i < this.smartPixels.length; i++) {
      const sp = this.smartPixels[i];

      //const relX =
        // ( (sp.pix.col) / (imageData.width - 1)) * (imageWidth - pixelSize);


         const relX = sp.pix.col / (imageData.width - 1) * (imageWidth);
        

     
      
      const relY =
         (sp.pix.row / (imageData.height - 1)) * (imageHeight);
      const homeX = -imageWidth * 0.5 + relX;
      const homeY = -imageHeight * 0.5 + relY;
      const pixelWidth = pixelSize ;
      const pixelHeight = pixelSize ;
      const distance = Math.hypot(homeX, homeY);

     
    //  console.log(sp.pix.col, relX, homeX, pixelSize);


     // console.log("pixel d", distance)

     

      const rgba = [...sp.pix.rgba];
      // rgba[0] += (255 - rgba[0]) * 0.4;
      // rgba[1] += (0 - rgba[1]) * 0.2;
      // rgba[2] += (255 - rgba[2]) * 0.4;

      sp.pix.rgba = rgba;
      sp.pix.homeX = homeX;
      sp.pix.homeY = homeY;
      sp.pix.x = homeX;
      sp.pix.y = homeY;
      sp.pix.distance = distance;
      sp.pix.width = pixelWidth;
      sp.pix.height = pixelHeight;
      sp.pix.alpha = 1;
   }

   if (this.onImageHeight) {
      this.onImageHeight(imageHeight);
   }
};

ImageSwirler.prototype.getInitOrbits = function (count) {
   const orbits = [];

   console.log("GET INIT ORBITS")
   let totalTails = 0;

   for (var i = 0; i < count; i++) {
      const angleToCentre = Math.random() * 360;

      //higher exponent means more compressed at centre
      const d =
         Math.pow(gaussianRand(3) * (orbitRadius - deadZone), 3) * 0.000012 +
         deadZone;

      const [xposNorm, yposNorm] = xyNorms(angleToCentre);
      let randomDeviation = gaussianRand(10);
      let vel = baseVelocity;
      vel *= speedMod;
      let velMod = 1 - velDeviation + randomDeviation * velDeviation;
      const size = 3 + Math.pow(gaussianRand(2) * 1.29, 5);
      const heading = limitAngle(
         angleToCentre -
            90 +
            randomDeviation * angleDeviation -
            angleDeviation * 0.5,
         -180,
         180
      );
      const [xvNorm, yvNorm] = xyNorms(heading);

      let hasTail = false;
      if (totalTails < 20 && size > 4 && size < 5) {
         hasTail = true;
         totalTails++;
      }

      orbits.push({
         x: xposNorm * d,
         y: yposNorm * d,
         distance: d,
         width: size, // + d / 50,
         height: size, // + d / 50,
         alpha: 1,
         hasTail,
         scale: 1,
         vx: xvNorm * vel * velMod,
         vy: yvNorm * vel * velMod,
         vel,
      });

      const preCycle = Math.ceil(200 + Math.random() * 200 );

      //sim the latest particle added
      for (let j = 0; j < preCycle; j++) {
         const o = orbits[orbits.length - 1];
         this.simCycle(orbits[orbits.length - 1], 100);
         orbits[orbits.length - 1].x += orbits[orbits.length - 1].vx * 100;
         orbits[orbits.length - 1].y += orbits[orbits.length - 1].vy * 100;
      }
   }

   return orbits;
};

ImageSwirler.prototype.simCycle = function (p, delta, index) {
   const dx = p.x;
   const dy = p.y;
   p.d = Math.hypot(dx, dy);
   const limitedDistance = Math.max(p.d / speedMod, 2);
   let pull = (1 / (limitedDistance * limitedDistance)) * 0.0002;

   let vx_new;
   let vy_new;
   if (this.exiting) {
      //const plugStrength = Math.min(this.plugholeStrength, 100)
      pull = Math.min(pull * this.plugholeStrength, 0.1000012);
      // pull = pull * 8000

      // p.vx *= 0.97;
      // p.vy *= 0.97;
      vx_new = dx * pull;
      vy_new = dy * pull;
      const max = Math.pow(limitedDistance, this.plugholeDimPow) * 0.1;
      const { vx, vy } = limitVectorVelocity({ vx: vx_new, vy: vy_new }, max);

      if (p.d < this.slowZone) {
         const dim = p.d / this.slowZone;
         const dimMod = Math.pow(dim, 0.5);

         p.x *= dimMod;
         p.y *= dimMod;
         p.vx *= dimMod;
         p.vy *= dimMod;
      }

      if (p.d < this.deadZone) {
         p.dead = true;
         p.x = 0;
         p.y = 0;
         p.vx = 0;
         p.vy = 0;
         return;
      }

      vx_new = vx;
      vy_new = vy;
      //   vy_new *= 0.5;
      //  vx_new *= 0.5;
   } else {
      vx_new = dx * pull;
      vy_new = dy * pull;
   }
   p.vx -= vx_new * delta;
   p.vy -= vy_new * delta;
};

ImageSwirler.prototype.repelCycle2 = function (
   mod,
   target,
   forceFactor,
   distanceFactor,
   inversePow = 2,
   velLimit = 0.1,
   damp,
   delta,
   allowPush = true
) {
   if (this.mouseX && this.mouseY && allowPush) {
      const relMouseX = (this.mouseX - this.midX) / this.xDistort;
      const relMouseY = (this.mouseY - this.midY) / this.yDistort;
      const targetX = target.x + mod.x; //* this.xDistort;
      const targetY = target.y + mod.y; //* this.yDistort;
      const dx = relMouseX - targetX;
      const dy = relMouseY - targetY;
      const d = Math.max(Math.hypot(dx, dy), 1) * distanceFactor;
      const force = 1 / Math.pow(d, inversePow);

      if (!this.exiting) {
         mod.vx += -dx * force * delta * forceFactor;
         mod.vy += -dy * force * delta * forceFactor;
      }
   }

   const diminish = allowPush ? 0.0004 : 0.0013;
   const decayTweenDelta = Math.pow(damp, delta);
   mod.vx += -mod.x * diminish * delta;
   mod.vy += -mod.y * diminish * delta;
   mod.vx *= decayTweenDelta;
   mod.vy *= decayTweenDelta;
   mod.vel = Math.hypot(mod.vx, mod.vy);
   if (mod.vel !== 0) {
      const limitVel = Math.min(mod.vel, velLimit);
      const limitRatio = limitVel / mod.vel;
      mod.vx *= limitRatio;
      mod.vy *= limitRatio;
   }

   mod.x += mod.vx * delta;
   mod.y += mod.vy * delta;
};

export default ImageSwirler;
