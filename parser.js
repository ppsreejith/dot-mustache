const _ = require('lodash');

const MISSING_VALUE = undefined;

function followKeyPathInData({ keys, data, index }) {
  index = index || 0;
  const key = keys[index];

  if (!data) {
    return MISSING_VALUE;
  } else if (data.constructor === Object) {
    const isFinal = (index === keys.length - 1);
    if (key in data) {
      if (isFinal) {
        return data[key];
      }
      return followKeyPathInData({ keys, data: data[key], index: index + 1 });
    }
    return MISSING_VALUE;
  } else if (data.constructor === Array) {
    return _.map(data, value => followKeyPathInData({ keys, data: value, index }));
  }
  return MISSING_VALUE;
}

function parser(pattern, data) {
  pattern = pattern || '';
  const keys = pattern.split('.');
  return followKeyPathInData({ keys, data, index: 0 });
}

function validator(pattern) {
  let bracketCounter = 0;
  for (const ind in pattern) {
    const ch = pattern[ind];
    if (ch === ' ') {
      return false; // should contain space
    }
    if (ch === '[') {
      if (pattern[ind - 1] !== '.') {
        return false; // array should be property of an object
      }
      bracketCounter += 1;
    } else if (ch === ']') {
      bracketCounter -= 1;
    }
    if (bracketCounter < 0) {
      return false; // Imbalanced brackets
    }
  }
  if (bracketCounter === 0) { // Imbalanced brackets
    return true;
  }
  return false;
}

module.exports = {
  parser,
  validator,
};
