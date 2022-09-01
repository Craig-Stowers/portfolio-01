export default function (child, base, ...sources) {
   child.prototype = Object.create(base.prototype);
   child.prototype.constructor = child;
   child.prototype.super = base.prototype;
   for (const source of sources) {
      const props = Object.keys(source);
      for (const prop of props) {
         const descriptor = Object.getOwnPropertyDescriptor(source, prop);
         Object.defineProperty(child.prototype, prop, descriptor);
      }
   }
}
