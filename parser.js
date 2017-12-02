const _ = require('lodash');

const MISSING_VALUE = undefined;
const SEPERATOR = '.';

function splitByChar(pattern, seperators) {
  seperators = _.castArray(seperators);
  let bracketCounter = 0;
  const token = '#$^$#';
  const stringBuilder = [];
  for (const ind in pattern) {
    const ch = pattern[ind];
    if (bracketCounter === 0 && seperators.indexOf(ch) >= 0) {
      stringBuilder.push(token);
    } else {
      stringBuilder.push(ch);
      if (ch === '[' || ch === '(') {
        bracketCounter += 1;
      } else if (ch === ']' || ch === ')') {
        bracketCounter -= 1;
      }
    }
  }
  return stringBuilder.join('').split(token);
}

function zipIntoArrays({ key, data }) {
  const paths = splitByChar(key.slice(1, -1), ',');
  const values = _.map(paths, path => followKeyPathInData({
    keys: splitByChar(path, '.'),
    data,
    index: 0,
  }));
  // Convert them to a format where for each path, each value is stored in values
  const zippedValues = _.zip.apply(_, values);
  const zippedObjects = [];
  _.forEach(zippedValues, (zippedValue) => {
    const zippedObject = {};
    _.forEach(paths, (path, ind) => {
      zippedObject[path] = zippedValue[ind];
    });
    zippedObjects.push(zippedObject);
  });
  return zippedObjects;
}

const mapAndFilter = (array, fn) => _.chain(array).map(fn).filter(x => x).value();

function evaluateCondition({ key, data }) {
  const paths = splitByChar(key.slice(1, -1), ['?', ':']);
  const values = _.map(paths, path => followKeyPathInData({
    keys: splitByChar(path, '.'),
    data,
    index: 0,
  }));
  const condition = values[0];
  const success = values[1] || MISSING_VALUE;
  const failure = values[2] || MISSING_VALUE;
  if (condition && condition.constructor === Array) {
    return mapAndFilter(condition, (c, index) => c ?
                                        success[index] || MISSING_VALUE :
                                        failure[index] || MISSING_VALUE);
  }
  return condition ? success : failure;
}

function followKeyPathInData({ keys, data, index }) {
  index = index || 0;
  const key = keys[index];
  if (key.indexOf('[') === 0) {
    return zipIntoArrays({ key, data, index });
  } else if (key.indexOf('(') === 0) {
    return evaluateCondition({ key, data, index });
  }
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
    return mapAndFilter(data, value => followKeyPathInData({ keys, data: value, index }));
  }
  return MISSING_VALUE;
}

function parser(pattern, data) {
  pattern = pattern || '';
  const keys = splitByChar(pattern, SEPERATOR);
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
      if (pattern[ind - 1] !== SEPERATOR) {
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
