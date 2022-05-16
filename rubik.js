/* eslint-disable no-magic-numbers */
const { log } = console;

const fs = require('fs');
const details = JSON.parse(fs.readFileSync('rubik.json', 'utf8'));

const max = 9;
const middle = 4;
const colors = ['red', 'green', 'blue', 'yellow', 'white', 'orange'];

const randomInt = limit => Math.floor(Math.random() * limit);

const getColor = function () {
  const color = colors[randomInt(colors.length)];
  return details[color].count === max ? getColor() : color;
};

const isDivisible = function (dividend, divisor) {
  return dividend % divisor === 0;
};

const replace = function ([context, index, face, color, emoji]) {
  if (index === middle) {
    details[face].side += details[face].emoji;
    return context.replace('_COLOR_', face);
  }
  details[color].count++;
  details[face].side += emoji;
  return context.replace('_COLOR_', color);
};

const generateOneSide = function (side, face) {
  return Array(max).fill().reduce(function (context, element, index) {
    const color = getColor();
    let emoji = details[color].emoji;
    emoji = isDivisible(index + 1, 3) ? emoji + '\n' : emoji;
    return replace([context, index, face, color, emoji]);
  }, side);
};

const generateSides = function (side) {
  return colors.reduce(function (context, color) {
    return context + generateOneSide(side, color);
  }, '');
};

const rubik = function () {
  const template = fs.readFileSync('./src/template.html', 'utf8');
  const side = fs.readFileSync('./src/side.html', 'utf8');
  const sides = generateSides(side);
  const rubik = template.replace('_SIDES_', sides);
  fs.writeFileSync('rubik.html', rubik, 'utf8');
};

rubik();

// colors.forEach(function (color) {
//   log(details[color].side);
// });

log(details);
