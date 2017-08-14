const {parser} = require('./parser');

let output = parser('body.text.crit.[b,a]', {
  body: {
    text: [
      {
        crit: {
          a: {
            b: 'lol',
            toString: function() { return JSON.stringify(this); },
          },
          b: {
            b: 'na',
            c: 'a.b.c',
            toString: function() { return JSON.stringify(this); },
          },
          toString: function() { return JSON.stringify(this); },
        },
        toString: function() { return JSON.stringify(this); },
      }, {
        crit: {
          a: {
            b: 'ha lol',
            toString: function() { return JSON.stringify(this); },
          },
          b: {
            b: 'ha na',
            toString: function() { return JSON.stringify(this); },
          },
          toString: function() { return JSON.stringify(this); },
        },
        toString: function() { return JSON.stringify(this); },
      }],
  },
});

console.log("Output is", JSON.stringify(output));

console.log("Output should be", '[{a.b: "lol", b: {b: "na"}}, {a.b: "ha lol", b: {b: "ha na"}}]');
