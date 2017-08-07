const Mustache = require('mustache');

function dfs(arr) {
  return (arr.length === 0) ? `"{{.}}",` : `{{#${arr[0]}}}${dfs(arr.slice(1))}{{/${arr[0]}}}`;
}

const regex = /,]/g;

function parser(initString, data) {
  const keys = initString.split('.');
  const template = `[${dfs(keys)}]`;
  return JSON.parse(Mustache.render(template, data).replace(regex, ']'));
}

module.exports = parser;
