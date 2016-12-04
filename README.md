# protractor-get-element-screenshot

> Takes screenshot of specific element
> Good for creating stable design regression tests

[![Standard - JavaScript Style Guide](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)
[![Build Status](https://travis-ci.org/coder-on-deck/protractor-get-element-screenshot.svg?branch=master)](https://travis-ci.org/coder-on-deck/protractor-get-element-screenshot)

# Assumptions

Please note this project is still work in progress.   
There is an assumption that scroll is present and element can be scrolled to top of page.    

A task in the roadmap to take care of this was added.    
Contributions are welcomed.

Another assumption is that the window size accommodates for the padding etc.. 

# Usage 


```javascript
var screenshot = require('protractor-get-element-screenshot')

describe('test', () => {
  it('should look awesome!', ()=>{
    // ...
    
    // screenshot.take( <element>, <options> );
    screenshot.take($('.AngularJS-large'), {filename: 'tests/images/screenshots/logo'})
    // ...
  })
})
```

# Example

```javascript
var elementScreenshot = require('protractor-get-element-screenshot')
var imagedirDiff = require('imagedir-diff')

beforeEach((done) => {
  browser.driver.getCapabilities().then(function (caps) {
    browser.browserName = caps.get('browserName')
    done()
  })
})

describe('sanity', () => {
  it('should do something', (done) => {
    // browser.driver.manage().window().maximize();
    browser.get('https://angularjs.org/')

    browser.sleep(2000) // allow things to render properly
    // expect(browser.pixDiff.checkRegion($('[ng-model="yourName"]'), 'example page title')).toMatchScreen();
    elementScreenshot.take($('[app-run="hello.html"]'), {filename: 'tests/images/screenshots/hello'})
    elementScreenshot.take($('.AngularJS-large'), {filename: 'tests/images/screenshots/logo'})
    elementScreenshot.take($('.ng2-beta'), {filename: 'tests/images/screenshots/download'})
    // elementScreenshot.take($('[ng-model="yourName"]'));

    browser.sleep(2000).then(() => {
      imagedirDiff.compare().then((result) => {
        console.log('compare results', result)
        expect(result.failed.length).toBe(0)
        done()
      })
    })
  })
})

```


# Options

 - **offset.y : number** - position element at offset from screen edges. default: `-50`                            
 - **padding : array<number>** - array of \[top,right,bottom,left] pixels to capture around the element. default: `\[10,10,10,10]`
 - **filename : string** - path to keep the image without `.png` suffix. use %s to denote date. default: `screenshot_%s` 
 - **phantomjs : boolean** - temporary work around to ignore scroll. default: looks for `browser.browserName` which you have to assign `beforeEach` to get recognized. 
 - **full : boolean** - if true will also keep a screenshot of entire page under `<filename>-full.png`. default: `false`

# Reminder - how to take screenshot of entire page 

Sometimes it is useful to simply take screenshot of entire page.   
This is the shortest copy/paste I found to do that.   

```javascript
browser.takeScreenshot().then(function (png) {
  require('fs').writeFileSync('exception.png', new Buffer(png, 'base64'))
})
```

# Roadmap

 - [ ] remove phantomjs option and refer to scroll position instead
 - [ ] support x scroll too
 - [ ] support different scroll position than element position by querying for scroll position directly
 - [ ] fix travis phantom strange rendering or support different environments
 - [ ] validate special cases apply
        - element within a container with scroll