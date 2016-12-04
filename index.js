const fs = require('fs-extra')
const PNG = require('pngjs').PNG
const _ = require('lodash')
const path = require('path')

/**
 * @typedef {object} ProtractorElementScreenshotOpts
 * @property {object} offset
 * @property {number} offset.y
 * @property {number} offset.x
 * @property {boolean} scrollX
 * @property {string} filename - pattern where %s is date
 * @property {boolean} phantomjs - will ignore scrolling
 * @property {boolean} full - should also keep full screenshot image?
 * @property {Array<number>} padding - [ top, right, bottom, left ]
 */

let defaultOpts = {
  offset: {y: -50, x: 0},
  full: false,
  scrollX: false,
  filename: 'screenshot_%s',
  padding: [10, 10, 10, 10]
}

/**
 *
 * @param {ProtractorElementScreenshotOpts} opts
 */
exports.setDefaultOpts = (opts) => {
  defaultOpts = opts
}

/**
 *
 * @param {WebElement} element
 * @param {ProtractorElementScreenshotOpts} opts

 */
exports.take = (element, opts) => {
  let location
  let size

  opts = _.merge({phantomjs: browser.browserName && browser.browserName.toLowerCase() === 'phantomjs'}, defaultOpts, opts)
  opts.filename = path.resolve(opts.filename)

  function getScrollPosition () {
    if (opts.phantomjs) {
      return {x: 0, y: 0}
    } else {
      return {
        y: Math.max(location.y + opts.offset.y, 0),
        x: opts.scrollX ? Math.max(location.x + opts.offset.x, 0) : 0
      }
    }
  }

  function paddingToObj () {
    return {
      top: opts && opts.padding && opts.padding.length > 0 ? opts.padding[0] : 0,
      right: opts && opts.padding && opts.padding.length > 1 ? opts.padding[1] : 0,
      bottom: opts && opts.padding && opts.padding.length > 2 ? opts.padding[2] : 0,
      left: opts && opts.padding && opts.padding.length > 3 ? opts.padding[3] : 0
    }
  }

  function getElementRelativePosition () {
    // console.log('get relative position', location, getScrollPosition());
    return {x: location.x - getScrollPosition().x, y: location.y - getScrollPosition().y}
  }

  function getDistImageSize () {
    let padding = paddingToObj()
    return {
      width: padding.left + padding.right + size.width,
      height: padding.top + padding.bottom + size.height
    }
  }

  element.getLocation().then((result) => {
    location = result
    return element.getSize()
  }).then((result) => {
    size = result
    let {x, y} = getScrollPosition()
    global.browser.executeScript(`return window.scrollTo(${x},${y});`)
    return browser.sleep(1).then(() => { // next tick.. recommended when using executeScript
      return global.browser.takeScreenshot()
    })
  }).then((image) => {
    let dst = new PNG(getDistImageSize())
    let {x, y} = getElementRelativePosition()
    // console.log('this is data',[location, getDistImageSize(), getElementRelativePosition()])
    let src = PNG.sync.read(new Buffer(image, 'base64'))
    let padding = paddingToObj()
    // console.log('taking screenshot of', Math.max(x - padding.left,0), Math.max(y - padding.top,0), dst.width, dst.height);
    PNG.bitblt(src, dst, Math.max(x - padding.left, 0), Math.max(y - padding.top, 0), dst.width, dst.height, 0, 0)
    fs.ensureDirSync(path.dirname(opts.filename))
    const date = Date.now()
    fs.writeFileSync(opts.filename.replace('%s', date) + '.png', PNG.sync.write(dst))
    if (opts.full) {
      fs.writeFileSync(opts.filename.replace('%s', date) + '-full.png', PNG.sync.write(src))
    }
  })
}
