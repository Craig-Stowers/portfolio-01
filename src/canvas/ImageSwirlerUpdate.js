import { updateTweens } from "../utility/Tweens";

export const draw = function ({ context: ctx, canvas, delta, ratio }) {
   if (!this.smartPixels) return;
   delta = Math.min(delta, 100);
   if (this.exiting) {
      this.plugholeStrength *= Math.pow(this.plugholeRate, delta);
   }

   //  console.log(this.plugholeStrength)
   let alldead = true;
   for (let i = 0; i < this.smartPixels.length; i++) {
      let sp = this.smartPixels[i];
      let target = sp.real.target;
      if (target.dead) {
         target.alpha = Math.max(target.alpha * 0.9 - 0.01, 0);
      }
      const isInBounds = true;
      //only tweening X has interesting effect
      if (!target.dead) alldead = false;

      if (this.orbiting) {
         const p = sp.orbit;
         if (!p.dead && !this.exploding) this.simCycle(p, delta, i);
         p.x += p.vx * delta;
         p.y += p.vy * delta;

         if (sp.real.lockToTarget) {
            if (sp.orbit.hasTail) {
               this.repelCycle2(
                  sp.mod,
                  sp.orbit,
                  0.006,
                  0.5,
                  3,
                  0.004,
                  0.95,
                  delta
               );
            } else {
               sp.mod.x *= 0.94;
               sp.mod.y *= 0.94;
            }

            sp.real.x = target.x + sp.mod.x;
            sp.real.y = target.y + sp.mod.y;

            sp.real.alpha = target.alpha;
            sp.real.width = target.width;
         }
      } else {
         if (!this.exploding) {
            if (sp.real.lockToTarget) {
               this.repelCycle2(
                  sp.mod,
                  sp.pix,
                  0.01,
                  0.1,
                  2,
                  1,
                  0.96,
                  delta,
                  this.enableRepel
               );
               sp.real.x = target.x + sp.mod.x;
               sp.real.y = target.y + sp.mod.y;
               sp.real.alpha = target.alpha;
               sp.real.width = target.width;
            }
         }
      }

      let [r, g, b, a] = sp.pix.rgba;

      if (
         this.orbiting &&
         sp.orbit.hasTail &&
         sp.real.lockToTarget &&
         isInBounds
      ) {
         sp.real.trail.push({ ...sp.real });
      } else {
         sp.real.trail[0] = { ...sp.real };
         //lags creating new arrays
         // sp.real.trail = [{ ...sp.real }];

         // sp.real.trail = [{ ...sp.real }];
      }

      if (this.exploding) {
         target.x += target.vx;
         target.y += target.vy;

         const dim = this.orbiting ? 0.999 : 0.98;
         target.vx *= dim;
         target.vy *= dim;
         target.alpha = Math.max(target.alpha * 0.98 - 0.003, 0);
         sp.real.x = target.x + sp.mod.x;
         sp.real.y = target.y + sp.mod.y;
         sp.real.alpha = target.alpha;
         sp.real.width = target.width;
      }

      // sp.real.x = target.x + sp.mod.x;
      // sp.real.y = target.y + sp.mod.y;
      // sp.real.alpha = target.alpha;
      // sp.real.width = target.width;

      if (sp.real.trail.length === 1) {
         const t = sp.real.trail[0];

         const tempY = -t.y + 400;
         //  let xDepthDistort = 2 - tempY * 0.002;

         const screenX = t.x * this.xDistort + this.width * 0.5;
         const screenY = t.y * this.yDistort + this.height * 0.5;

         const scaleFactor = 1.4;
         let color = `rgba(${r},${g},${b},${sp.real.alpha})`;

         // ctx.beginPath();
         // ctx.arc(screenX, screenY, t.width * 0.5 * scaleFactor, 0, 2 * Math.PI);
         // ctx.fillStyle = color;
         // ctx.fill();

         ctx.beginPath();
         ctx.rect(
            screenX,
            screenY,
            t.width * scaleFactor,
            t.width * scaleFactor
         );
         ctx.fillStyle = color;
         ctx.fill();
      }
   }

   updateTweens(delta);

   ctx.globalAlpha = 1;
   //draw trails
   for (let i = 0; i < this.smartPixels.length; i++) {
      const sp = this.smartPixels[i];

      if (sp.real.trail.length <= 1) continue; //abort if no trail. These aborted pixels already drawn above

      const [r, g, b, a] = sp.pix.rgba;
      const target = sp.real.target;
      const totalVel = Math.hypot(target.vx + sp.mod.vx, target.vy + sp.mod.vy);
      // console.log(totalVel)

      for (let j = 0; j < sp.real.trail.length; j++) {
         const reverseIndex = sp.real.trail.length - 1 - j;
         if (reverseIndex % 1 !== 0) continue;

         const t = sp.real.trail[j];

         if (this.orbiting && j !== sp.real.trail.length - 1) {
            // t.alpha = Math.max(t.alpha - totalVel * 0.1, 0); //- diminish;

            //dividing root of self by self provides gradual to sudden ramp
            const diminishFactor =
               1 - (Math.pow(t.alpha, 0.1) / t.alpha) * 0.04;

            // t.width = Math.max(t.width * diminishFactor, 0);
            // t.alpha *= t.width*0.01;
            t.alpha *= diminishFactor;
         } else {
            if (j !== sp.real.trail.length - 1) {
               t.alpha = 0;
            }
         }
         if (this.exiting && j < sp.real.trail.length - 1 && target.d < 60) {
            t.alpha = Math.max((t.alpha *= 0.8), 0);
            t.width = Math.max((t.width *= 0.8), 0);
         }

         // const alpha =
         //    t.alpha * target.alpha * j === sp.real.trail.length - 1 ? 1 : 1;
         const alpha = t.alpha;

         const xDepthDistort = 1 + t.y * 0.0012;
         const yDepthDistort = 1 + t.y * 0.0012;

         const screenX = t.x * this.xDistort + this.width * 0.5;
         const screenY = t.y * this.yDistort + this.height * 0.5;

         // const screenX = t.x * this.xDistort + this.width * 0.5;
         // const screenY = t.y * this.yDistort + this.height * 0.5;

         let color = `rgba(${r},${g},${b},${alpha})`;

         let radius = t.width * 0.7;

         if (j < sp.real.trail.length - 1) {
            //style tail
            //   color = `rgba(${140},${200},${255},${alpha})`;
         } else {
            //paint undercircle if last trail (the head of tail)
            // ctx.beginPath();
            // ctx.arc(screenX, screenY, radius, 0, 2 * Math.PI);
            // ctx.fillStyle = `rgba(${255},${255},${255},${1})`;
            // ctx.fill();
         }

         if (
            screenX > 0 &&
            screenX < this.width &&
            screenY > 0 &&
            screenY < this.height
         ) {
            // ctx.beginPath();
            // ctx.arc(screenX, screenY, radius, 0, 2 * Math.PI);
            // ctx.fillStyle = color;
            // ctx.fill();

            ctx.beginPath();
            ctx.rect(screenX, screenY, radius * 2, radius * 2);
            ctx.fillStyle = color;
            ctx.fill();
            // ctx.stroke();
         }
      }

      // for (let j = sp.real.trail.length - 1; j >= 0; j--) {
      //    if (sp.real.trail[j].width <= 0.4 || sp.real.trail.length > 100) {
      //       sp.real.trail.splice(j, 1);
      //    }
      // }
      for (let j = sp.real.trail.length - 1; j >= 0; j--) {
         if (sp.real.trail[j].alpha <= 0.01 || sp.real.trail.length > 100) {
            sp.real.trail.splice(j, 1);
         }
      }
   }

   if (this.exploding) {
      if (!this.orbiting) {
      }

      const change = Math.pow(1.012, delta * 0.25);
      this.sunScale *= Math.pow(change, 1.2);
      this.brightness = Math.min(
         this.brightness + (1 - this.brightness) * 0.12 + 0.005,
         1
      );
   }

   //const sunDistort = this.xDistort

   const w = this.starImage.width * this.xDistort * 0.2 * this.sunScale;
   const h = this.starImage.height * this.yDistort * 0.2 * this.sunScale;

   ctx.globalAlpha = this.brightness;
   ctx.drawImage(
      this.starImage,
      this.midX - w * 0.5,
      this.midY - h * 0.5,
      w,
      h
   );

   const w2 = this.orb.width * 2 * this.sunScale;
   const h2 = this.orb.height * 2 * this.sunScale;

   ctx.drawImage(
      this.orb,
      this.midX - w2 * 0.5,
      this.midY - h2 * 0.5 - 6,
      w2,
      h2
   );

   if (!this.finished && w2 * 0.009 > this.width && h2 * 0.009 > this.height) {
      this.finished = true;
      this.onComplete();
   }
   // console.log("?track=delta", delta)
   // console.log("?track=xDistort", this.xDistort)
   // console.log("?track=yDistort", this.yDistort)
};
