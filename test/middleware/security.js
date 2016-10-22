'use strict'

module.exports = class Middleware {
  register (context, options) {
    context.request.test = true
    context.request.options = options
  }
}
