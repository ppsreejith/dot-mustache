const parser = require('./parser');

let output = parser('body.text.crit.words', {
  body: {
    text: [{
      crit: {
        words: ['This works', 'This too'],
      },
    }, {
      crit: [{
        words: 'still works',
      }],
    }],
  },
});

console.log("Output is", output);
