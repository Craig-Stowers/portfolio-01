// const { EPSILON } = require('./constants')

// const areEqual = (one, other, epsilon = EPSILON) =>
//   Math.abs(one - other) < epsilon

const toDegrees = (radians) => (radians * 180) / Math.PI;
const toRadians = (degrees) => (degrees * Math.PI) / 180;
const toAngle = (dx, dy) => toDegrees(Math.atan2(dx, dy));
const sum = (arr) => arr.reduce((acc, value) => acc + value, 0);
const withoutElementAtIndex = (arr, index) => [
   ...arr.slice(0, index),
   ...arr.slice(index + 1),
];

export const limitNumberRange = (num, min, max) =>
   Math.min(Math.max(num, min), max);

export { toDegrees, toRadians, toAngle, sum, withoutElementAtIndex };
