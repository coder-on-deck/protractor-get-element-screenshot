var elementScreenshot = require('../index')
var imagedirDiff = require('imagedir-diff')

beforeEach((done) => {
  browser.driver.manage().window().maximize()
  browser.driver.getCapabilities().then(function (caps) {
    browser.browserName = caps.get('browserName')
    done()
  })
})

describe('design', () => {
  it('should look awesome!', (done) => {
    browser.get('https://angularjs.org/')

    browser.sleep(2000) // allow things to render properly

    console.log(require('path').resolve('tests/images/screenshots/hello'))

    elementScreenshot.take($('[app-run="hello.html"]'), {filename: 'tests/images/screenshots/hello'})
    elementScreenshot.take($('.AngularJS-large'), {filename: 'tests/images/screenshots/logo'})
    elementScreenshot.take($('.ng2-beta'), {filename: 'tests/images/screenshots/download'})

    browser.sleep(2000).then(() => {
      imagedirDiff.compare().then((result) => {
        console.log('compare results', result)
        expect(result.failed.length).toBe(0)
        done()
      })
    })
  })
})
