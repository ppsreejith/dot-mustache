const Mustache = require('mustache');
const rJSON = require('relaxed-json');

function splitByChar(str, seperator) {
  let bracketCounter = 0;
  const token = '#';
  let strBuilder = [];
  for (const ind in str) {
    const ch = str[ind];
    if (bracketCounter === 0 && ch === seperator) {
      strBuilder.push(token);
    } else {
      strBuilder.push(ch);
      if (ch === '[') {
        bracketCounter += 1;
      } else if (ch === ']') {
        bracketCounter -= 1;
      }
    }
  }
  return strBuilder.join('').split(token);
}

function processArray(key, index = 0) {
  const newKey = key.slice(1, -1); // handle array here
  const arr = splitByChar(newKey, ',');
  let jsonBuilder = [];
  for (const ind in arr) {
    jsonBuilder.push(`"${arr[ind]}": ${parse(arr[ind])}`);
    if (ind !== arr.length - 1) {
      jsonBuilder.push(',');
    }
  }
  return `{${jsonBuilder.join('')}},`;
}

function dfs(arr, index = 0) {
  const key = arr[index];
  if (index === arr.length) {
    return `"{{{.}}}",`;
  }
  if (index === arr.length - 1 && key.indexOf('[') === 0) {
    return `${processArray(key)},`;
  }
  return `{{#${key}}}${dfs(arr, index + 1)}{{/${key}}}`;
}

function parse(str) {
  let keys = splitByChar(str, '.');
  return `[${dfs(keys)}]`;
}

function fixTemplate(template) {
  const patterns = [
    {
      regex: /,+/g,
      replace: ',',
    },
    /* {
     *   regex: /,]/g,
     *   replace: ']',
     * },
     * {
     *   regex: /,}/g,
     *   replace: '}',
     * },*/
    {
      regex: /}\"/g,
      replace: '}',
    },
    {
      regex: /\"{/g,
      replace: '{',
    }
  ];
  for (let ind in patterns) {
    const regex = patterns[ind].regex;
    const replace = patterns[ind].replace;
    template = template.replace(regex, replace);
  }
  return template;
}

function parser(initString, data) {
  let fixed = null;
  try {
    const template = parse(initString);
    const rendered = Mustache.render(template, data);
    fixed = fixTemplate(rendered);
    return rJSON.parse(fixed);
  } catch (e) {
    return { parsingError: JSON.stringify(e), parsingString: fixed };
  }
}

function validator(str) {
  let bracketCounter = 0;
  for (const ind in str) {
    const ch = str[ind];
    if (ch === ' ') {
      return false; // should contain space
    }
    if (ch === '[') {
      if (str[ind - 1] !== '.') {
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

module.exports = parser;
