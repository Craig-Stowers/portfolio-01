

const mode = "normal"; //normal, off
const trackerOpacity = 0;

const maxLogs = {};
const trackItems = {};

const trackDiv = document.createElement("div");
const trackDivScroller = document.createElement("div");
trackDiv.appendChild(trackDivScroller);
trackDiv.style.padding = 10 + "px";
trackDiv.style.fontFamily = "Courier New";
trackDiv.style.color = "#00FF00";
trackDiv.style.width = 400 + "px";
trackDiv.style.fontSize = "16px";
trackDiv.style.fontWeight = 500;
trackDiv.style.maxHeight = "100vh";
trackDiv.style.overflow = "auto";
trackDiv.style.top = 0 + "px";
trackDiv.style.visibility = mode == "off" ? "hidden" : "visible";
trackDiv.style.position = "fixed";
trackDiv.style.backgroundColor = "#00000080";
trackDiv.style.zIndex = 10000;

document.body.appendChild(trackDiv);

const updateTrackItem = (name, args, limits = false) => {
   if (!trackItems[name]) {
      trackItems[name] = {
         el: document.createElement("div"),
         low: null,
         high: null,
      };
      
      trackItems[name].el.style.marginBottom = "10px";
     
      
      trackDivScroller.appendChild(trackItems[name].el);

      if(limits){
         trackItems[name].el.style.backgroundColor = "blue";
         trackItems[name].el.addEventListener("click", () => {
            console.log('clicked item')
            trackItems[name].low = null;
            trackItems[name].high = null;
         });
      }
   }

   if (limits) {
      const val = Math.round(parseInt(args[0])*100)/100;

      if (!trackItems[name].low || val < trackItems[name].low) {
         trackItems[name].low = val;
      }
      if (!trackItems[name].high || val > trackItems[name].high) {
         trackItems[name].high = val;
      }

      args = [val, `(${trackItems[name].low}, ${trackItems[name].high})`];

      // trackItems[name].el.style.color = "red"
   }

   trackItems[name].el.textContent = name + " : " + args;
};

var log = console.log;
const getTime = () => {
   return (
      new Date().getDate() +
      "." +
      new Date().getMonth() +
      "." +
      new Date().getFullYear() +
      " / " +
      new Date().getHours() +
      ":" +
      new Date().getMinutes() +
      ":" +
      new Date().getSeconds()
   );
};

console.log = function () {
   if (mode === "off") return;
   // 1. Convert args to a normal array
   var args = Array.from(arguments);
   // OR you can use: Array.prototype.slice.call( arguments );

   const queries = {};

   if (typeof args[0] === "string" || args[0] instanceof String) {
      if (args[0][0] === "?") {
         let queriesArr = args[0].split("?");
         queriesArr.shift();

         queriesArr.forEach((e, i) => {
            const pair = e.split("=");

            queries[pair[0]] = pair[1] ? pair[1] : true;
         });

         if (queries.count) queries.count = parseInt(queries.count);

         // i
         //  console.log('found int', queries.int)
         //  }
         // args.shift();
      }
   }

   if (queries.track) {
      args.shift();
      updateTrackItem(queries.track, args, queries.int);
      return;
   }

  // if (mode === "trackonly") return;

   //  let e = new Error();
   //  let frame = e.stack.split("\n")[2]; // change to 3 for grandparent func
   //  let lineNumber = frame.split(":").reverse()[1];
   //  let functionName = frame.split(" ")[5];
   //  let func = e.stack.split("\n")[1]

   //  if(queries.count){
   //    if(!maxLogs[lineNumber])maxLogs[lineNumber] = 0;
   //    if(maxLogs[lineNumber] > queries.count)return;
   //    maxLogs[lineNumber] ++;
   //  }
   //  if(mode === "advanced"){

   //  }
   // log.apply(console, [lineNumber])

   // log.apply(console, [arguments])

   // 2. Prepend log prefix log string
   args.unshift(getTime() + ": ");
   // 3. Pass along arguments to console.log
   log.apply(console, args);
};
