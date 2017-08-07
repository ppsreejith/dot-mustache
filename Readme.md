# DotMustache

Allows you to use Mustache via dot notation.

```javascript
const parser = require('DotMustache');
parser('body.text.crit.words', {
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
```

This code snippet returns
```javascript
[ 'This works', 'This too', 'still works' ]
```