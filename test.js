const parser = require('./parser');

let output = parser('body.text.crit.words', {
  body: {
    text: [{
      crit: {
        words: ['This works', 'This too'],
      },
    }, {
      crit: [{
        words: {title: 'this is an object', toString: function() {return JSON.stringify(this).replace(/"/g, '\\\"')}},
      }],
    }],
  },
});

console.log("Output is", output);
