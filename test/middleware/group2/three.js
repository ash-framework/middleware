module.exports = class Middleware {
  register (context) {
    context.request.test.three = 'group2three'
  }
}
