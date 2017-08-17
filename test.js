const {parser} = require('./parser');

let output = parser('body.text.[a.b,b]', {
  body: {
    text: [
      {
        a: {
          b: 'lol',
        },
        b: {
          b: 'na',
        },
      }, {
        a: {
          b: 'ha lol',
        },
      }],
  },
});

console.log('Output is       ', JSON.stringify(output));

console.log('Output should be', '[{"a.b":"lol","b":{"b":"na"}},{"a.b":"ha lol"}]');
