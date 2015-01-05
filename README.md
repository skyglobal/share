[Share](http://skyglobal.github.io/share/) [![Circle CI](https://circleci.com/gh/skyglobal/share/tree/master.svg?style=svg)](https://circleci.com/gh/skyglobal/share/tree/master)
========================

> Please take a look at the [demo page](http://skyglobal.github.io/share/)

## Quick-Start

Include the Share assets in your project either as **Static Resources**

```
<link rel="stylesheet" href="http://web-toolkit.global.sky.com/components/share/0.1.1/css/share.css" />
<script type="text/javascript" src="http://web-toolkit.global.sky.com/components/share/0.1.1/js/share.js"></script>
```

or alternatively, **Via Bower**

 * Run: `bower install --save-dev bskyb-skycons`
 * Include Sass: `@import 'bower_components/bskyb-share/src/scss/share';`
 * Include JS: `var share = require('../../bower_components/bskyb-share/src/js/share');`


#### Dependencies 

This component relies on other components and you must also include these in your project.

 * [Skycons](https://github.com/skyglobal/skycons)

#### Developer Notes

Choose a type of Share component and copy the relevant html, updating the share `url` for each link.
 * [bar](demo/_includes/bar.html)
 * [popup](demo/_includes/popup.html),

#### Initialise

To enable the widgets to open in a pop-up, the JS must be initialised:

```
<script type="text/javascript">
  skyComponents.share.init();
</script>
```

## Contribution

Components depends on collaboration between developers. Contributions of any size are actively encouraged.

[Read More >](CONTRIBUTING.md)

## Browser Support

 * IE8 +
 * Safari 5 +
 * Latest Firefox
 * Latest Chrome
 * Latest Mobile Safari
 * Latest Mobile Chrome
