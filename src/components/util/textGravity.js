//accepts vectors or vector sub-classes only.
//modifys velocity (vx/vy) only. receiving function will handle x/y change to make more modular. i.e combing influence with other factors.
function gravity(objects, pullers, pushers, delta) {
   objects.forEach((object) => push(object, pushers, delta));
   pullers.forEach((puller) => pull(puller, objects, delta));
}

const push = (obj, pushers, delta) => {
   let maxForceUpon = 0;

   //for (let i = 0; i < 1; i++) {
   for (let i = 0; i < pushers.length; i++) {
      const pusher = pushers[i];
      if (pusher.disabled) continue;
      const power = pusher.power || 1;
      const xPower = pusher.xPower || power;
      const yPower = pusher.yPower || power;

      if (Math.abs(pusher.x - obj.aim.x) < 0.05) {
         pushers[i].xFix = -1;
         pushers[i].x += pushers[i].xFix;
      }

      const vectorDiff = obj.subtract(pusher);

      // if (Math.abs(vectorDiff.x) < 0.1 && obj.x - obj.aim.x < 0.001) {
      //    vectorDiff.x = obj.randomPosNeg * 100;
      //    console.log("in line");
      // }

      let d = Math.max(vectorDiff.length * 0.35 - 10, 6);

      d *= 0.5;

    //  if (d > 60) continue;
      // const power = Math.max(1 / Math.pow(d, 3) - 0.000001, 0);

      if (!pushers[i].closestPoint) pushers[i].closestPoint = d;
      if (d < pushers[i].closestPoint) pushers[i].closestPoint = d;

      const killWeakEffect = 0.000012; // * power;

      const repel = Math.max(1 / Math.pow(d, 2.5) - killWeakEffect, 0);

      //if (i === 2) console.log("p", power);

      if (repel > maxForceUpon) {
         maxForceUpon = repel;
      }

      // console.log("push", obj.char, power)

      let vx = vectorDiff.x * repel * xPower * 4 * 0.0009;
      let vy = vectorDiff.y * repel * yPower * 4 * 0.0009;
      // let vx = vectorDiff.x * repel * xPower * 8 * delta * 0.0003;
      // let vy = vectorDiff.y * repel * yPower * 4 * delta * 0.0003;

      obj.vx += vx * delta;
      obj.vy += vy * delta;
   }
   obj.pushForce = maxForceUpon;
};

const pull = (puller, objects, delta) => {
   for (let i = 0; i < objects.length; i++) {
      const obj = objects[i];
      if (obj.lockstep) {
         continue;
      }
      const vectorDiff = obj.subtract(puller);
      const d = vectorDiff.length;

      let power = d * 0.0000022 * delta;
      // // extra boost helps reach final point (and balances dampening)
      // power += 0.00022 * delta;
      power += 0.00022 * delta;
      //let power = Math.pow(d * 0.012, delta);
      obj.pullForce = power;

      //if(power < 0.0003){
      // power = 0.0003;
      //  }

      // obj.vx -= vectorDiff.x * power * 2;
      // obj.vy -= vectorDiff.y * power;

      obj.vx -= vectorDiff.x * power;
      obj.vy -= vectorDiff.y * power;

      // obj.vx -= vectorDiff.x * inversePower;
      // obj.vy -= vectorDiff.y * inversePower;
   }
};

export { gravity };
