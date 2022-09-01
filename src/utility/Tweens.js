let tweens = [];

setInterval(() => {
   // console.log(tweens)
}, 2000);

const updateTweens = (delta) => {
   if (!tweens) return;
   tweens.forEach((e) => {
     // console.log("updateTween", delta);
      e.update(delta);
   });

   tweens = tweens.filter((e) => {
      return !e.complete;
   });
};

const Tween = function ({
   delay = 0,
   duration = 1,
   callback,
   exponent = 1,
   onComplete,
   onStart,
   type,
}) {
   this.time = -delay;
   this.duration = duration;
   this.callback = callback;
   this.percTime = 0;
   this.percTween = 0;
   this.exponent = exponent;
   this.onComplete = onComplete;
   this.type = type || "ease-in-out";
   this.calcTween = this.fullSine;
   this.onStart = onStart;
   this.started = false;
   this.complete = false;

   if (this.type === "ease-in") {
      this.calcTween = easeIn;
   }
   if (this.type === "ease-out") {
      this.calcTween = easeOut;
   }
   if (this.type === "ease-in-out") {
      this.calcTween = easeInOut;
   }
};

const addTween = (params) => {
   const t = new Tween(params);
   tweens.push(t);
   return t;
};
//sine curve
const easeInOut = (percTime, exponent) => {
   const PIx2 = -1 + percTime * 2; //range -1 to 1
   const modPIx2 = Math.pow(Math.abs(PIx2), exponent) * (PIx2 < 0 ? -1 : 1);
   return (Math.sin(modPIx2 * 0.5 * Math.PI) + 1) * 0.5; //convert to 0 to 1;
};

const easeIn = (percTime, exponent) => {
   const PIx2 = percTime - 1; //-1 - 0;
   const modPIx2 = Math.pow(Math.abs(PIx2), exponent) * (PIx2 < 0 ? -1 : 1);
   return Math.sin(modPIx2 * 0.5 * Math.PI) + 1;
};

const easeOut = (percTime, exponent) => {
   const PIx2 = percTime; //0 - 1
   const modPIx2 = Math.pow(Math.abs(PIx2), exponent) * (PIx2 < 0 ? -1 : 1);
   return Math.sin(modPIx2 * 0.5 * Math.PI);
};

Tween.prototype.update = function (delta) {
   // if (this.complete) return;
   const oldPercTween = this.percTween;
   this.time = Math.min(this.time + delta, this.duration);

   if (this.duration === 0) {
      this.percTime = 1;
   } else {
      this.percTime = Math.min(Math.max(this.time, 0) / this.duration, 1);
   }

   if (this.percTime > 0 && !this.started) {
      this.started = true;
      this.onStart && this.onStart();
   }
   this.percTween = this.calcTween(this.percTime, this.exponent);
   const percentOfRemaining =
      (this.percTween - oldPercTween) / (1 - oldPercTween);

   this.complete = this.percTime === 1;
   this.callback(percentOfRemaining);
   this.complete && this.onComplete && this.onComplete();
   //return a kind of "delta" of the percent change, relative to remaining target distance. That way can change targets and not have to recalcute start position
};

Tween.prototype.remove = function () {
   //console.log("try remove");
   for (let i = tweens.length - 1; i >= 0; i--) {
      // console.log("test remove", tweens[i])
      if (tweens[i] == this) {
         // console.log("removed");
         tweens.splice(i, 1);
      }
   }
};

export { addTween, updateTweens };
