// export const applyGravity = function ({ dx, dy, dLimit, dMod }) {
//    let distance = Math.hypot(dx, dy);
//    const virtualDistance = Math.max(p.d / speedMod, 2) * 10;
//    let pull = (1 / (limitD * limitD)) * 0.02;
//    // if (this.exiting) {
//    //    pull *= this.plugholeStrength;
//    //    const max = Math.pow(limitD, this.plugholeDimPow) * 0.02;
//    //    if (pull > 0.0009) {
//    //       pull = 0.0009;
//    //    }
//    //    if (p.d < 2) {
//    //       p.dead = true;
//    //       p.x = 0;
//    //       p.y = 0;
//    //       p.vx = 0;
//    //       p.vy = 0;
//    //       return;
//    //    }

//    //    // console.log("speed", Math.hypot(p.vx, p.vy));
//    // }

//    return {
//       distance,

//    }

//    p.vx -= dx * pull * delta;
//    p.vy -= dy * pull * delta;
// };

//recieves obj with vx,vy values and applies limit
export const limitVectorVelocity = function ({ vx, vy }, limit) {
   let vel = Math.hypot(vx, vy);
   if (vel !== 0) {
      const limitVel = Math.min(vel, limit);
      const limitRatio = limitVel / vel;
      vx *= limitRatio;
      vy *= limitRatio;
   }
   return { vx, vy };
};

//follow method by changing angle/distsance rather than directly. Needed for clockwise only spin to reach target
// const dCentre = Math.hypot(sp.real.x, sp.real.y);
// const dCentreNew = dCentre + (target.distance - dCentre) * tweenFactor;
// const currAngle = limitAngle(toAngle(sp.real.x, -sp.real.y), -180, 180);
// const targetAngle = limitAngle(toAngle(target.x, -target.y), -180, 180);
// let angleDiff = limitAngle(targetAngle - currAngle, -180, 180);
// let angleChange = Math.min(angleDiff * tweenFactor, 2);
// const newAngle = limitAngle(currAngle + angleChange, 0, 360);
// const [x, y] = xyNorms(newAngle);
