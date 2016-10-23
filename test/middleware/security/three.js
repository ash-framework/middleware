module.exports = class Middleware {
  register (context) {
    context.request.three = true
  }
}
