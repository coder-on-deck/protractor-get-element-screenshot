const browserName = process.env.BROWSER_NAME || 'chrome'

var capabilities = {
  browserName: 'chrome'
}

if (browserName.toLowerCase() === 'phantomjs') {
  capabilities = {
    'browserName': 'phantomjs',
    'phantomjs.binary.path': require('phantomjs-prebuilt').path
  }
}

exports.config = {
  seleniumAddress: 'http://localhost:4444/wd/hub',
  specs: ['tests/*.spec.js'],
  capabilities: capabilities
}
