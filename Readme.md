# DotMustache

Allows you to use access arrays and objects via dot notation.

```javascript
const parser = require('dot-mustache');
parser('body.text.crit.[words,something.here]', {
  body: {
    text: [{
      crit: {
        words: ['This works', 'This too'],
        something: {
          here: 'here this works',
        },
      },
    }, {
      crit: [{
        words: 'still works',
        something: {
          here: 'here this works too',
        },
      }],
    }],
  },
});
```

This code snippet returns
```javascript
[{
  'words': ['This works', 'This too'],
  'something.here': 'here this works'
} {
  'words': 'still works',
  'something.here': 'here this works too'
}]
```