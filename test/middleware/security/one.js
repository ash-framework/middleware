module.exports = class Middleware {
  register (context) {
    context.request.one = true
  }
}
