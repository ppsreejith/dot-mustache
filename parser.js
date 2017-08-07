const Mustache = require('mustache');

function dfs(arr, index = 0) {
  return (index === arr.length) ? `"{{.}}",` : `{{#${arr[index]}}}${dfs(arr, index+1)}{{/${arr[index]}}}`;
}

const regex = /,]/g;

function parser(initString, data) {
  const keys = initString.split('.');
  const template = `[${dfs(keys)}]`;
  return JSON.parse(Mustache.render(template, data).replace(regex, ']'));
}

module.exports = parser;
