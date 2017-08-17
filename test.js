const {parser} = require('./parser');

let output = parser('body.text.[crit.a.b,crit.b]', {
  body: {
    text: [
      {
        crit: {
          a: {
            b: 'lol',
          },
          b: {
            b: 'na',
          },
        },
      }, {
        crit: {
          a: {
            b: 'ha lol',
          },
        },
      }],
  },
});

console.log('Output is       ', JSON.stringify(output));

console.log('Output should be', '[{"a.b":"lol","b":{"b":"na"}},{"a.b":"ha lol"}]');
