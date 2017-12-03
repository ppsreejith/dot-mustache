const {parser} = require('./parser');

//let output = parser('body.text.crit.(b?a.b:6)', {
//let output = parser('body.text.(crit.b?crit.b.b:crit.a.b)', {
let output = parser('body.text.crit.(b?b.b:a.b)', {
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
