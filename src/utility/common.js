const toDegrees = (radians) => (radians * 180) / Math.PI;
const toRadians = (degrees) => (degrees * Math.PI) / 180;
const toAngle = (dx, dy) => toDegrees(Math.atan2(dx, dy));
const sum = (arr) => arr.reduce((acc, value) => acc + value, 0);
const withoutElementAtIndex = (arr, index) => [
   ...arr.slice(0, index),
   ...arr.slice(index + 1),
];

export const limitAngle = (angle, low, high) => {
   if (angle < low) return limitAngle(angle + 360, low, high);
   if (angle > high) return limitAngle(angle - 360, low, high);
   return angle;
};

export const xyNorms = (angle) => [
   Math.sin(toRadians(angle)),
   Math.cos(toRadians(angle)),
];

export const limitNumberRange = (num, min, max) =>
   Math.min(Math.max(num, min), max);

export const PowerPlusMinus = (num, exponent) => {
   const plusMinus = num < 0 ? -1 : 1;
   return plusMinus * Math.pow(num, exponent);
};

export const randomPosNeg = () => Math.floor(Math.random() * 2) * 2 - 1;

export const clamp = (num, low, high) => Math.min(Math.max(num, low), high);

export { toDegrees, toRadians, toAngle, sum, withoutElementAtIndex };
