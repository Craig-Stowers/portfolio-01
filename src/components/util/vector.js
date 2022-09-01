import { areEqual, toDegrees, toAngle, sum } from "./utils";
import extender from "./extender";

//factory pattern inspired from - https://zellwk.com/blog/copy-properties-of-one-object-to-another-object/
//methods inspired from - https://github.com/RodionChachura/linear-algebra/blob/master/library/vector.js

function Vector(...components) {
   this.cache = {};
   this.components = [...components];
}

Vector.prototype = {
   get x() {
      return this.components[0];
   },
   set x(val) {
      this.components[0] = val;
   },
   get y() {
      return this.components[1];
   },
   set y(val) {
      this.components[1] = val;
   },
   get length() {

      const l = Math.hypot(...this.components);
      if(l === Infinity){
         console.log("infinity", this.component)
      }

      return Math.hypot(...this.components);
      // if (this.cache.length) return this.cache.length;
      // return (this.cache.length = Math.hypot(...this.components));
   },
   get angle() {
      if (this.cache.angle) return this.cache.angle;
      return (this.cache.angle = toAngle(...this.components));
   },
   add({ components }) {
      return new Vector(
         ...components.map(
            (component, index) => this.components[index] + component
         )
      );
   },
   subtract({ components }) {
      return new Vector(
         ...components.map(
            (component, index) => this.components[index] - component
         )
      );
   },
   distanceBetween({ components }) {
      return Math.hypot(
         ...components.map(
            (component, index) => this.components[index] - component
         )
      );
   },
   angleBetween(other) {
      return toDegrees(
         Math.acos(this.dotProduct(other) / (this.length * other.length))
      );
   },
   dotProduct({ components }) {
      return components.reduce(
         (acc, component, index) => acc + component * this.components[index],
         0
      );
   },
   constructor: Vector,
};

// function VectorInvertY(...components) {
//    Vector.call(this, ...components);
// }
// extender(VectorInvertY, Vector, {
//    get y() {
//       return -this.components[1];
//    },
// });

export { Vector };
